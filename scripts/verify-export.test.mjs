import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { verifyExport } from './verify-export.mjs';

const ORIGIN = 'https://lab.kristiansalmeron.com';
const ROUTES = ['/', '/experiments/', '/experiments/data-grid-rendering/', '/methodology/'];

/** Create portable static output rather than importing application components into the audit tests. */
async function fixture(t, changes = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'lab-export-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const files = {
    '404.html':
      '<html lang="en"><head><meta name="robots" content="noindex"></head><body><main><h1>Not found</h1><a href="/">Home</a></main></body></html>',
    'assets/site.css':
      '@font-face{font-family:Test;src:url("../fonts/test.woff2")}body{color:#222}',
    'assets/site.js': 'console.log("fixture");',
    'fonts/test.woff2': 'fixture font',
    'social-preview.png': 'fixture image',
    'robots.txt': `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`,
    'sitemap.xml': `<urlset>${ROUTES.map((route) => `<url><loc>${ORIGIN}${route}</loc></url>`).join('')}</urlset>`,
  };
  for (const route of ROUTES) {
    const name = route === '/' ? 'index.html' : `${route.slice(1)}index.html`;
    files[name] = `<!doctype html><html lang="en"><head><title>Engineering Lab</title>
<meta name="description" content="Research protocols and reproducible findings.">
<link rel="canonical" href="${ORIGIN}${route}"><link rel="stylesheet" href="/assets/site.css">
<meta property="og:title" content="Engineering Lab"><meta property="og:description" content="Research protocols.">
<meta property="og:url" content="${ORIGIN}${route}"><meta property="og:image" content="${ORIGIN}/social-preview.png">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${ORIGIN}/social-preview.png">
<script src="/assets/site.js"></script></head><body><main id="main"><h1>Research protocol</h1>
<a href="/experiments/data-grid-rendering/#main">Inspect the protocol</a></main>
<script>const serialized = '<meta property="og:url" content="ignore serialized React payload">';</script></body></html>`;
  }
  for (const [name, content] of Object.entries({ ...files, ...changes })) {
    if (content === null) continue;
    await mkdir(dirname(join(directory, name)), { recursive: true });
    await writeFile(join(directory, name), content);
  }
  return { directory, files };
}

test('accepts complete nested exports and ignores metadata serialized inside script payloads', async (t) => {
  const { directory } = await fixture(t);
  const result = await verifyExport(directory);
  assert.deepEqual(result.errors, []);
  assert.equal(result.pageCount, 4);
  assert.equal(result.assetCount, 4);
});

test('detects a missing direct route, CSS font and social preview independently', async (t) => {
  const { directory } = await fixture(t, {
    'methodology/index.html': null,
    'fonts/test.woff2': null,
    'social-preview.png': null,
  });
  const { errors } = await verifyExport(directory);
  assert.ok(errors.some((error) => error.includes('/methodology/: exported page is missing')));
  assert.ok(errors.some((error) => error.includes('../fonts/test.woff2')));
  assert.ok(errors.some((error) => error.includes('social-preview.png')));
});

test('rejects conflicting canonicals, broken fragments and an indexable not-found document', async (t) => {
  const { directory, files } = await fixture(t);
  await writeFile(
    join(directory, 'index.html'),
    files['index.html']
      .replace('</head>', '<link rel="canonical" href="https://example.com/"></head>')
      .replace('/#main', '/#missing'),
  );
  await writeFile(
    join(directory, '404.html'),
    '<html><head><title>Not found</title></head><body>Missing</body></html>',
  );
  const { errors } = await verifyExport(directory);
  assert.ok(errors.some((error) => error.includes('canonical URL')));
  assert.ok(errors.some((error) => error.includes('missing fragment target')));
  assert.ok(errors.some((error) => error.includes('not-found document must be noindex')));
});
