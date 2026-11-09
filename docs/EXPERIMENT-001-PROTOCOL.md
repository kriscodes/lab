# Experiment 001 — The Cost of Rendering Progress

**Status: proposed study; no runs collected.** This release publishes the research question and method outline. It contains no PDF runner, measurement collection, or performance finding.

## Hypothesis

Adapting intermediate-frame updates to their observed cost could reduce final render time while preserving useful feedback. This is a hypothesis, not a promised improvement.

## Pilot before implementation

Pin PDF.js 6.5.438 and confirm that the intended renderer worker is actually active. Compare normal intermediate updates against a final-frame-only diagnostic, keeping documents, display settings, and final output identical. Separate fallback runs. Inspect snapshot work, visible frame updates, and final completion.

Proceed to an adaptive policy comparison only if the pilot demonstrates a reproducible cost. The diagnostic exists to isolate overhead; it is not proposed as a user-facing viewer experience.

## Conditional comparison

Compare cost-adaptive updates with fixed intervals under the same fixtures and user tasks. Measure the first useful visible frame, final completion, feedback gaps, responsiveness, and snapshot overhead. Validate exact final-output equivalence. Preserve raw trials, failures, environment information, worker status, and the source revision.

A render-task promise indicates completion, not a browser paint timestamp. Corroborate visible progress with screen captures and traces. Keep network acquisition separate from the renderer comparison.

## Falsification and stopping

Stop after the pilot if progress updates impose no reproducible cost. Reject an adaptive policy if it delays useful feedback, creates worse gaps, or does not improve on a simple fixed interval. Do not tune on held-out evaluation traces.

## Existing work

Progressive rendering and rendering workers already exist. The contribution, if supported, would be evidence about update policy and its tradeoffs; the study does not claim to invent progressive PDF rendering.

- [PDF.js 6.5.438 renderer worker](https://github.com/mozilla/pdf.js/blob/v6.5.438/src/display/renderer_worker.js)
- [Renderer-worker progressive updates](https://github.com/mozilla/pdf.js/pull/21860)
- [RenderTask lifecycle](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib-RenderTask.html)

The [prior-art review and detailed proposal](RESEARCH-001-PRIOR-ART.md) records the implementation evidence, alternative candidates, and the two-stage design. Freeze the detailed protocol and its metric definitions before collecting publishable measurements.
