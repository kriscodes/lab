# Labs front page: design and readability review

Reviewed November 18, 2026, on `feat/labs-front-page`. These refinements are local commits. This review did not push, merge, or deploy the website.

## Design

The large “Let’s try something.” hero and animated wire sculpture are retained. Lab001 uses a blue test-tube illustration in a full-width editorial row.

The footer closes with “Stay curious.” and the Portfolio, Privacy, and appearance controls. The flex page shell puts it at the bottom of short pages; it stays in normal document flow after longer articles. The header Source link and decorative link arrows are removed. Mobile navigation now aligns its two links together.

## Readability and documentation

Ambiguous local names in components, animation geometry, route content, shared helpers, preview/build scripts, and tests have descriptive replacements. Hand-maintained source files and named functions have short responsibility comments. Platform contracts, public URLs, storage keys, and immutable research inputs are preserved.

The README, architecture, staging, deployment, decision records, and historical review notes have been reconciled with the current source and release boundary. [Code guide](../../CODE_GUIDE.md) maps all 37 TypeScript/TSX, script, and test files, plus styles and root configuration.

## Verification

- `npm run verify` passed on the declared Node 22.23.4 runtime: formatting, zero-warning lint, TypeScript, all 15 tests, and the production build/export audit.
- The final mobile navigation spacing adjustment was followed by another successful production build and export audit: eight content routes, the custom 404, and 17 referenced local assets.
- Desktop, 390 px, and 320 px widths were inspected. No horizontal overflow was observed. The footer was at the bottom of the short desktop home and below the fold on the long Lab001 report.
- Manual pause/play behavior and the dark/light appearance control worked. Dark appearance and footer wrapping were inspected at 320 px. Captured browser logs contained no warnings or errors.
- An independent review found identical coil paths and opacity at seven sampled animation times after the descriptive-name refactor.
- Documentation file coverage, local Markdown links, formatting, and diff whitespace checks passed.

No new measurements were started. The published evidence snapshot and downloaded PDF corpus remain unchanged. This review did not repeat all historical replication, clipboard, or JavaScript-disabled checks.

## Notion

The existing Labs home now uses the same headline, a static version of the wire sculpture, and sparse navigation. A dedicated Lab001 landing page contains the original research notebook and its 12 supporting pages. The previous Labs introduction is preserved as a dated archive inside that notebook. Website notes distinguish the local review from the previously published report.

The organization is Labs, then Lab001, then the research notebook and its supporting records. Website maintenance notes remain beside Lab001 under Labs. No research records were deleted.

## Screenshots

- [Desktop home](labs-home-desktop.jpg)
- [Mobile footer](labs-footer-mobile.jpg)
