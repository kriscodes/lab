/** @file Protects the original PDF corpus and the distinction between pending and accepted evidence. */

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { CORPUS_DOCUMENTS, FINAL_WINDOWS } from '../src/experiments/pdf-first-page/evidence.ts';

test('public PDF downloads match the preserved corpus manifest byte for byte', async () => {
  const corpusDirectory = new URL('../public/downloads/pdf-lab-001/', import.meta.url);
  const corpusManifest = JSON.parse(
    await readFile(new URL('manifest.json', corpusDirectory), 'utf8'),
  );
  assert.equal(corpusManifest.purpose, 'generator-smoke-test-not-performance-results');
  for (const document of CORPUS_DOCUMENTS) {
    const manifestDocument = corpusManifest.documents.find(({ file }) => file === document.file);
    const pdfBytes = await readFile(new URL(document.file, corpusDirectory));
    assert.equal(pdfBytes.length, document.bytes);
    assert.equal(pdfBytes.length, manifestDocument.bytes);
    assert.equal(createHash('sha256').update(pdfBytes).digest('hex'), manifestDocument.sha256);
    assert.equal(document.sha256, manifestDocument.sha256);
    assert.equal(manifestDocument.pageCount, 100);
  }
  const corpusArchive = await readFile(new URL('pdf-lab-001-corpus.zip', corpusDirectory));
  assert.equal(
    createHash('sha256').update(corpusArchive).digest('hex'),
    'c0cd7cbcbf68a40e6abd6e7ed08bccabf172bdc80be693fe8df057c0bd63995a',
  );
});

test('the dated final-window snapshot does not mistake observer validity for timing acceptance', () => {
  assert.deepEqual(
    FINAL_WINDOWS.map(({ performance }) => performance),
    ['rejected', 'pending', 'pending'],
  );
  assert.equal(FINAL_WINDOWS[0].observer, '96 of 96 valid');
  for (const campaignWindow of FINAL_WINDOWS) {
    assert.ok(!Object.hasOwn(campaignWindow, 'renderMs'));
    assert.ok(Number.isFinite(Date.parse(campaignWindow.startsAt)));
  }
});
