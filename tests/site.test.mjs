/** @file Checks that sharing titles and canonical URLs identify each publication consistently. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageMetadata, SITE_NAME } from '../src/lib/site.ts';

test('homepage and investigation sharing titles identify the site without duplicating its name', () => {
  const homeMetadata = pageMetadata(
    'Engineering Lab',
    'Research protocols and measured findings.',
    '/',
  );
  assert.deepEqual(homeMetadata.title, { absolute: SITE_NAME });
  assert.equal(homeMetadata.openGraph.title, SITE_NAME);
  assert.equal(homeMetadata.twitter.title, SITE_NAME);
  assert.equal(homeMetadata.alternates.canonical, '/');
  const protocolMetadata = pageMetadata(
    'PDF Rendering',
    'Research protocol.',
    '/experiments/pdf-rendering/',
  );
  assert.equal(protocolMetadata.openGraph.title, 'PDF Rendering — Engineering Lab');
  assert.deepEqual(protocolMetadata.title, { absolute: protocolMetadata.openGraph.title });
  assert.equal(protocolMetadata.openGraph.url, protocolMetadata.alternates.canonical);
});
