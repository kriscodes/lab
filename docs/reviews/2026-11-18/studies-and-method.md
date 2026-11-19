# Studies and Method: approved design

Recorded November 18, 2026, on `feat/labs-front-page`. The user approved implementation, pushing, and deployment of the reviewed Studies design and friendlier Method page, together with the earlier home refinements. This record describes that approved scope; approval alone does not establish a completed deployment.

## Studies

The Studies page at `/experiments/` answers how questions are chosen. The headline is “What if it felt better?” beside a static orbit-and-question illustration. Loading, Motion, Accessibility, and Efficiency are selectable prompts that change the example question on the page.

“Follow the hmm.” introduces the process in three steps. Links to Lab001 and the rendering-progress proposal remain available after that introduction. The page explains the intention behind the work without treating a proposed or incomplete study as a published finding.

`ExperimentsPage`, `StudySymbol`, and `StudyTopics` own the composition, reusable topic symbols, and optional topic interaction. The route's CSS module keeps its layout separate from the research articles. The buttons use native semantics, expose selection, and announce the question through a polite live region.

## Method

The Method page at `/methodology/` opens with “Curious by nature. Careful by design.” Six short principles explain the care behind the work: ask a useful question, make the comparison fair, understand the measurement, retain the whole record, state the limits, and make the work repeatable.

Each principle retains its technical standard inside a native disclosure. The editorial grid uses two columns on larger screens and one on small screens. The full requirements remain available in static HTML and without JavaScript. The closing link returns to Studies.

## Release boundary

The approved release also includes the separate Labs cover, test-tube Lab001 row, normal-flow “Stay curious.” footer, simplified navigation, descriptive names, and expanded documentation. The established home sculpture remains. Decorative link arrows stay removed.

New bubble motion, page transitions, and hover-animation concepts are design-only and excluded from production. They are not required to ship the approved pages. The release does not alter the Lab001 snapshot, corpus, rejected or pending outcomes, benchmark source revision, or the unmeasured rendering-progress proposal.

The [front-page review](labs-front-page.md) and [original publication review](README.md) preserve the earlier checks and screenshots. Their results are not a substitute for validating the new candidate.

## Verification and publication

Use [Deployment](../../DEPLOYMENT.md) for release checks. Verify the eight exported routes, Studies selection with keyboard and pointer input, Method disclosures, both appearances, narrow layouts, footer flow, and the existing home motion preference. New animation concepts must remain outside the production source.

Local verification passed for source revision `22a66d2` on Node 22.23.4: formatting, zero-warning lint, TypeScript, all 15 tests, production build, and the export audit covering eight content routes, the custom 404, and 20 referenced assets. Browser checks covered desktop and 320 px layouts, light and dark appearance, Studies questions through pointer and keyboard input, and Method disclosures. Both pages fit the narrow viewport without horizontal overflow. All six original technical standards remain intact.

The separate animation preview demonstrates a short bubble arrival, a 240 ms page change, and hover feedback. Its reduced-motion control removes the bubbles and changes pages immediately. The preview is outside the website repository and is not part of this release.

Provider deployment must be verified separately. A passing local build does not establish what the public domain currently serves. Keep the Lab001 evidence date at **November 18, 2026, 09:06 Pacific** unless separately audited research is approved for publication.
