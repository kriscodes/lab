# Experiment 001 research: the cost of rendering progress

Status: proposed investigation; no benchmark has been implemented or run. Prior-art review conducted November 8, 2026. This document proposes a question and a method, not a performance finding or a claim of worldwide novelty.

## Recommendation

Investigate the cost of intermediate image updates in PDF.js's renderer worker. First establish whether producing progress images causes a reproducible delay in final rendering. Only then test whether changing update timing improves the tradeoff between feedback and completion time.

This is a narrower, more defensible contribution than demonstrating that lower-resolution previews can appear sooner. It involves a real rendering pipeline, observable scheduling decisions, explicit quality constraints, and a useful negative result if the proposed optimization fails.

## What already exists

| Direction                                         | Existing work                                                                                                                                                                                    | Implication                                                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Lower-resolution preview followed by sharp detail | PDF.js reduces its full-page background resolution when it will draw a high-resolution detail view.                                                                                              | The earlier preview-first proposal is an established technique.                                             |
| Visible-first rendering and directional prefetch  | PDF.js's rendering queue prioritizes visible views and selects adjacent work according to scroll direction.                                                                                      | Generic prefetch is not a new contribution.                                                                 |
| Pausing or cancelling obsolete work               | PDF.js already contains pause/resume scheduling, cancellation handling, delayed parsing aborts, and detail-view cancellation behavior. PDFium also exposes progressive pause/continue rendering. | A cancellation study needs a very specific unresolved behavior.                                             |
| Retaining costly pages                            | PDF.js maintains a recency/count-based page buffer. Cost-aware cache replacement has longstanding algorithmic precedent.                                                                         | A PDF-specific cost-per-pixel retention study could be useful, but cost-aware caching is not novel.         |
| Adaptive image-update frequency                   | Adaptive frame rate and resolution are studied in remotely rendered graphics. The reviewed PDF.js worker instead uses a fixed eligibility interval.                                              | The possible contribution is a PDF-specific evaluation and policy, not the invention of adaptive rendering. |

Primary references:

