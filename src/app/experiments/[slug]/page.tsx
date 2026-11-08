import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExperimentLayout } from '@/components/experiment-layout';
import { EXPERIMENTS, getExperiment, getExperimentPath } from '@/lib/experiments';
import { pageMetadata } from '@/lib/site';
import { DataGridProtocol } from '@/experiments/data-grid-rendering/protocol';

export const dynamicParams = false;

/** Generates only registered, independently linkable research documents. */
export function generateStaticParams() {
  return EXPERIMENTS.map(({ slug }) => ({ slug }));
}

/** Gives each experiment its own canonical document and social metadata. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const experiment = getExperiment((await params).slug);
  if (!experiment) return {};
  const description =
    experiment.status === 'protocol'
      ? `Research protocol: ${experiment.researchQuestion} No benchmark results have been collected.`
      : experiment.summary;
  return pageMetadata(experiment.title, description, getExperimentPath(experiment.slug));
}

/** Documents Experiment 001's planned workload; the actual benchmark belongs to the next phase. */
export default async function ExperimentPage({ params }: { params: Promise<{ slug: string }> }) {
  const experiment = getExperiment((await params).slug);
  if (!experiment) notFound();
  // Each investigation supplies its own content; adding metadata cannot silently reuse the grid study.
  const Content = experiment.slug === 'data-grid-rendering' ? DataGridProtocol : null;
  if (!Content) notFound();
  return (
    <ExperimentLayout experiment={experiment}>
      <Content experiment={experiment} />
    </ExperimentLayout>
  );
}
