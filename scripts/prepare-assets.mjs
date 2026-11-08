import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

// The sharing image is committed and reproducible without network requests or generated photography.
await sharp(fileURLToPath(new URL('../artwork/social-preview.svg', import.meta.url)))
  .png()
  .toFile(fileURLToPath(new URL('../public/social-preview.png', import.meta.url)));
