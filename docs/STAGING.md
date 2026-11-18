# Lab staging

Import the separate [`render.staging.yaml`](../render.staging.yaml) only after review, in the `kristiansalmeron.com` workspace. It creates `kriscodes-lab-staging` for `lab.staging.kristiansalmeron.com`, with the same static export/build inputs as production. No API or database is needed for the Lab itself.

`NEXT_PUBLIC_ANALYTICS_ORIGIN` selects `https://analytics.staging.kristiansalmeron.com` at build time. Provision the Portfolio staging API/database first. The production default remains unchanged. Render adds `X-Robots-Tag` to every staging response; canonical metadata still points to the public site. Check all five content routes, a true 404, mobile layout, and synthetic collector events after deployment.

## Promotion workflow

1. Work on a feature/review branch. Open a pull request to `staging` and require the repository's existing CI checks. CI runs on pull requests and pushes to both `staging` and `main`.
2. After initial activation, staging services follow `staging` with `autoDeployTrigger: checksPass`. Wait for the actual deployed revision, then verify the UI, API health, error/denial behavior, and relevant persistence using synthetic data.
3. Promote the reviewed changes through a `staging` → `main` pull request. Require CI again and verify its source tree matches the version reviewed in staging, apart from documented environment settings. If it differs, test that candidate in staging first.
4. Production remains a deliberate promotion to its configured production branch. Do not merge or change a Blueprint while review-only work is pending: Blueprint sync can itself change infrastructure or trigger a build.
5. Retain the previous successful deployment. Roll back application code only after checking database compatibility; application rollback does not roll back database contents. Rehearse restore/migration work on an isolated copy with synthetic fixtures.

## Initial activation — still pending

These commits prepare configuration; no resource, DNS record, remote branch, provider setting, or deployment was changed. Creating a Render service triggers its first deployment even when automatic deployments are off. Activate only after the user reviews the result and asks to deploy.

At activation, create `staging` from the approved source, review the provider's Blueprint plan, confirm workspace/resource names and costs, configure stage-only secrets, and install the exact DNS records Render provides. Set up branch protection separately; workflow files do not create branch protection. Keep Blueprint Auto Sync off during initial wiring and review future configuration syncs explicitly.

Use the custom staging domains for end-to-end checks. `onrender.com` aliases are not automatically included in browser origin allowlists. Staging is public unless separately access-controlled; `X-Robots-Tag: noindex, nofollow, noarchive` discourages indexing but is not authentication. Use synthetic data only.

## Initial Render URL checks

The staging collector uses `https://kristian-salmeron-api-staging.onrender.com` so smoke checks do not depend on custom DNS. Only the three explicitly named staging frontend aliases are accepted. On Render aliases, analytics cookies remain host-only; cross-site visitor continuity is checked after custom staging domains are connected.
