/** Builds the registered experiment routes that do not have their own page module. */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EXPERIMENTS, getExperiment, getExperimentPath } from '@/lib/experiments';
import { pageMetadata } from '@/lib/site';
import { PdfRenderingProtocol } from '@/experiments/pdf-rendering/protocol';

export const dynamicParams = false;

/** Lists registered routes handled here, excluding the dedicated PDF loading pages. */
export function generateStaticParams() {
  return EXPERIMENTS.filter(({ slug }) => slug !== 'pdf-first-page').map(({ slug }) => ({ slug }));
}

/** Creates canonical and sharing metadata for the requested registered experiment. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const experiment = getExperiment((await params).slug);
  if (!experiment) return {};
  return pageMetadata(experiment.title, experiment.summary, getExperimentPath(experiment.slug));
}

/** Renders the supported rendering protocol or returns the standard not-found page. */
export default async function ExperimentPage({ params }: { params: Promise<{ slug: string }> }) {
  const experiment = getExperiment((await params).slug);
  if (!experiment || experiment.slug !== 'pdf-rendering') notFound();
  return <PdfRenderingProtocol experiment={experiment} />;
}
