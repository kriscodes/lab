# Architecture

Engineering Lab is an independent Next.js, React, and TypeScript application. It owns its repository, dependency lockfile, checks, and future deployment. Portfolio and Toolbox remain independent applications. Shared typography and visual conventions are documented rather than distributed through a runtime package.

## Static application

The App Router builds readable HTML for the homepage, experiment index, experiment pages, methodology, and a custom not-found page. `output: 'export'` and `trailingSlash: true` produce a portable `out/` directory. Server Components execute during the build; there is no request-time Next.js server, database, API, authentication, analytics service, or secret required by this foundation.

The static-export choice follows [Next.js's documented export model](https://nextjs.org/docs/app/guides/static-exports). Browser interactions belong in small Client Components. Browser APIs must be accessed in browser lifecycle code rather than during prerendering. Features requiring a running server would be a separate architectural decision.

## Source map

| Location                                             | Responsibility                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------------- |
| `src/app/layout.tsx`                                 | Document metadata, local fonts, shared shell, and appearance bootstrap |
| `src/app/page.tsx`                                   | Lab introduction and real experiment entries                           |
| `src/app/experiments/`                               | Experiment index and statically generated experiment routes            |
| `src/app/methodology/`                               | Shared research and measurement principles                             |
| `src/app/not-found.tsx`                              | Accessible recovery links for unknown routes                           |
| `src/app/sitemap.ts`, `robots.ts`                    | Static crawler files                                                   |
| `src/components/experiment-layout.tsx`               | Consistent research-document structure                                 |
| `src/components/experiment-entry.tsx`                | Experiment summaries and status                                        |
| `src/components/site-header.tsx`, `theme-toggle.tsx` | Navigation and progressive appearance controls                         |
| `src/lib/experiments.ts`                             | Typed experiment registry and publication state                        |
| `src/lib/site.ts`                                    | Canonical site identity and metadata conventions                       |
| `src/lib/appearance.ts`                              | Appearance preference parsing                                          |
| `src/experiments/data-grid-rendering/protocol.tsx`   | Experiment-owned protocol document content                             |
| `scripts/verify-export.mjs`                          | Audit the generated static routes, metadata, links, and assets         |

## Publication model

An experiment in `protocol` state describes a research question, hypothesis, proposed controls, measurement definitions, limitations, and reproduction plan. It has no measured findings. `published` is reserved for an experiment with evidence that has passed the publication checks. `getPublishedFindings()` supplies findings from published work; the initial foundation has none.

Experiment 001, Data Grid Rendering Performance, is a protocol in this release. Dataset sizes and test conditions are planned inputs. They are not performance measurements. The foundation does not contain an implemented benchmark runner, interactive grid comparison, collected results, result charts, or export controls. Those are the next implementation phase.

Before publishing measured findings:

1. Implement and test equivalent workloads and deterministic dataset generation.
2. Define each metric's units, timing boundaries, supported browser APIs, and failure states.
3. Run comparable production builds under a recorded protocol; retain individual runs and invalid/aborted outcomes.
4. Record commit, dependency versions, browser, operating system, hardware information available to the operator, viewport, parameters, and collection method.
5. Publish raw results and reproduction instructions alongside analysis, uncertainty, and limitations. Unsupported metrics remain unavailable.
6. Review every conclusion against the collected evidence. A browser timing proxy must not be labeled as direct paint, full interaction latency, or framework superiority.

The export audit checks delivered files and metadata. It cannot establish whether a performance claim is true; publication requires review of actual evidence.

## Future experiment boundaries

Keep the initial infrastructure small: metadata, a reusable document layout, and a typed publication status. Add controls, runner code, measurement records, and JSON/CSV export when Experiment 001 is implemented. Do not add a general plugin system in advance.

Future SolidJS, Svelte, or other implementations should have isolated build outputs and load only the implementation under test in a fresh runner document. Keep the same dataset, workload, styling constraints, and measurement protocol. A parent research page can describe or launch a runner, but its rendering and unrelated framework bundles must not be included in the measured workload. An iframe alone does not guarantee process isolation; compare like environments and document remaining interference.

## Accessibility and appearance

Static landmarks, headings, navigation, skip links, and prose remain usable before JavaScript loads. Theme controls enhance the reading experience and write only the Lab's `lab.theme.v1` preference. They do not read or migrate Portfolio, Toolbox, or archived-project browser data. Local Instrument Sans and IBM Plex Mono assets retain their licenses. Visible focus, responsive layout, readable contrast, and reduced-motion behavior require browser checks in addition to automated tests.

## Validation and release boundary

`npm run verify` runs the repository's formatting, lint, type, unit, production-build, and export checks. GitHub Actions executes that command on pull requests and pushes to `main`; it has no deployment job or hosting credentials.

Build verification is separate from browser verification and future live-site checks. Keep work on feature branches and use pull requests. Production deployment, hosting-resource creation, and DNS changes require explicit owner approval. See [future deployment instructions](DEPLOYMENT.md).
