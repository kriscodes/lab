import Link from 'next/link';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Methodology',
  'Measurement and publication standards: controlled workloads, explicit timing boundaries, repeated trials, raw samples, and limitations.',
  '/methodology/',
);
const standards = [
  [
    'Ask',
    'Start with a falsifiable question.',
    'Review existing work before choosing the hypothesis. Define the behavior under investigation, the comparison, and what result would contradict the prediction. A protocol is a plan, not a finding.',
  ],
  [
    'Control',
    'Keep the workload comparable.',
    'Use identical source fixtures, equivalent operations, and documented parameters. Separate acquisition and setup from the work being timed. Keep browser and device cohorts separate.',
  ],
  [
    'Measure',
    'Name the boundary and the unit.',
    'Distinguish render completion, visible updates, browser paint, and interaction readiness. Record the API, milestones, build mode, revision, dependencies, and environment. Unsupported measurements are missing data, never zero.',
  ],
  [
    'Repeat',
    'Keep the noise visible.',
    'Run comparisons serially with a defined warmup policy and balanced order. Retain raw samples, failures, and timeouts. Report sample counts and variation; a single fast run cannot stand in for a result.',
  ],
  [
    'Interpret',
    'Keep conclusions inside the evidence.',
    'Explain observations, tradeoffs, limitations, and follow-up questions. Do not turn a timing proxy into an exact paint claim or a controlled policy comparison into a ranking of rendering libraries.',
  ],
  [
    'Reproduce',
    'Publish enough to repeat the work.',
    'Link the source, dependency lockfile, fixture checksums, setup, methodology version, and raw results. Visitor runs remain distinct from reviewed, versioned findings.',
  ],
];
export default function MethodologyPage() {
  return (
    <article className="lr-protocol">
      <p className="lr-mono">HOW THE WORK IS DONE</p>
      <h1 className="lr-title">
        Evidence with <em>context.</em>
      </h1>
      <p className="lr-lead">
        A measurement is useful when someone else can understand and repeat it.
      </p>
      <div className="lr-standards">
        {standards.map(([label, title, body], index) => (
          <section key={label} className="lr-policy">
            <span className="lr-mono">
              0{index + 1} / {label.toUpperCase()}
            </span>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
      </div>
      <Link className="lr-open" href="/experiments/pdf-rendering/">
        Read Study 001 <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
