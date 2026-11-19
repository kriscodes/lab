# PDF loading publication review

Historical local review recorded on November 18, 2026. Branch at review: `feat/pdf-loading-lab`. Base: `cc7f7c4`. The verification below describes that review session; no deployment or remote branch push occurred during it.

The Lab001 report was published afterward. Later work on `feat/labs-front-page` gives `/` a separate cover, revises the shared footer/navigation, and introduces the approved Studies and Method designs. See the [follow-up record](studies-and-method.md) for that scope. These screenshots and results remain evidence of the earlier report review, not a claim that they show the latest homepage or that later changes have been deployed.

## Implemented

- Editorial overview at `/` and `/experiments/pdf-first-page/`.
- Evidence ledger at `/experiments/pdf-first-page/evidence/`, with rejected and pending windows, diagnostic history, pinned audit links and limitations.
- Replication guide at `/experiments/pdf-first-page/replicate/`, with original corpus downloads, checksums, setup, baseline, controlled-delivery and independent-audit commands, expected outputs and troubleshooting.
- Existing rendering-progress proposal preserved and linked separately. Navigation, study metadata, sitemap and static export checks include the new pages.

## Verification

`npm run verify` passed: formatting, zero-warning lint, TypeScript checks, all 15 tests, production build, and the export audit for eight content routes. Local validation used Node 24.22.1, which satisfies the package engine; the repository and hosted CI still declare Node 22.23.4. Hosted CI had not run for the branch at the time of this local review. A final CSS-only mobile command-wrap change was checked with Prettier and a successful production build/export audit afterward.

Corpus tests check the two PDF sizes/hashes against the preserved manifest and the ZIP checksum. The actual ZIP downloaded through the browser matched SHA-256 `c0cd7cbcbf68a40e6abd6e7ed08bccabf172bdc80be693fe8df057c0bd63995a`; its exact inventory and both PDF hashes passed independent checks.

All five command blocks extracted from the production HTML passed `bash -n`. A shell fixture replaced the build and measurement executables: a simulated calibration exit 7 stopped the command chain before measurement or output-directory creation. No PDF measurement was launched for website validation. Replication commands were reviewed against the pinned runner protocols, not executed as a fresh browser experiment. The explicit audit path avoids the documented legacy shared-temp default.

Browser review covered desktop at the natural 967 px viewport and narrow layouts at 390 and 320 px. No page-level horizontal overflow remained after fixing a missing word separator in the mobile heading. Command text wraps at narrow widths without changing copied source text. The evidence table becomes labeled stacked records. Section links and checksum disclosures work; the skip link moves focus to `main`. Dark appearance survives reload and was restored to light for handoff. The inspected page reported no browser errors or warnings.

The command-copy action displayed success. The browser automation's separate clipboard reader returned an empty value, so OS clipboard content was not independently verified. The complete command remains selectable and the component provides an error fallback. Exported article text, commands and native disclosures were inspected in static HTML; a separate JavaScript-disabled browser session was not tested.

## Screenshots

- [Overview, desktop](overview-desktop.jpg)
- [Evidence, desktop](evidence-desktop.jpg)
- [Evidence, mobile](evidence-mobile.jpg)
- [Replication commands, mobile](replication-mobile.jpg)

## Preserved boundaries

At the time of this review, the benchmark repository was clean at `1d2ba55` on `feat/corpus-text-pair`. Its PDFs, sources, schedule and recorded outcomes were not edited. The website is a dated publication snapshot, not a live status feed or a visitor benchmark. Final-campaign updates still require audited evidence and a deliberate publication update. Full raw archives remain linked through Notion, with an access notice; public audit exports are linked separately.

This review used a local production preview at `http://127.0.0.1:4191/`; an old preview address does not guarantee a running process. To restart it from this checkout, use the supported Node runtime, run `npm run build`, then `LAB_PREVIEW_PORT=4191 npm run preview`.
