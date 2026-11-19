/** Publication standards shared by research pages while the home stays intentionally spare. */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Offer the publication criteria beneath research content, excluding the home page. */
export function ResearchDisclosure() {
  const currentPath = usePathname();
  if (currentPath === '/') return null;

  return (
    <details className="lr-disclosure">
      <summary>What makes a finding worth publishing?</summary>
      <p>
        A method you can repeat, raw measurements you can inspect, and limits stated alongside the
        conclusion. An attempted measurement is not automatically an accepted finding.{' '}
        <Link href="/methodology/">Read the publication standards.</Link>
      </p>
    </details>
  );
}
