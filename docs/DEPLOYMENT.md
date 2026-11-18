# Deployment

Lab deploys as a Render Static Site at `https://lab.kristiansalmeron.com/`. The artifact is `out/`; no request-time Node server or Lab database is required. The optional audience tracker uses the separately deployed Portfolio analytics service.

## Build and preview

Use Node **22.23.4**, as pinned in `.node-version`:

```sh
npm ci
npm run verify
npm run preview
```

The export audit checks the five content routes, canonical and social metadata, sitemap, robots file, local resources, and custom 404. Preview serves the actual export at `http://127.0.0.1:4174/`. Check direct nested-route loads, keyboard navigation, theme persistence, blocked storage, reduced motion, and a narrow viewport.

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

GitHub Actions runs `npm run verify` on every pull request and push to `main` or `staging`, with a manual run option. CI covers formatting, lint, types, tests, production build, and the export audit. Use a regular feature branch, open a pull request, wait for CI, then merge into `main`. Render automatically deploys matching changes only after that commit's checks pass (`autoDeployTrigger: checksPass`). A failure or zero detected checks blocks automatic deployment. Do not add workflow path filters that skip checks on deployable commits.

The build filter includes application source, public assets, scripts, dependency files, and runtime/build configuration. Documentation-only changes run CI without deploying the site. Update the filter when introducing new build inputs.

The Blueprint tracks `main` with Auto Sync enabled. Adopt the existing service when connecting the Blueprint; do not create a duplicate. The `sync: false` entries preserve environment values already configured on the adopted service. For a new installation, supply the Node version above, `SKIP_INSTALL_DEPS=true`, and `NEXT_TELEMETRY_DISABLED=1`.

Blueprint configuration syncs and manual deploys are separate from commit-triggered deployments. Review configuration changes and merge only after PR checks pass. Manual releases are for recovery after verifying the selected commit's checks. After deploying a specific commit, restore **After CI Checks Pass** if Render disabled auto-deploy. Routine releases do not use deploy hooks.

Serve the exported directory routes directly. Do not add a catch-all rewrite to `/index.html`: unknown paths must return `404.html` with HTTP 404. Required content routes are `/`, `/experiments/`, `/experiments/pdf-rendering/`, `/methodology/`, and `/privacy/`.

For domain setup or recovery, attach `lab.kristiansalmeron.com` to the Static Site and use the exact CNAME target supplied by Render. Verify domain ownership and TLS before serving traffic. Routine releases do not require DNS changes.

## Release checks and recovery

After deployment, check each route over HTTPS, refresh nested routes, confirm an unknown URL returns HTTP 404, and inspect canonical URLs, social image, sitemap, fonts, and scripts. Verify that the current study is still labeled as a proposal and that no planned values appear as results.

When changing the tracker integration, deploy its compatible Portfolio collector first. Check opt-out, Global Privacy Control, Do Not Track, and blocked storage across the real subdomains; localhost cannot verify shared-domain cookie behavior. The research pages must still work when analytics is blocked.

If a release fails, restore the last known-good Render deployment or redeploy its source commit. Recheck routes and assets after recovery.
