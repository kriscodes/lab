# Architecture

Lab is a static publication site built with Next.js App Router, React, and TypeScript. It has its own dependency lockfile and verification workflow. Portfolio and Toolbox are separate applications.

## Application structure

`next.config.ts` sets `output: 'export'`, `trailingSlash: true`, and unoptimized images. Server Components execute at build time; the `out/` directory contains the deployable site. There is no Lab application server, database, or secret configuration.

| Location                              | Responsibility                                                              |
| ------------------------------------- | --------------------------------------------------------------------------- |
| `src/app/layout.tsx`                  | Shared shell, metadata, appearance bootstrap, and optional audience tracker |
| `src/app/experiments/[slug]/page.tsx` | Static experiment routes and experiment-specific content selection          |
| `src/app/methodology/`                | Measurement and publication standards                                       |
| `src/app/privacy/`                    | Audience-measurement notice and preference links                            |
| `src/lib/experiments.ts`              | Typed registry, publication states, and findings selection                  |
| `src/experiments/pdf-rendering/`      | Study-specific copy and proposed method                                     |
| `src/lib/site.ts`                     | Canonical identity and page metadata                                        |
| `src/lib/appearance.ts`               | Theme preference parsing and startup behavior                               |
| `scripts/verify-export.mjs`           | Checks generated routes, metadata, assets, and local references             |

The public routes are `/`, `/experiments/`, `/experiments/pdf-rendering/`, `/experiments/pdf-first-page/`, `/experiments/pdf-first-page/evidence/`, `/experiments/pdf-first-page/replicate/`, `/methodology/`, and `/privacy/`. Unknown routes use the exported `404.html`. Sitemap and robots files are generated during the build.

`src/experiments/pdf-first-page/` owns the dated loading-lab snapshot, editorial report, evidence ledger, replication guide and shared reading navigation. Its explicit static route modules select these components; the dynamic experiment route generates only the older proposal. The homepage is a separate editorial cover linking to Lab 001. Its SVG experiment is server-rendered, then animated by a small Client Component with pause and reduced-motion support. The publication disclosure remains on research routes only. `src/components/command-block.tsx` adds optional clipboard copying to commands that remain visible without JavaScript. Download fixtures are byte-preserved under `public/downloads/pdf-lab-001/` and covered by integrity tests.

## Adding a study

1. Add a stable ID and slug to `src/lib/experiments.ts`. Describe the research question, hypothesis, controls, measurements, and limitations before implementing a runner.
2. Put the study's article in `src/experiments/<slug>/` and add its explicit content selection to the experiment route. Registry metadata alone is not a complete page.
3. Keep section anchors, canonical metadata, navigation, and the export audit aligned with the new route. Unknown or unimplemented studies must remain missing pages.
4. Add checks for the study's actual contracts: deterministic inputs, correct workloads, metric units, result serialization, and failure handling as they are implemented.

The registry supports four states:

| State         | Meaning                                                                            |
| ------------- | ---------------------------------------------------------------------------------- |
| `proposal`    | A question and candidate method; no measured findings                              |
| `protocol`    | A defined method and implementation plan; no measured findings                     |
| `in-progress` | Measurements exist, but the declared campaign and final interpretation remain open |
| `published`   | Findings supported by raw measurements and reproduction instructions               |

`getPublishedFindings()` includes only `published` entries. The original rendering-progress proposal retains registry ID `001`; the loading experiment uses ID `002` and the public notebook label `Lab 001`. Registry identities are distinct from publication labels. The proposal remains unmeasured ([decision 003](decisions/003-pdf-progress-study.md)); the loading campaign is in progress ([decision 004](decisions/004-pdf-loading-publication.md)).

Before publishing findings, retain raw trials, failed or invalid outcomes, units, timing boundaries, protocol version, source revision, dependency versions, browser, hardware, viewport, and run parameters. Report sample counts, uncertainty, exclusions, and limits. Unsupported metrics must not become zero. A successful build cannot validate a performance claim.

## Browser behavior

Small Client Components manage appearance controls. The `lab.theme.v1` preference belongs to this site. Static headings, links, navigation, and article content remain available without JavaScript. Fonts are served locally, with attribution and licenses in `public/fonts/`.

`src/app/layout.tsx` loads Portfolio's tracker after hydration with `data-site="lab"` and `referrerPolicy="no-referrer"`. The tracker is an optional external dependency; its failure must not prevent reading. Audience events are not benchmark measurements. See [decision 002](decisions/002-audience-measurement.md).

Future measurement runners should have separate entry points and bundles. Keep article rendering, navigation, and unrelated framework code outside timed work. An iframe isolates a document, but does not guarantee a dedicated process or CPU thread.

## Verification

GitHub Actions runs `npm run verify` for pull requests and changes to `main`, with read-only repository permissions. It contains no deployment job. Browser checks still cover keyboard use, narrow layouts, theme persistence, blocked storage, reduced motion, and content with JavaScript disabled. Hosting checks are described in [Deployment](DEPLOYMENT.md).
