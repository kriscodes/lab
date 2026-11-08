import Link from 'next/link';
import { ExperimentEntry } from '@/components/experiment-entry';
import { EXPERIMENTS, getPopulatedCategories, getPublishedFindings } from '@/lib/experiments';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Engineering Lab',
  'A public notebook for investigating frontend behavior through controlled experiments. Start with the Data Grid Rendering Performance research protocol.',
  '/',
);

/** Introduces the current research honestly, showing populated topics and measured findings only. */
export default function HomePage() {
  const findings = getPublishedFindings();
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow mono">
            <span className="label-rule" aria-hidden="true" />
            Engineering Lab / Kristian Salmeron
          </p>
          <h1 id="home-title">
            Questions first.
            <br />
            <span>Evidence follows.</span>
          </h1>
          <p className="hero-intro">
            A place to investigate frontend behavior through controlled experiments. The question,
            the method, and the source stay in the open.
          </p>
          <Link className="text-link" href="/experiments/">
            Explore the research <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <aside className="research-stamp" aria-label="Current research status">
          <span className="mono">Research log</span>
          <span className="stamp-number" aria-hidden="true">
            001
          </span>
          <span className="stage">Protocol defined</span>
          <p>First investigation. Measurements come next.</p>
        </aside>
      </section>
      <section className="featured-section" aria-labelledby="featured-title">
        <header className="section-heading">
          <h2 id="featured-title">
            <span className="mono section-index" aria-hidden="true">
              01 /
            </span>
            First investigation
          </h2>
          <Link href="/experiments/" className="quiet-link">
            Research log <span aria-hidden="true">↗</span>
          </Link>
        </header>
        <ExperimentEntry experiment={EXPERIMENTS[0]} />
      </section>
      <section className="research-notes" aria-labelledby="research-notes-title">
        <div>
          <p className="mono section-label">Research area</p>
          <h2 id="research-notes-title">Start with rendering.</h2>
          {getPopulatedCategories().map((category) => (
            <Link
              key={category}
              className="topic-link"
              href="/experiments/#rendering-and-reactivity"
            >
              {category}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        <div className="method-preview">
          <p className="mono section-label">A note on evidence</p>
          <h2>Results need context.</h2>
          <p>
            Every published finding will include the environment, units, raw samples, and limits of
            the measurement. No benchmark findings have been published yet.
          </p>
          <Link className="text-link" href="/methodology/">
            Read the methodology <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      {findings.length > 0 && (
        <section className="findings-section" aria-labelledby="findings-title">
          <header className="section-heading">
            <h2 id="findings-title">Recent findings</h2>
          </header>
          {findings.map((experiment) => (
            <ExperimentEntry key={experiment.id} experiment={experiment} />
          ))}
        </section>
      )}
    </>
  );
}
