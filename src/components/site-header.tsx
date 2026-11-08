import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

/** Keeps research navigation and the independent engineering sites within reach. */
export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Engineering Lab home">
        <span className="brand-bracket" aria-hidden="true">
          [
        </span>
        lab<span className="brand-dot">.</span>
        <span className="brand-bracket" aria-hidden="true">
          ]
        </span>
      </Link>
      <nav className="lab-nav" aria-label="Lab navigation">
        <Link href="/experiments/">Experiments</Link>
        <Link href="/methodology/">Methodology</Link>
      </nav>
      <nav className="ecosystem-nav" aria-label="Engineering ecosystem">
        <a href="https://kristiansalmeron.com/">
          Portfolio <span aria-hidden="true">↗</span>
        </a>
        <a href="https://toolbox.kristiansalmeron.com/">
          Toolbox <span aria-hidden="true">↗</span>
        </a>
      </nav>
      <ThemeToggle />
    </header>
  );
}
