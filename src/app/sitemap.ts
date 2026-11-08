import type { MetadataRoute } from 'next';
import { EXPERIMENTS, getExperimentPath } from '@/lib/experiments';
import { SITE_ORIGIN } from '@/lib/site';

export const dynamic = 'force-static';

/** Lists actual static research documents, with no empty future category routes. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '/',
    '/experiments/',
    '/methodology/',
    ...EXPERIMENTS.map(({ slug }) => getExperimentPath(slug)),
  ].map((path) => ({ url: `${SITE_ORIGIN}${path}` }));
}
