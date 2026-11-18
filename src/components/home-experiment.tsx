/** A server-rendered wire sculpture that follows motion preferences and visibility changes. */
'use client';

import { useEffect, useRef, useState } from 'react';

const COIL_RING_COUNT = 52;
const RING_SEGMENT_COUNT = 56;
const FULL_CIRCLE_RADIANS = Math.PI * 2;

/** Project the three-dimensional coil into SVG rings for a given elapsed time. */
function createCoilFrame(elapsedSeconds: number) {
  const turnAngle = elapsedSeconds * 0.13;
  const tiltAngle = 0.95 + Math.sin(elapsedSeconds * 0.22) * 0.23;
  const rollAngle = -0.48 + Math.sin(elapsedSeconds * 0.16) * 0.13;
  return Array.from({ length: COIL_RING_COUNT }, (_, ringIndex) => {
    const ringAngle = (ringIndex / COIL_RING_COUNT) * FULL_CIRCLE_RADIANS;
    const ringRadius = 67 + Math.sin(ringAngle * 3 + elapsedSeconds * 0.35) * 9;
    let combinedPointDepth = 0;
    const pathSegments = Array.from({ length: RING_SEGMENT_COUNT + 1 }, (_, segmentIndex) => {
      const segmentAngle = (segmentIndex / RING_SEGMENT_COUNT) * FULL_CIRCLE_RADIANS;
      const distanceFromCenter = 157 + Math.cos(segmentAngle) * ringRadius;
      const horizontalPosition = distanceFromCenter * Math.cos(ringAngle);
      const verticalPosition = distanceFromCenter * Math.sin(ringAngle);
      const depthPosition =
        Math.sin(segmentAngle) * ringRadius + Math.sin(ringAngle * 3 + elapsedSeconds * 0.35) * 24;
      const turnedHorizontalPosition =
        horizontalPosition * Math.cos(turnAngle) + depthPosition * Math.sin(turnAngle);
      const turnedDepth =
        -horizontalPosition * Math.sin(turnAngle) + depthPosition * Math.cos(turnAngle);
      const tiltedVerticalPosition =
        verticalPosition * Math.cos(tiltAngle) - turnedDepth * Math.sin(tiltAngle);
      const tiltedDepth =
        verticalPosition * Math.sin(tiltAngle) + turnedDepth * Math.cos(tiltAngle);
      const perspectiveScale = 850 / (850 + tiltedDepth);
      const projectedHorizontalPosition =
        (turnedHorizontalPosition * Math.cos(rollAngle) -
          tiltedVerticalPosition * Math.sin(rollAngle)) *
        perspectiveScale;
      const projectedVerticalPosition =
        (turnedHorizontalPosition * Math.sin(rollAngle) +
          tiltedVerticalPosition * Math.cos(rollAngle)) *
        perspectiveScale;
      combinedPointDepth += tiltedDepth;
      return `${segmentIndex === 0 ? 'M' : 'L'}${(320 + projectedHorizontalPosition).toFixed(2)},${(307 + projectedVerticalPosition).toFixed(2)}`;
    });
    return {
      pathData: `${pathSegments.join(' ')}Z`,
      opacity: 0.36 + ((combinedPointDepth / (RING_SEGMENT_COUNT + 1) + 250) / 500) * 0.6,
    };
  });
}

const INITIAL_COIL_FRAME = createCoilFrame(0);

/** Render a static first frame and animate only when the visitor allows motion. */
export function HomeExperiment() {
  const sculptureElementRef = useRef<SVGSVGElement>(null);
  const [animationAllowed, setAnimationAllowed] = useState(false);
  const elapsedAnimationSecondsRef = useRef(0);

  useEffect(() => {
    const reducedMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    /** Follow the visitor’s reduced-motion preference before enabling animation. */
    const syncMotionPreference = () => {
      setAnimationAllowed(!reducedMotionPreference.matches);
    };
    syncMotionPreference();
    reducedMotionPreference.addEventListener('change', syncMotionPreference);
    return () => reducedMotionPreference.removeEventListener('change', syncMotionPreference);
  }, []);

  useEffect(() => {
    if (!animationAllowed || !sculptureElementRef.current) return;
    const sculptureElement = sculptureElementRef.current;
    const coilRingPaths = sculptureElement.querySelectorAll<SVGPathElement>('[data-coil-ring]');
    let animationFrameId = 0;
    let lastFrameTimeMilliseconds = 0;
    let sculptureVisible = true;

    /** Advance visible frames at most 30 times a second without counting hidden time. */
    const renderAnimationFrame = (timestampMilliseconds: number) => {
      animationFrameId = requestAnimationFrame(renderAnimationFrame);
      if (document.hidden || !sculptureVisible) {
        lastFrameTimeMilliseconds = 0;
        return;
      }
      if (
        lastFrameTimeMilliseconds &&
        timestampMilliseconds - lastFrameTimeMilliseconds < 1000 / 30
      )
        return;
      elapsedAnimationSecondsRef.current += lastFrameTimeMilliseconds
        ? Math.min(timestampMilliseconds - lastFrameTimeMilliseconds, 80) / 1000
        : 0;
      lastFrameTimeMilliseconds = timestampMilliseconds;
      createCoilFrame(elapsedAnimationSecondsRef.current).forEach((coilRing, ringIndex) => {
        coilRingPaths[ringIndex].setAttribute('d', coilRing.pathData);
        coilRingPaths[ringIndex].setAttribute('opacity', String(coilRing.opacity));
      });
    };
    const visibilityObserver = new IntersectionObserver(([visibilityEntry]) => {
      sculptureVisible = visibilityEntry.isIntersecting;
    });
    visibilityObserver.observe(sculptureElement);
    animationFrameId = requestAnimationFrame(renderAnimationFrame);
    return () => {
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
    };
  }, [animationAllowed]);

  return (
    <div className="labs-home-art">
      <svg
        ref={sculptureElementRef}
        className="labs-home-sculpture"
        viewBox="0 0 640 600"
        fill="none"
        aria-hidden="true"
      >
        <g className="labs-home-guides" stroke="currentColor" strokeWidth="0.7">
          <ellipse cx="320" cy="307" rx="283" ry="256" strokeDasharray="2 8" />
          <path d="M320 35v16m0 512v16M24 307h16m560 0h16" />
        </g>
        <g stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
          {INITIAL_COIL_FRAME.map((coilRing, ringIndex) => (
            <path
              key={ringIndex}
              data-coil-ring=""
              d={coilRing.pathData}
              opacity={coilRing.opacity}
            />
          ))}
        </g>
        <circle cx="572" cy="190" r="8" fill="currentColor" />
        <circle cx="83" cy="439" r="5" fill="currentColor" />
      </svg>
    </div>
  );
}
