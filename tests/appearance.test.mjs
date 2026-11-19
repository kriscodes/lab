/** @file Verifies appearance persistence, cross-tab updates, blocked storage, and subscription cleanup. */

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
function createStorageRecorder(initialEntries = [], storageIsBlocked = false) {
  const storedValues = new Map(initialEntries);
  const storageCalls = [];
  return {
    values: storedValues,
    calls: storageCalls,
    /** Reads a saved preference and records the attempted browser-storage operation. */
    getItem(key) {
      storageCalls.push(['get', key]);
      if (storageIsBlocked) throw new Error('Storage unavailable.');
      return storedValues.get(key) ?? null;
    },
    /** Records a preference write, including attempts rejected by blocked storage. */
    setItem(key, value) {
      storageCalls.push(['set', key, String(value)]);
      if (storageIsBlocked) throw new Error('Storage unavailable.');
      storedValues.set(key, String(value));
    },
    /** Removes one fixture entry using the browser Storage interface. */
    removeItem(key) {
      storageCalls.push(['remove', key]);
      storedValues.delete(key);
    },
    /** Clears the fixture while recording the whole-storage operation. */
    clear() {
      storageCalls.push(['clear']);
      storedValues.clear();
    },
  };
}

/** Uses Node's actual event dispatch while exposing listener ownership for cleanup assertions. */
class EventTrackingWindow extends EventTarget {
  listeners = new Map();

  /** Tracks listener ownership before delegating to Node's event dispatcher. */
  addEventListener(eventType, listener, options) {
    const eventListeners = this.listeners.get(eventType) ?? new Set();
    eventListeners.add(listener);
    this.listeners.set(eventType, eventListeners);
    super.addEventListener(eventType, listener, options);
  }

  /** Removes the tracked subscription and its underlying event listener. */
  removeEventListener(eventType, listener, options) {
    this.listeners.get(eventType)?.delete(listener);
    super.removeEventListener(eventType, listener, options);
  }

  /** Counts all active subscriptions so cleanup can be asserted directly. */
  getListenerCount() {
    return [...this.listeners.values()].reduce(
      (listenerTotal, eventListeners) => listenerTotal + eventListeners.size,
      0,
    );
  }

  /** Delivers a realistic cross-tab storage notification without opening another browser. */
  dispatchStorageChange(key, newValue, storageArea) {
    const storageEvent = new Event('storage');
    Object.defineProperties(storageEvent, {
      key: { value: key },
      newValue: { value: newValue },
      storageArea: { value: storageArea },
    });
    this.dispatchEvent(storageEvent);
  }
}

/** Installs the minimum document boundary and restores every replaced global after the test. */
function createBrowserFixture(testContext, storage = createStorageRecorder()) {
  const themeColorElement = { content: '#ffffff' };
  const document = {
    documentElement: { dataset: { theme: 'light' } },
    /** Supplies only the theme-color element expected by the appearance helper. */
    querySelector(selector) {
      assert.equal(selector, 'meta[name="theme-color"]');
      return themeColorElement;
    },
  };
  const window = new EventTrackingWindow();
  const originalGlobalDescriptors = new Map();
  const activeSubscriptions = new Set();
  for (const [globalName, value] of [
    ['document', document],
    ['window', window],
    ['localStorage', storage],
  ]) {
    originalGlobalDescriptors.set(
      globalName,
      Object.getOwnPropertyDescriptor(globalThis, globalName),
    );
    Object.defineProperty(globalThis, globalName, { configurable: true, writable: true, value });
  }
  testContext.after(() => {
    for (const unsubscribe of activeSubscriptions) unsubscribe();
    for (const [globalName, originalDescriptor] of originalGlobalDescriptors) {
      if (originalDescriptor) Object.defineProperty(globalThis, globalName, originalDescriptor);
      else delete globalThis[globalName];
    }
  });
  return {
    document,
    meta: themeColorElement,
    window,
    storage,
    /** Runs the exact first-paint script in an isolated document context. */
    runAppearanceBootstrap() {
      runInNewContext(
        APPEARANCE_BOOTSTRAP,
        { document, localStorage: storage },
        {
          filename: 'lab-appearance-bootstrap.js',
          timeout: 1000,
        },
      );
    },
    /** Registers an appearance subscription and retains cleanup ownership for the test. */
    subscribeToAppearance(notifyAppearanceChange) {
      const unsubscribe = subscribeAppearance(notifyAppearanceChange);
      activeSubscriptions.add(unsubscribe);
      return () => {
        unsubscribe();
        activeSubscriptions.delete(unsubscribe);
      };
    },
  };
}

/** Checks the state consumed by React together with the document and browser chrome. */
function assertAppearance(browserFixture, expectedAppearance) {
  assert.equal(getAppearance(), expectedAppearance);
  assert.equal(browserFixture.document.documentElement.dataset.theme, expectedAppearance);
  assert.equal(browserFixture.meta.content, expectedAppearance === 'dark' ? '#10161f' : '#ffffff');
}

