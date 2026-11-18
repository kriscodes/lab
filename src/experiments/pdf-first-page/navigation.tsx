/** Reading paths shared by the static report, evidence ledger and replication guide. */
import Link from 'next/link';
import { LAB_PATH, SNAPSHOT_DATE, SNAPSHOT_TIME } from './evidence';

/** Links the overview, evidence ledger and replication guide, marking the current section. */
export function LabNavigation({
  currentSection,
}: {
  currentSection: 'overview' | 'evidence' | 'replicate';
}) {
  const navigationSections = [
    ['overview', LAB_PATH, 'Overview'],
    ['evidence', `${LAB_PATH}evidence/`, 'The evidence'],
    ['replicate', `${LAB_PATH}replicate/`, 'Replicate the experiment'],
  ] as const;
  return (
    <nav className="lab-navigation" aria-label="PDF loading lab">
      {navigationSections.map(([sectionId, sectionPath, sectionLabel]) => (
        <Link
          key={sectionId}
          href={sectionPath}
          aria-current={currentSection === sectionId ? 'page' : undefined}
        >
          {sectionLabel}
        </Link>
      ))}
    </nav>
  );
}

/** Shows when the reviewed evidence snapshot was captured, rather than a live status. */
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
