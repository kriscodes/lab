/** @file Runs disposable arrival and hover bubbles inside a dedicated viewport layer. */

import {
  BUBBLE_POP_DURATION_MS,
  HOME_POP_TIME_MS,
  bubbleTransform,
  createHomeBubbleMotions,
  createHoverBubbleFlights,
  getHoverBubbleKeyframes,
  sampleHomeBubble,
  type BubblePosition,
  type HoverBubbleFlight,
} from './bubble-motion';

export interface BubbleAnimator {
  playHomeArrival(): void;
  playHover(origin: BubblePosition): void;
  clear(): void;
  destroy(): void;
}

/** Owns only bubble elements and animation lifetimes; the caller owns routes and preferences. */
export function createBubbleAnimator(
  layer: HTMLDivElement,
  classNames: Readonly<{ bubble: string; pop: string }>,
): BubbleAnimator {
  const animationWindow = layer.ownerDocument.defaultView;
  const activeAnimations = new Set<Animation>();
  let animationGeneration = 0;
  let pageMotionFrame: number | null = null;
  let destroyed = false;

  /** Tracks browser animations so a cleared or removed page cannot leave work running. */
  function animateElement(
    element: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
  ): Animation {
    const animation = element.animate(keyframes, options);
    activeAnimations.add(animation);
    void animation.finished.then(
      () => activeAnimations.delete(animation),
      () => activeAnimations.delete(animation),
    );
    return animation;
  }

  /** Gives every finished bubble the same brief expanding ring, then removes it completely. */
  function popBubble(position: BubblePosition, diameter: number): void {
    const pop = layer.ownerDocument.createElement('span');
    pop.className = classNames.pop;
    Object.assign(pop.style, {
      left: `${position.horizontalPosition - diameter / 2}px`,
      top: `${position.verticalPosition - diameter / 2}px`,
      width: `${diameter}px`,
      height: `${diameter}px`,
    });
    layer.append(pop);
    const animation = animateElement(
      pop,
      [
        { opacity: 0.8, transform: 'scale(.94)' },
        { opacity: 0.55, offset: 0.25, transform: 'scale(1.12)' },
        { opacity: 0, transform: 'scale(1.34)' },
      ],
      { duration: BUBBLE_POP_DURATION_MS, easing: 'ease-out', fill: 'both' },
    );

    /** Releases the element and its filled animation after completion or cancellation. */
    function removePop(): void {
      pop.remove();
      animation.cancel();
    }

    void animation.finished.then(removePop, removePop);
  }

  /** Plays one hover path without putting it into the arrival wall-reflection simulation. */
  function launchHoverBubble(flight: HoverBubbleFlight): void {
    const bubble = layer.ownerDocument.createElement('span');
    bubble.className = classNames.bubble;
    bubble.dataset.kind = 'hover';
    Object.assign(bubble.style, {
      width: `${flight.diameter}px`,
      height: `${flight.diameter}px`,
    });
    layer.append(bubble);
    const generation = animationGeneration;
    const animation = animateElement(bubble, getHoverBubbleKeyframes(flight), {
      duration: flight.durationMilliseconds,
      easing: 'linear',
      fill: 'both',
    });

    /** Cancels the filled animation and removes the finished or interrupted bubble. */
    function removeBubble(): void {
      bubble.remove();
      animation.cancel();
    }

    void animation.finished.then(() => {
      if (generation === animationGeneration && !destroyed && layer.isConnected)
        popBubble(flight.destination, flight.diameter);
      removeBubble();
    }, removeBubble);
  }

  /** Stops scheduled frames and browser animations, including bubbles waiting to finish. */
  function clear(): void {
    animationGeneration += 1;
    if (pageMotionFrame !== null) animationWindow?.cancelAnimationFrame(pageMotionFrame);
    pageMotionFrame = null;
    for (const animation of activeAnimations) animation.cancel();
    activeAnimations.clear();
    layer.replaceChildren();
  }

  /** Restarts the fourteen-bubble arrival and pops every bubble together at three seconds. */
  function playHomeArrival(): void {
    if (destroyed) return;
    clear();
    if (!animationWindow || !layer.isConnected || typeof layer.animate !== 'function') return;

    const viewport = { width: layer.clientWidth, height: layer.clientHeight };
    if (viewport.width <= 0 || viewport.height <= 0) return;
    const generation = animationGeneration;
    const startedAt = animationWindow.performance.now();
    const pageBubbles = createHomeBubbleMotions(viewport).map((motion) => {
      const element = layer.ownerDocument.createElement('span');
      element.className = classNames.bubble;
      element.dataset.kind = 'page';
      Object.assign(element.style, {
        width: `${motion.diameter}px`,
        height: `${motion.diameter}px`,
      });
      return { motion, element, position: motion.origin };
    });

    /** Samples elapsed time rather than frame count, preserving bounces after a slow frame. */
    function movePageBubbles(now: number): void {
      pageMotionFrame = null;
      if (generation !== animationGeneration || destroyed) return;
      if (!layer.isConnected) {
        clear();
        return;
      }

      const elapsedMilliseconds = now - startedAt;
      const currentViewport = { width: layer.clientWidth, height: layer.clientHeight };
      for (const bubble of pageBubbles) {
        const frame = sampleHomeBubble(bubble.motion, elapsedMilliseconds, currentViewport);
        if (!frame) continue;
        if (!bubble.element.isConnected) layer.append(bubble.element);
        bubble.position = frame.position;
        bubble.element.style.opacity = String(frame.opacity);
        bubble.element.style.transform = bubbleTransform(
          frame.position,
          bubble.motion.diameter,
          frame.scale,
        );
      }

      if (elapsedMilliseconds >= HOME_POP_TIME_MS) {
        for (const bubble of pageBubbles) {
          popBubble(bubble.position, bubble.motion.diameter);
          bubble.element.remove();
        }
        return;
      }
      pageMotionFrame = animationWindow!.requestAnimationFrame(movePageBubbles);
    }

    pageMotionFrame = animationWindow.requestAnimationFrame(movePageBubbles);
  }

  /** Adds the six approved hover bubbles at the caller's viewport-relative interaction point. */
  function playHover(origin: BubblePosition): void {
    if (destroyed || !layer.isConnected || typeof layer.animate !== 'function') return;
    for (const flight of createHoverBubbleFlights(origin)) launchHoverBubble(flight);
  }

  /** Makes cleanup permanent so a stale callback cannot restart a discarded animator. */
  function destroy(): void {
    clear();
    destroyed = true;
  }

  return { playHomeArrival, playHover, clear, destroy };
}
