import Link from 'next/link';
import { PDF_STUDY_COPY as copy } from '@/experiments/pdf-rendering/copy';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Engineering Lab',
  'An independent study of PDF rendering by Kristian Salmeron. A proposed study of rendering-progress overhead; no benchmark results have been collected.',
  '/',
);

export default function HomePage() {
  return (
    <article>
      <div className="lr-kicker lr-mono">
        <span>PDF RENDERING / STUDY 001</span>
        <span>HYPOTHESIS · UNTESTED</span>
      </div>
      <h1 className="lr-title">
        {copy.headline}
        <br /> {copy.secondLine}
        <em>{copy.emphasis}</em>
      </h1>
      <div className="lr-deck">
        <p className="lr-summary">{copy.summary}</p>
        <div className="lr-edition" aria-hidden="true">
          <div className="lr-number">001</div>
          <div className="lr-number-label">A STUDY IN SPEED</div>
        </div>
      </div>
      <div className="lr-hypothesis">
        <div className="lr-hypothesis-label lr-mono">THE HYPOTHESIS</div>
        <div>
          <p className="lr-hypothesis-text">{copy.hypothesis}</p>
          <p className="lr-hypothesis-note">{copy.note}</p>
        </div>
      </div>
      <div className="lr-bottom">
        <Link className="lr-open" href="/experiments/pdf-rendering/">
          How we’ll test it <span aria-hidden="true">↗</span>
        </Link>
        <p className="lr-bottom-note">
          {copy.scope}
          <br />
          Results to follow the evidence.
        </p>
      </div>
    </article>
  );
}
