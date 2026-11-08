# Engineering Lab — Kristian Salmeron

A public notebook for controlled frontend engineering investigations. This repository is independent of [Portfolio](https://github.com/kriscodes/portfolio) and [Toolbox](https://github.com/kriscodes/toolbox), with its own dependencies, checks, and future release lifecycle.

## Current scope

This foundation includes a research homepage, experiment index, methodology page, custom 404, and the individually linkable **Experiment 001: Data Grid Rendering Performance** protocol. It shares the approved Instrument Sans / IBM Plex Mono typography and neutral light/dark palette without a shared runtime package.

Experiment 001 is a **protocol**, not an executed benchmark. There is no interactive grid, measurement collection, result visualization, export implementation, or published performance finding yet. Those belong to the next phase. Only populated research topics appear; no placeholder experiments or fabricated results are included.

The canonical future site is `https://lab.kristiansalmeron.com/`. This source change does not publish it or configure DNS.

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

Next.js App Router, React, and TypeScript generate static HTML with `output: 'export'`. Content is rendered without requiring client JavaScript. The initial interactive enhancement is a light/dark preference stored only as `lab.theme.v1`; there is no analytics or measurement upload service.

The experiment registry is a plain typed array in `src/lib/experiments.ts`. Each investigation owns content under `src/experiments/<slug>/`; a small shared layout supplies the document structure. Future benchmark runners should be separate entry points/bundles, leaving the research shell outside measured work. Do not introduce a plugin framework before multiple real experiments justify one.

- [Architecture](docs/ARCHITECTURE.md)
- [Visual specification](docs/VISUAL-SPECIFICATION.md)
- [Adding experiments](docs/ADDING-EXPERIMENTS.md)
- [Experiment 001 protocol](docs/EXPERIMENT-001-PROTOCOL.md)
- [Future deployment and release process](docs/DEPLOYMENT.md)
- [Foundation validation and preview](docs/FOUNDATION-VALIDATION.md)

## Checks and release boundaries

GitHub Actions runs verification for PRs and main-branch changes with read-only repository permission. It contains no deployment job. Use feature branches and PRs; production deployment and DNS changes require explicit owner approval.

The export audit verifies the real HTML routes, canonical/social metadata, local asset and fragment references, crawler files, and noindex 404. It cannot establish that a benchmark is scientifically valid. Published findings must additionally include actual raw samples, units, environment, source revision, dependency versions, methodology, repeatability checks, and limitations.

Next.js 16.4 officially supports the pinned ESLint 10 configuration. Some bundled plugins still declare older ESLint peer ranges, so npm can print the [upstream-documented peer warnings](https://nextjs.org/docs/app/api-reference/config/eslint). The default `npm ci` command is verified without `--force`, peer overrides, or legacy-peer flags; the included React, accessibility, and import rules remain enabled.

The self-hosted font assets include their SIL Open Font License files. No backend or infrastructure is shared with Portfolio, Toolbox, or CareIQ.
