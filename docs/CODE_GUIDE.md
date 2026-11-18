# Code guide

This guide is a map of the hand-maintained code. Start with the feature you want to change, then follow the file and function descriptions below. Generated output and immutable research fixtures have separate ownership rules.

## The shortest path through the application

1. `src/app/layout.tsx` creates the document and shared page shell.
2. A route module under `src/app/` chooses the page content and its metadata.
3. Research content comes from `src/experiments/`; shared browser controls come from `src/components/`.
4. `src/lib/` supplies canonical site identity, the experiment registry, and appearance state.
5. `npm run build` exports HTML and assets, then `verifyExport()` checks the result.
6. `npm run preview` serves that same output locally. An approved production release serves `out/` on Render.

## Naming and documentation

Use names that explain the value or action at the point of use. Prefer `currentPathname`, `elapsedSeconds`, `exportDirectory`, and `experimentSlug` to context-free abbreviations. Boolean names should read as conditions, such as `isAnimationPaused` or `wasPreferenceSaved`.

Keep standard platform names when they are part of a contract: Next.js exports such as `metadata`, `viewport`, `dynamic`, `generateMetadata`, and `generateStaticParams`; HTML/SVG attributes; browser event names; and the preserved research manifest. Renaming a local variable must not change a published URL, storage key, evidence field, command flag, or file checksum.

Each source file begins with a brief description of its responsibility. Named functions have a short comment explaining their purpose or important boundary. Keep those comments close to the code; use this guide for longer explanations. Comments should explain intent, units, cleanup, or evidence boundaries rather than restating obvious syntax.

## Shared document and routes

| File                                                    | Responsibility and main functions                                                                                                                                                                                                       |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/layout.tsx`                                    | `RootLayout()` renders document metadata, the pre-hydration appearance script, header, main content, disclosure, footer, and optional tracker. `metadata` and `viewport` are required Next.js exports.                                  |
| `src/app/globals.css`                                   | Local font faces, descriptive theme colors, shared editorial layout, article styles, responsive tables, home artwork, lab entry, and normal-flow footer. Keep selectors scoped to their feature and respect reduced-motion preferences. |
| `src/app/page.tsx`                                      | `HomePage()` composes the sparse Labs cover, large heading, `HomeExperiment`, and the test-tube Lab001 link. It owns the root page metadata.                                                                                            |
| `src/app/experiments/page.tsx`                          | `ExperimentsPage()` lists the immutable experiment registry with publication labels, status, titles, and summaries.                                                                                                                     |
| `src/app/experiments/[slug]/page.tsx`                   | `generateStaticParams()` selects supported dynamic routes; `generateMetadata()` resolves their sharing metadata; `ExperimentPage()` chooses the proposal component and sends unsupported slugs to the missing-page response.            |
| `src/app/experiments/pdf-first-page/page.tsx`           | Static route and metadata for the Lab001 overview; `PdfLoadingOverviewPage()` renders `PdfLoadingOverview()`.                                                                                                                           |
| `src/app/experiments/pdf-first-page/evidence/page.tsx`  | Static route and metadata for the evidence ledger; `PdfLoadingEvidencePage()` renders `PdfLoadingEvidence()`.                                                                                                                           |
| `src/app/experiments/pdf-first-page/replicate/page.tsx` | Static route and metadata for the replication guide; `PdfLoadingReplicationPage()` renders `PdfLoadingReplication()`.                                                                                                                   |
| `src/app/methodology/page.tsx`                          | `MethodologyPage()` renders the six publication standards from the local standards data.                                                                                                                                                |
| `src/app/privacy/page.tsx`                              | `PrivacyPage()` explains the separate audience tracker and links to participation controls. The website does not implement the collector.                                                                                               |
| `src/app/not-found.tsx`                                 | The missing-page component gives unknown routes a clear message and a link back to Labs. Next.js exports it as `404.html`.                                                                                                              |
| `src/app/robots.ts`                                     | Generates static crawler instructions and the canonical sitemap location.                                                                                                                                                               |
| `src/app/sitemap.ts`                                    | Generates the eight canonical content URLs from fixed routes and the experiment registry.                                                                                                                                               |

### What belongs in a route file?

A route file should select a page, declare its metadata, and handle route-specific validation. Longer research narratives and their data belong in `src/experiments/`. Keep the homepage presentation independent from a particular report so adding or updating a study does not replace the Labs cover.

## Reusable components

| File                                     | Responsibility and main functions                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/components/site-header.tsx`         | `SiteHeader()` renders the Lab home link, owner name, and Studies/Method navigation. It uses the current pathname to mark the active section and simplify the home byline.                                                                                                                                                           |
| `src/components/site-footer.tsx`         | `SiteFooter()` renders “Stay curious.” and the Portfolio, Privacy, and appearance controls. Layout, not a scroll listener, keeps it at the bottom of short pages.                                                                                                                                                                    |
| `src/components/research-disclosure.tsx` | `ResearchDisclosure()` omits the publication-standards disclosure on `/` and preserves the native expandable explanation on other pages.                                                                                                                                                                                             |
| `src/components/theme-toggle.tsx`        | `ThemeToggle()` reads the external appearance store, toggles the preference, and announces whether the choice was saved. The optional control stays hidden during server rendering.                                                                                                                                                  |
| `src/components/command-block.tsx`       | `CommandBlock()` displays a labeled command and copy control. `copyCommand()` writes the complete command to the clipboard and reports a readable fallback when access fails.                                                                                                                                                        |
| `src/components/home-experiment.tsx`     | `HomeExperiment()` renders the static SVG sculpture, observes reduced-motion preferences, updates the paths after hydration, and provides pause/play. `createCoilFrame()` projects ring paths from elapsed seconds, `syncMotionPreference()` observes the browser preference, and `renderAnimationFrame()` schedules visual updates. |

