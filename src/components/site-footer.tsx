'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

export function SiteFooter() {
  const home = usePathname() === '/';
  return (
    <footer className={`lr-footer${home ? ' labs-home-footer' : ''}`}>
      {!home && <span>Questions first. Evidence next.</span>}
      <div className="lr-footer-links">
        <a href="https://kristiansalmeron.com/" referrerPolicy="origin">
          Portfolio <span aria-hidden="true">↗</span>
        </a>
        <Link href="/privacy/">Privacy & analytics</Link>
        <ThemeToggle />
      </div>
    </footer>
  );
}
