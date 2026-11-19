/** @file Exercises the export audit against complete fixtures and deliberately broken publications. */

import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { verifyExport } from './verify-export.mjs';

const SITE_ORIGIN = 'https://lab.kristiansalmeron.com';
const CONTENT_ROUTES = [
  '/',
  '/experiments/',
  '/experiments/pdf-rendering/',
  '/methodology/',
  '/privacy/',
  '/experiments/pdf-first-page/',
  '/experiments/pdf-first-page/evidence/',
  '/experiments/pdf-first-page/replicate/',
];

/** Create portable static output rather than importing application components into the audit tests. */
async function createExportFixture(testContext, fileOverrides = {}) {
  const fixtureDirectory = await mkdtemp(join(tmpdir(), 'lab-export-'));
  testContext.after(() => rm(fixtureDirectory, { recursive: true, force: true }));
  const fixtureFiles = {
    '404.html':
      '<html lang="en"><head><meta name="robots" content="noindex"></head><body><main><h1>Not found</h1><a href="/">Home</a></main></body></html>',
    'assets/site.css':
      '@font-face{font-family:Test;src:url("../fonts/test.woff2")}body{color:#222}',
    'assets/site.js': 'console.log("fixture");',
    'fonts/test.woff2': 'fixture font',
    'social-preview.png': 'fixture image',
    'robots.txt': `User-agent: *\nAllow: /\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
    'sitemap.xml': `<urlset>${CONTENT_ROUTES.map((route) => `<url><loc>${SITE_ORIGIN}${route}</loc></url>`).join('')}</urlset>`,
  };
  for (const route of CONTENT_ROUTES) {
    const fileName = route === '/' ? 'index.html' : `${route.slice(1)}index.html`;
    fixtureFiles[fileName] = `<!doctype html><html lang="en"><head><title>Engineering Lab</title>
<meta name="description" content="Research protocols and reproducible findings.">
<link rel="canonical" href="${SITE_ORIGIN}${route}"><link rel="stylesheet" href="/assets/site.css">
<meta property="og:title" content="Engineering Lab"><meta property="og:description" content="Research protocols.">
<meta property="og:url" content="${SITE_ORIGIN}${route}"><meta property="og:image" content="${SITE_ORIGIN}/social-preview.png">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${SITE_ORIGIN}/social-preview.png">
<script src="/assets/site.js"></script></head><body><main id="main"><h1>Research protocol</h1>
<a href="/experiments/pdf-rendering/#main">Inspect the protocol</a></main>
<script>const serialized = '<meta property="og:url" content="ignore serialized React payload">';</script></body></html>`;
  }
  for (const [fileName, fileContent] of Object.entries({ ...fixtureFiles, ...fileOverrides })) {
    if (fileContent === null) continue;
    await mkdir(dirname(join(fixtureDirectory, fileName)), { recursive: true });
    await writeFile(join(fixtureDirectory, fileName), fileContent);
  }
  return { directory: fixtureDirectory, files: fixtureFiles };
}

test('accepts complete nested exports and ignores metadata serialized inside script payloads', async (testContext) => {
  const { directory: fixtureDirectory } = await createExportFixture(testContext);
  const auditResult = await verifyExport(fixtureDirectory);
  assert.deepEqual(auditResult.errors, []);
  assert.equal(auditResult.pageCount, 8);
  assert.equal(auditResult.assetCount, 4);
});

test('detects a missing direct route, CSS font and social preview independently', async (testContext) => {
  const { directory: fixtureDirectory } = await createExportFixture(testContext, {
    'methodology/index.html': null,
    'fonts/test.woff2': null,
    'social-preview.png': null,
  });
  const { errors } = await verifyExport(fixtureDirectory);
  assert.ok(errors.some((error) => error.includes('/methodology/: exported page is missing')));
  assert.ok(errors.some((error) => error.includes('../fonts/test.woff2')));
  assert.ok(errors.some((error) => error.includes('social-preview.png')));
});

test('rejects conflicting canonicals, broken fragments and an indexable not-found document', async (testContext) => {
  const { directory: fixtureDirectory, files: fixtureFiles } =
    await createExportFixture(testContext);
  await writeFile(
    join(fixtureDirectory, 'index.html'),
    fixtureFiles['index.html']
      .replace('</head>', '<link rel="canonical" href="https://example.com/"></head>')
      .replace('/#main', '/#missing'),
  );
  await writeFile(
    join(fixtureDirectory, '404.html'),
    '<html><head><title>Not found</title></head><body>Missing</body></html>',
  );
  const { errors } = await verifyExport(fixtureDirectory);
  assert.ok(errors.some((error) => error.includes('canonical URL')));
  assert.ok(errors.some((error) => error.includes('missing fragment target')));
  assert.ok(errors.some((error) => error.includes('not-found document must be noindex')));
});
