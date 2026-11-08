# Portfolio, Toolbox, and Lab visual specification

This is a lightweight shared specification, not a shared runtime package. Each application owns its styles and release lifecycle. Lab follows the approved light-first direction from Toolbox while using a research-document layout. This repository does not restyle or deploy Portfolio or Toolbox.

## Foundations

- Self-hosted Instrument Sans for headings, content, and controls; IBM Plex Mono for small technical labels. Include the font licenses with the assets.
- Light appearance by default, with an explicit dark-appearance toggle. Store only the local site's appearance preference; do not couple storage across subdomains.
- Light palette: white `#ffffff`, graphite `#22262b`, secondary text `#626971`, blue-gray accent `#526b7b`, divider `#dfe3e6`.
- Dark palette: background `#101113`, text `#eeeef0`, secondary text `#adb1b8`, accent `#b0bec8`, divider `#353b42`.
- Spacing follows 4, 8, 12, 16, 24, 32, 48, and 64px, with composition-specific spacing where useful.
- Content is constrained to 1280px including desktop gutters. Reading columns remain narrower; future utility workspaces can use the full content width.

## Composition and navigation

Portfolio remains editorial and personal. Toolbox emphasizes practical tasks and concise inputs/outputs. Lab emphasizes research questions, methodology, evidence, and limitations. Use the same typography, accent restraint, and navigation language without copying every layout.

Lab links to Portfolio, Toolbox, and its own public GitHub repository. Its internal navigation exposes the experiment index and methodology in one click. Add links to Lab on the other sites only when it has an approved published destination; those sites remain independently managed.

The Lab's pages are statically exported HTML with progressive appearance controls. Show only meaningful investigations and their actual stage. Experiment 001 is a research protocol; do not introduce empty categories, placeholder experiments, disabled benchmark controls, or fabricated results.

## Interaction and accessibility

- Semantic landmarks, a skip link, clear heading hierarchy, and visible focus indicators.
- Native links and buttons with names that remain clear without icons.
- Minimum 44px touch targets on coarse pointers; preserve keyboard navigation and 200% zoom usability.
- Short color/background transitions only when reduced motion is not requested.
- Theme controls are optional enhancement: content and navigation remain usable without JavaScript or storage.
- Lab theme changes write only `lab.theme.v1`. Appearance preferences stay local to each site's origin; there is no shared storage or synchronization service.

## Public metadata

Keep a meaningful title, description, canonical URL, social preview, sitemap, and crawler file. Only actual public content routes belong in the sitemap. Protocol metadata must not imply that measured findings already exist.
