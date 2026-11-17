# Engineering Lab — Kristian Salmeron

A public notebook for controlled frontend engineering investigations. This repository is independent of [Portfolio](https://github.com/kriscodes/portfolio) and [Toolbox](https://github.com/kriscodes/toolbox), with its own dependencies, checks, and release lifecycle.

## Current scope

This application implements the approved publication design: IBM Plex Sans, Source Serif 4, IBM Plex Mono, white/ink/cobalt colors, horizontal navigation, and an open study layout. All fonts are self-hosted.

Experiment 001 is **The Cost of Rendering Progress**, a proposed PDF rendering study. Its homepage, method, research log, methodology, and custom 404 are statically exported. No PDF runner, measurement collection, or published performance finding exists yet. The diagnostic pilot and adaptive comparison are research proposals, not results.

The publication site is live at [lab.kristiansalmeron.com](https://lab.kristiansalmeron.com/). The current study remains a proposal; publishing the site does not establish a performance finding.

## Related benchmark work

[PDF Rendering Benchmark](https://github.com/kriscodes/pdf-rendering-benchmark) is a separate repository for reusable infrastructure investigating PDF structure, network delivery, and rendering architecture. Its current work is a corpus foundation, with deterministic PDF-pair generation on a feature branch. It does not yet contain a browser timing runner or published results.

Lab hosts research questions, methods, and eventual findings. Experiment 001 specifically investigates intermediate-frame update cost and cadence, keeping network acquisition separate. The broader benchmark work can support future investigations, but it is not an implementation or validation of Experiment 001.

## Run locally

Use Node **22.23.4**, recorded in `.node-version`:

```sh
npm ci
npm run dev
```

The development server binds to `127.0.0.1`. No environment variables, API keys, database, authentication, or external service are needed.

```sh
npm run verify
npm run preview
```

Verification checks formatting, lint, TypeScript, unit tests, the production build, and the actual static output. Preview serves the generated `out/` directory at `http://127.0.0.1:4174/`, including deep links and a real 404. It does not deploy anything. Set `LAB_PREVIEW_PORT` only if that local port is occupied.

Other commands:

| Command             | Purpose                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| `npm test`          | Registry, publication-stage, appearance, and export-contract regressions |
| `npm run typecheck` | Generate Next route types and check strict TypeScript                    |
| `npm run build`     | Static export plus route/metadata/resource audit                         |
| `npm run format`    | Apply Prettier formatting                                                |
| `npm run assets`    | Rebuild the committed social image from its vector source                |

## Architecture and research conventions

Next.js App Router, React, and TypeScript generate static HTML with `output: 'export'`. Content is rendered without requiring client JavaScript. The light/dark preference is stored as `lab.theme.v1`. An optional first-party Studio Insights script reports audience activity to the existing Portfolio analytics service. This is separate from research measurements: no benchmark runner or benchmark-result upload is introduced. See [analytics integration and privacy](docs/ANALYTICS.md). This tracking version must be deployed before new metrics can collect.

The experiment registry is a plain typed array in `src/lib/experiments.ts`. Each investigation owns content under `src/experiments/<slug>/`; a small shared layout supplies the document structure. Future benchmark runners should be separate entry points/bundles, leaving the research shell outside measured work. Do not introduce a plugin framework before multiple real experiments justify one.

- [Architecture](docs/ARCHITECTURE.md)
- [Visual specification](docs/VISUAL-SPECIFICATION.md)
- [Adding experiments](docs/ADDING-EXPERIMENTS.md)
- [Experiment 001 protocol](docs/EXPERIMENT-001-PROTOCOL.md)
- [Prior-art review and proposed two-stage study](docs/RESEARCH-001-PRIOR-ART.md)
- [Deployment and release process](docs/DEPLOYMENT.md)
- [Foundation validation and preview](docs/FOUNDATION-VALIDATION.md)

## Checks and release boundaries

GitHub Actions runs verification for PRs and main-branch changes with read-only repository permission. It contains no deployment job. Use feature branches and PRs; production deployment and DNS changes require explicit owner approval.

The export audit verifies the real HTML routes, canonical/social metadata, local asset and fragment references, crawler files, and noindex 404. It cannot establish that a benchmark is scientifically valid. Published findings must additionally include actual raw samples, units, environment, source revision, dependency versions, methodology, repeatability checks, and limitations.

Next.js 16.4 officially supports the pinned ESLint 10 configuration. Some bundled plugins still declare older ESLint peer ranges, so npm can print the [upstream-documented peer warnings](https://nextjs.org/docs/app/api-reference/config/eslint). The default `npm ci` command is verified without `--force`, peer overrides, or legacy-peer flags; the included React, accessibility, and import rules remain enabled.

The self-hosted font assets include their SIL Open Font License files. The static site retains its independent deployment. Optional audience measurement uses the existing Portfolio-owned Studio Insights service; no Lab backend or research measurement service is created.
