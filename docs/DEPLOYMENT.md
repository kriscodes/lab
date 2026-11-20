# Deployment

Lab deploys as a Render Static Site at `https://lab.kristiansalmeron.com/`. The artifact is `out/`; no request-time Node server or Lab database is required. The optional audience tracker uses the separately deployed Portfolio analytics service.

## Build and preview

Use Node **22.23.4**, as pinned in `.node-version`:

```sh
npm ci
npm run verify
npm run preview
```

The export audit checks the eight content routes, canonical and social metadata, sitemap, robots file, local resources, and custom 404. Preview serves the actual export at `http://127.0.0.1:4174/`. Check direct nested-route loads, keyboard navigation, theme persistence, blocked storage, reduced motion, and a narrow viewport. On the home, check the Lab001 entry and the footer at the bottom of a short viewport. On longer research pages, confirm that the footer follows the content and never overlays it. Check all four Studies topic buttons with keyboard and pointer input, including their selected state and question announcement. Confirm that Method disclosures expose the full standards without JavaScript. Inspect both pages in light and dark appearances and at narrow widths.

### Bubble release checks

1. Open `/` as a new document and refresh it. Each load should emit 14 arrival bubbles at seven per second, decelerate them to rest by 2.9 seconds, and begin their shared pop at three seconds.
2. Navigate between pages and back to home with site links. Use browser back and forward, including a restored history entry. No arrival should replay. A direct document load of Studies, Method, or a research page must also skip it.
3. Hover enabled links, buttons, and disclosure summaries. Each burst creates six bubbles near the pointer, moves for two seconds, and pops over 190 milliseconds. Moving within one interactive item must not create repeated entry bursts. Check matching feedback from keyboard-visible focus and touch presses without interrupting the native interaction.
4. Check light and dark appearance, narrow viewports, and resized windows. Arrival bubbles should reflect within the viewport; interaction bursts may be clipped at its edge. The layer must never block interaction, intercept focus, or change document layout.
5. Enable reduced motion before loading and while an effect is active. Both effects must be skipped or cleared. Hide or leave the page during an effect and confirm that pending bubbles are cleared rather than resumed.
6. Confirm that the arrival policy writes no cookies or session storage, and that all existing navigation, content, disclosures, downloads, and appearance controls still work.

## Render configuration

[`render.yaml`](../render.yaml) manages the existing `kriscodes-lab` Static Site with these build settings:

| Setting             | Value                                                |
| ------------------- | ---------------------------------------------------- |
| Repository          | `kriscodes/lab`                                      |
| Branch              | `main`                                               |
| Root directory      | Repository root                                      |
| Build command       | `npm ci && npm run build`                            |
| Publish directory   | `out`                                                |
| Node version        | `22.23.4`                                            |
| `SKIP_INSTALL_DEPS` | `true` when using the explicit install command above |
| Runtime secrets     | None                                                 |
| Start command       | None                                                 |

GitHub Actions runs `npm run verify` on every pull request and push to `main` or `staging`, with a manual run option. CI covers formatting, lint, types, tests, production build, and the export audit. For an approved release, use a regular feature branch, push the reviewed commits, open or update the pull request, wait for CI, then merge into `main`. Render automatically deploys matching changes only after that commit's checks pass (`autoDeployTrigger: checksPass`). A failure or zero detected checks blocks automatic deployment. Do not add workflow path filters that skip checks on deployable commits.

The build filter includes application source, public assets, scripts, dependency files, and runtime/build configuration. Documentation-only changes run CI without deploying the site. Update the filter when introducing new build inputs.

The production configuration tracks `main`. Confirm the provider’s current Blueprint Auto Sync setting before an infrastructure change; the source file does not establish that setting. Adopt the existing service when connecting the Blueprint; do not create a duplicate. The `sync: false` entries preserve environment values already configured on the adopted service. For a new installation, supply the Node version above, `SKIP_INSTALL_DEPS=true`, and `NEXT_TELEMETRY_DISABLED=1`.

Blueprint configuration syncs and manual deploys are separate from commit-triggered deployments. Review configuration changes and merge only after PR checks pass. Manual releases are for recovery after verifying the selected commit's checks. After deploying a specific commit, restore **After CI Checks Pass** if Render disabled auto-deploy. Routine releases do not use deploy hooks.

Serve the exported directory routes directly. Do not add a catch-all rewrite to `/index.html`: unknown paths must return `404.html` with HTTP 404. Required content routes are `/`, `/experiments/`, `/experiments/pdf-rendering/`, `/experiments/pdf-first-page/`, `/experiments/pdf-first-page/evidence/`, `/experiments/pdf-first-page/replicate/`, `/methodology/`, and `/privacy/`.

For domain setup or recovery, attach `lab.kristiansalmeron.com` to the Static Site and use the exact CNAME target supplied by Render. Verify domain ownership and TLS before serving traffic. Routine releases do not require DNS changes.

## Release checks and recovery

After deployment, check each route over HTTPS, refresh nested routes, confirm an unknown URL returns HTTP 404, and inspect canonical URLs, social image, sitemap, fonts, and scripts. Verify that the loading lab retains its dated in-progress snapshot, rejected/pending outcomes and replication boundaries. The separate rendering-progress study must remain an unmeasured proposal. Download the original corpus ZIP and verify its checksum; no planned values may appear as results.

When changing the tracker integration, deploy its compatible Portfolio collector first. Check opt-out, Global Privacy Control, Do Not Track, and blocked storage across the real subdomains; localhost cannot verify shared-domain cookie behavior. The research pages must still work when analytics is blocked.

If a release fails, restore the last known-good Render deployment or redeploy its source commit. Recheck routes and assets after recovery.

## Environments

| Service               | Branch    | Render URL                                 |
| --------------------- | --------- | ------------------------------------------ |
| kriscodes-lab-staging | `staging` | https://kriscodes-lab-staging.onrender.com |
| kriscodes-lab         | `main`    | https://kriscodes-lab.onrender.com         |

Production and staging use separate services. Keep staging credentials and data isolated. Run CI on each release candidate, verify the deployed source revision and health endpoints, and retain the previous working deployment for recovery. Documentation-only commits can be excluded by build filters; deploy the checked revision manually when a rebuild is required.
