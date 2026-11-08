import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/site';

export const dynamic = 'force-static';

/** Exports ordinary crawler instructions without requiring a runtime server. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE_ORIGIN}/sitemap.xml` };
}
