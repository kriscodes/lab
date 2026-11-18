'use client';

import { useEffect, useRef, useState } from 'react';

const RING_COUNT = 52;
const SEGMENTS = 56;
const TAU = Math.PI * 2;

/** Project a gently deforming coil. The first frame also renders without JavaScript. */
function coilFrame(time: number) {
  const turn = time * 0.13;
  const tilt = 0.95 + Math.sin(time * 0.22) * 0.23;
  const roll = -0.48 + Math.sin(time * 0.16) * 0.13;
  return Array.from({ length: RING_COUNT }, (_, ring) => {
    const u = (ring / RING_COUNT) * TAU;
    const radius = 67 + Math.sin(u * 3 + time * 0.35) * 9;
    let depth = 0;
    const points = Array.from({ length: SEGMENTS + 1 }, (_, segment) => {
      const v = (segment / SEGMENTS) * TAU;
      const radial = 157 + Math.cos(v) * radius;
      const x = radial * Math.cos(u);
      const y = radial * Math.sin(u);
      const z = Math.sin(v) * radius + Math.sin(u * 3 + time * 0.35) * 24;
      const turnedX = x * Math.cos(turn) + z * Math.sin(turn);
      const turnedZ = -x * Math.sin(turn) + z * Math.cos(turn);
      const tiltedY = y * Math.cos(tilt) - turnedZ * Math.sin(tilt);
      const tiltedZ = y * Math.sin(tilt) + turnedZ * Math.cos(tilt);
      const perspective = 850 / (850 + tiltedZ);
      const px = (turnedX * Math.cos(roll) - tiltedY * Math.sin(roll)) * perspective;
      const py = (turnedX * Math.sin(roll) + tiltedY * Math.cos(roll)) * perspective;
      depth += tiltedZ;
      return `${segment === 0 ? 'M' : 'L'}${(320 + px).toFixed(2)},${(307 + py).toFixed(2)}`;
    });
    return {
      d: `${points.join(' ')}Z`,
      opacity: 0.36 + ((depth / (SEGMENTS + 1) + 250) / 500) * 0.6,
    };
  });
}

const STILL_FRAME = coilFrame(0);

export function HomeExperiment() {
  const sculpture = useRef<SVGSVGElement>(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const elapsed = useRef(0);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setPaused(motion.matches);
      setReady(true);
    };
    updatePreference();
    motion.addEventListener('change', updatePreference);
    return () => motion.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!ready || paused || !sculpture.current) return;
    const svg = sculpture.current;
    const paths = svg.querySelectorAll<SVGPathElement>('[data-coil-ring]');
    let frame = 0;
    let previous = 0;
    let visible = true;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (document.hidden || !visible) {
        previous = 0;
        return;
      }
      if (previous && now - previous < 1000 / 30) return;
      elapsed.current += previous ? Math.min(now - previous, 80) / 1000 : 0;
      previous = now;
      coilFrame(elapsed.current).forEach((ring, index) => {
        paths[index].setAttribute('d', ring.d);
        paths[index].setAttribute('opacity', String(ring.opacity));
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(svg);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [paused, ready]);

  return (
    <div className="labs-home-art">
      <svg
        ref={sculpture}
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
          {STILL_FRAME.map((ring, index) => (
            <path key={index} data-coil-ring="" d={ring.d} opacity={ring.opacity} />
          ))}
        </g>
        <circle cx="572" cy="190" r="8" fill="currentColor" />
        <circle cx="83" cy="439" r="5" fill="currentColor" />
      </svg>
      <button
        className="labs-home-motion"
        type="button"
        hidden={!ready}
        aria-label={paused ? 'Play animation' : 'Pause animation'}
        onClick={() => setPaused(!paused)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          {paused ? (
            <path d="m5 3 8 5-8 5Z" fill="currentColor" />
          ) : (
            <path d="M5 3v10m6-10v10" stroke="currentColor" strokeWidth="1.5" />
          )}
        </svg>
      </button>
    </div>
  );
}
