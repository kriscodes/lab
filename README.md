# Labs

A little room for curiosity. Frontend experiments by Kristian Salmeron, published at [lab.kristiansalmeron.com](https://lab.kristiansalmeron.com/).

The website has a separate front page and a research section. The front page pairs oversized editorial type with an animated wire sculpture and a test-tube entry for **Lab001**. Studies explains how a question becomes an experiment. Method introduces the research principles in plain language, with technical details available in expandable sections. The research pages keep the evidence, limits, and replication instructions together.

## Current work

**Lab001 — How soon can a PDF show its first page?** compares a controlled PDF pair under a declared delivery profile. Its overview, evidence ledger, and replication guide distinguish accepted, rejected, and missed outcomes. The evidence snapshot is **November 19, 2026, 09:13 Pacific**: the campaign closed with one accepted window, one rejected attempt, and one missed slot. Only window 03 supplies timing estimates. One accepted window is insufficient for the planned comparison across runs; the earlier pilot remains separate. The frozen aggregate audit still fails on its handling of the missed slot, with a supplemental review explaining the discrepancy.

The separate **The Cost of Rendering Progress** proposal remains at `/experiments/pdf-rendering/`. It studies intermediate-frame update cadence and has no collected measurements. Lab001's loading results do not establish findings for that proposal.

## Work locally

Use Node **22.23.4**, pinned in [.node-version](.node-version), and the committed npm lockfile:

```sh
npm ci
npm run dev
```

The development server binds to `127.0.0.1`. No credentials or environment variables are required for ordinary local work. Lab uses Next.js App Router, React, and TypeScript to generate static HTML.

To validate the project and review the actual production export:

```sh
npm run verify
npm run preview
```

The preview opens at `http://127.0.0.1:4174/`. Set `LAB_PREVIEW_PORT` to use another port. It serves the files in `out/`, so rebuild and reload after changing source.

### Useful commands

| Command                | What it does                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`          | Starts the local development server with live updates.                                |
| `npm run typecheck`    | Generates Next.js route types and checks TypeScript.                                  |
| `npm test`             | Runs appearance, bubble behavior, registry, metadata, corpus, and export-audit tests. |
| `npm run build`        | Builds the static site and audits its exported routes and assets.                     |
| `npm run preview`      | Serves the actual export with working deep links and HTTP 404 responses.              |
| `npm run verify`       | Runs formatting, lint, type checks, tests, the production build, and export audit.    |
| `npm run format:check` | Checks repository formatting without modifying files.                                 |
| `npm run assets`       | Rebuilds the committed social image from its SVG source.                              |

## Find your way around

| Guide                                                                        | Start here when you want to…                                            |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [Architecture](docs/ARCHITECTURE.md)                                         | Change routes, add an experiment, or understand publication boundaries. |
| [Deployment](docs/DEPLOYMENT.md)                                             | Prepare an approved release or verify a deployed version.               |
| [Static publication decision](docs/decisions/001-static-publication.md)      | Understand why this site exports static files.                          |
| [Audience measurement decision](docs/decisions/002-audience-measurement.md)  | Understand the optional analytics dependency.                           |
| [Rendering-progress proposal](docs/decisions/003-pdf-progress-study.md)      | Read the separate, unmeasured research proposal.                        |
| [Lab001 publication decision](docs/decisions/004-pdf-loading-publication.md) | Update the dated evidence and replication instructions responsibly.     |

## Review the experience

Start at `/` for the large hero, Lab001 entry, and footer. On a short page, the footer should sit at the bottom of the viewport; on a long page it should follow the content and scroll normally. It must not cover the article. Header navigation contains Studies and Method. Footer links use Portfolio and Privacy; decorative arrow glyphs are not part of the design.

On `/experiments/`, try the Loading, Motion, Accessibility, and Efficiency topic buttons with pointer and keyboard input; they change the example question without navigating away. On `/methodology/`, read the six principles and open the native disclosures for technical details. The Studies illustration is static. These pages introduce the work without changing its research status.

For Lab001, open `/experiments/pdf-first-page/`, `/experiments/pdf-first-page/evidence/`, and `/experiments/pdf-first-page/replicate/`. Check desktop and narrow widths, both appearances, keyboard navigation, native disclosures, command copying, and downloads. Confirm that the sculpture remains still for reduced-motion preferences and stops updating while the page or artwork is hidden. Static headings, links, article text, commands, and the initial artwork must remain available without JavaScript.

For the bubbles, load `/` directly and refresh it: each new home document may play the arrival once. Navigating between pages, returning home through a link, restoring back/forward history, or loading another route must not play it. The six-bubble interaction bursts stay limited to enabled links, buttons, and disclosure summaries, with matching feedback for keyboard focus and touch presses. Reduced-motion preferences skip both bubble effects; hiding or leaving the page clears them. Verify that bubbles never block clicking, scrolling, reading, or keyboard focus. No cookie or session storage controls their playback.

## Protect the evidence

The files in `public/downloads/pdf-lab-001/` are immutable research inputs. Do not format the original manifest or regenerate the PDFs while editing the website. Integrity tests check their sizes and SHA-256 hashes, including the corpus ZIP.

Evidence links are pinned to reviewed benchmark commit `0feddfba7a62a556a25cc2ddcab324cf67892fc0`. Audit new benchmark records before changing the snapshot, then update the data, article, and date together. Never infer a completed run from a scheduled time or convert a missed outcome into a zero-duration result.

The optional audience tracker belongs to Portfolio's Studio Insights service. Audience events are separate from research measurements, and a blocked tracker must not prevent reading. The [Privacy page](https://lab.kristiansalmeron.com/privacy/) contains the participation controls. Locally served fonts, source attribution, and SIL Open Font License files are retained in [public/fonts](public/fonts/SOURCES.md).
