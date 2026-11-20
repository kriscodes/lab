/** @file Defines the immutable experiment catalog and the navigation derived from it. */

export type ExperimentStatus = 'proposal' | 'protocol' | 'in-progress' | 'published';

export interface ExperimentReference {
  readonly title: string;
  readonly url: string;
}

export interface ExperimentMetadata {
  readonly id: string;
  readonly publicationLabel: string;
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
  publicationLabel: 'Research proposal',
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

/** Lab 001 is the benchmark notebook's label; registry IDs remain stable and unique. */
const pdfLoadingExperiment: ExperimentMetadata = Object.freeze({
  id: '002',
  publicationLabel: 'Lab 001',
  slug: 'pdf-first-page',
  title: 'How soon can a PDF show its first page?',
  status: 'published',
  category: 'PDF loading',
  summary:
    'A closed campaign with one accepted window, one rejected attempt and one missed slot. Insufficient accepted evidence for a comparison across runs.',
  researchQuestion:
    'Does linearization change first-page render time under controlled delivery, with and without range loading?',
  hypothesis:
    'The order of PDF bytes may change time to first-page render under a declared delivery profile. The closed campaign did not yield enough accepted windows for a comparison across runs.',
  technologies: Object.freeze(['PDF.js', 'Chromium', 'TypeScript', 'Python']),
  strategies: Object.freeze([
    'Linearized versus nonlinearized',
    'Range loading enabled versus disabled',
  ]),
  methodologyURI: '/methodology/',
  references: Object.freeze([
    Object.freeze({
      title: 'Benchmark source and experiment records',
      url: 'https://github.com/kriscodes/pdf-rendering-benchmark',
    }),
  ]),
});

export const EXPERIMENTS: readonly ExperimentMetadata[] = Object.freeze([
  pdfLoadingExperiment,
  pdfRenderingExperiment,
]);
const populatedCategories: readonly string[] = Object.freeze([
  ...new Set(EXPERIMENTS.map(({ category }) => category)),
]);
const publishedFindings: readonly ExperimentMetadata[] = Object.freeze(
  EXPERIMENTS.filter(({ status }) => status === 'published'),
);
/** Finds a registered experiment by its exact URL slug. */
export function getExperiment(experimentSlug: string): ExperimentMetadata | undefined {
  return EXPERIMENTS.find((experiment) => experiment.slug === experimentSlug);
}
/** Returns only categories with registered content, in catalog order. */
export function getPopulatedCategories(): readonly string[] {
  return populatedCategories;
}
/** Returns published reports, including inconclusive findings, without promoting proposals. */
export function getPublishedFindings(): readonly ExperimentMetadata[] {
  return publishedFindings;
}
/** Builds the canonical trailing-slash path for an experiment. */
export function getExperimentPath(experimentSlug: string): string {
  return `/experiments/${experimentSlug}/`;
}
