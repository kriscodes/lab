export type ExperimentStatus = 'proposal' | 'protocol' | 'published';

export interface ExperimentReference {
  readonly title: string;
  readonly url: string;
}

export interface ExperimentMetadata {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly status: ExperimentStatus;
  readonly category: string;
  readonly summary: string;
  readonly researchQuestion: string;
  readonly hypothesis: string;
  readonly technologies: readonly string[];
  readonly strategies: readonly string[];
  readonly methodologyURI: string;
  readonly references: readonly ExperimentReference[];
}

/** The proposed study stays unmeasured until its protocol and pilot are completed. */
const pdfRenderingExperiment: ExperimentMetadata = Object.freeze({
  id: '001',
  slug: 'pdf-rendering',
  title: 'The Cost of Rendering Progress',
  status: 'proposal',
  category: 'PDF rendering',
  summary:
    'A proposed PDF rendering study of intermediate-frame update cost and adaptive cadence. No benchmark runs or findings have been published.',
  researchQuestion:
    'Can a cost-aware intermediate-frame update policy improve PDF completion time while preserving useful visual feedback?',
  hypothesis:
    'Adapting intermediate-frame updates to their observed cost could reduce final render time while preserving useful feedback. Any gain remains to be measured.',
  technologies: Object.freeze(['PDF.js', 'TypeScript']),
  strategies: Object.freeze([
    'Default progressive updates',
    'Final-frame-only diagnostic',
    'Adaptive cadence after pilot',
  ]),
  methodologyURI: '/methodology/',
  references: Object.freeze([
    Object.freeze({
      title: 'PDF.js 6.5.438: renderer worker implementation',
      url: 'https://github.com/mozilla/pdf.js/blob/v6.5.438/src/display/renderer_worker.js',
    }),
    Object.freeze({
      title: 'PDF.js: renderer-worker progressive updates',
      url: 'https://github.com/mozilla/pdf.js/pull/21860',
    }),
    Object.freeze({
      title: 'PDF.js: rendering task lifecycle',
      url: 'https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib-RenderTask.html',
    }),
  ]),
});

export const EXPERIMENTS: readonly ExperimentMetadata[] = Object.freeze([pdfRenderingExperiment]);
const populatedCategories: readonly string[] = Object.freeze([
  ...new Set(EXPERIMENTS.map(({ category }) => category)),
]);
const publishedFindings: readonly ExperimentMetadata[] = Object.freeze(
  EXPERIMENTS.filter(({ status }) => status === 'published'),
);
export function getExperiment(slug: string): ExperimentMetadata | undefined {
  return EXPERIMENTS.find((experiment) => experiment.slug === slug);
}
export function getPopulatedCategories(): readonly string[] {
  return populatedCategories;
}
export function getPublishedFindings(): readonly ExperimentMetadata[] {
  return publishedFindings;
}
export function getExperimentPath(slug: string): string {
  return `/experiments/${slug}/`;
}
