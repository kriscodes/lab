import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { CORPUS_DOCUMENTS, FINAL_WINDOWS } from '../src/experiments/pdf-first-page/evidence.ts';

test('public PDF downloads match the preserved corpus manifest byte for byte', async () => {
  const root = new URL('../public/downloads/pdf-lab-001/', import.meta.url);
  const manifest = JSON.parse(await readFile(new URL('manifest.json', root), 'utf8'));
  assert.equal(manifest.purpose, 'generator-smoke-test-not-performance-results');
  for (const document of CORPUS_DOCUMENTS) {
    const original = manifest.documents.find(({ file }) => file === document.file);
    const bytes = await readFile(new URL(document.file, root));
    assert.equal(bytes.length, document.bytes);
    assert.equal(bytes.length, original.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), original.sha256);
    assert.equal(document.sha256, original.sha256);
    assert.equal(original.pageCount, 100);
  }
  const archive = await readFile(new URL('pdf-lab-001-corpus.zip', root));
  assert.equal(
    createHash('sha256').update(archive).digest('hex'),
    'c0cd7cbcbf68a40e6abd6e7ed08bccabf172bdc80be693fe8df057c0bd63995a',
  );
});

test('the dated final-window snapshot does not mistake observer validity for timing acceptance', () => {
  assert.deepEqual(
    FINAL_WINDOWS.map(({ performance }) => performance),
    ['rejected', 'pending', 'pending'],
  );
  assert.equal(FINAL_WINDOWS[0].observer, '96 of 96 valid');
  for (const window of FINAL_WINDOWS) {
    assert.ok(!Object.hasOwn(window, 'renderMs'));
    assert.ok(Number.isFinite(Date.parse(window.startsAt)));
  }
});
