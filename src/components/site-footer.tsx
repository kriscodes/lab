/** Shared closing note and quiet navigation at the natural end of every page. */
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

/** Invite another visit and keep privacy, portfolio, and appearance controls easy to find. */
export function SiteFooter() {
  return (
    <footer className="lr-footer">
      <p className="footer-farewell">Stay curious.</p>
      <nav className="lr-footer-links" aria-label="Footer navigation">
        <a href="https://kristiansalmeron.com/" referrerPolicy="origin">
          Portfolio
        </a>
        <Link href="/privacy/">Privacy</Link>
        <ThemeToggle />
      </nav>
    </footer>
  );
}