test('saved dark preference is applied by the actual pre-hydration bootstrap without a write', (testContext) => {
  const storage = createStorageRecorder([[APPEARANCE_KEY, 'dark']]);
  const browserFixture = createBrowserFixture(testContext, storage);
  assertAppearance(browserFixture, 'light');
  browserFixture.runAppearanceBootstrap();
  assertAppearance(browserFixture, 'dark');
  assert.equal(
    browserFixture.window.getListenerCount(),
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

test('two toggles persist only the Lab preference and notify subscribers of document state', (testContext) => {
  const unrelatedStorageEntries = [
    ['toolbox.theme.v1', 'dark'],
    ['toolbox.prompt-builder.library.v1', ' { "draft": }\u0000 preserve-me '],
    ['toolbox.pinned-projects.v1', ' [ "prompt", "family" ] \n'],
  ];
  const storage = createStorageRecorder(unrelatedStorageEntries);
  const browserFixture = createBrowserFixture(testContext, storage);
  browserFixture.runAppearanceBootstrap();
  assertAppearance(browserFixture, 'light');
  const appearanceSnapshots = [];
  browserFixture.subscribeToAppearance(() => appearanceSnapshots.push(getAppearance()));
  assert.equal(setAppearance(getAppearance() === 'light' ? 'dark' : 'light'), true);
  assertAppearance(browserFixture, 'dark');
  assert.equal(setAppearance(getAppearance() === 'light' ? 'dark' : 'light'), true);
  assertAppearance(browserFixture, 'light');
  assert.deepEqual(appearanceSnapshots, ['dark', 'light']);
  assert.deepEqual(storage.calls, [
    ['get', APPEARANCE_KEY],
    ['set', APPEARANCE_KEY, 'dark'],
    ['set', APPEARANCE_KEY, 'light'],
  ]);
  assert.equal(storage.values.get(APPEARANCE_KEY), 'light');
  assert.deepEqual(
    [...storage.values].filter(([key]) => key !== APPEARANCE_KEY),
    unrelatedStorageEntries,
  );
});

test('blocked storage preserves a usable control and returns false for visit-only feedback', (testContext) => {
  const storage = createStorageRecorder([], true);
  const browserFixture = createBrowserFixture(testContext, storage);
  assert.doesNotThrow(() => browserFixture.runAppearanceBootstrap());
  assertAppearance(browserFixture, 'light');
  const appearanceSnapshots = [];
  browserFixture.subscribeToAppearance(() => appearanceSnapshots.push(getAppearance()));
  assert.equal(setAppearance('dark'), false);
  assertAppearance(browserFixture, 'dark');
  assert.equal(setAppearance('light'), false);
  assertAppearance(browserFixture, 'light');
  assert.deepEqual(
    appearanceSnapshots,
    ['dark', 'light'],
    'React is notified even when persistence fails.',
  );
  assert.equal(storage.values.has(APPEARANCE_KEY), false);
  assert.deepEqual(storage.calls, [
    ['get', APPEARANCE_KEY],
    ['set', APPEARANCE_KEY, 'dark'],
    ['set', APPEARANCE_KEY, 'light'],
  ]);
});

test('other-tab preferences and clearing synchronize without writeback; unrelated keys are ignored', (testContext) => {
  const browserFixture = createBrowserFixture(testContext);
  browserFixture.runAppearanceBootstrap();
  const appearanceSnapshots = [];
  browserFixture.subscribeToAppearance(() => appearanceSnapshots.push(getAppearance()));
  const callsBeforeEvents = [...browserFixture.storage.calls];
  browserFixture.window.dispatchStorageChange('toolbox.theme.v1', 'dark', browserFixture.storage);
  assertAppearance(browserFixture, 'light');
  assert.deepEqual(appearanceSnapshots, []);
  browserFixture.window.dispatchStorageChange(APPEARANCE_KEY, 'dark', browserFixture.storage);
  assertAppearance(browserFixture, 'dark');
  browserFixture.window.dispatchStorageChange(
    'toolbox.prompt-builder.library.v1',
    'light',
    browserFixture.storage,
  );
  assertAppearance(browserFixture, 'dark');
  browserFixture.window.dispatchStorageChange(APPEARANCE_KEY, null, browserFixture.storage);
  assertAppearance(browserFixture, 'light');
  browserFixture.window.dispatchStorageChange(APPEARANCE_KEY, 'dark', browserFixture.storage);
  assertAppearance(browserFixture, 'dark');
  browserFixture.window.dispatchStorageChange(null, null, browserFixture.storage);
  assertAppearance(browserFixture, 'light');
  assert.deepEqual(appearanceSnapshots, ['dark', 'light', 'dark', 'light']);
  assert.deepEqual(browserFixture.storage.calls, callsBeforeEvents);
});

test('unsubscribe removes both listeners and prevents notifications or later storage updates', (testContext) => {
  const browserFixture = createBrowserFixture(testContext);
  browserFixture.runAppearanceBootstrap();
  let notificationCount = 0;
  const unsubscribe = browserFixture.subscribeToAppearance(() => {
    notificationCount += 1;
  });
  assert.equal(browserFixture.window.getListenerCount(), 2);
  setAppearance('dark');
  assert.equal(notificationCount, 1);
  unsubscribe();
  unsubscribe();
  assert.equal(browserFixture.window.getListenerCount(), 0);
  browserFixture.window.dispatchStorageChange(APPEARANCE_KEY, 'light', browserFixture.storage);
  assertAppearance(browserFixture, 'dark');
  assert.equal(notificationCount, 1);
  setAppearance('light');
  assertAppearance(browserFixture, 'light');
  assert.equal(notificationCount, 1, 'A removed subscriber cannot receive same-document changes.');
});
