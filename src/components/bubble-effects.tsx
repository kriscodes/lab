/** Optional decorative bubbles, with one home welcome and the approved pointer hover effect. */
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { createBubbleAnimator } from '@/lib/bubble-animation';
import { createHomeArrivalGate } from '@/lib/bubble-arrival';
import styles from './bubble-effects.module.css';

const INTERACTIVE_TARGET_SELECTOR = 'a[href], button, summary';

/** Find the nearest enabled link or control without changing its native interaction. */
function findBubbleTarget(eventTarget: EventTarget | null): HTMLElement | null {
  if (!(eventTarget instanceof Element)) return null;
  const interactiveElement = eventTarget.closest<HTMLElement>(INTERACTIVE_TARGET_SELECTOR);
  if (!interactiveElement || interactiveElement.matches(':disabled, [aria-disabled="true"]')) {
    return null;
  }
  return interactiveElement;
}

/** Add a click-through overlay without changing layout, focus, links, or page content. */
export function BubbleEffects() {
  const currentPathname = usePathname();
  const bubbleLayerRef = useRef<HTMLDivElement>(null);
  const animatorRef = useRef<ReturnType<typeof createBubbleAnimator> | null>(null);
  const arrivalGateRef = useRef<ReturnType<typeof createHomeArrivalGate> | null>(null);

  useEffect(() => {
    const bubbleLayer = bubbleLayerRef.current;
    if (!bubbleLayer) return;

    const animator = createBubbleAnimator(bubbleLayer, {
      bubble: styles.bubble,
      pop: styles.pop,
    });
    animatorRef.current = animator;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const documentNavigation = performance.getEntriesByType('navigation')[0] as
      PerformanceNavigationTiming | undefined;
    const initialDocumentPathname = documentNavigation
      ? new URL(documentNavigation.name).pathname
      : window.location.pathname;
    arrivalGateRef.current ??= createHomeArrivalGate(
      initialDocumentPathname,
      documentNavigation?.type ?? 'navigate',
    );

    /** Check the original document once; client-side route changes never schedule a welcome. */
    function playInitialHomeWelcome() {
      const arrivalAllowed = arrivalGateRef.current?.(window.location.pathname);
      if (arrivalAllowed && !motionPreference.matches && !document.hidden) {
        animator.playHomeArrival();
      }
    }

    const arrivalFrameId = requestAnimationFrame(playInitialHomeWelcome);

    /** Consume a welcome that was skipped before its first frame, so it cannot play later. */
    function cancelPendingWelcome() {
      cancelAnimationFrame(arrivalFrameId);
      arrivalGateRef.current?.(window.location.pathname);
    }

    /** Release six bubbles only when the pointer enters a different interactive target. */
    function handlePointerEntry(event: PointerEvent) {
      if (event.pointerType === 'touch' || motionPreference.matches || document.hidden) return;
      const interactiveElement = findBubbleTarget(event.target);
      if (!interactiveElement) return;
      if (event.relatedTarget instanceof Node && interactiveElement.contains(event.relatedTarget)) {
        return;
      }
      animator.playHover({ horizontalPosition: event.clientX, verticalPosition: event.clientY });
    }

    /** Give keyboard focus the same six-bubble effect from the control's center. */
    function handleKeyboardFocus(event: FocusEvent) {
      if (motionPreference.matches || document.hidden) return;
      const interactiveElement = findBubbleTarget(event.target);
      if (!interactiveElement?.matches(':focus-visible')) return;
      const targetBounds = interactiveElement.getBoundingClientRect();
      animator.playHover({
        horizontalPosition: targetBounds.left + targetBounds.width / 2,
        verticalPosition: targetBounds.top + targetBounds.height / 2,
      });
    }

    /** Preserve the preview's touch feedback without preventing taps or synthesizing clicks. */
    function handleTouchPress(event: PointerEvent) {
      if (
        event.pointerType !== 'touch' ||
        motionPreference.matches ||
        document.hidden ||
        !findBubbleTarget(event.target)
      ) {
        return;
      }
      animator.playHover({ horizontalPosition: event.clientX, verticalPosition: event.clientY });
    }

    /** Remove active decoration immediately when the visitor requests reduced motion. */
    function handleMotionPreferenceChange() {
      if (motionPreference.matches) {
        cancelPendingWelcome();
        animator.clear();
      }
    }

    /** Discard hidden motion instead of replaying it when the visitor returns. */
    function handleVisibilityChange() {
      if (document.hidden) {
        cancelPendingWelcome();
        animator.clear();
      }
    }

    /** Leave history snapshots free of unfinished bubbles. */
    function handlePageExit() {
      cancelPendingWelcome();
      animator.clear();
    }

    document.addEventListener('pointerover', handlePointerEntry, { passive: true });
    document.addEventListener('focusin', handleKeyboardFocus);
    document.addEventListener('pointerdown', handleTouchPress, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageExit);
    motionPreference.addEventListener('change', handleMotionPreferenceChange);

    return () => {
      cancelAnimationFrame(arrivalFrameId);
      document.removeEventListener('pointerover', handlePointerEntry);
      document.removeEventListener('focusin', handleKeyboardFocus);
      document.removeEventListener('pointerdown', handleTouchPress);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageExit);
      motionPreference.removeEventListener('change', handleMotionPreferenceChange);
      animator.destroy();
      animatorRef.current = null;
    };
  }, []);

  useEffect(() => {
    /** Clear departing-page decoration without scheduling an animation on the next route. */
    return () => animatorRef.current?.clear();
  }, [currentPathname]);

  return <div ref={bubbleLayerRef} className={styles.layer} aria-hidden="true" />;
}
