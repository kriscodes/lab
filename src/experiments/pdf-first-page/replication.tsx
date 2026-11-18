/** Portable instructions for a new attempt, not a replay of machine-specific calendar claims. */
import Link from 'next/link';
import { CommandBlock } from '@/components/command-block';
import {
  getBenchmarkSourceUrl,
  BENCHMARK_REVISION,
  CORPUS_DOCUMENTS,
  CORPUS_PATH,
  LAB_PATH,
} from './evidence';
import { LabNavigation } from './navigation';

const workspaceSetupCommand = `git clone https://github.com/kriscodes/pdf-rendering-benchmark.git pdf-lab-001 &&
cd pdf-lab-001 &&
git checkout --detach ${BENCHMARK_REVISION} &&
npm install --global pnpm@11.28.12 &&
pnpm install --frozen-lockfile &&
python3 -m venv .venv &&
.venv/bin/python -m pip install -r packages/corpus/requirements.txt &&
pnpm --filter @pdf-benchmark/runner exec playwright install chromium --only-shell`;
const corpusVerificationCommand = `mkdir -p corpus/generated/pilot &&
unzip pdf-lab-001-corpus.zip -d corpus/generated/pilot &&
qpdf --version &&
pdftoppm -v &&
.venv/bin/python --version &&
node --version &&
pnpm --version &&
pnpm corpus:verify`;
const controlledDeliveryCommand = `pnpm --filter @pdf-benchmark/runner build &&
node packages/runner/dist/controlled-delivery.js --calibrate-only &&
mkdir -p results/raw/controlled-delivery &&
run_dir="$(mktemp -d "$PWD/results/raw/controlled-delivery/replicate.XXXXXX")" &&
node packages/runner/dist/controlled-delivery.js --output-dir "$run_dir"`;
const independentAuditCommand = `# In the same terminal, after the controlled-delivery attempt:
test -n "$run_dir" &&
audit_dir="$(mktemp -d "$PWD/results/raw/manual-audit.XXXXXX")" &&
.venv/bin/python packages/runner/scripts/summarize_controlled_delivery.py \\
  "$run_dir/report.json" \\
  --output-prefix "$audit_dir/summary" \\
  --audit-json "$audit_dir/audit.json"`;

