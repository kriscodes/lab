# Experiment 001: Data Grid Rendering Performance

**Status: protocol only.** The Lab foundation does not implement this benchmark, collect measurements, or publish findings. The runner, result export, and verification described here belong to the next implementation phase. No numerical performance claim is established by this document.

**Protocol draft:** 0.1. Freeze and version the protocol alongside the runner before collecting publishable results. All numeric settings below describe proposed test inputs or collection rules, not observed performance.

## Research question

How do full rendering, client-side pagination, and row virtualization affect mounting, updates, mounted DOM, and scrolling as a fixed synthetic dataset grows?

The first implementation compares rendering strategies within React and TypeScript. It does not establish React's performance relative to another framework, or predict every production grid workload.

### Motivation

Data-heavy interfaces require decisions about rendering cost, interaction behavior, accessibility, and implementation complexity. This experiment should make those tradeoffs observable under a controlled, documented workload.

### Hypotheses

- Rendering every record will increase mounted DOM with dataset size.
- Pagination and virtualization will bound mounted rows with different interaction and navigation costs.
- Reducing mounted rows will not automatically reduce the cost of filtering or sorting the entire dataset.
- Improvements in one metric may introduce accessibility, navigation, or implementation tradeoffs.

These are predictions to investigate. Findings will be written only after the runner and measurements exist.

## Controlled workload

The baseline consists of nine cases: three strategies at exactly 1,000, 10,000, and 100,000 records.

| Input            | Proposed baseline                                                                      |
| ---------------- | -------------------------------------------------------------------------------------- |
| Data             | One framework-neutral seeded TypeScript generator; identical records in all strategies |
| Columns          | Eight primitive fields with identical formatting                                       |
| Row identity     | Stable record ID                                                                       |
| Row height       | Fixed 36 CSS pixels                                                                    |
| Grid viewport    | Fixed 576 CSS pixels tall                                                              |
| Browser viewport | One fixed, documented desktop viewport; mobile runs form a separate cohort             |
| Pagination       | 50 records per page                                                                    |
| Virtualization   | Five overscan rows on each side                                                        |
| Filtering        | Identical full-dataset predicate and fixed queries with known result counts            |
| Sorting          | Identical comparator, stable tie-break by record ID                                    |
| Presentation     | Matching row/cell content, CSS, fonts, and semantics wherever feasible                 |

Generate the dataset before the mount timer. Record generation separately if useful. Wait for fonts and runner assets before timing a warm mount. Do not mix generation, network, navigation, hydration, and grid mounting into a metric named only "rendering time."

