import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EXPERIMENTS, getExperiment, getExperimentPath } from '@/lib/experiments';
import { pageMetadata } from '@/lib/site';
import { PdfRenderingProtocol } from '@/experiments/pdf-rendering/protocol';

export const dynamicParams = false;
export function generateStaticParams() {
  return EXPERIMENTS.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const experiment = getExperiment((await params).slug);
  if (!experiment) return {};
  return pageMetadata(experiment.title, experiment.summary, getExperimentPath(experiment.slug));
}
export default async function ExperimentPage({ params }: { params: Promise<{ slug: string }> }) {
  const experiment = getExperiment((await params).slug);
  if (!experiment || experiment.slug !== 'pdf-rendering') notFound();
  return <PdfRenderingProtocol experiment={experiment} />;
}
