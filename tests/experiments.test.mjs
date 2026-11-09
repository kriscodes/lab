import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPERIMENTS,
  getExperiment,
  getExperimentPath,
  getPopulatedCategories,
  getPublishedFindings,
} from '../src/lib/experiments.ts';

test('registry entries have unique identities and canonical linkable slugs', () => {
  assert.ok(EXPERIMENTS.length > 0);
  assert.equal(new Set(EXPERIMENTS.map(({ id }) => id)).size, EXPERIMENTS.length);
  assert.equal(new Set(EXPERIMENTS.map(({ slug }) => slug)).size, EXPERIMENTS.length);
  for (const experiment of EXPERIMENTS) {
    assert.match(experiment.id, /^\d{3}$/u);
    assert.match(experiment.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
    assert.strictEqual(getExperiment(experiment.slug), experiment);
    assert.equal(getExperimentPath(experiment.slug), `/experiments/${experiment.slug}/`);
    for (const field of ['title', 'category', 'summary', 'researchQuestion', 'hypothesis']) {
      assert.ok(experiment[field].trim(), `${experiment.slug} must have ${field}.`);
    }
    assert.equal(experiment.methodologyURI, '/methodology/');
    assert.ok(experiment.technologies.length > 0);
    assert.ok(experiment.references.length > 0);
    for (const reference of experiment.references) {
      assert.ok(reference.title.trim());
      assert.equal(new URL(reference.url).protocol, 'https:');
    }
  }
  assert.equal(getExperiment('unknown-experiment'), undefined);
  assert.equal(getExperiment('../pdf-rendering'), undefined);
});

test('navigation categories are unique and each points to meaningful registered content', () => {
  const categories = getPopulatedCategories();
  assert.equal(new Set(categories).size, categories.length);
  assert.deepEqual(categories, ['PDF rendering']);
  for (const category of categories) {
    assert.ok(category.trim());
    assert.ok(EXPERIMENTS.some((experiment) => experiment.category === category));
  }
  assert.ok(EXPERIMENTS.every((experiment) => categories.includes(experiment.category)));
});

test('Experiment 001 is an unmeasured PDF proposal and cannot be surfaced as a finding', () => {
  const experiment = getExperiment('pdf-rendering');
  assert.ok(experiment);
  assert.equal(experiment.id, '001');
  assert.equal(experiment.title, 'The Cost of Rendering Progress');
  assert.equal(experiment.status, 'proposal');
  assert.ok(experiment.strategies.includes('Final-frame-only diagnostic'));
  assert.deepEqual(experiment.technologies, ['PDF.js', 'TypeScript']);
  assert.match(experiment.summary, /No benchmark runs/u);
  assert.match(experiment.hypothesis, /remains to be measured/u);
  assert.equal(getExperiment('data-grid-rendering'), undefined);
  assert.deepEqual(getPublishedFindings(), []);
  assert.ok(!getPublishedFindings().includes(experiment));
  assert.ok(getPublishedFindings().every((entry) => entry.status === 'published'));
  assert.ok(
    !Object.hasOwn(experiment, 'results'),
    'A protocol must not contain fabricated results.',
  );
});

test('registry and navigation outputs are stable and immutable at runtime', () => {
  assert.strictEqual(getPopulatedCategories(), getPopulatedCategories());
  assert.strictEqual(getPublishedFindings(), getPublishedFindings());
  assert.ok(Object.isFrozen(EXPERIMENTS));
  assert.ok(Object.isFrozen(getPopulatedCategories()));
  assert.ok(Object.isFrozen(getPublishedFindings()));
  for (const experiment of EXPERIMENTS) {
    assert.ok(Object.isFrozen(experiment));
    for (const field of ['technologies', 'strategies', 'references']) {
      assert.ok(Object.isFrozen(experiment[field]));
      assert.throws(() => experiment[field].push('mutated'), TypeError);
    }
    assert.ok(experiment.references.every((reference) => Object.isFrozen(reference)));
    assert.throws(() => {
      experiment.status = 'published';
    }, TypeError);
    assert.throws(() => {
      experiment.references[0].url = 'https://example.com/';
    }, TypeError);
  }
  assert.throws(() => EXPERIMENTS.pop(), TypeError);
  assert.throws(() => getPopulatedCategories().push('Empty category'), TypeError);
  assert.throws(() => getPublishedFindings().push(EXPERIMENTS[0]), TypeError);
  assert.deepEqual(getPublishedFindings(), []);
});