### How the sculpture works

The geometry is decorative, not research data. `COIL_RING_COUNT`, `RING_SEGMENT_COUNT`, and `FULL_CIRCLE_RADIANS` describe its structure; `INITIAL_COIL_FRAME` supplies the static first view. A deterministic initial frame is generated for static HTML. After hydration, a browser animation callback projects the rings into SVG path coordinates and updates their opacity for depth. Frame updates are limited to approximately 30 per second. Hidden documents and artwork outside the viewport skip visual updates.

Reduced-motion preferences start the sculpture paused. Visitors can pause or play manually. Cleanup cancels the animation callback and disconnects the intersection observer when the component unmounts or the pause state changes. No renderer dependency, downloaded image, canvas, or measurement runner is required. Theme colors use descriptive custom properties such as `--page-background`, `--text-primary`, `--accent-color`, and `--border-color`. Decorative arrow glyphs must not be added to links or controls.

### How the footer reaches the bottom

The page shell is a flex column with `min-height: calc(100svh - 32px)`, and its `main` element uses `flex: 1`. Main content takes the remaining vertical space between the header and closing content. On longer pages, normal content height wins and the footer appears after the article. Do not add `position: fixed`, `position: sticky`, or a scroll handler to reproduce this behavior.

## Shared data and utilities

| File                     | Responsibility                                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `src/lib/site.ts`        | Canonical origin, site name, repository identity, and consistent sharing metadata.                                      |
| `src/lib/experiments.ts` | Readonly experiment types, immutable registry entries, publication states, category lists, and route helpers.           |
| `src/lib/appearance.ts`  | The trusted startup script, appearance preference, document updates, persistence, and same-tab/other-tab subscriptions. |

### Site metadata

`pageMetadata()` creates the page title, description, canonical URL, Open Graph fields, and Twitter card fields together. The root title is already complete, so it avoids adding the site name twice. All sharing images refer to the committed local social preview.

### Experiment registry

| Function                   | Purpose                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| `getExperiment()`          | Looks up one experiment by its stable slug, returning `undefined` for an unknown study.             |
| `getPopulatedCategories()` | Returns the stable set of categories represented in the registry.                                   |
| `getPublishedFindings()`   | Returns only entries whose status is `published`; proposals and incomplete campaigns stay excluded. |
| `getExperimentPath()`      | Builds the canonical trailing-slash route for a study slug.                                         |

The registry ID and publication label are deliberately separate. The rendering-progress proposal has registry ID `001`; the loading experiment has registry ID `002` and publication label `Lab 001`. Do not renumber one to match the other.

### Appearance state

