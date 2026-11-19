# Lab staging

This document describes the separate [`render.staging.yaml`](../render.staging.yaml) configuration. The file declares `kriscodes-lab-staging` at `lab.staging.kristiansalmeron.com`, using the same static export and build inputs as production. No application API or database is needed for Lab itself.

The configuration's presence does not prove that a service, DNS record, remote branch, or deployment currently exists. Verify those states in the provider before activation or promotion. The current [production release approval](DEPLOYMENT.md) covers the approved website changes; it does not activate or redesign staging.

## Build-time settings

| Setting                 | Declared value                                       |
| ----------------------- | ---------------------------------------------------- |
| Source branch           | `staging`                                            |
| Build command           | `npm ci && npm run build`                            |
| Published directory     | `out`                                                |
| Node version            | `22.23.4`                                            |
| Automatic deployments   | After passing checks                                 |
| Collector origin        | `https://kristian-salmeron-api-staging.onrender.com` |
| Custom frontend domain  | `lab.staging.kristiansalmeron.com`                   |
| Staging response header | `X-Robots-Tag: noindex, nofollow, noarchive`         |

`NEXT_PUBLIC_ANALYTICS_ORIGIN` is applied at build time. The staging configuration currently selects the Render alias above so collector checks do not depend on custom collector DNS. Changing to `https://analytics.staging.kristiansalmeron.com` requires deliberate configuration and origin-allowlist review; it is not the value currently declared by this repository.

The production default remains `https://analytics.kristiansalmeron.com`. Canonical metadata still identifies the public website. Staging is public unless separately access-controlled; the non-indexing header is not authentication. Use synthetic data only.

## Initial activation

Importing a Blueprint creates and deploys resources. Only activate after the user reviews the plan and asks to deploy.

1. Verify the intended workspace, service names, current resources, source branch, and costs. Use the existing intended staging service if it has already been provisioned.
2. Provision or verify the Portfolio staging collector and its storage before testing analytics. Lab itself needs no database or collector credentials.
3. Create `staging` from the approved source if the branch does not exist. Review the provider's proposed Blueprint changes before applying them.
4. Configure the required build-time values and exact DNS records supplied by Render. Confirm TLS and the deployed source revision.
5. Set branch protection separately. Workflow files do not create protection rules. Review Blueprint Auto Sync behavior before enabling it or changing infrastructure configuration.

The original configuration was prepared before activation. No statement in that historical preparation establishes the current provider state.

## Review and promotion

1. Work on a descriptive feature/review branch. For an approved staging release, open a pull request to `staging` and require the existing CI checks.
2. The workflow runs on pull requests and pushes to `staging` and `main`. After activation, the staging configuration uses `autoDeployTrigger: checksPass`; wait for the actual deployment and verify its revision.
3. Review all eight content routes, a real HTTP 404, mobile layouts, theme controls, motion behavior, the normal-flow footer, and corpus downloads. Test collector events with synthetic data only when analytics is in scope.
4. Promote reviewed changes through a pull request from `staging` to `main`. Require CI again and verify that its source tree matches the reviewed candidate, apart from documented environment settings. If it differs, review the new candidate first.
5. Keep the previous successful deployment available. Recheck routes and assets after any rollback. Lab has no database to roll back; any separate collector rollback must account for that service's storage and migration compatibility.

Do not merge or change a Blueprint while work is still limited to local review. A Blueprint sync can itself change infrastructure or start a build.

## Domain and analytics checks

Use custom staging domains for end-to-end checks once they are connected. Render aliases are not automatically included in collector origin allowlists; confirm the exact Lab staging origin in the separate collector configuration.

On Render aliases, analytics cookies are host-only. Cross-site visitor continuity must be checked separately after the custom staging domains are connected. The export audit verifies local files and public canonical metadata, not collector allowlists, provider routing, DNS, TLS, or cross-domain cookies.
