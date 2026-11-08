export type ExperimentStatus = 'protocol' | 'published';

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
  readonly recordCounts: readonly number[];
  readonly methodologyURI: string;
  readonly references: readonly ExperimentReference[];
}

/** The first entry describes an approved protocol, not an executed benchmark or a finding. */
const dataGridExperiment: ExperimentMetadata = Object.freeze({
  id: '001',
  slug: 'data-grid-rendering',
  title: 'Data Grid Rendering Performance',
  status: 'protocol',
  category: 'Rendering and reactivity',
  summary:
    'Compare rendering every row, client-side pagination, and virtualized rendering with 1,000, 10,000, and 100,000 synthetic records. Interactive benchmarks and measured findings are planned for the next phase.',
  researchQuestion:
    'How do rendering every row, client-side pagination, and virtualized rendering affect browser rendering and interaction as a synthetic data grid grows?',
  hypothesis:
    'Pagination and virtualization are expected to reduce mounted DOM size relative to rendering every row, with different navigation and interaction tradeoffs. Timing and memory effects remain to be measured.',
  technologies: Object.freeze(['React', 'TypeScript']),
  strategies: Object.freeze(['All rows', 'Client-side pagination', 'Virtualized rendering']),
  recordCounts: Object.freeze([1000, 10000, 100000]),
  methodologyURI: '/methodology/',
  references: Object.freeze([
    Object.freeze({
      title: 'TanStack Virtual: introduction',
      url: 'https://tanstack.com/virtual/latest/docs/introduction',
    }),
    Object.freeze({
      title: 'React Profiler: measurements and caveats',
      url: 'https://react.dev/reference/react/Profiler',
    }),
    Object.freeze({
      title: 'W3C User Timing specification',
      url: 'https://www.w3.org/TR/user-timing/',
    }),
  ]),
});

export const EXPERIMENTS: readonly ExperimentMetadata[] = Object.freeze([dataGridExperiment]);

const populatedCategories: readonly string[] = Object.freeze([
  ...new Set(EXPERIMENTS.map((experiment) => experiment.category)),
]);
const publishedFindings: readonly ExperimentMetadata[] = Object.freeze(
  EXPERIMENTS.filter((experiment) => experiment.status === 'published'),
);

/** Finds an exact registered slug without creating a page for an unknown experiment. */
export function getExperiment(slug: string): ExperimentMetadata | undefined {
  return EXPERIMENTS.find((experiment) => experiment.slug === slug);
}

/** Returns only categories backed by an actual registry entry, in registry order. */
export function getPopulatedCategories(): readonly string[] {
  return populatedCategories;
}

/** Excludes research protocols from the findings surface until their measured work is published. */
export function getPublishedFindings(): readonly ExperimentMetadata[] {
  return publishedFindings;
}

/** Builds the canonical individually linkable route for a registered experiment slug. */
export function getExperimentPath(slug: string): string {
  return `/experiments/${slug}/`;
}
