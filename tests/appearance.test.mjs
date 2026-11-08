import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import {
  APPEARANCE_BOOTSTRAP,
  APPEARANCE_KEY,
  getAppearance,
  getServerAppearance,
  setAppearance,
  subscribeAppearance,
} from '../src/lib/appearance.ts';

/** Records every browser-storage access without involving an actual browser profile. */
function createStorage(entries = [], blocked = false) {
  const values = new Map(entries);
  const calls = [];
  return {
    values,
    calls,
    getItem(key) {
      calls.push(['get', key]);
      if (blocked) throw new Error('Storage unavailable.');
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      calls.push(['set', key, String(value)]);
      if (blocked) throw new Error('Storage unavailable.');
      values.set(key, String(value));
    },
    removeItem(key) {
      calls.push(['remove', key]);
      values.delete(key);
    },
    clear() {
      calls.push(['clear']);
      values.clear();
    },
  };
}

/** Uses Node's actual event dispatch while exposing listener ownership for cleanup assertions. */
class FakeWindow extends EventTarget {
  listeners = new Map();

  addEventListener(type, listener, options) {
    const listeners = this.listeners.get(type) ?? new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
    super.addEventListener(type, listener, options);
  }

  removeEventListener(type, listener, options) {
    this.listeners.get(type)?.delete(listener);
    super.removeEventListener(type, listener, options);
  }

  listenerCount() {
    return [...this.listeners.values()].reduce((total, listeners) => total + listeners.size, 0);
  }

  sendStorage(key, newValue, storageArea) {
    const event = new Event('storage');
    Object.defineProperties(event, {
      key: { value: key },
      newValue: { value: newValue },
      storageArea: { value: storageArea },
    });
    this.dispatchEvent(event);
  }
}

