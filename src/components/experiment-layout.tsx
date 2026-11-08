import type { ReactNode } from 'react';
import Link from 'next/link';
import type { ExperimentMetadata } from '@/lib/experiments';

/** Supplies the readable structure shared by protocol and future measured experiment pages. */
export function ExperimentLayout({
  experiment,
  children,
}: {
  experiment: ExperimentMetadata;
  children: ReactNode;
}) {
  return (
    <>
      <header className="document-hero">
        <p className="breadcrumb">
          <Link href="/experiments/">Experiments</Link>
          <span aria-hidden="true">/</span>
          <span className="mono">{experiment.id}</span>
        </p>
        <div className="document-kicker">
          <span className="mono">{experiment.category}</span>
          <span className="stage">
            {experiment.status === 'protocol' ? 'Protocol defined' : 'Findings published'}
          </span>
        </div>
        <h1>{experiment.title}</h1>
        <p className="document-intro">{experiment.researchQuestion}</p>
      </header>
      <div className="research-document">
        <aside className="document-toc">
          <p className="mono">On this page</p>
          <nav aria-label="Experiment sections">
            <a href="#overview">Overview</a>
            <a href="#design">Experiment design</a>
            <a href="#measurements">Measurements</a>
            <a href="#findings">Findings</a>
            <a href="#reproduce">Source & reproducibility</a>
          </nav>
        </aside>
        <div className="document-body">{children}</div>
      </div>
    </>
  );
}