- [PDF.js low-resolution background implementation](https://github.com/mozilla/pdf.js/commit/4c7bbd0fef7a94581eaca53dd665cd371a988671)
- [PDF.js rendering queue, v6.5.438](https://github.com/mozilla/pdf.js/blob/v6.5.438/web/pdf_rendering_queue.js)
- [PDF.js page buffer, v6.5.438](https://github.com/mozilla/pdf.js/blob/v6.5.438/web/pdf_viewer.js)
- [PDF.js detail-view behavior, v6.5.438](https://github.com/mozilla/pdf.js/blob/v6.5.438/web/pdf_page_detail_view.js)
- [PDFium progressive-rendering API](https://pdfium.googlesource.com/pdfium/+/refs/heads/main/public/fpdf_progressive.h)
- [Cao and Irani: cost-aware caching](https://static.usenix.org/publications/library/proceedings/usits97/cao.html)
- [Related adaptive frame-rate/resolution research](https://arxiv.org/abs/2605.10995)

The source review, introducing pull request, and targeted searches did not reveal a controlled study or adaptive policy for this exact PDF.js snapshot pipeline. That is a search result with limited scope, not proof that no such work exists. Search again before publishing a novelty claim, and cite additional prior work when found.

## The specific opportunity

The reviewed baseline is [PDF.js v6.5.438](https://github.com/mozilla/pdf.js/releases/tag/v6.5.438), released November 1, 2026. The renderer-worker work was merged on October 6 in [PR 21860](https://github.com/mozilla/pdf.js/pull/21860).

Its [renderer worker](https://github.com/mozilla/pdf.js/blob/v6.5.438/src/display/renderer_worker.js) uses a 500 ms minimum eligibility interval for partial frames. It checks at execution boundaries, skips unchanged operation positions, and awaits intermediate bitmap creation. Intermediate frames use `createImageBitmap`; the final frame uses `transferToImageBitmap`. Transparency can require additional compositing. The [proxy](https://github.com/mozilla/pdf.js/blob/v6.5.438/src/display/renderer_worker_proxy.js) presents returned bitmaps on the main thread.

This is not a guaranteed update every 500 ms. A long operation can postpone a boundary. Snapshot work can also overlap an existing resource wait, so snapshot duration alone does not establish extra completion time. Measure the full rendering path rather than adding isolated durations together.

## Two-stage hypothesis

### Pilot: does the cost exist?

> On some long-running PDF pages, intermediate bitmap updates measurably delay final-quality completion, and the effect depends on page content and output pixel area.

Compare the same pinned build with partial frames enabled and disabled. Disabling partial frames is a diagnostic comparison; it is not automatically the preferred user experience. Include the initial blank period when measuring feedback.

Stop if a small, repeatable pilot cannot establish a meaningful cost. A negative result is publishable and does not justify building a more complicated scheduler.

### Follow-up: can timing improve the tradeoff?

> A policy that adjusts update timing using observed snapshot cost improves the completion-time/feedback tradeoff on unseen documents compared with fixed intervals, while preserving final output and meeting a declared feedback-gap target.

Preserve the first update opportunity. Thereafter, adjust the interval within a declared limit. Compare with the stock interval and a sweep of fixed intervals up to the same limit. Otherwise, a policy that merely sends fewer updates has an unfair advantage.

Set the feedback-gap target, minimum useful-content criterion, meaningful improvement threshold, and policy parameters using pilot fixtures. Freeze them before testing held-out documents. These are study choices, not universal UX standards. If one fixed interval performs equally well, recommend that simpler policy.

## Bounded method

Use a small fixture set: a short-running control, vector-heavy drawing, image-heavy content, and transparency/compositing. Include more than one output pixel area. Record file hashes, byte sizes, page dimensions, output pixels, fixture licenses, source revision, dependency versions, browser, device, and worker configuration.

Keep source bytes local and render one page at a time. Use identical zoom, output size, quality, and renderer settings between paired policies. Counterbalance policy order. Keep worker startup outside the rendering-only metric and report end-to-end opening separately. Report cold and warm conditions separately; internal resource reuse can affect results.

Collect:

- Request to final raster-task completion, in milliseconds.
- Request to first useful intermediate frame delivery, in milliseconds.
- Gaps between delivered updates, including the initial blank period and final completion.
- Partial-frame count, snapshot-production elapsed time, and main-thread drawing elapsed time.
- Final-image correctness and retained canvas pixels.
- Failures, cancellation outcomes, and actual worker mode.

Frame delivery and task completion are observable milestones, not guaranteed display-paint timestamps. Inspect actual visual behavior separately. Run screenshot comparison and expensive diagnostics outside timed trials. A frame containing only a blank background does not count as useful feedback.

Use repeated paired trials and report raw samples and uncertainty. Do not cherry-pick documents that make adaptation win. Include workloads dominated by graphics execution and workloads dominated by resource waits. Report feedback-target violations even when uninterruptible operations caused them.

## Implementation boundary

The pilot requires a minimal page runner and the existing partial-frame toggle. Adaptive timing would require a small experimental patch to the pinned renderer worker. Publish that patch beside an unmodified baseline; do not create a permanent application fork.

Configure matching parsing and renderer workers and check `RenderTask.isWorkerRendering` in every trial. Unsupported configurations and main-thread fallback must not silently enter the worker cohort. The introducing PR describes worker rendering as initially disabled in built viewers; browser capabilities and configuration must be recorded rather than assumed. See [worker options](https://github.com/mozilla/pdf.js/blob/v6.5.438/src/display/worker_options.js) and [RenderTask](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib-RenderTask.html).

The investigation can run in the browser. It does not require an API server, uploaded private documents, a database, or a new commercial PDF viewer.
