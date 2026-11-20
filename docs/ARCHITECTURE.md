# Architecture

Labs is a static publication site built with Next.js App Router, React, and TypeScript. It has its own dependency lockfile and verification workflow. Portfolio and Toolbox are separate applications.

## Static by design

`next.config.ts` sets `output: 'export'`, `trailingSlash: true`, and unoptimized images. Server Components execute at build time. The `out/` directory contains the pages and assets that hosting serves. Lab has no request-time application server, database, or runtime secrets.

Small Client Components add appearance switching, home artwork motion, decorative bubbles, Studies topic selection, command copying, and route-aware navigation. Their presence does not make the article depend on JavaScript: headings, text, links, commands, and native disclosures are included in the export.

## Page structure

`RootLayout` supplies the document metadata, appearance bootstrap, header, main landmark, publication disclosure, footer, and optional audience tracker. The page shell uses a minimum viewport height and flexible main content. The footer occupies normal document flow: it reaches the bottom on short pages and follows the article on long pages. It is neither fixed nor sticky.

The home route is an editorial cover with one Lab001 entry. Its wire sculpture starts as a server-rendered SVG and becomes animated after hydration. The home omits the publication disclosure and explanatory research copy. Research routes retain their full editorial content and publication standards. The shared navigation uses words without decorative link arrows.

## Routes and ownership

| Route                                    | Purpose                                                | Source                                           |
| ---------------------------------------- | ------------------------------------------------------ | ------------------------------------------------ |
| `/`                                      | Labs cover and Lab001 entry                            | `src/app/page.tsx`                               |
| `/experiments/`                          | How questions are selected and developed into studies  | `src/app/experiments/page.tsx`                   |
| `/experiments/pdf-first-page/`           | Lab001 overview                                        | `src/experiments/pdf-first-page/overview.tsx`    |
| `/experiments/pdf-first-page/evidence/`  | Dated evidence ledger and limits                       | `src/experiments/pdf-first-page/ledger.tsx`      |
| `/experiments/pdf-first-page/replicate/` | Corpus downloads and portable replication guide        | `src/experiments/pdf-first-page/replication.tsx` |
| `/experiments/pdf-rendering/`            | Separate rendering-progress proposal                   | `src/experiments/pdf-rendering/protocol.tsx`     |
| `/methodology/`                          | Friendly research principles and expandable standards  | `src/app/methodology/page.tsx`                   |
| `/privacy/`                              | Audience-measurement notice and participation controls | `src/app/privacy/page.tsx`                       |

The eight content routes are audited after every production build. Unknown paths use the exported `404.html`. `src/app/sitemap.ts` and `src/app/robots.ts` generate crawler documents during the build.

Explicit route modules select the three Lab001 components. The dynamic `[slug]` route generates only the older proposal; it rejects unsupported or unknown slugs. Registry metadata alone does not create a complete article.

## Studies and Method

Studies is an introduction to choosing useful questions. `src/app/experiments/page.tsx` composes a static orbit-and-question illustration, topic choices, a short three-step process, and links to the two existing studies. `StudyTopics` owns the selected topic and announces its example question through a polite live region. It does not filter the registry, record a research result, or start a benchmark. The four topics are editorial prompts, not a list of measured categories.

Method renders six approachable principles from `researchPrinciples`. Each principle pairs a short introduction with native `<details>` containing its technical standard. The complete text remains in the static export and can be expanded without JavaScript. Styles are colocated in the two routes' CSS modules, keeping these layouts separate from the research articles.

The Studies illustration is static and topic changes have no transition. Shared hover bubbles decorate interactive items without changing the topic selection or layout. The arrival bubbles play only on a fresh home document; they are not a page-navigation transition. The existing home sculpture retains its established behavior.

## Research data and publication states

`src/lib/experiments.ts` holds the typed, immutable registry. It supports four states:

| State         | Meaning                                                                             |
| ------------- | ----------------------------------------------------------------------------------- |
| `proposal`    | A question and candidate method; no measured findings.                              |
| `protocol`    | A defined method and implementation plan; no measured findings.                     |
| `in-progress` | Measurements exist, but the declared campaign and final interpretation remain open. |
| `published`   | Findings supported by raw measurements and reproduction instructions.               |

`getPublishedFindings()` includes only `published` entries. The rendering-progress proposal retains registry ID `001`; the loading experiment uses registry ID `002` and public notebook label **Lab 001**. Registry identities and publication labels serve different purposes and must not be silently renumbered.