| Function or value            | Purpose                                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `APPEARANCE_BOOTSTRAP`       | Applies a saved dark appearance before hydration, without writing storage or making a request.                        |
| `getAppearance()`            | Reads the appearance already applied to the root document.                                                            |
| `getServerAppearance()`      | Returns the server snapshot used to hide the optional control before hydration.                                       |
| `updateDocumentAppearance()` | Updates the root theme attribute and browser theme-color metadata.                                                    |
| `setAppearance()`            | Applies a choice, attempts to save it, and notifies subscribers; reports whether persistence succeeded.               |
| `subscribeAppearance()`      | Observes changes within this document and matching storage events from other tabs; returns complete listener cleanup. |

The storage key remains `lab.theme.v1`. A failed storage write does not disable the switch. Only this site's appearance preference is managed here; analytics participation is handled by the external tracker.

## Lab001: the published research notebook

| File                                             | Responsibility and main functions                                                                                                                                                                          |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/experiments/pdf-first-page/evidence.ts`     | Reviewed source revision, snapshot date/time, fixed-window outcomes, corpus filenames/checksums, and research stages. `getBenchmarkSourceUrl()` creates revision-pinned source links.                      |
| `src/experiments/pdf-first-page/navigation.tsx`  | `LabNavigation()` links the overview, ledger, and replication guide. `EvidenceDate()` shows the explicitly dated publication snapshot.                                                                     |
| `src/experiments/pdf-first-page/overview.tsx`    | `PdfLoadingOverview()` presents the question, current evidence, controls, method, timing boundary, and deeper reading paths.                                                                               |
| `src/experiments/pdf-first-page/ledger.tsx`      | `PdfLoadingEvidence()` presents all final-window outcomes, earlier diagnostic stages, source audits, and limits.                                                                                           |
| `src/experiments/pdf-first-page/replication.tsx` | `PdfLoadingReplication()` presents environment prerequisites, corpus downloads, preserved checksums, setup commands, baseline and controlled-delivery attempts, independent auditing, and troubleshooting. |

### Evidence update boundary

The current source snapshot is **November 18, 2026, 09:06 Pacific**, pinned to benchmark commit `1d2ba55efa2af1203202315d2f739e9cbe3401e1`. One final-campaign window was rejected and two remained pending. Do not reinterpret those records when the calendar advances.

A content update needs reviewed benchmark evidence first. Update the typed data, publication date, narrative, and pinned links together, then run the corpus and export checks. Keep every rejected or pending outcome visible. The website's animated hero is unrelated to the PDF experiment and must not be treated as a benchmark.

### Replication commands

Command strings are displayed as text and optionally copied; this website never executes them. They direct readers to a new benchmark checkout at the pinned source revision. The controlled-delivery sequence calibrates before running measurements and creates a fresh output directory. The separate audit sequence uses an explicit private destination.

Website validation must not start a new benchmark campaign or replay fixed calendar slots. The separate benchmark repository owns renderer versions, workloads, clocks, acceptance gates, and measurement output.

## The rendering-progress proposal

| File                                         | Responsibility and main functions                                                                         |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/experiments/pdf-rendering/copy.ts`      | `PDF_STUDY_COPY` holds the proposal's editorial question, hypothesis, and state labels.                   |
| `src/experiments/pdf-rendering/protocol.tsx` | `PdfRenderingProtocol()` combines the registry entry and proposal copy into the unmeasured protocol page. |

This proposal concerns intermediate-frame update cost. It is separate from Lab001's first-page loading question. Preserve its `proposal` status until an appropriate protocol and evidence justify a change.

## Build, preview, and audit scripts

