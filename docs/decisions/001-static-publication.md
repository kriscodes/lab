# 001: Publish static research pages

Status: Accepted

## Context

The initial application publishes research questions and methods. It does not need request-time rendering, accounts, or a data service. Performance experiments will need tighter workload boundaries than an article page can provide.

## Decision

Export the Next.js application to static files. Keep the experiment registry typed and explicit, with each study's content in its own source directory. Use `proposal`, `protocol`, and `published` states to separate planned work from evidence-backed findings.

Build future runners separately from the publication shell. Keep a single implementation active in each measured workload and document its isolation limits.

## Consequences

The site can be served from a CDN and remains readable before JavaScript loads. Content changes require a build. Features needing a server require a separate design decision. A static export audit verifies delivery, while publishing findings also requires raw evidence and reproducible methods.
