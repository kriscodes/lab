/** Site identity and study navigation, with a quieter owner label on the home page. */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Show the shared masthead and identify the current research section. */
export function SiteHeader() {
  const currentPath = usePathname();
  return (
    <header className="lr-header">
      <div className="lr-brand">
        <Link className="lr-brand-name" href="/" aria-label="Engineering Lab home">
          lab<span>.</span>
        </Link>
        <span className="lr-owner">
          {currentPath === '/' ? (
            'Kristian Salmeron'
          ) : (
            <>
              Independent engineering
              <br />
              by Kristian Salmeron
            </>
          )}
        </span>
      </div>
      <nav className="lr-nav" aria-label="Lab navigation">
        <Link
          href="/experiments/"
          aria-current={currentPath?.startsWith('/experiments') ? 'page' : undefined}
        >
          Studies
        </Link>
        <Link
          href="/methodology/"
          aria-current={currentPath === '/methodology/' ? 'page' : undefined}
        >
          Method
        </Link>
      </nav>
    </header>
  );
}