/** Installs the minimum document boundary and restores every replaced global after the test. */
function createPage(t, storage = createStorage()) {
  const meta = { content: '#ffffff' };
  const document = {
    documentElement: { dataset: { theme: 'light' } },
    querySelector(selector) {
      assert.equal(selector, 'meta[name="theme-color"]');
      return meta;
    },
  };
  const window = new FakeWindow();
  const originals = new Map();
  const subscriptions = new Set();
  for (const [name, value] of [
    ['document', document],
    ['window', window],
    ['localStorage', storage],
  ]) {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  }
  t.after(() => {
    for (const unsubscribe of subscriptions) unsubscribe();
    for (const [name, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  });
  return {
    document,
    meta,
    window,
    storage,
    bootstrap() {
      runInNewContext(
        APPEARANCE_BOOTSTRAP,
        { document, localStorage: storage },
        {
          filename: 'lab-appearance-bootstrap.js',
          timeout: 1000,
        },
      );
    },
    subscribe(onChange) {
      const unsubscribe = subscribeAppearance(onChange);
      subscriptions.add(unsubscribe);
      return () => {
        unsubscribe();
        subscriptions.delete(unsubscribe);
      };
    },
  };
}

/** Checks the state consumed by React together with the document and browser chrome. */
function assertAppearance(page, appearance) {
  assert.equal(getAppearance(), appearance);
  assert.equal(page.document.documentElement.dataset.theme, appearance);
  assert.equal(page.meta.content, appearance === 'dark' ? '#101113' : '#ffffff');
}

test('saved dark preference is applied by the actual pre-hydration bootstrap without a write', (t) => {
  const storage = createStorage([[APPEARANCE_KEY, 'dark']]);
  const page = createPage(t, storage);
  assertAppearance(page, 'light');
  page.bootstrap();
  assertAppearance(page, 'dark');
  assert.equal(
    page.window.listenerCount(),
    0,
    'First-paint state does not require a hydrated control.',
  );
  assert.equal(
    getServerAppearance(),
    null,
    'Optional controls remain absent from server rendering.',
  );
  assert.deepEqual(storage.calls, [['get', APPEARANCE_KEY]]);
});

test('two toggles persist only the Lab preference and notify subscribers of document state', (t) => {
  const unrelated = [
    ['toolbox.theme.v1', 'dark'],
    ['toolbox.prompt-builder.library.v1', ' { "draft": }\u0000 preserve-me '],
    ['toolbox.pinned-projects.v1', ' [ "prompt", "family" ] \n'],
  ];
  const storage = createStorage(unrelated);
  const page = createPage(t, storage);
  page.bootstrap();
  assertAppearance(page, 'light');
  const snapshots = [];
  page.subscribe(() => snapshots.push(getAppearance()));
  assert.equal(setAppearance(getAppearance() === 'light' ? 'dark' : 'light'), true);
  assertAppearance(page, 'dark');
  assert.equal(setAppearance(getAppearance() === 'light' ? 'dark' : 'light'), true);
  assertAppearance(page, 'light');
  assert.deepEqual(snapshots, ['dark', 'light']);
  assert.deepEqual(storage.calls, [
    ['get', APPEARANCE_KEY],
    ['set', APPEARANCE_KEY, 'dark'],
    ['set', APPEARANCE_KEY, 'light'],
  ]);
  assert.equal(storage.values.get(APPEARANCE_KEY), 'light');
  assert.deepEqual(
    [...storage.values].filter(([key]) => key !== APPEARANCE_KEY),
    unrelated,
  );
});

test('blocked storage preserves a usable control and returns false for visit-only feedback', (t) => {
  const storage = createStorage([], true);
  const page = createPage(t, storage);
  assert.doesNotThrow(() => page.bootstrap());
  assertAppearance(page, 'light');
  const snapshots = [];
  page.subscribe(() => snapshots.push(getAppearance()));
  assert.equal(setAppearance('dark'), false);
  assertAppearance(page, 'dark');
  assert.equal(setAppearance('light'), false);
  assertAppearance(page, 'light');
  assert.deepEqual(snapshots, ['dark', 'light'], 'React is notified even when persistence fails.');
  assert.equal(storage.values.has(APPEARANCE_KEY), false);
  assert.deepEqual(storage.calls, [
    ['get', APPEARANCE_KEY],
    ['set', APPEARANCE_KEY, 'dark'],
    ['set', APPEARANCE_KEY, 'light'],
  ]);
});

test('other-tab preferences and clearing synchronize without writeback; unrelated keys are ignored', (t) => {
  const page = createPage(t);
  page.bootstrap();
  const snapshots = [];
  page.subscribe(() => snapshots.push(getAppearance()));
  const callsBeforeEvents = [...page.storage.calls];
  page.window.sendStorage('toolbox.theme.v1', 'dark', page.storage);
  assertAppearance(page, 'light');
  assert.deepEqual(snapshots, []);
  page.window.sendStorage(APPEARANCE_KEY, 'dark', page.storage);
  assertAppearance(page, 'dark');
  page.window.sendStorage('toolbox.prompt-builder.library.v1', 'light', page.storage);
  assertAppearance(page, 'dark');
  page.window.sendStorage(APPEARANCE_KEY, null, page.storage);
  assertAppearance(page, 'light');
  page.window.sendStorage(APPEARANCE_KEY, 'dark', page.storage);
  assertAppearance(page, 'dark');
  page.window.sendStorage(null, null, page.storage);
  assertAppearance(page, 'light');
  assert.deepEqual(snapshots, ['dark', 'light', 'dark', 'light']);
  assert.deepEqual(page.storage.calls, callsBeforeEvents);
});

test('unsubscribe removes both listeners and prevents notifications or later storage updates', (t) => {
  const page = createPage(t);
  page.bootstrap();
  let notifications = 0;
  const unsubscribe = page.subscribe(() => {
    notifications += 1;
  });
  assert.equal(page.window.listenerCount(), 2);
  setAppearance('dark');
  assert.equal(notifications, 1);
  unsubscribe();
  unsubscribe();
  assert.equal(page.window.listenerCount(), 0);
  page.window.sendStorage(APPEARANCE_KEY, 'light', page.storage);
  assertAppearance(page, 'dark');
  assert.equal(notifications, 1);
  setAppearance('light');
  assertAppearance(page, 'light');
  assert.equal(notifications, 1, 'A removed subscriber cannot receive same-document changes.');
});