/** Guides a separate attempt using the pinned inputs, controls and audit commands. */
export function PdfLoadingReplication() {
  return (
    <article className="loading-lab">
      <div className="lr-kicker lr-mono">
        <span>PDF LOADING / LAB 001</span>
        <Link href={LAB_PATH}>Back to the overview</Link>
      </div>
      <h1 className="lr-title lab-page-title">
        Make the experiment
        <br /> <em>repeatable.</em>
      </h1>
      <p className="lab-intro">
        The same inputs. A pinned source revision. A record of your own environment and every
        outcome.
      </p>
      <LabNavigation currentSection="replicate" />
      <div className="lab-evidence-layout">
        <nav className="lab-contents" aria-label="Replication steps">
          <span className="lr-mono">YOUR READING PATH</span>
          <a href="#prepare">01 · Prepare</a>
          <a href="#inputs">02 · Get the PDFs</a>
          <a href="#baseline">03 · Run the baseline</a>
          <a href="#controlled">04 · Control delivery</a>
          <a href="#record">05 · Keep the record</a>
          <a href="#troubleshooting">If a check fails</a>
        </nav>
        <div className="lab-evidence-body">
          <div className="lab-prerequisites">
            <p className="lr-mono lab-eyebrow">BEFORE YOU START</p>
            <h2>A new attempt, in a fresh workspace.</h2>
            <p>
              Use a terminal on macOS or Linux, Node 24.x, Python 3.11 or newer, qpdf, Poppler and
              unzip. Leave enough room for Chromium and 100-page validation images. No website
              hosting or account is needed.
            </p>
            <p>
              The first-page baseline is the easiest entry point. Controlled delivery adds stricter
              calibration and audit gates. Neither command replays the final campaign’s reserved
              time slots.
            </p>
            <details>
              <summary>Tools and environment details</summary>
              <div className="lab-prose">
                <p>
                  The source declares Node 24.22.3 and pnpm 11.28.12. The measured environment used
                  Node 24.22.1, Python 3.13.18 and qpdf 12.4.2. PDF.js is pinned to 5.6.205 and
                  Playwright to 1.62.1; Playwright selects its Chromium revision.
                </p>
                <p>
                  Install qpdf and Poppler through your system package manager, with{' '}
                  <code>qpdf</code> and <code>pdftoppm</code> on PATH. On macOS with Homebrew, use{' '}
                  <code>brew install qpdf poppler</code>; on Debian/Ubuntu,{' '}
                  <code>sudo apt-get install qpdf poppler-utils unzip</code>. Record the versions
                  actually installed. Linux may also need Playwright’s documented Chromium system
                  dependencies.
                </p>
                <p>
                  Different operating systems, fonts or runtimes define a different environment. A
                  matching setup does not guarantee identical timings. These commands create
                  independent evidence, not a claim to reproduce the original machine exactly.
                </p>
                <a href={getBenchmarkSourceUrl('docs/corpus-validation.md#setup')}>
                  Full environment and corpus setup
                </a>
              </div>
            </details>
          </div>

          <section id="prepare" className="lab-section lab-step">
            <p className="lr-mono lab-eyebrow">01 / PREPARE</p>
            <h2>Pin the code before you measure.</h2>
            <p className="lab-section-deck">
              Run this in a directory where <code>pdf-lab-001</code> does not already exist. The
              checkout uses the reviewed source revision, so a later change to main cannot silently
              alter your attempt.
            </p>
            <CommandBlock label="Create a separate workspace" command={workspaceSetupCommand} />
            <p className="lab-small">
              Keep this terminal open in the repository root for the following steps. Do not install
              or build inside an active measurement checkout.
            </p>
          </section>

          <section id="inputs" className="lab-section lab-step">
            <p className="lr-mono lab-eyebrow">02 / USE THE SAME INPUTS</p>
            <h2>Download, then verify the pair.</h2>
            <p className="lab-section-deck">
              These are the original synthetic PDFs, copied without modification. Download the ZIP
              and move it into the <code>pdf-lab-001</code> folder you just created.
            </p>
            <a
              className="lab-download"
              href={`${CORPUS_PATH}pdf-lab-001-corpus.zip`}
              download="pdf-lab-001-corpus.zip"
            >
              Download the original corpus
              <small>Two 100-page PDFs + manifest · ZIP</small>
            </a>
            <CommandBlock
              label="Unpack and verify the corpus"
              command={corpusVerificationCommand}
            />
            <p className="lab-small">
              The verifier checks hashes and qpdf structure, repeats generation, and compares all
              pages at 144 DPI. Inspect its saved samples of pages 1, 50 and 100 for layout defects.
              These checks establish input correctness, not performance.
            </p>
            <details className="lab-checksums">
              <summary>Inspect individual files and SHA-256 checksums</summary>
              <div>
                {CORPUS_DOCUMENTS.map((corpusDocument) => (
                  <div key={corpusDocument.file}>
                    <h3>
                      <a href={`${CORPUS_PATH}${corpusDocument.file}`} download>
                        {corpusDocument.label} PDF
                      </a>
                    </h3>
                    <p>{corpusDocument.bytes.toLocaleString('en-US')} bytes · 100 pages</p>
                    <code>{corpusDocument.sha256}</code>
                  </div>
                ))}
                <div>
                  <h3>Corpus ZIP</h3>
                  <code>c0cd7cbcbf68a40e6abd6e7ed08bccabf172bdc80be693fe8df057c0bd63995a</code>
                </div>
                <a href={`${CORPUS_PATH}manifest.json`} download>
                  Download the unchanged manifest
                </a>
              </div>
            </details>
            <p className="lab-small">
              To investigate generation itself, use the{' '}
              <a href={getBenchmarkSourceUrl('docs/corpus-validation.md')}>generator protocol</a> in
              a separate directory. Do not replace the downloaded originals. Toolchain differences
              can change generated bytes; retain and investigate any failed verification.
            </p>
          </section>

          <section id="baseline" className="lab-section lab-step">
            <p className="lr-mono lab-eyebrow">03 / START SIMPLE</p>
            <h2>Run the first-page baseline.</h2>
            <p className="lab-section-deck">
              Close competing workloads, keep the machine awake and let the trials run serially. Do
              this only after the corpus checks pass.
            </p>
            <CommandBlock
              label="Run the local first-page baseline"
              command="pnpm bench:first-page"
            />
            <div className="lab-expectation">
              <h3>What to expect</h3>
              <p>
                Four excluded warmup trials, then 20 measured trials in balanced pairs. Each trial
                uses a fresh browser context. A new directory under{' '}
                <code>results/raw/first-page-local/</code> retains <code>report.json</code> and
                sample images.
              </p>
              <p>
                This baseline uses a 65,536-byte range chunk. Both PDFs are too small to enable
                PDF.js range loading at that setting, so it measures full-response loading. It
                cannot establish a range-delivery benefit.
              </p>
              <p>
                The primary metric is <code>firstPageRenderMs</code>: immediately before{' '}
                <code>getDocument()</code> through page 1’s <code>render().promise</code>. Compare
                paired differences only from a complete, valid run. Do not treat a nonzero exit as a
                successful comparison.
              </p>
            </div>
            <a className="lab-text-link" href={getBenchmarkSourceUrl('docs/first-page-local.md')}>
              Full baseline protocol and controls
            </a>
          </section>

          <section id="controlled" className="lab-section lab-step">
            <p className="lr-mono lab-eyebrow">04 / GO DEEPER</p>
            <h2>Add controlled delivery.</h2>
            <p className="lab-section-deck">
              This is a separate four-condition experiment, not an extra baseline repeat. Read the
              protocol before running it. Keep the original PDFs and the declared settings
              unchanged.
            </p>
            <div className="lab-settings">
              <dl>
                <div>
                  <dt>PDF response headers</dt>
                  <dd>100 ms delay</dd>
                </div>
                <div>
                  <dt>Shared body budget</dt>
                  <dd>125,000 bytes/s · 1 Mbit/s</dd>
                </div>
                <div>
                  <dt>Range chunk</dt>
                  <dd>16,384 bytes</dd>
                </div>
                <div>
                  <dt>Scheduled trials</dt>
                  <dd>16 warmups + 48 measured</dd>
                </div>
              </dl>
            </div>
            <CommandBlock
              label="Calibrate and run controlled delivery"
              command={controlledDeliveryCommand}
            />
            <p className="lab-small">
              Run one attempt after calibration passes. Both the calibration-only invocation and the
              performance runner retain their own evidence. A rejected performance attempt may stop
              early; do not retry until something passes or widen a tolerance.
            </p>
            <CommandBlock
              label="Independently audit the attempt"
              command={independentAuditCommand}
            />
            <p className="lab-small">
              The explicit audit path is intentional: the legacy command’s default uses a shared
              temporary filename. Keep it in the new private directory shown above. The auditor
              rejects incomplete evidence and writes comparison exports only after acceptance.
            </p>
            <a
              className="lab-text-link"
              href={getBenchmarkSourceUrl('docs/controlled-delivery.md')}
            >
              Read every control and acceptance gate
            </a>
          </section>

          <section id="record" className="lab-section lab-step">
            <p className="lr-mono lab-eyebrow">05 / KEEP THE RECORD</p>
            <h2>Share an attempt someone can inspect.</h2>
            <ul className="lab-limit-list">
              <li>The source revision, PDF hashes, configuration and exact command.</li>
              <li>
                Your OS, hardware, Node, Python, qpdf, PDF.js, Playwright and actual Chromium
                versions.
              </li>
              <li>
                All raw trials, excluded warmups, errors, calibration records and audit output.
              </li>
              <li>
                Sample images and your notes on correctness, background activity and departures from
                the protocol.
              </li>
              <li>
                The outcome, including rejection or insufficient evidence. Keep separate
                environments and protocols separate.
              </li>
            </ul>
            <p className="lab-section-deck">
              Archive the whole output directory before any new attempt. Choose the number and
              timing of repeats in advance. A reader’s attempt never becomes one of the original
              campaign’s calendar windows.
            </p>
            <Link className="lab-text-link" href={`${LAB_PATH}evidence/`}>
              Compare the structure of our record
            </Link>
          </section>

          <section id="troubleshooting" className="lab-section">
            <p className="lr-mono lab-eyebrow">WHEN SOMETHING DOES NOT PASS</p>
            <h2>A failure is still evidence.</h2>
            <details className="lab-faq">
              <summary>Chromium is missing or will not launch</summary>
              <p>
                Re-run the pinned Playwright install command from step 1 and check the system
                dependencies for your OS. Do not silently substitute another browser. If you use an
                executable override, record its exact path and version; it defines a different
                environment.
              </p>
            </details>
            <details className="lab-faq">
              <summary>Corpus verification fails</summary>
              <p>
                Keep the failed report. Compare file hashes and tool versions, confirm qpdf and
                Poppler are on PATH, and inspect retained page images. Do not edit the manifest or
                regenerate the downloaded pair to hide the mismatch.
              </p>
            </details>
            <details className="lab-faq">
              <summary>The run or clock gate rejects the attempt</summary>
              <p>
                Retain partial trials and the rejection reason. Do not summarize them as an accepted
                timing result. Investigate separately, then declare any changed protocol or new
                schedule before collecting new measurements.
              </p>
            </details>
            <details className="lab-faq">
              <summary>Can I run the original fixed-window launcher?</summary>
              <p>
                Its plan is tied to preserved files, absolute runtime paths and three calendar slots
                on the original machine. It is not a portable quick start. Follow the independent
                runner instructions above; use the{' '}
                <a href={getBenchmarkSourceUrl('docs/final-windows.md')}>final protocol</a> as a
                reference when declaring your own schedule.
              </p>
            </details>
          </section>
        </div>
      </div>
    </article>
  );
}
