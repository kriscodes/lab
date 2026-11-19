/** @file Configures the portable static export served by Render and the local preview. */

import type { NextConfig } from 'next';

const nextConfiguration: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfiguration;
