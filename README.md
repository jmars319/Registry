# tenra Registry

tenra Registry is the suite coordination layer for tenra handoffs, app capabilities, contracts, and local integration visibility. It gives the ecosystem a controlled place to describe what each app can do, how handoffs are shaped, and how suite-level flows should be verified.

Registry is infrastructure for the tenra ecosystem. It is not a generic app store or marketing catalog.

## Operational Purpose

- Define and validate cross-app handoff contracts.
- Track suite capabilities and module boundaries.
- Provide operator-facing visibility into integration flows.
- Keep contract changes, fixtures, and compatibility notes in one repo.

## Design Posture

- Explicit contracts over implicit integration behavior.
- Local verification before broader suite automation.
- Shared domain packages for handoff vocabulary.
- Desktop/web/mobile shells exist to support suite visibility, not to blur app ownership.
- Contract fixtures and negative tests are part of the system.

## Architecture

```text
apps/
  webapp/       Next.js registry and integration surface
  desktopapp/   Electron desktop launcher for the local web app
  mobileapp/    Expo scaffold for later suite visibility

packages/
  domain/       Handoff, module, and capability models
  api-contracts/ Shared request and response contracts
  validation/   Runtime schemas
  auth/         Local/session placeholders
  ui/           Shared interface primitives
  config/       Product identity and environment helpers

docs/           Contract changelog, handoff standards, fixtures, and suite docs
```

## Current State

- The repo contains the most complete tenra suite handoff documentation.
- Contract generation and replay verification scripts are present.
- The web app is the primary product surface.
- The desktop app wraps the registry surface for local operator access.
- Mobile remains a scaffold for future suite review.

## Deployment Posture

Registry is currently a local/development coordination system for the tenra ecosystem. Hosted deployment should follow contract hardening, auth decisions, and clear ownership of suite metadata.

## Working Locally

```bash
pnpm run bootstrap
pnpm run dev:web
pnpm run dev:desktop
pnpm run contracts:generate
pnpm run suite:smoke
pnpm run verify:all
pnpm run doctor
```

Use the contract and handoff docs when making any cross-app integration change.

## Direction

- Keep Registry as the canonical suite integration reference.
- Tighten handoff versioning and fixtures.
- Make capability visibility useful without turning Registry into a broad product marketplace.
- Continue separating infrastructure truth from individual app marketing.

## Related Documentation

- [Suite Handoff Standard](docs/SUITE_HANDOFF_STANDARD.md)
- [Suite Handoff Catalog](docs/SUITE_HANDOFF_CATALOG.md)
- [Contract Changelog](docs/CONTRACT_CHANGELOG.md)
- [Repo Map](docs/REPO_MAP.md)
