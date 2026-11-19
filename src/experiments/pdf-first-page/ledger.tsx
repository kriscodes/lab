/** Dated evidence ledger. Rejected and unattempted windows never become timing estimates. */
import Link from 'next/link';
import {
  getBenchmarkSourceUrl,
  CORPUS_PATH,
  FINAL_WINDOWS,
  LAB_PATH,
  RESEARCH_STAGES,
} from './evidence';
import { EvidenceDate, LabNavigation } from './navigation';

/** Displays the reviewed campaign outcomes, earlier diagnostics and limits of the evidence. */
export function PdfLoadingEvidence() {
  return (
    <article className="loading-lab">
      <div className="lr-kicker lr-mono">
        <span>PDF LOADING / LAB 001</span>
        <Link href={LAB_PATH}>Back to the overview</Link>
      </div>
      <h1 className="lr-title lab-page-title">
        Follow the <em>evidence.</em>
      </h1>
      <p className="lab-intro">
        A record of what ran, what passed, and what we can actually conclude.
      </p>
      <LabNavigation currentSection="evidence" />
      <div className="lab-evidence-layout">
        <nav className="lab-contents" aria-label="Evidence sections">
          <span className="lr-mono">IN THIS RECORD</span>
          <a href="#ledger">Final campaign</a>
          <a href="#earlier">Earlier diagnostics</a>
          <a href="#artifacts">Source &amp; artifacts</a>
          <a href="#limits">Limits &amp; open questions</a>
        </nav>
        <div className="lab-evidence-body">
          <section id="ledger" aria-labelledby="ledger-heading">
            <p className="lr-mono lab-eyebrow">THE FINAL CAMPAIGN</p>
            <h2 id="ledger-heading">One attempt. An open conclusion.</h2>
            <div className="lab-counts">
              <p>
                <strong>
                  1 <span>/ 3</span>
                </strong>{' '}
                windows attempted
              </p>
              <p>
                <strong>0</strong> accepted timing windows
              </p>
            </div>
            <EvidenceDate />
            <table className="lab-ledger">
              <caption>Final campaign windows. All scheduled times are Pacific.</caption>
              <thead>
                <tr>
                  <th scope="col">Window</th>
                  <th scope="col">Observer workload</th>
                  <th scope="col">Performance</th>
                </tr>
              </thead>
              <tbody>
                {FINAL_WINDOWS.map((campaignWindow) => (
                  <tr key={campaignWindow.number}>
                    <th scope="row">
                      <span className="lr-mono">{campaignWindow.number}</span>{' '}
                      <time dateTime={campaignWindow.startsAt}>
                        {campaignWindow.date}, {campaignWindow.time}
                      </time>
                    </th>
                    <td data-label="Observer workload">{campaignWindow.observer}</td>
                    <td data-label="Performance">
                      <span
                        className={
                          campaignWindow.performance === 'rejected'
                            ? 'lab-status lab-rejected'
                            : 'lab-status'
                        }
                      >
                        {campaignWindow.performance === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <details className="lab-finding" open>
              <summary>Why window 01 was rejected</summary>
              <div className="lab-prose">
                <p>
                  The clock mapping had a <strong>5.105 ms uncertainty interval</strong>, wider than
                  the protocol’s <strong>5 ms limit</strong>. That uncertainty describes the
                  measurement boundary, not how long the PDF took to render.
                </p>
                <p>
                  The performance runner stopped after 39 recorded trials: 16 warmups, 22 measured
                  passes, then one rejected trial. The other 25 trials and post-run controls were
                  not reached. No performance estimate is accepted from this attempt.
                </p>
                <p>
                  The separate observer diagnostic completed 96 valid workloads and 144 passing
                  clock analyses. Passing that diagnostic does not override the performance
                  rejection. The cause of the wider interval remains unestablished.
                </p>
                <a
                  className="lab-text-link"
                  href={getBenchmarkSourceUrl('docs/final-windows-results.md')}
                >
                  Read the complete window record
                </a>
              </div>
            </details>
            <div className="lab-prose lab-note">
              <h3>What happens at the end?</h3>
              <p>
                Stop after the three declared windows, without replacements or relaxed gates. At
                least two new accepted windows are needed for a descriptive comparison. If fewer
                pass, insufficient evidence is the result. Earlier accepted pilots cannot fill a
                missing slot.
              </p>
            </div>
          </section>
          <section id="earlier" className="lab-section" aria-labelledby="earlier-heading">
            <p className="lr-mono lab-eyebrow">THE PATH TO THIS POINT</p>
            <h2 id="earlier-heading">Each step answered a smaller question.</h2>
            <p className="lab-section-deck">
              These stages use different protocols. They explain the investigation; their timings
              are not pooled with the final campaign.
            </p>
            <ol className="lab-history">
              {RESEARCH_STAGES.map(
                ([stageNumber, stageTitle, stageDescription, sourceFilePath]) => (
                  <li key={stageNumber}>
                    <span className="lr-mono">{stageNumber}</span>
                    <div>
                      <h3>
                        <a href={getBenchmarkSourceUrl(sourceFilePath)}>{stageTitle}</a>
                      </h3>
                      <p>{stageDescription}</p>
                    </div>
                  </li>
                ),
              )}
            </ol>
          </section>
          <section id="artifacts" className="lab-section" aria-labelledby="artifacts-heading">
            <p className="lr-mono lab-eyebrow">INSPECT THE RECORD</p>
            <h2 id="artifacts-heading">The source behind the summary.</h2>
            <ul className="lab-artifacts">
              <li>
                <a href={getBenchmarkSourceUrl('docs/data/final-windows-progress-window-1.json')}>
                  Independent progress audit
                </a>
                <span>JSON · complete, versioned audit</span>
              </li>
              <li>
                <a href={getBenchmarkSourceUrl('docs/data/final-windows-progress-window-1.csv')}>
                  Window outcomes
                </a>
                <span>CSV · includes rejected and pending windows</span>
              </li>
              <li>
                <a href={getBenchmarkSourceUrl('experiments/final-windows.json')}>
                  Frozen experiment plan
                </a>
                <span>JSON · schedule, controls and source hashes</span>
              </li>
              <li>
                <a href={`${CORPUS_PATH}pdf-lab-001-corpus.zip`} download>
                  Original PDF pair
                </a>
                <span>ZIP · two PDFs and the unchanged manifest</span>
              </li>
              <li>
                <a href="https://app.notion.com/p/41ce9784880681ca958ac1a6484f4eb2">
                  Full raw archive in the lab notebook
                </a>
                <span>Notion · access may be required</span>
              </li>
            </ul>
            <p className="lab-small">
              Source links are pinned to the reviewed revision. The public JSON and CSV are audit
              exports; the full raw trial archive is retained separately in the notebook.
            </p>
          </section>
          <section id="limits" className="lab-section lab-prose" aria-labelledby="limits-heading">
            <p className="lr-mono lab-eyebrow">KEEP THE CLAIM SMALL</p>
            <h2 id="limits-heading">What this cannot tell us.</h2>
            <ul className="lab-limit-list">
              <li>
                Two small, synthetic text PDFs do not represent scanned documents, image-heavy files
                or the web’s PDF population.
              </li>
              <li>
                One local Chromium/PDF.js setup does not rank other viewers, browsers or devices.
              </li>
              <li>
                Application-level pacing is a controlled delivery profile, not a real wide-area
                network.
              </li>
              <li>Fresh browser contexts do not clear operating-system or font caches.</li>
              <li>
                Render-promise completion is not physical screen presentation. Network body sums are
                not unique PDF-byte coverage.
              </li>
              <li>
                The final campaign is unfinished. Observer acceptance does not establish equivalent
                overhead or a general speed benefit.
              </li>
            </ul>
            <Link className="lab-text-link" href={`${LAB_PATH}replicate/`}>
              Run a separate, documented attempt
            </Link>
          </section>
        </div>
      </div>
    </article>
  );
}
