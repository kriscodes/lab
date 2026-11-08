import Link from 'next/link';
import { pageMetadata, REPOSITORY_URL } from '@/lib/site';

export const metadata = pageMetadata(
  'Methodology',
  'How Engineering Lab will collect, document, and interpret frontend measurements: controlled workloads, explicit timing boundaries, repeated runs, raw data, and limitations.',
  '/methodology/',
);

/** Makes the publication and measurement rules readable before the first benchmark exists. */
export default function MethodologyPage() {
  return (
    <>
      <header className="document-hero">
        <p className="eyebrow mono">How the work is done</p>
        <h1>Evidence with context.</h1>
        <p className="document-intro">
          A measurement is useful when someone else can understand what it includes, what it leaves
          out, and how to reproduce it.
        </p>
      </header>
      <div className="methodology-body">
        <section>
          <span className="mono section-label">01 / Ask</span>
          <h2>Start with a falsifiable question.</h2>
          <p>
            State the motivation and hypothesis before running the comparison. Define the behavior
            under investigation and the variables that must remain constant. A protocol is a plan,
            not a finding.
          </p>
        </section>
        <section>
          <span className="mono section-label">02 / Control</span>
          <h2>Keep the workload comparable.</h2>
          <p>
            Use seeded synthetic data, equivalent operations, and documented parameters. Separate
            data generation and setup from the work being timed. Different browser or device cohorts
            will remain separate.
          </p>
        </section>
        <section>
          <span className="mono section-label">03 / Measure</span>
          <h2>Name the boundary and the unit.</h2>
          <p>
            Distinguish computation, DOM commit, frame opportunities, and browser paint. Record the
            API, milestones, build mode, source revision, dependency versions, and environment.
            Unsupported measurements are missing data, never zero.
          </p>
        </section>
        <section>
          <span className="mono section-label">04 / Repeat</span>
          <h2>Keep the noise visible.</h2>
          <p>
            Run comparisons serially with a defined warmup policy and balanced order. Retain raw
            samples, failures, and timeouts. Summaries will show sample counts and variation; a
            single fast run cannot stand in for a result.
          </p>
        </section>
        <section>
          <span className="mono section-label">05 / Interpret</span>
          <h2>Keep conclusions inside the evidence.</h2>
          <p>
            Explain observations, tradeoffs, limitations, and follow-up questions. Do not turn a
            frame-timing proxy into an exact paint claim, or a controlled React strategy comparison
            into a ranking of frameworks.
          </p>
        </section>
        <section>
          <span className="mono section-label">06 / Reproduce</span>
          <h2>Publish enough to repeat the work.</h2>
          <p>
            Each completed experiment will link to its source, dependency lockfile, setup,
            methodology version, and exported raw results. Visitor runs will remain distinct from
            reviewed, versioned findings.
          </p>
        </section>
      </div>
      <div className="document-callout">
        <h2>Read the first protocol.</h2>
        <p>
          Experiment 001 applies these rules to data-grid rendering. Its benchmark implementation is
          the next phase.
        </p>
        <Link className="text-link" href="/experiments/data-grid-rendering/">
          Data Grid Rendering Performance <span aria-hidden="true">↗</span>
        </Link>
        <a className="quiet-link" href={REPOSITORY_URL}>
          Conventions and source on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </>
  );
}
