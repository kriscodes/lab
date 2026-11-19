/** @file Verifies that the home arrival burst is consumed once per eligible document visit. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHomeArrivalGate } from '../src/lib/bubble-arrival.ts';

test('direct home visits, reloads, and unknown navigation types can play only once', () => {
  for (const navigationType of ['navigate', 'reload', 'unknown', '']) {
    const consumeHomeArrival = createHomeArrivalGate('/', navigationType);
    assert.equal(consumeHomeArrival('/'), true, navigationType);
    assert.equal(consumeHomeArrival('/'), false, 'A repeated evaluation must not replay arrival.');
    assert.equal(consumeHomeArrival('/methodology/'), false);
    assert.equal(consumeHomeArrival('/'), false, 'Returning home must not rearm this document.');
  }
});

test('a document initially loaded on a nested page never gains a home arrival burst', () => {
  for (const initialPathname of [
    '/experiments/',
    '/methodology/',
    '/experiments/pdf-first-page/',
  ]) {
    const consumeHomeArrival = createHomeArrivalGate(initialPathname, 'navigate');
    assert.equal(consumeHomeArrival(initialPathname), false);
    assert.equal(consumeHomeArrival('/'), false);

    const firstEvaluationAfterNavigation = createHomeArrivalGate(initialPathname, 'navigate');
    assert.equal(
      firstEvaluationAfterNavigation('/'),
      false,
      'Late hydration on home must still respect the original document path.',
    );
  }
});

test('leaving home before the first evaluation consumes the opportunity without playing', () => {
  const consumeHomeArrival = createHomeArrivalGate('/', 'navigate');
  assert.equal(consumeHomeArrival('/experiments/'), false);
  assert.equal(consumeHomeArrival('/'), false);
  assert.equal(consumeHomeArrival('/'), false);
});

test('a fresh home reload gets a new opportunity without rearming the previous document', () => {
  const originalDocument = createHomeArrivalGate('/', 'navigate');
  assert.equal(originalDocument('/'), true);
  assert.equal(originalDocument('/'), false);

  const refreshedDocument = createHomeArrivalGate('/', 'reload');
  assert.equal(refreshedDocument('/'), true);
  assert.equal(refreshedDocument('/'), false);
  assert.equal(originalDocument('/'), false);
});

test('back and forward history visits never replay the home arrival burst', () => {
  const restoredDocument = createHomeArrivalGate('/', 'back_forward');
  assert.equal(restoredDocument('/'), false);
  assert.equal(restoredDocument('/experiments/'), false);
  assert.equal(restoredDocument('/'), false);
});
