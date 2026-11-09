'use client';

import { useState, useSyncExternalStore } from 'react';
import {
  getAppearance,
  getServerAppearance,
  setAppearance,
  subscribeAppearance,
} from '@/lib/appearance';

/** Offers an optional appearance preference while all research content remains server-rendered. */
export function ThemeToggle() {
  const appearance = useSyncExternalStore(subscribeAppearance, getAppearance, getServerAppearance);
  const [message, setMessage] = useState('');

  function toggleAppearance() {
    const next = getAppearance() === 'dark' ? 'light' : 'dark';
    const persisted = setAppearance(next);
    setMessage(
      `${next === 'dark' ? 'Dark' : 'Light'} appearance.${persisted ? '' : ' Saved for this visit only.'}`,
    );
  }

  return (
    <>
      <button
        className="lr-theme"
        type="button"
        aria-label="Dark appearance"
        aria-pressed={appearance === 'dark'}
        hidden={appearance === null}
        onClick={toggleAppearance}
      >
        <svg
          className="theme-moon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M20.2 14A8.4 8.4 0 0 1 10 3.8 8.4 8.4 0 1 0 20.2 14Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          className="theme-sun"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Appearance
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {message}
      </span>
    </>
  );
}
