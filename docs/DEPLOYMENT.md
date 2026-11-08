# Future deployment

This repository is prepared for static hosting. No Render service, production deployment, custom-domain association, or DNS change is created by the foundation or its CI workflow. The intended canonical origin is `https://lab.kristiansalmeron.com`; its presence in metadata is not evidence of a live deployment.

## Verify before release

Use Node **22.23.4**, recorded in `.node-version`, and the committed npm lockfile:

```sh
npm ci
npm run verify
```

The build creates `out/`. Its audit checks the expected content routes, not-found page, canonical/social metadata, sitemap, crawler instructions, and local resources. Review the built application in a local static preview as well: direct nested-route refreshes, keyboard navigation, theme persistence, storage unavailable, reduced motion, narrow layouts, and an unknown URL. Development mode alone is not a production-export check.

Experiment 001 is a protocol at this stage. The release must not describe it as a completed benchmark or present planned parameters as measurements. Publication of findings requires the evidence checks in [Architecture](ARCHITECTURE.md).

## Render settings after owner approval

The appropriate future service is a **Static Site**, following [Render's Next.js static-export instructions](https://render.com/docs/deploy-nextjs-app). Creating that service starts an initial deployment, so service creation itself belongs to the approved release step.

| Setting             | Value                                                    |
| ------------------- | -------------------------------------------------------- |
| Repository          | `kriscodes/lab`                                          |
| Root directory      | Repository root                                          |
| Release branch      | Reviewed `main` or an explicitly approved release branch |
| Build command       | `npm ci && npm run build`                                |
| Publish directory   | `out`                                                    |
| Node version        | `22.23.4`                                                |
| `SKIP_INSTALL_DEPS` | `true` when using the explicit install command above     |
| Runtime secrets     | None required                                            |
| Start command       | None; serve static output                                |

Keep automatic production deployment disabled unless the owner separately approves it. A future automatic deployment integration can make merging or pushing to its configured branch a production release. The GitHub checks in this repository do not deploy anything.

Render supports static hosting and documents [dependency installation and deployment behavior](https://render.com/docs/static-sites). No database, worker, private service, provider API key, or always-on Node process is needed for this version. Review current account allowances before creating resources rather than treating static hosting as a promise of no account charges.

## Route delivery

`trailingSlash: true` exports nested content into directories containing `index.html`. Serve those files directly. Do not add a catch-all `/* → /index.html` rewrite: that would turn missing pages into the homepage and interfere with direct-route and HTTP 404 checks. Render's [redirect/rewrite documentation](https://render.com/docs/redirects-rewrites) distinguishes these rules from serving real static resources.

Required public routes:

- `/`
- `/experiments/`
- `/experiments/data-grid-rendering/`
- `/methodology/`

The export also includes `404.html`, `sitemap.xml`, `robots.txt`, the social preview, fonts, and Next.js assets. A deployment must return the not-found document with HTTP 404 for an unknown URL; a 200 response containing not-found text is insufficient.

## Custom domain and HTTPS

After a release and domain change are approved, associate `lab.kristiansalmeron.com` with the selected static site. Use the exact DNS target returned by Render at that time; this document deliberately does not invent a provider hostname or DNS record value. Change only the approved Lab record. Preserve Portfolio, Toolbox, analytics, mail records, and unrelated subdomains.

Verify domain ownership and the managed HTTPS certificate before announcing the URL. Do not treat an accepted DNS change or queued deployment as completion.

## Live checks and recovery

After an approved deployment is live:

1. Load every public route directly and refresh each nested route.
2. Check canonical URLs, page titles, social preview, sitemap, robots, and local font/assets over HTTPS.
3. Confirm an unknown URL returns HTTP 404 and provides working recovery links.
4. Exercise keyboard navigation and appearance controls on desktop and a narrow viewport; verify content with JavaScript unavailable.
5. Confirm Experiment 001 still communicates its actual publication state and that no uncollected values appear as results.
6. Record the exact source commit, deployment identifier, URL, and verification limits in the release record.

Retain the last known-good source commit. If a release fails, select a known-good deploy or redeploy that reviewed commit using the hosting provider's release controls. Recheck routes and assets after recovery. Rollback changes production and requires the same release authority; it does not require touching DNS or another application.