Use an existing headless virtualizer, with TanStack Virtual the proposed starting point. Pin the selected version and record it in results. Avoid adding a complete grid library that introduces unrelated behavior into the comparison. [TanStack Virtual introduction](https://tanstack.com/virtual/latest/docs/introduction)

Exploration controls may expose page size or overscan. Published baseline comparisons hold them fixed. Never aggregate samples with unlike configurations.

### Correctness and semantics

All strategies must produce the same logical filtered and sorted records. Pagination changes only the displayed slice; virtualization changes only which rows are mounted. Keep matching row content and stable IDs.

Preserve accessible table relationships, header associations, sort state, logical row count, and row position as applicable. Document any markup difference required by virtualization. Do not claim that equivalent appearance establishes equivalent accessibility.

## Planned architecture and isolation

The static Next.js research page will hold the overview, controls, methodology, result presentation, and source links. Build a minimal React runner independently and serve its assets under the Lab's static output. The runner should contain only the grid, required controls or command handlers, and measurement code.

Start with a small neutral command contract: `ready`, `prepare(config)`, `mount`, `filter(query)`, `sort(column, direction)`, `scroll(scenario)`, `reset`, `result`, and `error`. This is a concrete boundary, not a plugin framework.

A visible iframe may host the exploratory demonstration. A same-origin iframe separates documents but does not guarantee a separate thread or renderer process. Published trials should navigate directly to the minimal runner and execute one case at a time under an external browser controller. Describe the actual isolation method; a fresh storage context alone does not prove a fresh renderer process.

Future Solid or Svelte implementations must use separate entry points and bundles. Share framework-neutral input and operation contracts. Do not load multiple frameworks into the article's React tree or run implementations simultaneously for quantitative comparisons.

The foundation does not add these runner bundles. Their implementation and build integration will be reviewed in the next phase.

## Metrics and collection boundaries

| Metric                     | Planned collection                                                                                   | Unit and limitation                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Mount to DOM commit        | Mark before `root.render()`; completion marker in the grid's mount layout effect                     | Milliseconds; a defined DOM commit milestone, not proof that pixels have been painted             |
| Commit to subsequent frame | Documented `requestAnimationFrame` sequence following commit                                         | Milliseconds; frame-opportunity proxy                                                             |
| Mounted DOM                | Count elements and total nodes under the grid root after the timed interval                          | Count; distinguish element count from all node types                                              |
| Filter/sort compute        | Marks around the identical pure data operation                                                       | Milliseconds; excludes the subsequent rendering update                                            |
| Filter/sort update         | Start of the defined operation through committed output                                              | Milliseconds; includes the operation's documented work                                            |
| User interaction           | Trusted pointer/keyboard input; Event Timing when supported; event timestamp to commit separately    | Milliseconds; browser event duration, input delay, and application commit latency remain distinct |
| Scroll smoothness          | Fixed-duration, fixed-speed scroll scenario; frame timestamps, scroll position, supported long tasks | Frame-gap distribution and long-task count; not exact compositor dropped frames                   |
| Memory                     | Separate optional memory pass with an explicitly named method and attribution scope                  | Bytes and MiB; unsupported is not zero                                                            |

### Timing

Use named User Timing marks and measures so each boundary is inspectable. Clear entries between trials. Keep DOM counting, chart updates, exports, and verbose logging outside timed intervals. [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing)

An animation-frame callback runs before repaint, and hidden documents can suspend callbacks. A double-animation-frame sequence still does not prove painted pixels. Label it as a proxy, record visibility changes, and invalidate affected trials. Refresh rate affects frame intervals, so do not assume every display has a 16.7ms frame budget. [requestAnimationFrame documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)

React Profiler is optional diagnostic instrumentation. It adds overhead and is disabled in ordinary production builds. If enabled through a production profiling build, keep those results separate and identify the build mode. React render duration is not the complete browser layout and paint duration. [React Profiler documentation](https://react.dev/reference/react/Profiler)

### Interaction and scrolling

Event Timing exposes rounded values and thresholds: durations are rounded to 8ms, the live observation threshold can be reduced to 16ms, and the default buffer retains events of at least 104ms. An absent entry can mean below threshold or unsupported; it must not become zero. A short scripted interaction scenario is not a field INP measurement. [PerformanceEventTiming documentation](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming)

Feature-detect each observer. Long Tasks, when supported, reports tasks occupying the main thread for at least 50ms; do not treat the absence of this API as evidence of no blocking. [PerformanceLongTaskTiming documentation](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming)

Pagination does not expose all records in one continuous scroll area. Compare scrolling within its current page and measure page changes separately. Do not equate page-local scrolling with traversing 100,000 continuous rows. Keep an equal-speed scrolling scenario distinct from a task that navigates to a target record.

### Memory

Memory collection is optional and outside timing passes. `measureUserAgentSpecificMemory()` requires a secure, cross-origin-isolated context and provides browser-dependent values. Do not compare its byte counts across browser versions. Sampling and garbage collection can perturb other measurements. [Memory measurement documentation](https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory)

If host headers or browser support are unavailable, show an unavailable status and document a separate local measurement procedure. Do not silently substitute the deprecated and unreliable `performance.memory` API. [Legacy memory API documentation](https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory)

Do not introduce hosting changes solely to make memory collection mandatory. Decide the optional collection method during runner implementation and document it before publishing memory findings.

## Proposed run protocol

1. Freeze the protocol and produce production assets from pinned dependencies. Record the source revision and build mode.
2. Run one case at a time with no parallel benchmark workers. Record the browser version, viewport, device notes, power/thermal conditions when known, and automation mode.
3. Wait for runner readiness, fonts, completed setup, and a visible foreground document.
4. Generate and validate the seeded dataset outside the mount timer; retain the seed and dataset hash.
5. Mount into an empty root and record the defined milestones. Count DOM after timing completes.
6. Execute each operation from a documented starting state: original data for sorting, unfiltered data for filtering, and initial page/scroll position for navigation.
7. Validate output IDs, counts, and ordering after each operation. Incorrect output fails the trial regardless of speed.
8. Begin with two discarded warmups and ten recorded trials per case. Counterbalance or deterministically shuffle strategy order across rounds. Record the ordering seed. This is a proposed collection policy, not a statistical guarantee.
9. Preserve raw samples. Report sample count, median, interquartile range, and min/max with the calculation method. Do not emphasize a p95 from ten samples.
10. Repeat the complete session on a second occasion before publishing findings. Keep browser/device cohorts separate.
11. Retain crashes, failures, timeouts, and invalidated trials with reasons. Do not silently remove outliers or incomplete cases.
12. Publish the raw export, protocol version, environment, and evidence-backed findings together.

Warm mounting, cold navigation, and steady-state interactions are separate named suites. Reset can remove DOM and listeners; it cannot guarantee a cold JavaScript engine or completed garbage collection. Record these limits.

Published measurements should use a visible browser with unrelated activity minimized. Headless or throttled runs may be useful diagnostics, but belong to separately labeled cohorts. Browser automation does not make a shared CI machine a controlled performance laboratory.

## Controls and blocking behavior

The planned runner should provide strategy, record count, explained parameters, Run current case, Run comparison, and Reset. Start at 1,000 records. Do not execute the full suite on page load.

Rendering 100,000 rows is an explicit high-load action and may block the tab. State that before it runs. An in-document Cancel button cannot interrupt synchronous work already blocking that document. The external browser controller needs a timeout and must retain the case as `timed-out`, without inventing its completion duration.

Reset should restore controls, remove the previous grid, unregister observers/listeners, clear relevant marks, and return results to a clear empty state. When a configuration changes, identify existing results as belonging to their saved configuration or invalidate the active comparison.

Keep "Results from this browser" separate from versioned published findings. An empty result state should say that measurements have not been collected. Do not render illustrative bars, fake timing values, or predicted winners.

## Result export contract

This describes the intended data model for the next phase. It does not require a result store or service in the foundation.

| Group         | Required context                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Identity      | `schemaVersion`, `experimentId`, `protocolVersion`, `runId`, UTC collection timestamp                               |
| Provenance    | Source revision, build mode, actual framework and virtualizer versions                                              |
| Configuration | Strategy, record count, dataset seed/hash, columns, row height, page size, overscan, operation inputs               |
| Environment   | Browser/engine/version, OS where available, device notes, viewport, DPR, visibility, automation and throttling mode |
| Capabilities  | Supported observers, isolation state, memory method, relevant threshold and resolution information                  |
| Trial         | ID, run order, warmup flag, operation, metric name, value, unit, collection milestones                              |
| Outcome       | Status, failure/exclusion reason, attribution scope, validation outcome                                             |
| Summary       | Sample count, included trial IDs, statistic values, calculation method                                              |

Suggested sample statuses are `completed`, `unsupported`, `below-threshold`, `invalidated`, `timed-out`, and `failed`. Use `null` with a status and reason for missing measurements. Only completed valid numeric samples feed numeric summaries. Retain counts of all other outcomes.

CSV should contain one metric sample per row with repeated configuration needed for interpretation. JSON retains the complete nested environment, raw samples, and optional trace arrays. Both should download locally without a backend.

No result artifacts are included in the foundation. Do not add sample files that could be mistaken for collected evidence.

## Verification before findings

- Unit checks: seeded data reproducibility; immutable filter/sort behavior; ID tie-breaking; statistics; units; exports; missing-value handling.
- Browser checks: equal logical outputs; pagination boundaries; virtualized offscreen rows; scrolling; reset; downloads; unsupported APIs; invalidated and timed-out cases.
- Accessibility checks: keyboard controls; visible focus; announced status; sorting state; row count/position; focus preservation; accessible result tables; manual screen-reader behavior.
- Production runs: all nine cases or explicitly recorded failures/timeouts; repeated sessions; at least one trace per strategy to inspect measurement boundaries.
- CI: deterministic correctness and small smoke checks. Do not gate on exact timing values from shared CI hardware or publish them as universal performance evidence.

Only publish findings after the runner passes correctness checks and the raw records exist. Findings should explain observations, tradeoffs, uncertainty, and follow-up questions, with links to the exact source revision and measurements.

## Static hosting boundary

The research shell can use Next.js static export and client-side functionality. The initial Lab does not require API routes, Server Actions, a database, or runtime secrets. Static-export limitations, including runtime headers, must be handled by the selected host if an optional capability requires them. [Next.js static export documentation](https://nextjs.org/docs/app/guides/static-exports)

Deployment and DNS changes remain outside the foundation work.
