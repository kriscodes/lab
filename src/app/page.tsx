import Link from 'next/link';
import { HomeExperiment } from '@/components/home-experiment';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Engineering Lab',
  'A little room for curiosity. Experiments by Kristian Salmeron.',
  '/',
);

export default function HomePage() {
  return (
    <div className="labs-home">
      <div className="labs-home-heading">
        <p>Labs</p>
        <svg width="27" height="27" viewBox="0 0 28 28" aria-hidden="true">
          <path
            d="M14 1v26M1 14h26M5 5l18 18M5 23 23 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <section className="labs-home-hero" aria-labelledby="home-title">
        <h1 id="home-title">
          Let’s try
          <br />
          <em>something.</em>
        </h1>
        <HomeExperiment />
      </section>
      <div className="labs-home-index">
        <Link href="/experiments/pdf-first-page/" className="labs-home-study">
          <span className="labs-home-study-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Lab001
          <span className="labs-home-study-plus" aria-hidden="true">
            +
          </span>
        </Link>
      </div>
    </div>
  );
}
