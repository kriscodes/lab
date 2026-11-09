'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { REPOSITORY_URL } from '@/lib/site';

export function SiteHeader() {
  const path = usePathname();
  return (
    <header className="lr-header">
      <div className="lr-brand">
        <Link className="lr-brand-name" href="/" aria-label="Engineering Lab home">
          lab<span>.</span>
        </Link>
        <span className="lr-owner">
          Independent engineering
          <br />
          by Kristian Salmeron
        </span>
      </div>
      <nav className="lr-nav" aria-label="Lab navigation">
        <Link href="/" aria-current={path === '/' ? 'page' : undefined}>
          Study 001
        </Link>
        <Link
          href="/experiments/pdf-rendering/"
          aria-current={path?.startsWith('/experiments/pdf-rendering') ? 'page' : undefined}
        >
          The method
        </Link>
        <a href={REPOSITORY_URL}>
          Source <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}
