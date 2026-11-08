import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageMetadata, SITE_NAME } from '../src/lib/site.ts';

test('homepage and investigation sharing titles identify the site without duplicating its name', () => {
  const home = pageMetadata('Engineering Lab', 'Research protocols and measured findings.', '/');
  assert.deepEqual(home.title, { absolute: SITE_NAME });
  assert.equal(home.openGraph.title, SITE_NAME);
  assert.equal(home.twitter.title, SITE_NAME);
  assert.equal(home.alternates.canonical, '/');
  const protocol = pageMetadata(
    'Data Grid Rendering Performance',
    'Research protocol.',
    '/experiments/data-grid-rendering/',
  );
  assert.equal(protocol.openGraph.title, 'Data Grid Rendering Performance — Engineering Lab');
  assert.deepEqual(protocol.title, { absolute: protocol.openGraph.title });
  assert.equal(protocol.openGraph.url, protocol.alternates.canonical);
});
