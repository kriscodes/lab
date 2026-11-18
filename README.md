# Engineering Lab

Research questions, methods, and findings from frontend engineering investigations by Kristian Salmeron. The site is published at [lab.kristiansalmeron.com](https://lab.kristiansalmeron.com/).

The featured **PDF loading lab (Lab 001)** presents the controlled first-page experiment from [PDF Rendering Benchmark](https://github.com/kriscodes/pdf-rendering-benchmark). Its overview, evidence ledger and replication guide distinguish accepted, rejected and pending outcomes. The current publication snapshot is dated November 18, 2026; the final campaign is not complete.

The separate **The Cost of Rendering Progress** proposal remains at `/experiments/pdf-rendering/`. It concerns intermediate-frame update cadence and has no collected measurements. Loading results do not establish findings for that proposal.

## Development

Use Node **22.23.4** from [.node-version](.node-version) and the committed npm lockfile:

```sh
npm ci
npm run dev
```

The development server binds to `127.0.0.1`. No environment variables or credentials are required. Lab uses Next.js, React, and TypeScript to export static HTML.

```sh
npm run verify
npm run preview
```

`verify` runs formatting, lint, type checks, unit tests, a production build, and an audit of the exported routes and assets. `preview` serves `out/` at `http://127.0.0.1:4174/`; set `LAB_PREVIEW_PORT` to use another port. `npm run assets` rebuilds the social image from its SVG source.

The research content remains readable without JavaScript. Theme controls store a local preference. Optional audience measurement uses Portfolio's Studio Insights service; it is separate from research data and can be disabled through the site's [privacy controls](https://lab.kristiansalmeron.com/privacy/).

## Documentation

- [Architecture and adding studies](docs/ARCHITECTURE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Static publication architecture](docs/decisions/001-static-publication.md)
- [Audience measurement boundary](docs/decisions/002-audience-measurement.md)
- [Proposed PDF progress study](docs/decisions/003-pdf-progress-study.md)
- [PDF loading publication and evidence updates](docs/decisions/004-pdf-loading-publication.md)

## Local review of Lab 001

After `npm run verify`, run `LAB_PREVIEW_PORT=4191 npm run preview` and open `http://127.0.0.1:4191/`. Review the report, `/experiments/pdf-first-page/evidence/`, and `/experiments/pdf-first-page/replicate/` at desktop and narrow widths, in both appearances. Check disclosures, keyboard navigation, command copying and downloads. The static content and original corpus remain available without JavaScript.

The original PDF files and manifest in `public/downloads/pdf-lab-001/` are immutable research inputs. Do not format the manifest or regenerate them while editing the site. The tests verify their identity. Source evidence links are pinned to a reviewed benchmark commit; update the dated publication deliberately after an independent evidence audit. See decision 004 for the boundary between independent replication and the original machine's fixed-window schedule.

Font source attribution and SIL Open Font License files are retained in [public/fonts](public/fonts/SOURCES.md).

Staging setup and promotion: [docs/STAGING.md](docs/STAGING.md) (prepared; activation pending review).