| File                             | Responsibility and main functions                                                                                                                                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/prepare-assets.mjs`     | Uses Sharp to render `artwork/social-preview.svg` into the committed `public/social-preview.png`, entirely from local files.                                                                                                                  |
| `scripts/serve-export.mjs`       | `serveExportedFile()` serves `out/` locally with MIME types, directory redirects, path containment, and true missing-page responses. `announcePreviewAddress()` prints the listening address. Reads `LAB_PREVIEW_PORT`, defaulting to `4174`. |
| `scripts/verify-export.mjs`      | `verifyExport()` audits generated pages, metadata, local assets/links, crawler documents, and the custom 404. Its command-line entry reports failures and sets an unsuccessful exit code.                                                     |
| `scripts/verify-export.test.mjs` | `createExportFixture()` builds temporary synthetic exports so the audit can be tested independently of framework rendering.                                                                                                                   |

### The export audit, step by step

1. `listExportedFiles()` enumerates the publish directory and rejects symbolic links.
2. `readHtmlTags()` parses real markup after excluding comments and serialized script content. `decodeHtmlEntities()` normalizes attribute values.
3. Every expected content route must have one heading, a main landmark, a language, the correct canonical, and complete social metadata.
4. `getExportedFilePath()` maps a local URL to the exported file. `validateLocalReference()` checks resource paths, page destinations, and static fragment targets.
5. Local HTML and CSS dependencies must exist. The sitemap must contain exactly the content routes. Robots instructions must identify the canonical sitemap. The custom 404 must be non-indexable.

The audit returns errors, the expected page count, and the number of referenced local assets. It does not test remote website availability or the scientific validity of a claim.

## Regression tests

| File                         | Contract protected                                                                                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/appearance.test.mjs`  | Saved preferences, startup behavior, document/theme updates, blocked storage, tab synchronization, and listener cleanup. Browser and storage fixtures make side effects observable. |
| `tests/experiments.test.mjs` | Unique identities, canonical routes, stable immutable registry values, and the boundary between proposals and published findings.                                                   |
| `tests/export.test.mjs`      | Includes the export-audit tests in the standard `npm test` run.                                                                                                                     |
| `tests/pdf-loading.test.mjs` | Exact corpus bytes and hashes, ZIP identity, and the dated distinction between observer validity and timing acceptance.                                                             |
| `tests/site.test.mjs`        | Correct homepage and study sharing titles without duplicated site names.                                                                                                            |

Use tests for behavior and contracts that could regress. Browser checks cover presentation, keyboard access, footer flow, and optional interactions. Do not add tests that only repeat a component's literal implementation.

## Configuration and repository files

| File                          | Purpose                                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                | Commands, runtime floor, and dependency declarations.                                                                                       |
| `package-lock.json`           | Exact npm dependency graph for reproducible installation; maintained by npm.                                                                |
| `.node-version`               | The repository's declared Node version, currently `22.23.4`.                                                                                |
| `next.config.ts`              | Static export, trailing slash, unoptimized images, and disabled powered-by header.                                                          |
| `tsconfig.json`               | Strict TypeScript settings, generated Next.js type inputs, and the `@/` source alias.                                                       |
| `eslint.config.mjs`           | Next.js/TypeScript lint rules and generated-output exclusions.                                                                              |
| `.prettierrc.json`            | Formatting rules, including preserved prose wrapping.                                                                                       |
| `.prettierignore`             | Excludes generated output, font files, lockfile, and the immutable corpus manifest from formatting.                                         |
| `.gitignore`                  | Excludes dependencies, build output, caches, and local environment files.                                                                   |
| `.github/workflows/check.yml` | Read-only CI for pull requests, pushes to `main`/`staging`, and manual runs. Executes `npm run verify`.                                     |
| `render.yaml`                 | Existing production static-site configuration, including the custom domain, `main`, `out/`, and deployment after passing checks.            |
| `render.staging.yaml`         | Separate staging configuration with its collector origin and non-indexing response header. Provider activation must be verified separately. |
| `README.md`                   | Project entry point, current review boundary, commands, guides, and evidence safeguards.                                                    |

## Assets, generated files, and ownership

`artwork/social-preview.svg` is the editable source for the sharing image. `public/social-preview.png` is the committed generated result, and `public/favicon.svg` supplies the site icon. `public/fonts/SOURCES.md` records font provenance; the license files and local WOFF2 assets remain alongside it. The older Instrument Sans assets are retained but unused by the current design.

`public/downloads/pdf-lab-001/` contains the original two PDFs, manifest, and ZIP. They are preserved inputs, not design assets. Do not reformat or regenerate them.

`.next/`, `out/`, `next-env.d.ts`, and TypeScript build caches are generated. Change their source or configuration instead of editing generated files. Review screenshots under `docs/reviews/` are dated evidence of earlier browser checks; they are not always the latest design.

## Before handing off a change

Run checks appropriate to the work and `npm run verify` before an approved release. Review the static export in the browser, including a narrow viewport and direct nested-route loads. Keep commits focused and messages concrete. Use a descriptive feature branch rather than a `codex/` branch. During the current design review, keep commits local until pushing or publishing is explicitly approved.

When a route, function responsibility, environment setting, or user-visible behavior changes, update the relevant section of this guide and the concise entry in the README. Treat deployment status and benchmark status as separate facts, each requiring its own evidence.
