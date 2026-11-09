# Adding experiments

The Lab publishes questions, reproducible experiments, and findings supported by evidence. A finished page must explain both what was observed and what the experiment cannot establish.

The foundation includes a small experiment registry and a consistent page structure. Experiment 001 is a proposed PDF study, not an implemented benchmark. Do not publish numerical results, result-shaped example data, or performance conclusions until measurements have been collected and reviewed.

## 1. Define a bounded question

Before adding a runner, write:

- A research question that one experiment can answer.
- Motivation grounded in a frontend engineering problem.
- A falsifiable hypothesis, labeled as a hypothesis.
- The variables being changed and the variables held constant.
- The intended measurements, their units, and their limitations.
- The smallest useful implementation and a criterion for completion.

Prefer a focused investigation over a new product. An experiment does not need a backend, account system, database, or general plugin framework.

## 2. Register metadata

Follow `src/lib/experiments.ts` and its `ExperimentMetadata` type. Keep metadata declarative and free of side effects. Use a stable, individually linkable slug and a permanent experiment ID such as `001`.

The existing metadata includes the title, summary, research category, lifecycle status, question, hypothesis, technologies, strategy inputs, methodology URL, and references. Record protocol version and source provenance in the methodology documentation until the runner needs a typed result contract. Dates describe actual events; do not insert an invented publication or measurement date.

The foundation supports three lifecycle values:

| Lifecycle   | What the page may claim                                                                 |
| ----------- | --------------------------------------------------------------------------------------- |
| `proposal`  | A candidate question and method under evaluation; no measured findings                  |
| `protocol`  | The question, proposed method, and planned implementation; no measured findings         |
| `published` | Versioned findings with raw measurements, environment, and reproducibility instructions |

`getPublishedFindings()` excludes proposals and protocols from the findings surface. Keep Experiment 001 unmeasured until its method and evidence are ready. A working demonstration alone does not justify changing it to `published`. If a later phase needs a separate interactive lifecycle value, make that a small explicit extension when it is needed. The foundation does not have measurement-collection fields or fixture results.

Only expose a research category when it contains meaningful content. Do not create empty categories or placeholder experiments to fill navigation.

## 3. Use the experiment page structure

Every published experiment should contain the following sections. During the protocol phase, explicitly mark the interactive runner, measurements, and findings as pending rather than simulating them.

The current route is `src/app/experiments/[slug]/page.tsx`, generated from the registry at build time. Preserve the approved publication shell and use experiment-owned article content. Keep the route responsible for page metadata, registry lookup, and explicit selection of an experiment's own content.

Keep each investigation's body in `src/experiments/<slug>/`. Experiment 001 uses `src/experiments/pdf-rendering/protocol.tsx`. Future experiments should supply their own question-specific body in their own folder; do not duplicate another study’s protocol as a general template. Add a small explicit slug-to-body selection when registering another experiment. A dynamic plugin loader or plugin framework is unnecessary.

Adding registry metadata alone does not create a complete experiment. Verify that its static route renders the matching body, status, and social metadata. Unknown slugs and registered entries without an implemented body should remain missing pages rather than displaying another experiment's content.

Give section anchors meaningful, stable names. Put interactive controls under the experiment-design section when implemented. If an investigation needs a different structure, update its navigation deliberately so links still reach meaningful sections.

### Overview

State the research question, motivation, hypothesis, technologies, and boundaries of the investigation. Separate predictions from observations.

### Interactive experiment

Provide a working demonstration with labeled controls, documented defaults, parameter bounds, and a reset action. A control must explain what it changes and whether changing it invalidates an existing comparison.

Use semantic controls, keyboard access, visible focus, and an accessible status message. Keep controls usable on narrow screens. Respect reduced-motion preferences for decorative transitions; a measurement scenario that requires motion should explain its behavior and remain explicitly initiated.

Do not run expensive scenarios on page load. State any realistic risk of blocking the document. A Cancel button cannot promise to interrupt a synchronous task already occupying that document's main thread.

### Measurements

For each metric, document:

- The metric name, unit, and exact start and completion milestones.
- The API or collection tool, its support requirements, and its attribution scope.
- What setup work is excluded or included.
- Warmup policy, repetition count, run order, and reset behavior.
- Browser, operating environment, viewport, source revision, and actual dependency versions.
- Raw samples, derived statistics, and handling of missing or failed samples.
- Sources of noise and limits to comparing devices or implementations.

Unsupported, below-threshold, invalidated, timed-out, and failed measurements need distinct statuses. They must not become zero or disappear silently from the record.

### Findings

Explain observations, analysis, tradeoffs, supported conclusions, and follow-up questions. Link each quantitative claim to a versioned result artifact. A result from one browser or device does not establish a universal ranking.

If measurements have not been collected, state that directly. Hypotheses and expected tradeoffs remain in the overview.

### Source and reproducibility

Link the source, exact revision used for published results, protocol, test setup, dependencies, and commands required to repeat the run. Explain any browser settings or optional host headers. Results should be reproducible without secrets whenever practical.

## 4. Keep the runner independent of the article

The research page provides context, controls, accessible result presentation, and source links. A runner owns the workload and its measurement boundaries. Do not include animated charts, navigation updates, logging, or unrelated application work inside timed intervals.

For Experiment 001, a separately built PDF renderer harness is proposed after the diagnostic pilot. Future framework implementations should use their own entry points and bundles, with one implementation active per quantitative trial. Share neutral dataset and operation contracts rather than framework component instances.

An iframe can separate a demo's document and styles. It does not guarantee a dedicated CPU thread or renderer process. Published measurements should run directly in the minimal runner, serially, with the isolation method documented.

A plain typed registry and a few explicit functions are enough for the first experiments. Add abstractions only after multiple working experiments establish a concrete need.

## 5. Plan result exports

Use a small, versioned JSON result contract when the runner is implemented. Define its fields alongside [the experiment protocol](./EXPERIMENT-001-PROTOCOL.md) before collecting results.

At minimum, a result needs the experiment and protocol version, source revision, configuration, environment, raw trials, metric units, collection status, and any exclusion reasons. Derived summaries must retain their sample count and calculation method.

CSV exports should preserve enough configuration to interpret each metric row. JSON may contain richer nested environment details and trace arrays. Downloading an export should not require a server or upload measurements elsewhere.

## 6. Verify before publishing findings

Choose checks that protect the experiment's actual claims:

- Unit checks for deterministic inputs, shared operations, statistics, and export serialization.
- Browser checks for workload correctness, controls, reset, failure states, and actual downloads.
- Keyboard and manual accessibility checks in addition to automated checks.
- Production-build runs using the documented protocol, including retained failures and timeouts.
- A review of timing boundaries against a browser trace when performance is the subject.

CI should verify correctness and a small smoke scenario. Shared CI timing is not a substitute for controlled measurements and should not create device-independent performance claims.

Run the repository's documented checks before opening a pull request. Keep public findings and raw result artifacts tied to the same source revision and protocol version. When the method changes materially, increment the protocol version and preserve the earlier evidence.

## Reference guidance

- [Experiment 001 protocol](./EXPERIMENT-001-PROTOCOL.md)
- [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing)
- [React Profiler and its overhead](https://react.dev/reference/react/Profiler)
- [Next.js static export](https://nextjs.org/docs/app/guides/static-exports)
