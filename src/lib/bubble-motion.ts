/** @file Describes the approved bubble paths and timings without touching the page. */

export const HOME_BUBBLE_COUNT = 14;
export const HOME_EMISSION_INTERVAL_MS = 1000 / 7;
export const HOME_STOP_TIME_MS = 2900;
export const HOME_POP_TIME_MS = 3000;
export const HOVER_BUBBLE_COUNT = 6;
export const HOVER_LIFETIME_MS = 2000;
export const BUBBLE_POP_DURATION_MS = 190;

export interface BubblePosition {
  readonly horizontalPosition: number;
  readonly verticalPosition: number;
}

export interface BubbleViewport {
  readonly width: number;
  readonly height: number;
}

export interface HomeBubbleMotion {
  readonly diameter: number;
  readonly radius: number;
  readonly origin: BubblePosition;
  readonly direction: {
    readonly horizontalComponent: number;
    readonly verticalComponent: number;
  };
  readonly initialSpeed: number;
  readonly delayMilliseconds: number;
}

export interface HomeBubbleFrame {
  readonly position: BubblePosition;
  readonly opacity: number;
  readonly scale: number;
}

export interface HoverBubbleFlight {
  readonly origin: BubblePosition;
  readonly destination: BubblePosition;
  readonly diameter: number;
  readonly durationMilliseconds: number;
  readonly index: number;
}

/** Folds an uninterrupted path at each wall, retaining every bounce between frames. */
export function reflectAtWall(position: number, minimum: number, maximum: number): number {
  const span = Math.max(1, maximum - minimum);
  const roundTrip = span * 2;
  const distance = (((position - minimum) % roundTrip) + roundTrip) % roundTrip;
  return minimum + (distance <= span ? distance : roundTrip - distance);
}

/** Plans fourteen varied bubbles from the lower-left corner, spaced seven per second. */
export function createHomeBubbleMotions(
  viewport: BubbleViewport,
  randomValue: () => number = Math.random,
): readonly HomeBubbleMotion[] {
  const diagonal = Math.hypot(viewport.width, viewport.height);
  const maximumDiameter = Math.min(viewport.width * 0.38, 160);

  return Array.from({ length: HOME_BUBBLE_COUNT }, (_, index) => {
    const diameter = 8 + Math.pow(randomValue(), 1.4) * (maximumDiameter - 8);
    const radius = diameter / 2;
    const directionAngle = -Math.PI / 2 + (randomValue() * Math.PI) / 2;

    return {
      diameter,
      radius,
      origin: {
        horizontalPosition: radius + 2 + randomValue() * 18,
        verticalPosition: viewport.height - radius - 2 - randomValue() * 18,
      },
      direction: {
        horizontalComponent: Math.cos(directionAngle),
        verticalComponent: Math.sin(directionAngle),
      },
      initialSpeed: diagonal * (0.45 + randomValue() * 0.4),
      delayMilliseconds: index * HOME_EMISSION_INTERVAL_MS,
    };
  });
}

/** Samples linear deceleration so every arrival bubble rests at the shared 2.9-second mark. */
export function sampleHomeBubble(
  bubble: HomeBubbleMotion,
  elapsedMilliseconds: number,
  viewport: BubbleViewport,
): HomeBubbleFrame | null {
  if (elapsedMilliseconds < bubble.delayMilliseconds) return null;

  const ageSeconds =
    Math.max(0, Math.min(elapsedMilliseconds, HOME_POP_TIME_MS) - bubble.delayMilliseconds) / 1000;
  const decelerationSeconds = (HOME_STOP_TIME_MS - bubble.delayMilliseconds) / 1000;
  const progress = Math.min(1, ageSeconds / decelerationSeconds);
  const travel = bubble.initialSpeed * decelerationSeconds * (progress - (progress * progress) / 2);

  return {
    position: {
      horizontalPosition: reflectAtWall(
        bubble.origin.horizontalPosition + bubble.direction.horizontalComponent * travel,
        bubble.radius,
        viewport.width - bubble.radius,
      ),
      verticalPosition: reflectAtWall(
        bubble.origin.verticalPosition + bubble.direction.verticalComponent * travel,
        bubble.radius,
        viewport.height - bubble.radius,
      ),
    },
    opacity: Math.min(0.85, ageSeconds * 12),
    scale: 0.08 + 0.92 * Math.min(1, ageSeconds / 0.16),
  };
}

/** Places a bubble by its center while keeping its growth centered on the same point. */
export function bubbleTransform(position: BubblePosition, diameter: number, scale = 1): string {
  return `translate(${position.horizontalPosition - diameter / 2}px,${position.verticalPosition - diameter / 2}px) scale(${scale})`;
}

/** Fans the six approved hover bubbles around the supplied pointer or focus origin. */
export function createHoverBubbleFlights(origin: BubblePosition): readonly HoverBubbleFlight[] {
  return Array.from({ length: HOVER_BUBBLE_COUNT }, (_, index) => {
    const angle = ((-160 + index * 30) * Math.PI) / 180;
    const distance = 38 + ((index * 19) % 37);

    return {
      origin: { ...origin },
      destination: {
        horizontalPosition: origin.horizontalPosition + Math.cos(angle) * distance,
        verticalPosition: origin.verticalPosition + Math.sin(angle) * distance - 20,
      },
      diameter: 12 + index * 3.5,
      durationMilliseconds: HOVER_LIFETIME_MS,
      index,
    };
  });
}

/** Keeps hover easing separate from arrival physics, matching the approved four keyframes. */
export function getHoverBubbleKeyframes(flight: HoverBubbleFlight): Keyframe[] {
  const firstStep = {
    horizontalPosition:
      flight.origin.horizontalPosition +
      (flight.destination.horizontalPosition - flight.origin.horizontalPosition) * 0.04,
    verticalPosition:
      flight.origin.verticalPosition +
      (flight.destination.verticalPosition - flight.origin.verticalPosition) * 0.04,
  };
  const travel = {
    horizontalPosition: flight.destination.horizontalPosition + (flight.index % 2 ? 8 : -8),
    verticalPosition: flight.destination.verticalPosition + 16,
  };

  return [
    { offset: 0, opacity: 0, transform: bubbleTransform(flight.origin, flight.diameter, 0.08) },
    {
      offset: 0.025,
      opacity: 0.8,
      transform: bubbleTransform(firstStep, flight.diameter, 0.2),
      easing: 'cubic-bezier(.12,.72,.16,1)',
    },
    {
      offset: 0.27,
      opacity: 0.85,
      transform: bubbleTransform(travel, flight.diameter),
      easing: 'ease-in-out',
    },
    { offset: 1, opacity: 0.85, transform: bubbleTransform(flight.destination, flight.diameter) },
  ];
}
