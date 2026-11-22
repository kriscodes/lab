import { BENCHMARK_REPOSITORY } from './evidence';

export const ROUND_TWO = {
  headline: 'The render gap grew when we removed the delay.',
  summary:
    'With range loading enabled, the linearized PDF rendered its first page 405–414 ms later than the nonlinearized PDF at 0 ms of header delay, compared with 80–105 ms later at 100 ms.',
  tableCaption:
    'Run outcomes and paired median render gaps with range loading enabled. Positive values mean the linearized PDF took longer.',
  pairs: [
    { pair: 1, delay0: 'Rejected at the clock check', delay100: 'Accepted · +109.20 ms' },
    { pair: 2, delay0: 'Rejected at the pacing check', delay100: 'Rejected at the clock check' },
    { pair: 3, delay0: 'Accepted · +414.00 ms', delay100: 'Accepted · +80.35 ms' },
    { pair: 4, delay0: 'Accepted · +404.90 ms', delay100: 'Accepted · +104.60 ms' },
  ],
  interpretation:
    'Two of four pairs passed both audits. The gap narrowed in all eight matched blocks when we added 100 ms of header delay. With range loading disabled, the gap stayed between 5 and 22 ms.',
  network:
    'In the accepted pairs, the nonlinearized file started three range requests before render at both delays. The linearized file started four at 100 ms and five at 0 ms. The extra request is a clue to how delivery changed. We have yet to measure how much time any single request contributed.',
  evidenceUrl: `${BENCHMARK_REPOSITORY}/blob/ed38b02c126e2553610bc06d2db2c13e46f56f37/docs/round-two.md`,
} as const;
