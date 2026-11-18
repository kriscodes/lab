/** Lists the published experiment pages and their current research status. */
import Link from 'next/link';
import { EXPERIMENTS, getExperimentPath } from '@/lib/experiments';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Studies',
  'The research log: a PDF loading experiment in progress and a separate rendering-progress proposal.',
  '/experiments/',
);

/** Renders a linked research log with each experiment’s declared publication status. */
export default function ExperimentsPage() {
  return (
    <article className="lr-protocol">
      <p className="lr-mono">THE RESEARCH LOG</p>
      <h1 className="lr-title">
        Follow the <em>question.</em>
      </h1>
      <p className="lr-lead">Questions, methods, and the evidence they produce.</p>
      {EXPERIMENTS.map((experiment) => (
        <section key={experiment.id} className="lr-policy lab-study-entry">
          <p className="lr-mono">
            {experiment.publicationLabel.toUpperCase()} /{' '}
            {experiment.status === 'in-progress' ? 'IN PROGRESS' : 'PROPOSED STUDY'}
          </p>
          <h2>
            <Link href={getExperimentPath(experiment.slug)}>{experiment.title}</Link>
          </h2>
          <p>{experiment.summary}</p>
        </section>
      ))}
    </article>
  );
}
