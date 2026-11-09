import Link from 'next/link';
import type { ExperimentMetadata } from '@/lib/experiments';

export function PdfRenderingProtocol({ experiment }: { experiment: ExperimentMetadata }) {
  return (
    <article className="lr-protocol">
      <p className="lr-mono">STUDY 001 / PROPOSED METHOD</p>
      <h1 className="lr-title">
        {'Useful progress. '}
        <br />
        At <em>what cost?</em>
      </h1>
      <p className="lr-lead">
        Can progress updates adapt to their own cost without making the wait feel longer?
      </p>
      <div className="lr-comparison">
        <section className="lr-policy">
          <span className="lr-mono">A / DIAGNOSTIC PILOT</span>
          <h2>Measure the cost first</h2>
          <p>
            Compare the renderer’s normal intermediate updates with a final-frame-only diagnostic.
            Record snapshot work, visible feedback, and final completion. The diagnostic is a
            measurement control, not a proposed user experience.
          </p>
        </section>
        <section className="lr-policy">
          <span className="lr-mono">B / CONDITIONAL STUDY</span>
          <h2>Adapt the update cadence</h2>
          <p>
            If the pilot exposes a reproducible cost, compare an adaptive update policy with fixed
            intervals. Keep the requested page and final image quality identical, while tracking the
            gaps between useful updates.
          </p>
        </section>
      </div>
      <h3>The evidence</h3>
      <p>
        Measure the first useful frame, final render completion, visible feedback gaps, and snapshot
        overhead. A completed render task is not a paint timestamp: inspect visual updates and
        browser traces separately. Check final output correctness and interaction responsiveness.
      </p>
      <h3>The controls</h3>
      <p>
        Pin PDF.js 6.5.438 and verify whether each run actually uses its renderer worker. Record
        fallback runs separately. Use identical documents, display settings, final quality, and
        interaction tasks; repeat serial trials in balanced order. Keep file acquisition outside the
        rendering comparison.
      </p>
      <h3>A useful failure</h3>
      <p>
        Stop after the pilot if updates add no reproducible cost. An adaptive policy also fails if
        it delays useful feedback, creates longer unexplained pauses, or produces no improvement
        over a simple fixed interval. No benchmark runs have been collected yet.
      </p>
      <h3>Prior work</h3>
      <p>
        Progressive drawing and worker rendering already exist. This proposal examines the cost of
        the update policy, without claiming to invent progressive PDF rendering.
      </p>
      <ul className="lr-references">
        <li>
          <a href="https://github.com/kriscodes/lab/blob/main/docs/RESEARCH-001-PRIOR-ART.md">
            Prior-art review and detailed study proposal <span aria-hidden="true">↗</span>
          </a>
        </li>
        {experiment.references.map(({ title, url }) => (
          <li key={url}>
            <a href={url}>
              {title} <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
      <Link className="lr-open" href="/methodology/">
        Measurement and publication standards <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
