/** @file Rebuilds the committed social preview from its local SVG source without network access. */

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

await sharp(fileURLToPath(new URL('../artwork/social-preview.svg', import.meta.url)))
  .png()
  .toFile(fileURLToPath(new URL('../public/social-preview.png', import.meta.url)));
