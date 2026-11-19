/** @file Checks arrival cadence, bounded motion, deceleration, and the independent hover burst. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HOME_BUBBLE_COUNT,
  HOME_EMISSION_INTERVAL_MS,
  HOME_STOP_TIME_MS,
  HOME_POP_TIME_MS,
  HOVER_BUBBLE_COUNT,
  HOVER_LIFETIME_MS,
  createHomeBubbleMotions,
  sampleHomeBubble,
  reflectAtWall,
  createHoverBubbleFlights,
} from '../src/lib/bubble-motion.ts';

/** Supplies a repeatable range of values without depending on global randomness. */
function createRandomSequence() {
  const values = [0, 0.01, 0.06, 0.13, 0.25, 0.5, 0.8, 0.99];
  let nextValueIndex = 0;
  return () => values[nextValueIndex++ % values.length];
}

/** Provides a straight path with ample room so wall bounces cannot hide speed changes. */
function createStraightMotion(delayMilliseconds = 0) {
  return {
    diameter: 20,
    radius: 10,
    origin: { horizontalPosition: 100, verticalPosition: 100 },
    direction: { horizontalComponent: 1, verticalComponent: 0 },
    initialSpeed: 100,
    delayMilliseconds,
  };
}

test('home arrival emits fourteen bubbles individually at seven per second', () => {
  const viewport = { width: 1200, height: 800 };
  const motions = createHomeBubbleMotions(viewport, createRandomSequence());
  assert.equal(HOME_BUBBLE_COUNT, 14);
  assert.equal(HOME_EMISSION_INTERVAL_MS, 1000 / 7);
  assert.equal(motions.length, 14);
  assert.equal(motions[0].delayMilliseconds, 0);

  for (let bubbleIndex = 1; bubbleIndex < motions.length; bubbleIndex++) {
    const emissionTime = motions[bubbleIndex].delayMilliseconds;
    const previousEmissionTime = motions[bubbleIndex - 1].delayMilliseconds;
    assert.ok(Math.abs(emissionTime - previousEmissionTime - 1000 / 7) < 0.000001);
    assert.equal(sampleHomeBubble(motions[bubbleIndex], emissionTime - 0.01, viewport), null);
    assert.notEqual(sampleHomeBubble(motions[bubbleIndex], emissionTime, viewport), null);
    assert.equal(
      motions.filter((motion) => sampleHomeBubble(motion, emissionTime - 0.01, viewport)).length,
      bubbleIndex,
      'A later bubble must remain absent until its own emission time.',
    );
  }
  assert.ok(motions.at(-1).delayMilliseconds < 2000, 'Even the final bubble gets time to travel.');
});

test('injected randomness gives reproducible, varied sizes within desktop and mobile limits', () => {
  for (const viewport of [
    { width: 1200, height: 800 },
    { width: 320, height: 640 },
  ]) {
    const motions = createHomeBubbleMotions(viewport, createRandomSequence());
    assert.deepEqual(motions, createHomeBubbleMotions(viewport, createRandomSequence()));
    assert.ok(new Set(motions.map((motion) => motion.diameter)).size >= 5);
    assert.ok(
      new Set(motions.map((motion) => motion.direction.horizontalComponent)).size >= 5,
      'Independent launch directions should not collapse to a single path.',
    );
    for (const motion of motions) {
      assert.ok(motion.diameter >= 8);
      assert.ok(motion.diameter <= 160);
      assert.ok(motion.diameter <= viewport.width * 0.38);
      assert.equal(motion.radius * 2, motion.diameter);
    }

    const smallest = createHomeBubbleMotions(viewport, () => 0)[0];
    const largest = createHomeBubbleMotions(viewport, () => 1 - Number.EPSILON)[0];
    assert.equal(smallest.diameter, 8);
    assert.ok(largest.diameter > 120, 'The range must include visibly large bubbles.');
  }
});

