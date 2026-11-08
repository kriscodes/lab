import { ExperimentEntry } from '@/components/experiment-entry';
import { EXPERIMENTS, getPopulatedCategories } from '@/lib/experiments';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Experiments',
  'The Engineering Lab research log. Experiment 001 defines a controlled comparison of data-grid rendering strategies; measurements are not yet collected.',
  '/experiments/',
);

/** Lists actual investigations with their stage, without empty categories or invented studies. */
export default function ExperimentsPage() {
  return (
    <>
      <header className="document-hero">
        <p className="eyebrow mono">The research log</p>
        <h1>Follow the question.</h1>
        <p className="document-intro">
          Protocols, experiments, and their findings. Each entry keeps the assumptions and
          limitations close to the work.
        </p>
        <p className="stage-note">
          The first entry is a protocol. A runnable benchmark and measured findings are the next
          phase.
        </p>
      </header>
      {getPopulatedCategories().map((category) => (
        <section key={category} id="rendering-and-reactivity" aria-labelledby="rendering-title">
          <header className="section-heading">
            <h2 id="rendering-title">{category}</h2>
            <span className="mono section-label">Research protocol</span>
          </header>
          {EXPERIMENTS.filter((experiment) => experiment.category === category).map(
            (experiment) => (
              <ExperimentEntry key={experiment.id} experiment={experiment} />
            ),
          )}
        </section>
      ))}
    </>
  );
}
