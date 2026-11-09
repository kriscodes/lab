# Engineering Lab visual specification

The approved publication design is independent from Toolbox’s warmer workbench identity. Preserve its composition, typography, and color system when changing research content.

## Foundations

- Self-hosted IBM Plex Sans for interface and body copy, Source Serif 4 for large study headings and editorial text, and IBM Plex Mono for compact research labels. Font assets include their SIL Open Font Licenses.
- White `#ffffff`, ink `#172439`, secondary text `#5b6778`, cobalt `#254dcb`, and rules `#d2dae6`.
- Dark appearance: background `#10161f`, ink `#e7edf8`, secondary text `#b1bed0`, cobalt `#9bb9ff`, and rules `#394656`.
- The page has a thin cobalt top edge, compact masthead, horizontal navigation, large serif study title, open abstract, study number, and a ruled hypothesis section.
- Preserve an open reading surface. No sidebar, collection pane, dashboard cards, or permanent settings rail.
- Desktop gutters are 42px. Narrow layouts use 22px gutters and wrap navigation, with the study number hidden at the smallest width.

## Navigation and content

The masthead links to Study 001, its proposed method, and the public source repository. The footer links to Portfolio and hosts the appearance toggle. The evidence disclosure links to methodology standards. All public content has real routes and works before hydration.

The experiment index remains at `/experiments/`. Study 001 is available at `/experiments/pdf-rendering/`. Editorial content is separate from the approved layout in `src/experiments/pdf-rendering/copy.ts` and `protocol.tsx`.

## Appearance and accessibility

Appearance changes write only `lab.theme.v1`; no other site’s saved data is read or migrated. A saved preference is applied before hydration. Content and navigation remain usable without JavaScript, and storage failures preserve a working visit-only control.

Use semantic landmarks and headings, keyboard focus, a skip link, readable contrast, and native interactive controls. The production page does not include the conversation preview’s palette or typography controls.
