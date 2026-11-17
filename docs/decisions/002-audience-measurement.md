# 002: Keep audience measurement separate from research

Status: Accepted

## Context

Portfolio, Lab, and Toolbox use a common first-party analytics service. Lab must distinguish readership from experimental measurements and remain useful if the service is unavailable.

## Decision

Load the Portfolio-owned tracker from `analytics.kristiansalmeron.com` after hydration with the fixed site marker `lab`. Portfolio owns event validation, collection, authentication, PostgreSQL storage, retention, and reporting. Lab supplies the script integration, origin-only links between the three sites, and a privacy notice with opt-out controls.

Approved reading routes are the homepage, experiment index, PDF proposal, and methodology. `/privacy` is excluded from pageview collection. Opening a protocol is reading activity, not a benchmark run. No PDF performance data is collected by this tracker.

## Consequences

Lab needs no backend or analytics credentials. Tracker releases are an external dependency and require compatibility checks against Portfolio. Blocked scripts, storage restrictions, and interrupted visits can reduce observations. Opt-out and browser privacy signals take precedence over collection; the reading experience must continue without the tracker.

The [public privacy notice](../../src/app/privacy/page.tsx) describes collection, identifiers, storage, and controls. The implementation lives in the [Portfolio repository](https://github.com/kriscodes/portfolio).
