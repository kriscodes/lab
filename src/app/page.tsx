/** The Labs cover pairs a kinetic hero with a compact index of published experiments. */
import Link from 'next/link';
import { HomeExperiment } from '@/components/home-experiment';
import { pageMetadata } from '@/lib/site';

export const metadata = pageMetadata(
  'Engineering Lab',
  'A little room for curiosity. Experiments by Kristian Salmeron.',
  '/',
);

/** Render the editorial home and its direct entry into Lab001. */
export default function HomePage() {
  return (
    <div className="labs-home">
      <div className="labs-home-ornament">
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
      <nav className="labs-home-index" aria-label="Experiments">
        <Link href="/experiments/pdf-first-page/" className="labs-home-study">
          <svg
            className="labs-home-study-vessel"
            viewBox="0 0 96 112"
            fill="none"
            aria-hidden="true"
          >
            <g transform="rotate(20 48 56)">
              <path d="M35 20v62a13 13 0 0 0 26 0V20" stroke="currentColor" strokeWidth="1.5" />
              <path d="M38 58c7 3 13-3 20 0v24a10 10 0 0 1-20 0Z" fill="currentColor" />
              <ellipse cx="48" cy="18" rx="16" ry="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M54 33h7m-5 9h5m-7 9h7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M40 26v24" stroke="currentColor" strokeOpacity="0.25" />
              <circle cx="44" cy="71" r="2" className="labs-home-study-liquid-bubble" />
              <circle cx="51" cy="81" r="1.5" className="labs-home-study-liquid-bubble" />
            </g>
            <circle cx="65" cy="7" r="3" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="78" cy="18" r="1.7" fill="currentColor" />
          </svg>
          <span className="labs-home-study-name">Lab001</span>
          <span className="labs-home-study-action" aria-hidden="true">
            Open lab
          </span>
        </Link>
      </nav>
    </div>
  );
}