`src/experiments/pdf-first-page/evidence.ts` owns the reviewed source revision, corpus metadata, research stages, and fixed-window outcomes. The snapshot remains **November 18, 2026, 09:06 Pacific**, with one rejected final-campaign attempt and two pending windows. It is not a live status feed. `getBenchmarkSourceUrl()` creates revision-pinned links so later benchmark edits do not silently replace the cited evidence.

Download fixtures are byte-preserved in `public/downloads/pdf-lab-001/` and covered by integrity tests. Website build success establishes delivery and code correctness, not validity of a performance claim.

## Adding a study

1. Add a stable registry ID and slug. Describe the question, hypothesis, controls, measurements, and limitations before implementing a runner.
2. Put the article in `src/experiments/<slug>/` and select it through an explicit route or a supported dynamic-route branch.
3. Update section anchors, canonical metadata, navigation, sitemap, and the export-audit route inventory together. Unknown or unimplemented studies must remain missing pages.
4. Add tests for actual contracts: deterministic inputs, workload correctness, metric units, result serialization, or failure handling as these behaviors are implemented.
5. Update the code guide and relevant publication decision so another contributor can locate the content and evidence.

Before publishing findings, retain raw trials, failed or invalid outcomes, units, timing boundaries, protocol version, source revision, dependency versions, browser, hardware, viewport, and run parameters. Report sample counts, uncertainty, exclusions, and limits. Unsupported metrics stay missing; they do not become zero.

## Appearance and optional browser behavior

`src/lib/appearance.ts` owns the `lab.theme.v1` preference. A fixed, trusted bootstrap applies a saved dark appearance before hydration. The appearance control observes document state and updates the browser theme color. Blocked storage still permits an in-memory choice for the current visit, and storage events synchronize other tabs.

The home animation respects reduced-motion preferences and skips visual updates when the document is hidden or the artwork is outside the viewport. Its presentation has no manual playback control. The initial SVG remains visible without JavaScript. The Lab001 row uses a decorative test-tube illustration; the entire row is a normal link.

`CommandBlock` adds clipboard copying to commands that remain selectable in static HTML. Clipboard errors produce a visible fallback message. Fonts are local, with source attribution and licenses in `public/fonts/`.

## Decorative bubble behavior

The shared `BubbleEffects` component owns a non-interactive decorative layer. The initial arrival is eligible only when a new document loads `/`. Refreshing the home creates a new eligible document. Client-side navigation, a later visit to `/` in the same document, back/forward history restoration, and direct loads of other routes do not play it. The decision uses document lifetime and navigation information, not cookies or session storage.

The arrival emits 14 bubbles at seven per second. Their responsive diameters range from 8 to 160 pixels. They travel in random directions, reflect at the viewport walls, and slow linearly from a gentle launch until stopping at 2.9 seconds. All arrival bubbles begin their pop at three seconds. Hovering an enabled link, button, or disclosure summary creates six bubbles near the pointer; keyboard focus and touch presses receive the same feedback. Each interaction burst lasts two seconds before its 190-millisecond pop. These smaller bursts follow their own short paths and are clipped at the viewport edge rather than reflected.

Reduced-motion preferences skip both bubble effects. Hiding or leaving the page clears active bubbles and scheduled work. The layer must not intercept pointer input or enter the accessibility tree. Animation timing and geometry live in small shared modules, while browser events and cleanup belong to the component. These effects are decorative and do not change the page layout, publication content, or research measurements.

## Audience measurement

`RootLayout` loads the Portfolio-owned tracker after hydration with `data-site="lab"` and `referrerPolicy="no-referrer"`. `NEXT_PUBLIC_ANALYTICS_ORIGIN` may replace the default origin at build time. The tracker is optional: failure must not prevent reading, using navigation, or downloading the corpus.

The external collector owns route allowlists, validation, retention, and reporting. A new website route does not automatically become an approved analytics route. Confirm collector support separately when measurement is part of a release. Audience events are not benchmark measurements. See [decision 002](decisions/002-audience-measurement.md).

## Verification and release boundary

GitHub Actions runs `npm run verify` for pull requests, pushes to `main` and `staging`, and manual workflow dispatches. It uses read-only repository permissions and contains no deployment job. The Render configuration separately observes the production branch and passing checks.

Browser review covers keyboard use, narrow layouts, footer flow, theme persistence, blocked storage, reduced motion, and content without JavaScript. Future measurement runners need separate entry points and bundles; keep publication rendering, navigation, and unrelated framework code outside timed work. An iframe isolates a document but does not guarantee a dedicated process or CPU thread.
