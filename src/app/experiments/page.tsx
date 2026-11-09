import Link from 'next/link';
import { EXPERIMENTS, getExperimentPath } from '@/lib/experiments';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Studies',
  'PDF rendering research. A proposed study; no measured findings have been published.',
  '/experiments/',
);
export default function ExperimentsPage() {
  return (
    <article className="lr-protocol">
      <p className="lr-mono">THE RESEARCH LOG</p>
      <h1 className="lr-title">
        Follow the <em>question.</em>
      </h1>
      <p className="lr-lead">Questions, methods, and the evidence they produce.</p>
      {EXPERIMENTS.map((experiment) => (
        <section key={experiment.id} className="lr-policy">
          <p className="lr-mono">STUDY {experiment.id} / PROPOSED STUDY</p>
          <h2>
            <Link href={getExperimentPath(experiment.slug)}>{experiment.title} ↗</Link>
          </h2>
          <p>{experiment.summary}</p>
        </section>
      ))}
    </article>
  );
}
