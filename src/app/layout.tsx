import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SITE_NAME, SITE_ORIGIN } from '@/lib/site';
import { APPEARANCE_BOOTSTRAP } from '@/lib/appearance';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: SITE_NAME, template: '%s — Engineering Lab' },
  description:
    'Frontend engineering investigations by Kristian Salmeron. Research questions, reproducible methods, and findings supported by measurements.',
  authors: [{ name: 'Kristian Salmeron', url: 'https://kristiansalmeron.com/' }],
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

/** Exports a static research shell; appearance is the only initial client-side interaction. */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" suppressHydrationWarning />
        <link
          rel="preload"
          href="/fonts/ibm-plex-sans-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOTSTRAP }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div id="lab-refined">
          <div className="lr-page">
            <SiteHeader />
            <main id="main" tabIndex={-1}>
              {children}
            </main>
            <details className="lr-disclosure">
              <summary>What makes a finding worth publishing?</summary>
              <p>
                A method you can repeat, raw measurements you can inspect, and limits stated
                alongside the conclusion. No benchmark results have been collected yet.{' '}
                <Link href="/methodology/">Read the publication standards.</Link>
              </p>
            </details>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
