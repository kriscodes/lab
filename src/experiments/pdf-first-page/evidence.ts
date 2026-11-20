/** Reviewed publication snapshot. Update only from an audited, versioned benchmark record. */
export const BENCHMARK_REVISION = '0feddfba7a62a556a25cc2ddcab324cf67892fc0';
export const BENCHMARK_REPOSITORY = 'https://github.com/kriscodes/pdf-rendering-benchmark';
export const LAB_PATH = '/experiments/pdf-first-page/';
export const CORPUS_PATH = '/downloads/pdf-lab-001/';
export const SNAPSHOT_DATE = 'November 19, 2026';
export const SNAPSHOT_TIME = '09:13 Pacific';
export const SNAPSHOT_TIMESTAMP = '2026-11-19T09:13:00-08:00';

/** Pinned links keep later repository changes from silently changing this article's evidence. */
export function getBenchmarkSourceUrl(repositoryFilePath: string): string {
  return `${BENCHMARK_REPOSITORY}/blob/${BENCHMARK_REVISION}/${repositoryFilePath}`;
}

/** Declared campaign windows and their reviewed outcomes at the snapshot time. */
export const FINAL_WINDOWS = [
  {
    number: '01',
    date: 'Nov 18',
    time: '09:00',
    startsAt: '2026-11-18T09:00:00-08:00',
    performance: 'rejected',
    performanceLabel: 'Rejected',
    observer: '96 of 96 valid',
    note: 'Clock uncertainty exceeded the 5 ms limit.',
  },
  {
    number: '02',
    date: 'Nov 18',
    time: '15:00',
    startsAt: '2026-11-18T15:00:00-08:00',
    performance: 'missed',
    performanceLabel: 'Missed',
    observer: 'Not attempted',
    note: 'The start deadline passed. Neither runner was invoked.',
  },
  {
    number: '03',
    date: 'Nov 19',
    time: '09:00',
    startsAt: '2026-11-19T09:00:00-08:00',
    performance: 'accepted',
    performanceLabel: 'Accepted',
    observer: '96 of 96 valid',
    note: 'All 64 performance trials passed; 48 measured trials retained.',
  },
] as const;

/** Window 3 only: audited condition medians, excluding all warmups and other windows.
 * Source: docs/data/final-windows-final-2026-11-19.csv at BENCHMARK_REVISION.
 */
export const ACCEPTED_WINDOW_RESULTS = {
  windowNumber: '03',
  warmupTrials: 16,
  measuredTrialsPerCondition: 12,
  conditions: [
    { structure: 'Nonlinearized', ranges: 'Enabled', medianRenderMilliseconds: 1008.4 },
    { structure: 'Linearized', ranges: 'Enabled', medianRenderMilliseconds: 1110.65 },
    { structure: 'Nonlinearized', ranges: 'Disabled', medianRenderMilliseconds: 968.15 },
    { structure: 'Linearized', ranges: 'Disabled', medianRenderMilliseconds: 977.05 },
  ],
  pairedStructureDifference: {
    rangesEnabledMilliseconds: 100.35,
    rangesDisabledMilliseconds: 7.2,
  },
} as const;

/** Original downloadable PDF pair, including exact byte counts and checksums. */
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

/** Ordered investigation stages with links to their preserved source records. */
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
    'One rejected, one missed, one accepted. The campaign closed with insufficient evidence for a between-window comparison.',
    'docs/final-windows-results.md',
  ],
] as const;
