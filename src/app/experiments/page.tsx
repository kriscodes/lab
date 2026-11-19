/** @file Introduces the questions behind the lab and links to its ongoing research. */
import Link from 'next/link';
import { getExperimentPath } from '@/lib/experiments';
import { pageMetadata } from '@/lib/site';
import { StudySymbol } from './study-symbol';
import { StudyTopics } from './study-topics';
import styles from './studies.module.css';

export const metadata = pageMetadata(
  'Studies',
  'Small annoyances. Questions worth asking. Explore loading, motion, accessibility, and efficiency with the lab.',
  '/experiments/',
);

/** Welcomes a little curiosity, from everyday friction to a focused experiment. */
export default function ExperimentsPage() {
  return (
    <article className={styles.studiesPage}>
      <section className={styles.hero} aria-labelledby="studies-title">
        <div>
          <h1 id="studies-title" className={styles.heroTitle}>
            What if it
            <br />
            <em>felt better?</em>
          </h1>
          <p className={styles.introduction}>
            Small annoyances.
            <br />
            Questions worth asking.
          </p>
        </div>
        <div className={styles.questionArtwork} aria-hidden="true">
          <span className={styles.orbit} />
          <span className={`${styles.orbit} ${styles.crossingOrbit}`} />
          <span className={`${styles.orbit} ${styles.uprightOrbit}`} />
          <span className={styles.outerOrbit} />
          <span className={styles.questionMark}>?</span>
          <span className={`${styles.satellite} ${styles.rabbitSatellite}`}>
            <StudySymbol topic="loading" />
          </span>
          <span className={`${styles.satellite} ${styles.handSatellite}`}>
            <StudySymbol topic="accessibility" />
          </span>
          <span className={`${styles.satellite} ${styles.featherSatellite}`}>
            <StudySymbol topic="efficiency" />
          </span>
          <span className={styles.orbitDot} />
          <span className={styles.smallOrbitDot} />
        </div>
      </section>

      <StudyTopics />

      <section className={styles.process} aria-labelledby="studies-process-title">
        <h2 id="studies-process-title" className={styles.sectionTitle}>
          Follow the <em>hmm.</em>
        </h2>
        <div className={styles.processSteps}>
          <div>
            <h3 className={styles.stepTitle}>Notice the snag.</h3>
            <p>A wait. A stutter. A small thing that gets in the way.</p>
          </div>
          <div>
            <h3 className={styles.stepTitle}>Look around.</h3>
            <p>Read the research. Try existing approaches. Find what’s still unclear.</p>
          </div>
          <div>
            <h3 className={styles.stepTitle}>Give it a go.</h3>
            <p>A focused question. A fair comparison. A result we can check.</p>
          </div>
        </div>
      </section>

      <section className={styles.closing} aria-label="From question to experiment">
        <p>
          Could it make the web work better?
          <br />
          Is there something useful left to learn?
          <br />
          That’s a good place to start.
        </p>
        <div className={styles.researchLinks}>
          <Link className={styles.labLink} href={getExperimentPath('pdf-first-page')}>
            Meet Lab001
          </Link>
          <Link className={styles.proposalLink} href={getExperimentPath('pdf-rendering')}>
            A rendering proposal
          </Link>
        </div>
      </section>
    </article>
  );
}
