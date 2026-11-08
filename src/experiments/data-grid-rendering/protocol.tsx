import Link from 'next/link';
import type { ExperimentMetadata } from '@/lib/experiments';
import { REPOSITORY_URL } from '@/lib/site';

/** Documents the approved data-grid protocol without implying a completed benchmark. */
export function DataGridProtocol({ experiment }: { experiment: ExperimentMetadata }) {
  return (
    <>
      <div className="protocol-notice">
        <span className="mono">Protocol / not yet measured</span>
        <p>
          This page defines the investigation. The interactive grid, benchmark execution, exports,
          and evidence-based findings will be added in the next phase.
        </p>
      </div>
      <section id="overview">
        <p className="mono section-label">01 / Overview</p>
        <h2>What does the browser actually have to render?</h2>
        <p>
          Large data grids make a familiar frontend tradeoff visible: how much content should be
          mounted, and how should people move through the data? This investigation will compare
          three approaches under the same synthetic workload.
        </p>
        <h3>Hypothesis</h3>
        <p>{experiment.hypothesis}</p>
        <p>
          Virtualization is not assumed to make full-dataset filtering or sorting faster. This study
          compares rendering strategies in React; it will not rank frameworks.
        </p>
        <dl className="facts">
          <div>
            <dt>Initial implementation</dt>
            <dd>{experiment.technologies.join(' + ')}</dd>
          </div>
          <div>
            <dt>Data</dt>
            <dd>Seeded, synthetic records only</dd>
          </div>
          <div>
            <dt>Current stage</dt>
            <dd>Protocol defined. No measurements collected.</dd>
          </div>
        </dl>
      </section>
      <section id="design">
        <p className="mono section-label">02 / Experiment design</p>
        <h2>One workload. Three rendering strategies.</h2>
        <ul className="numbered-options">
          {experiment.strategies.map((strategy, index) => (
            <li key={strategy}>
              <span className="mono">0{index + 1}</span>
              <span>{strategy}</span>
            </li>
          ))}
        </ul>
        <p>
          The planned baseline uses{' '}
          {experiment.recordCounts.map((count) => count.toLocaleString('en-US')).join(', ')}{' '}
          records, eight columns, and fixed-height rows. All approaches will use identical data,
          cell content, filtering, and sort rules.
        </p>
        <p>
          Pagination will start at 50 rows per page. Virtualization will use five overscan rows per
          side. Dataset sizes and these settings are workload parameters, not benchmark results.
        </p>
        <h3>Interactive controls</h3>
        <p>
          The next phase will add strategy and dataset controls, an explicit run action, and reset.
          The 100,000-row full-render case will require an opt-in action because it can block the
          tab.
        </p>
      </section>
      <section id="measurements">
        <p className="mono section-label">03 / Measurements</p>
        <h2>Separate the costs before comparing them.</h2>
        <div className="table-scroll">
          <table>
            <caption>Planned measurement contract. No measured values yet.</caption>
            <thead>
              <tr>
                <th scope="col">Signal</th>
                <th scope="col">Unit</th>
                <th scope="col">Collection boundary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Mount to DOM commit</th>
                <td>ms</td>
                <td>Render request to committed grid; generation excluded</td>
              </tr>
              <tr>
                <th scope="row">Mounted DOM</th>
                <td>Count</td>
                <td>Elements and all nodes reported separately, after timing</td>
              </tr>
              <tr>
                <th scope="row">Filter and sort</th>
                <td>ms</td>
                <td>Pure computation and result-commit latency separated</td>
              </tr>
              <tr>
                <th scope="row">Interaction latency</th>
                <td>ms</td>
                <td>Input event to committed update; browser event timing reported separately</td>
              </tr>
              <tr>
                <th scope="row">Scroll behavior</th>
                <td>ms</td>
                <td>Frame-gap distribution under a defined scenario</td>
              </tr>
              <tr>
                <th scope="row">Memory, where supported</th>
                <td>Bytes / MiB</td>
                <td>Separate pass with API and attribution recorded</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Frame callbacks are not proof of painted pixels. Memory availability differs across
          browsers. Missing or unsupported data will never be represented as zero.
        </p>
        <h3>Repeatability</h3>
        <p>
          The initial protocol calls for two discarded warmups and ten recorded trials per case,
          executed serially with counterbalanced strategy order. Published findings will include raw
          samples, environment details, failures, and limitations.
        </p>
        <Link className="text-link" href="/methodology/">
          Measurement principles <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <section id="findings">
        <p className="mono section-label">04 / Findings</p>
        <h2>No conclusions ahead of the evidence.</h2>
        <p>
          No benchmark runs have been published. Observations, tradeoffs, and conclusions will be
          written after the implementation and reproducibility checks are complete.
        </p>
      </section>
      <section id="reproduce">
        <p className="mono section-label">05 / Source & reproducibility</p>
        <h2>The method stays inspectable.</h2>
        <p>
          The source repository includes the full Experiment 001 protocol and conventions for adding
          investigations. The foundation does not include a runner or saved measurement artifacts
          yet.
        </p>
        <p>
          <a className="text-link" href={REPOSITORY_URL}>
            Source repository <span aria-hidden="true">↗</span>
          </a>
        </p>
        <p className="file-note">
          Protocol: <code>docs/EXPERIMENT-001-PROTOCOL.md</code>
          <br />
          Metadata: <code>src/lib/experiments.ts</code>
        </p>
        <h3>Technical references</h3>
        <ul className="reference-list">
          {experiment.references.map((reference) => (
            <li key={reference.url}>
              <a href={reference.url}>
                {reference.title} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
