/** Reviewed publication snapshot. Update only from an audited, versioned benchmark record. */
export const BENCHMARK_REVISION = '1d2ba55efa2af1203202315d2f739e9cbe3401e1';
export const BENCHMARK_REPOSITORY = 'https://github.com/kriscodes/pdf-rendering-benchmark';
export const LAB_PATH = '/experiments/pdf-first-page/';
export const CORPUS_PATH = '/downloads/pdf-lab-001/';
export const SNAPSHOT_DATE = 'November 18, 2026';
export const SNAPSHOT_TIME = '09:06 Pacific';

/** Pinned links keep later repository changes from silently changing this article's evidence. */
export function benchmarkSource(path: string): string {
  return `${BENCHMARK_REPOSITORY}/blob/${BENCHMARK_REVISION}/${path}`;
}

export const FINAL_WINDOWS = [
  {
    number: '01',
    date: 'Nov 18',
    time: '09:00',
    startsAt: '2026-11-18T09:00:00-08:00',
    performance: 'rejected',
    observer: '96 of 96 valid',
    note: 'Clock uncertainty exceeded the 5 ms limit.',
  },
  {
    number: '02',
    date: 'Nov 18',
    time: '15:00',
    startsAt: '2026-11-18T15:00:00-08:00',
    performance: 'pending',
    observer: 'Pending',
    note: 'Scheduled. No replacement runs.',
  },
  {
    number: '03',
    date: 'Nov 19',
    time: '09:00',
    startsAt: '2026-11-19T09:00:00-08:00',
    performance: 'pending',
    observer: 'Pending',
    note: 'Scheduled. No replacement runs.',
  },
] as const;

export const CORPUS_DOCUMENTS = [
  {
    label: 'Nonlinearized',
    file: 'text-100-nonlinearized.pdf',
    bytes: 86329,
    sha256: 'd9ad470b1f56976f907aad64712c2269b380cb0af7e52a5c3670dc3290af162a',
  },
  {
    label: 'Linearized',
    file: 'text-100-linearized.pdf',
    bytes: 87189,
    sha256: 'efb5faa8018ec5a2b508eb703d55fa39e8cb4746b6aad29d05a841b6c3cf874a',
  },
] as const;

export const RESEARCH_STAGES = [
  [
    '01',
    'Validate the inputs',
    'One source, two PDFs. Check structure, repeat-generation hashes and all 100 rendered pages.',
    'docs/validation-2026-11-16.md',
  ],
  [
    '02',
    'Establish a local baseline',
    'Four first-page runs completed. Timing varied between sessions; this small pair loaded in full.',
    'docs/first-page-repeatability-2026-11-17.md',
  ],
  [
    '03',
    'Inspect partial loading',
    'Record range requests and bytes around first render before making delivery claims.',
    'docs/partial-loading-2026-11-17.md',
  ],
  [
    '04',
    'Control delivery',
    'One accepted pilot, then rejected replication attempts. Keep every outcome; do not pool the protocols.',
    'docs/controlled-delivery-replication-2026-11-17.md',
  ],
  [
    '05',
    'Examine the observer',
    'Test clock measurements on a known fixture, then under the preserved PDF workload.',
    'docs/pdf-clock-observer-2026-11-18.md',
  ],
  [
    '06',
    'Finish at fixed times',
    'Three scheduled windows, unchanged gates, no replacement attempts. Final interpretation is pending.',
    'docs/final-windows.md',
  ],
] as const;
