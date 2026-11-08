import Link from 'next/link';
import { getExperimentPath, type ExperimentMetadata } from '@/lib/experiments';

/** Presents an investigation with its actual publication stage, not an implied benchmark result. */
export function ExperimentEntry({ experiment }: { experiment: ExperimentMetadata }) {
  return (
    <article className="experiment-entry">
      <div className="entry-index mono">EXP / {experiment.id}</div>
      <div className="entry-copy">
        <p className="entry-category mono">{experiment.category}</p>
        <h2>
          <Link href={getExperimentPath(experiment.slug)}>
            {experiment.title}
            <span aria-hidden="true">↗</span>
          </Link>
        </h2>
        <p>{experiment.summary}</p>
        <div className="entry-tags">
          <span className="stage">
            {experiment.status === 'protocol' ? 'Protocol defined' : 'Findings published'}
          </span>
          <span>{experiment.technologies.join(' · ')}</span>
        </div>
      </div>
    </article>
  );
}
