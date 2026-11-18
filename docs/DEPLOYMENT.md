# Deployment

Lab deploys as a Render Static Site at `https://lab.kristiansalmeron.com/`. The artifact is `out/`; no request-time Node server or Lab database is required. The optional audience tracker uses the separately deployed Portfolio analytics service.

## Current review boundary

The current design work is on `feat/labs-front-page`. Local edits and focused local commits are authorized. Pushing, merging, and deploying require explicit approval for this review. The existing pull request does not change that boundary. Keep the branch name descriptive; do not create a `codex/` branch.

The dedicated home and current footer/navigation refinements may be present in this checkout before they appear on the public website. A local build, passing tests, a commit, or an open pull request is not evidence of a production release.

## Build and preview

Use Node **22.23.4**, as pinned in `.node-version`:

```sh
npm ci
npm run verify
npm run preview
```

The export audit checks the eight content routes, canonical and social metadata, sitemap, robots file, local resources, and custom 404. Preview serves the actual export at `http://127.0.0.1:4174/`. Check direct nested-route loads, keyboard navigation, theme persistence, blocked storage, reduced motion, and a narrow viewport. On the home, check the Lab001 entry and the footer at the bottom of a short viewport. On longer research pages, confirm that the footer follows the content and never overlays it.

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