test('wall reflection handles both directions and multiple crossings without escaping the bounds', () => {
  const minimumCenter = 10;
  const maximumCenter = 90;
  for (const [unboundedPosition, expectedCenter] of [
    [10, 10],
    [90, 90],
    [91, 89],
    [170, 10],
    [250, 90],
    [330, 10],
    [-70, 90],
    [-150, 10],
  ]) {
    assert.equal(reflectAtWall(unboundedPosition, minimumCenter, maximumCenter), expectedCenter);
  }
  for (const unboundedPosition of [-1000001, -203, 0, 117, 1000001]) {
    const center = reflectAtWall(unboundedPosition, minimumCenter, maximumCenter);
    assert.ok(center >= minimumCenter && center <= maximumCenter);
  }
});

test('sampled bubble edges stay inside the viewport throughout repeated wall bounces', () => {
  const viewport = { width: 180, height: 140 };
  const motion = {
    ...createStraightMotion(),
    origin: { horizontalPosition: 30, verticalPosition: 110 },
    direction: { horizontalComponent: 0.6, verticalComponent: -0.8 },
    initialSpeed: 1500,
  };
  for (let elapsedMilliseconds = 0; elapsedMilliseconds <= 3000; elapsedMilliseconds += 37) {
    const { position } = sampleHomeBubble(motion, elapsedMilliseconds, viewport);
    assert.ok(position.horizontalPosition >= motion.radius);
    assert.ok(position.horizontalPosition <= viewport.width - motion.radius);
    assert.ok(position.verticalPosition >= motion.radius);
    assert.ok(position.verticalPosition <= viewport.height - motion.radius);
  }
});

test('early and late arrivals slow continuously and share a stationary interval before the pop', () => {
  const viewport = { width: 10000, height: 10000 };
  assert.equal(HOME_STOP_TIME_MS, 2900);
  assert.equal(HOME_POP_TIME_MS, 3000);

  for (const delayMilliseconds of [0, 1500]) {
    const motion = createStraightMotion(delayMilliseconds);
    const halfwayTime = delayMilliseconds + (HOME_STOP_TIME_MS - delayMilliseconds) / 2;
    const samplePosition = (time) => sampleHomeBubble(motion, time, viewport).position;
    const displacementOverNextHundredMilliseconds = (time) =>
      samplePosition(time + 100).horizontalPosition - samplePosition(time).horizontalPosition;
    const earlyDisplacement = displacementOverNextHundredMilliseconds(delayMilliseconds);
    const middleDisplacement = displacementOverNextHundredMilliseconds(halfwayTime);
    const finalDisplacement = displacementOverNextHundredMilliseconds(2800);

    assert.ok(earlyDisplacement > middleDisplacement);
    assert.ok(middleDisplacement > finalDisplacement);
    assert.ok(
      finalDisplacement > 0,
      'The bubble should approach its stop instead of stopping early.',
    );
    const stoppedPosition = samplePosition(2900);
    for (const timeAfterStop of [2950, 2999, 3000, 10000]) {
      assert.deepEqual(samplePosition(timeAfterStop), stoppedPosition);
    }
  }
});

test('hover keeps its independent six-bubble, two-second burst at the supplied pointer location', () => {
  const pointerOrigin = { horizontalPosition: 123, verticalPosition: 456 };
  const flights = createHoverBubbleFlights(pointerOrigin);
  assert.equal(HOVER_BUBBLE_COUNT, 6);
  assert.equal(HOVER_LIFETIME_MS, 2000);
  assert.equal(flights.length, 6);
  assert.deepEqual(
    flights.map((flight) => flight.index),
    [0, 1, 2, 3, 4, 5],
  );
  for (const flight of flights) {
    assert.deepEqual(flight.origin, pointerOrigin);
    assert.equal(flight.durationMilliseconds, 2000);
    assert.notDeepEqual(flight.destination, pointerOrigin);
  }
  assert.equal(flights[0].diameter, 12);
  assert.equal(flights.at(-1).diameter, 29.5);
  assert.deepEqual(pointerOrigin, { horizontalPosition: 123, verticalPosition: 456 });
});
