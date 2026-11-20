/** Editorial introduction to the loading study; all measurements live in the separate harness. */
import Link from 'next/link';
import { getBenchmarkSourceUrl, FINAL_WINDOWS, LAB_PATH } from './evidence';
import { EvidenceDate, LabNavigation } from './navigation';

/** Introduces the research question, fixed campaign and paths to its supporting records. */
export function PdfLoadingOverview() {
  return (
    <article className="loading-lab">
      <div className="lr-kicker lr-mono">
        <span>PDF LOADING / LAB 001</span>
        <span>FINAL CAMPAIGN · CLOSED</span>
      </div>
      <div className="lab-hero">
        <div>
          <h1 className="lr-title">
            How soon can a PDF
            <br /> <em>show its first page?</em>
          </h1>
          <p className="lab-intro">
            One document, arranged two ways. A controlled look at the journey from loading a PDF to
            rendering its first page.
          </p>
        </div>
        <span className="lab-edition" aria-hidden="true">
          001
        </span>
      </div>
      <LabNavigation currentSection="overview" />
      <section className="lab-current" aria-labelledby="current-evidence">
        <p className="lr-mono lab-eyebrow">CURRENT EVIDENCE</p>
        <div>
          <h2 id="current-evidence">One accepted window. Not enough to compare runs.</h2>
          <p>
            The campaign ended with one accepted window, one rejected attempt and one missed slot.
            We can describe the accepted run, but the planned comparison needed at least two.
          </p>
          <div className="lab-actions">
            <Link className="lab-text-link" href={`${LAB_PATH}evidence/`}>
              Explore the evidence
            </Link>
            <Link className="lab-text-link" href={`${LAB_PATH}replicate/`}>
              Try the experiment
            </Link>
          </div>
        </div>
      </section>
      <EvidenceDate />
      <ol className="lab-windows" aria-label="Final campaign schedule, Pacific time">
        {FINAL_WINDOWS.map((campaignWindow) => (
          <li key={campaignWindow.number}>
            <div className="lr-mono">
              <span>
                {campaignWindow.number} /{' '}
                <time dateTime={campaignWindow.startsAt}>
                  {campaignWindow.date} · {campaignWindow.time}
                </time>
              </span>
              <span>Pacific</span>
            </div>
            <h3 className={campaignWindow.performance === 'rejected' ? 'lab-rejected' : ''}>
              {campaignWindow.performanceLabel}
            </h3>
            <p>{campaignWindow.note}</p>
          </li>
        ))}
      </ol>
      <div className="lab-controls" aria-label="Shared controls">
        <span className="lr-mono">THE CONSTANTS</span>
        <p>100 pages per PDF</p>
        <p>Same first page &amp; viewport</p>
        <p>PDF.js + Chromium</p>
      </div>

      <section className="lab-section lab-split" aria-labelledby="question">
        <div>
          <p className="lr-mono lab-eyebrow">01 / THE QUESTION</p>
          <h2 id="question">
            Same pages.
            <br />
            <em>Different order of bytes.</em>
          </h2>
        </div>
        <div className="lab-prose">
          <p>
            A linearized PDF arranges its data to help a reader start with the first page before it
            has the whole file. The visible document stays the same.
          </p>
          <p>
            Does that arrangement make the first page render sooner in PDF.js? And does the answer
            change when the viewer can request just part of the file?
          </p>
          <p>
            We compare the original pair under a fixed delivery profile, with range requests enabled
            and disabled. The question is deliberately small: one pair, one renderer, one declared
            setup.
          </p>
        </div>
      </section>

      <section className="lab-section" aria-labelledby="method">
        <div className="lab-section-heading">
          <p className="lr-mono lab-eyebrow">02 / THE METHOD</p>
          <h2 id="method">A comparison with the controls in view.</h2>
        </div>
        <div className="lab-method-grid">
          <div>
            <span className="lr-mono">A / KEEP THE CONTENT</span>
            <h3>One synthetic source</h3>
            <p>
              Both PDFs have the same 100 pages. Structure checks and pixel comparisons establish
              the input controls; they do not measure speed.
            </p>
          </div>
          <div>
            <span className="lr-mono">B / CONTROL DELIVERY</span>
            <h3>Four conditions</h3>
            <p>
              Linearized or nonlinearized, each with ranges on or off. The controlled profile delays
              headers by 100 ms and shares a 1 Mbit/s body budget.
            </p>
          </div>
          <div>
            <span className="lr-mono">C / KEEP EVERY OUTCOME</span>
            <h3>A fixed stopping rule</h3>
            <p>
              Three scheduled windows. Unchanged acceptance checks. No replacement run for a result
              we do not like.
            </p>
          </div>
        </div>
        <a className="lab-text-link" href={getBenchmarkSourceUrl('docs/final-windows.md')}>
          Read the declared protocol
        </a>
      </section>

      <section className="lab-section lab-split" aria-labelledby="timer">
        <div>
          <p className="lr-mono lab-eyebrow">03 / WHAT THE CLOCK MEANS</p>
          <h2 id="timer">
            Render completion,
            <br />
            <em>precisely defined.</em>
          </h2>
        </div>
        <div className="lab-prose">
          <p>
            The timer starts just before PDF.js begins loading the document and stops when the first
            page’s canvas-render promise resolves. Worker startup, transfer, parsing and rendering
            are included.
          </p>
          <p>
            This does not tell us when pixels reach a physical display. Browser launch, navigation,
            verification and screenshot capture sit outside the measured interval.
          </p>
          <Link className="lab-text-link" href={`${LAB_PATH}evidence/#limits`}>
            Read the limits of the measurement
          </Link>
        </div>
      </section>

      <section className="lab-reading-paths" aria-label="Continue reading">
        <div>
          <p className="lr-mono">FOR THE CURIOUS</p>
          <h2>Follow the evidence.</h2>
          <p>See the run ledger, earlier diagnostics and why a rejected result still matters.</p>
          <Link className="lab-text-link" href={`${LAB_PATH}evidence/`}>
            Open the research record
          </Link>
        </div>
        <div>
          <p className="lr-mono">FOR THE HANDS-ON</p>
          <h2>Make your own attempt.</h2>
          <p>
            Get the original PDFs, prepare a separate workspace and keep a record you can inspect.
          </p>
          <Link className="lab-text-link" href={`${LAB_PATH}replicate/`}>
            Follow the replication guide
          </Link>
        </div>
      </section>
      <p className="lab-related">
        A separate question:{' '}
        <Link href="/experiments/pdf-rendering/">what do intermediate rendering updates cost?</Link>{' '}
        That proposal remains unmeasured.
      </p>
    </article>
  );
}
