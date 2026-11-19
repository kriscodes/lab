# PDF loading lab publication

Date: November 18, 2026. Status: accepted; the Lab001 report is published. The later dedicated Labs front page, footer, Studies, and Method refinements have separate release approval. Their deployment must be verified independently; they do not change the evidence snapshot documented here.

Publish Lab 001 as an editorial report with two deeper reading paths: the evidence ledger and a replication guide. The report answers what was tested and what the current evidence permits; the ledger retains rejected and pending outcomes; the guide provides the unchanged original PDFs and commands for a separate local attempt.

Routes: `/experiments/pdf-first-page/`, `/experiments/pdf-first-page/evidence/`, and `/experiments/pdf-first-page/replicate/`. The dedicated homepage in the current source links to the loading report as Lab001. At the start of this design review, the public homepage still rendered the report directly. The study index and site navigation keep the older `/experiments/pdf-rendering/` proposal discoverable. That proposal concerns intermediate-frame update cadence and remains unmeasured. Its registry ID is retained; publication labels distinguish it from the benchmark notebook's Lab 001 designation.

Content is a dated snapshot of benchmark revision `1d2ba55efa2af1203202315d2f739e9cbe3401e1`, not a live status feed. One final-campaign attempt was rejected and two were pending at the snapshot. A valid observer workload is not an accepted performance result. The 5.105 ms clock boundary is not a PDF render time. No speed chart or generalized performance claim is justified by this record.

The original PDF pair and manifest are copied byte-for-byte into `public/downloads/pdf-lab-001/`. A ZIP bundles those same three files. Tests check PDF sizes and SHA-256 against both the published metadata and original manifest. The generator's manifest remains unchanged and still identifies its smoke-test purpose; all-page equivalence is established separately by the linked verification record.

Replication starts in a new checkout, installs the pinned workspace, downloads the corpus, verifies it, and runs the existing first-page baseline or controlled-delivery runner. It does not replay expired calendar slots, copy another machine's absolute runtime paths, overwrite the active measurement checkout, or promise identical timings across systems. The audit command uses a fresh private directory and an explicit audit destination to avoid the legacy shared-temp default.

Use native HTML links, details and semantic tables. Main research content must remain usable without JavaScript. Command-copy buttons are progressive enhancement, with visible fallback text. Narrow layouts use stacked run records with repeated labels. No new analytics, accounts, uploads, browser benchmarks, dependency upgrades or hosting changes belong to this publication work.

Before updating the snapshot, independently audit the new benchmark evidence, update the typed publication data and editorial conclusions together, keep historical records, and rerun asset integrity and export checks. Pending outcomes must never turn into zero-duration samples.
