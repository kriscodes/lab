/** @file Draws the four friendly symbols used by the Studies page. */

export type StudyTopicName = 'loading' | 'motion' | 'accessibility' | 'efficiency';

/** Keeps each topic recognizable in the static hero and the question buttons. */
export function StudySymbol({ topic }: Readonly<{ topic: StudyTopicName }>) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {topic === 'loading' && (
        <>
          <path d="M46 38c-4-8-2-25 2-27 5-3 6 15 4 24M54 36c0-9 5-24 9-24 5 1-2 20-5 25" />
          <path d="M47 37c8-5 18-1 19 6l5 5-5 4c-2 5-6 7-12 7l-4 10H35M45 43c-10-10-29-5-30 9-1 8 5 17 16 17h14" />
          <path d="M36 51c-7-3-15 3-12 9 1 3 5 4 9 4M16 48c-4-5-10-3-10 2s5 7 9 5" />
          <circle cx="60" cy="43" r="1.2" fill="currentColor" stroke="none" />
        </>
      )}
      {topic === 'motion' && (
        <>
          <ellipse cx="40" cy="40" rx="31" ry="14" transform="rotate(-35 40 40)" />
          <ellipse cx="40" cy="40" rx="31" ry="14" transform="rotate(35 40 40)" />
          <circle cx="40" cy="40" r="6" />
          <circle cx="16" cy="24" r="5" fill="var(--page-background)" />
          <circle cx="64" cy="55" r="4" fill="var(--page-background)" />
        </>
      )}
      {topic === 'accessibility' && (
        <>
          <path d="M27 42V22c0-6 8-6 8 0v16-23c0-6 8-6 8 0v23-18c0-6 8-6 8 0v20-11c0-6 8-6 8 0v22c0 14-8 22-20 22-8 0-13-4-18-11L10 46c-3-5 3-10 7-6l10 10v-8Z" />
          <path d="M34 52c5-4 11-3 15 1M35 60c3-2 6-2 9 0" />
        </>
      )}
      {topic === 'efficiency' && (
        <>
          <path d="M16 63c-5-15 4-34 21-42 10-5 19-7 30-8-1 13-4 27-14 38-11 12-25 15-37 12Z" />
          <path d="m10 71 47-47M29 52l-1-15M40 41l-1-13M29 52l15 1M40 41l15 1" />
        </>
      )}
    </svg>
  );
}
