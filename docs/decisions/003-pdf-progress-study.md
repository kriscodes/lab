# 003: Measure PDF progress-update cost before testing adaptation

Status: Proposed; no runner or measurements exist in this repository.

## Question and prior work

Can a cost-aware intermediate-frame update policy improve PDF completion time while preserving useful visual feedback?

Progressive rendering, workers, visible-page scheduling, cancellation, and page caches already exist. This study concerns the cost and timing of intermediate bitmap updates, not the invention of progressive PDF rendering. The proposed baseline is PDF.js **6.5.438**.

Primary references retained from the study review:

- [Renderer worker](https://github.com/mozilla/pdf.js/blob/v6.5.438/src/display/renderer_worker.js) and [main-thread proxy](https://github.com/mozilla/pdf.js/blob/v6.5.438/src/display/renderer_worker_proxy.js)
- [Renderer-worker progressive updates](https://github.com/mozilla/pdf.js/pull/21860)
- [Rendering queue](https://github.com/mozilla/pdf.js/blob/v6.5.438/web/pdf_rendering_queue.js) and [page buffer](https://github.com/mozilla/pdf.js/blob/v6.5.438/web/pdf_viewer.js)
- [Low-resolution background implementation](https://github.com/mozilla/pdf.js/commit/4c7bbd0fef7a94581eaca53dd665cd371a988671)
- [PDFium progressive-rendering API](https://pdfium.googlesource.com/pdfium/+/refs/heads/main/public/fpdf_progressive.h)
- [Cost-aware caching](https://static.usenix.org/publications/library/proceedings/usits97/cao.html)
- [RenderTask lifecycle](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib-RenderTask.html)

The review does not establish novelty. Recheck the baseline and relevant research before making such a claim.

## Proposed method

Start with a diagnostic pilot: compare normal intermediate updates with a final-frame-only control in the same pinned build. Verify actual renderer-worker use for every trial and separate fallback runs. The control isolates overhead; it is not a proposed viewer experience.

Use local source bytes, one page at a time, identical zoom, output size, quality, and renderer settings. Include a short-running control, vector-heavy content, image-heavy content, and transparency/compositing at more than one output pixel area. Retain fixture hashes, sizes, dimensions, licenses, source revision, dependencies, browser, device, and worker configuration.

Counterbalance paired trials. Keep worker startup outside the rendering-only metric and report end-to-end opening separately. Separate cold and warm conditions. Measure:

- Request to final raster-task completion, in milliseconds.
- Request to first useful intermediate frame delivery, in milliseconds.
- Feedback gaps, including the initial blank period and final completion.
- Partial-frame count, snapshot-production time, and main-thread drawing time.
- Final-image correctness, retained canvas pixels, failures, and cancellation outcomes.

A delivered frame or completed render task is not a paint timestamp. Corroborate visible progress with captures and browser traces outside timed trials. Blank frames do not count as useful feedback. Snapshot duration alone does not establish extra completion time because work can overlap resource waits.

## Conditional adaptation study

Proceed only if the pilot shows reproducible overhead. Preserve the first update opportunity, then compare adaptive cadence with the stock policy and fixed intervals under the same upper limit. Keep final output identical.

Set the feedback-gap target, useful-content criterion, improvement threshold, and policy parameters on pilot fixtures. Freeze them before testing held-out documents. Retain raw trials, uncertainty, failures, and feedback-target violations. Do not tune on evaluation traces or select only documents that favor adaptation.

Stop if the pilot shows no reproducible cost. Reject adaptation if it delays useful feedback, worsens gaps, or fails to improve on a simple fixed interval. A negative result is useful evidence.

## Implementation boundary

Build a minimal runner outside the article. Any experimental renderer patch must accompany an unmodified pinned baseline. Freeze the detailed protocol and a versioned result contract before collecting publishable measurements. No server, document upload, or database is required for this proposed browser study.
