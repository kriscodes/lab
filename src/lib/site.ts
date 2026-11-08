import type { Metadata } from 'next';

export const SITE_ORIGIN = 'https://lab.kristiansalmeron.com';
export const REPOSITORY_URL = 'https://github.com/kriscodes/lab';
export const SITE_NAME = 'Engineering Lab — Kristian Salmeron';

/** Gives every research document a canonical identity and an honest sharing preview. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const pageTitle = title === 'Engineering Lab' ? SITE_NAME : `${title} — Engineering Lab`;
  return {
    title: { absolute: pageTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: pageTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: '/social-preview.png', width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: ['/social-preview.png'],
    },
  };
}
