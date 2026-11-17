# Engineering Lab

Research questions, methods, and findings from frontend engineering investigations by Kristian Salmeron. The site is published at [lab.kristiansalmeron.com](https://lab.kristiansalmeron.com/).

The current study, **The Cost of Rendering Progress**, proposes measuring the cost of intermediate PDF rendering updates. It has no runner, collected measurements, or published findings. The separate [PDF Rendering Benchmark](https://github.com/kriscodes/pdf-rendering-benchmark) repository contains related infrastructure; work there does not establish results for this study.

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

Font source attribution and SIL Open Font License files are retained in [public/fonts](public/fonts/SOURCES.md).
