/** Dated evidence ledger. Rejected and unattempted windows never become timing estimates. */
import Link from 'next/link';
import {
  getBenchmarkSourceUrl,
  ACCEPTED_WINDOW_RESULTS,
  CORPUS_PATH,
  FINAL_WINDOWS,
  LAB_PATH,
  RESEARCH_STAGES,
} from './evidence';
import { EvidenceDate, LabNavigation } from './navigation';
import { RoundTwoResults } from './round-two';

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
          <a href="#round-two">Round two</a>
          <a href="#ledger">Final campaign</a>
          <a href="#earlier">Earlier diagnostics</a>
          <a href="#artifacts">Source &amp; artifacts</a>
          <a href="#limits">Limits &amp; open questions</a>
        </nav>
        <div className="lab-evidence-body">
          <RoundTwoResults />
          <section id="ledger" className="lab-section" aria-labelledby="ledger-heading">
            <p className="lr-mono lab-eyebrow">THE FINAL CAMPAIGN</p>
            <h2 id="ledger-heading">Three slots. One accepted window.</h2>
            <div className="lab-counts">
              <p>
                <strong>
                  2 <span>/ 3</span>
                </strong>{' '}
                windows attempted
              </p>
              <p>
                <strong>1</strong> accepted timing window
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
                        {campaignWindow.performanceLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="lab-prose">
              <h3>What the accepted window measured</h3>
              <p>
                Window 03 completed on November 19, 09:01–09:05 Pacific. All 64 performance trials
                passed the original checks: {ACCEPTED_WINDOW_RESULTS.warmupTrials} warmups, excluded
                from the summaries, and 48 measured trials. The independent performance audit
                accepted this window, including its pre/post controls, PDF checks, pixels, network
                checks and strict clock gate.
              </p>
            </div>
            <table className="lab-ledger">
              <caption>
                Window 03 only · median first-page render time ·{' '}
                {ACCEPTED_WINDOW_RESULTS.measuredTrialsPerCondition} measured trials per condition
              </caption>
              <thead>
                <tr>
                  <th scope="col">PDF structure</th>
                  <th scope="col">Range requests</th>
                  <th scope="col">Median time</th>
                </tr>
              </thead>
              <tbody>
                {ACCEPTED_WINDOW_RESULTS.conditions.map((condition) => (
                  <tr key={`${condition.structure}-${condition.ranges}`}>
                    <th scope="row">{condition.structure}</th>
                    <td data-label="Range requests">{condition.ranges}</td>
                    <td data-label="Median time">
                      {condition.medianRenderMilliseconds.toFixed(2)} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="lab-prose">
              <p>
                Within this window, the paired median difference for linearized minus nonlinearized
                was +
                {ACCEPTED_WINDOW_RESULTS.pairedStructureDifference.rangesEnabledMilliseconds.toFixed(
                  2,
                )}{' '}
                ms with ranges enabled and +
                {ACCEPTED_WINDOW_RESULTS.pairedStructureDifference.rangesDisabledMilliseconds.toFixed(
                  2,
                )}{' '}
                ms with ranges disabled. Positive means the linearized PDF took longer in these
                paired observations. These are medians of paired differences, not differences
                between the four medians above. They describe one run, not a general linearization
                penalty.
              </p>
              <p>
                The separate observer diagnostic completed 96 valid workloads and 144 passing clock
                analyses, with all six control stages passing. All 48 pairs were comparable; there
                were no candidate-only clock acceptance gains. These checks do not establish equal
                observer overhead or justify adopting the larger observer.
              </p>
            </div>
            <details className="lab-finding">
              <summary>Why window 02 has no measurements</summary>
              <div className="lab-prose">
                <p>
                  Its allowed start interval ended before the slot was claimed. The retained ledger
                  records a missed slot with zero attempts: neither runner started. There was no
                  catch-up or replacement. The missed slot contributes no timing estimate.
                </p>
              </div>
            </details>
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
              <h3>The stopping rule is met. The comparison is not.</h3>
              <p>
                All three slots are accounted for, without replacements or relaxed gates. Only one
                of three new performance windows was accepted; the planned comparison needed at
                least two. The final conclusion is insufficient accepted evidence for a
                between-window timing comparison. The earlier accepted pilot stays separate.
              </p>
            </div>
            <div className="lab-prose lab-note">
              <h3>The overall audit still reports a failure</h3>
              <p>
                The frozen campaign auditor expects a Node runtime identity for window 02, even
                though that missed slot never launched a runner. It labels the slot
                “integrity-failed.” A separate 14-check ledger review confirms the missed outcome
                and zero invocations; the closing review reconciles the discrepancy. The failed
                export and frozen code are preserved. This is not an overall audit pass, and it does
                not change window 03’s independent acceptance.
              </p>
              <a
                className="lab-text-link"
                href={getBenchmarkSourceUrl('docs/data/final-windows-window-2-ledger-review.json')}
              >
                Inspect the missed-slot review
              </a>
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
                <a href={getBenchmarkSourceUrl('docs/data/final-windows-final-2026-11-19.json')}>
                  Final campaign audit
                </a>
                <span>JSON · retained failed aggregate audit; see caveat above</span>
              </li>
              <li>
                <a href={getBenchmarkSourceUrl('docs/data/final-windows-final-2026-11-19.csv')}>
                  Window outcomes
                </a>
                <span>CSV · original export, including the missed-slot classification defect</span>
              </li>
              <li>
                <a
                  href={getBenchmarkSourceUrl(
                    'docs/data/final-windows-closing-review-2026-11-19.json',
                  )}
                >
                  Closing review and conclusion
                </a>
                <span>JSON · reconciles the missed slot without relabeling the failed audit</span>
              </li>
              <li>
                <a
                  href={getBenchmarkSourceUrl(
                    'docs/data/final-windows-final-publication-2026-11-19.json',
                  )}
                >
                  Verified final archive receipt
                </a>
                <span>JSON · three ZIP parts, 231 files, downloaded and checked by SHA-256</span>
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
                One accepted window cannot establish repeatability across runs. Observer acceptance
                does not establish equivalent overhead or a general speed benefit.
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
