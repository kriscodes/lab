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

Configure the existing Static Site with these build settings:

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

GitHub Actions verifies source but does not deploy it. Automatic deployment is configured in Render, outside this repository; inspect that setting before merging or starting a release. Match the deployment to the intended source commit.

Serve the exported directory routes directly. Do not add a catch-all rewrite to `/index.html`: unknown paths must return `404.html` with HTTP 404. Required content routes are `/`, `/experiments/`, `/experiments/pdf-rendering/`, `/methodology/`, and `/privacy/`.

For domain setup or recovery, attach `lab.kristiansalmeron.com` to the Static Site and use the exact CNAME target supplied by Render. Verify domain ownership and TLS before serving traffic. Routine releases do not require DNS changes.

## Release checks and recovery

After deployment, check each route over HTTPS, refresh nested routes, confirm an unknown URL returns HTTP 404, and inspect canonical URLs, social image, sitemap, fonts, and scripts. Verify that the current study is still labeled as a proposal and that no planned values appear as results.

When changing the tracker integration, deploy its compatible Portfolio collector first. Check opt-out, Global Privacy Control, Do Not Track, and blocked storage across the real subdomains; localhost cannot verify shared-domain cookie behavior. The research pages must still work when analytics is blocked.

If a release fails, restore the last known-good Render deployment or redeploy its source commit. Recheck routes and assets after recovery.
