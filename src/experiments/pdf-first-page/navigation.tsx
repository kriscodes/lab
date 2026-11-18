/** Reading paths shared by the static report, evidence ledger and replication guide. */
import Link from 'next/link';
import { LAB_PATH, SNAPSHOT_DATE, SNAPSHOT_TIME } from './evidence';

export function LabNavigation({ current }: { current: 'overview' | 'evidence' | 'replicate' }) {
  const sections = [
    ['overview', LAB_PATH, 'Overview'],
    ['evidence', `${LAB_PATH}evidence/`, 'The evidence'],
    ['replicate', `${LAB_PATH}replicate/`, 'Replicate the experiment'],
  ] as const;
  return (
    <nav className="lab-navigation" aria-label="PDF loading lab">
      {sections.map(([id, href, label]) => (
        <Link key={id} href={href} aria-current={current === id ? 'page' : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function EvidenceDate() {
  return (
    <p className="lab-dateline">
      Evidence snapshot ·{' '}
      <time dateTime="2026-11-18T09:06:00-08:00">
        {SNAPSHOT_DATE}, {SNAPSHOT_TIME}
      </time>
      . Updated after review, not live.
    </p>
  );
}
