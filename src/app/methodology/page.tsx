/** Presents friendly research principles with the technical standards available on demand. */
import Link from 'next/link';
import { pageMetadata } from '@/lib/site';
import styles from './methodology.module.css';

export const metadata = pageMetadata(
  'Methodology',
  'A careful approach to useful questions: fair comparisons, clear measurements, honest limits, and work others can repeat.',
  '/methodology/',
);

/** Keep the first read approachable while preserving the full publication requirements. */
const researchPrinciples = [
  {
    title: 'Start with a good question.',
    introduction:
      'Get specific about what might improve, and what would show the idea doesn’t hold up.',
    detailsLabel: 'How we frame the question',
    technicalDetails:
      'Review existing work before choosing the hypothesis. Define the behavior under investigation, the comparison, and what result would contradict the prediction. A protocol is a plan, not a finding.',
  },
  {
    title: 'Make it a fair comparison.',
    introduction:
      'Change the thing we’re studying. Keep the rest as steady and comparable as we can.',
    detailsLabel: 'What stays the same',
    technicalDetails:
      'Use identical source fixtures, equivalent operations, and documented parameters. Separate acquisition and setup from the work being timed. Keep browser and device cohorts separate.',
  },
  {
    title: 'Know what we’re measuring.',
    introduction: 'A number only helps when we know what it captures, and what it leaves out.',
    detailsLabel: 'Where the measurement begins and ends',
    technicalDetails:
      'Distinguish render completion, visible updates, browser paint, and interaction readiness. Record the API, milestones, build mode, revision, dependencies, and environment. Unsupported measurements are missing data, never zero.',
  },
  {
    title: 'Keep the whole story.',
    introduction: 'Repeat the work. Keep the slow runs, the failures, and the surprises in view.',
    detailsLabel: 'How we handle repeats and variation',
    technicalDetails:
      'Run comparisons serially with a defined warmup policy and balanced order. Retain raw samples, failures, and timeouts. Report sample counts and variation; a single fast run cannot stand in for a result.',
  },
  {
    title: 'Leave room for “we don’t know.”',
    introduction: 'Small studies can give useful answers. They don’t have to answer everything.',
    detailsLabel: 'Where the conclusion stops',
    technicalDetails:
      'Explain observations, tradeoffs, limitations, and follow-up questions. Do not turn a timing proxy into an exact paint claim or a controlled policy comparison into a ranking of rendering libraries.',
  },
  {
    title: 'Make it easy to try again.',
    introduction: 'Share the ingredients and the steps, so someone else can check the work.',
    detailsLabel: 'What goes into the record',
    technicalDetails:
      'Link the source, dependency lockfile, fixture checksums, setup, methodology version, and raw results. Visitor runs remain distinct from reviewed, versioned findings.',
  },
];

/** Introduces the method through readable principles and expandable technical details. */
export default function MethodologyPage() {
  return (
    <article className={styles.methodPage}>
      <header className={styles.introduction}>
        <p className={styles.eyebrow}>The method</p>
        <h1 className={styles.title}>
          Curious by nature.
          <br />
          <em>Careful by design.</em>
        </h1>
        <p className={styles.lead}>
          Interesting questions deserve a fair try. Here’s how we keep the work clear, useful, and
          easy to check.
        </p>
      </header>
      <div className={styles.principles}>
        {researchPrinciples.map((principle) => (
          <section className={styles.principle} key={principle.title}>
            <h2>{principle.title}</h2>
            <p className={styles.principleIntroduction}>{principle.introduction}</p>
            <details className={styles.technicalDetails}>
              <summary>{principle.detailsLabel}</summary>
              <p>{principle.technicalDetails}</p>
            </details>
          </section>
        ))}
      </div>
      <section className={styles.closing} aria-labelledby="method-closing-title">
        <h2 id="method-closing-title">Good questions come first.</h2>
        <Link className={styles.closingLink} href="/experiments/">
          How we choose what to study
        </Link>
      </section>
    </article>
  );
}
