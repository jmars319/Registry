# Module Manifest

Generated from `tenra Registry/contracts/handoff-catalog.json` by `tenra Registry/scripts/generate-suite-contract-docs.mjs`.

## Standalone Mode

Runs as a complete rental operations app with its own customers, assets, assignments, receivables, documents, imports, reports, and settings.

## Required Suite Dependencies

- None

## Optional Suite Dependencies

- tenra Ledger: Optional financial reconciliation import/export.
- tenra Assembly: Optional document request handoff when richer drafting is useful.

## Provides

- suite catalog
- handoff audit
- replay bundle
- ledger export
- assembly document request

## Consumes

- handoff receipts

## Contracts

Emits:

- `tenra-registry.ledger-export.v1`
- `tenra-registry.assembly-document-request.v1`

Accepts:

- None

## Rules

- Each app must remain complete and usable without another tenra app running.
- Suite integrations are optional module links, not required runtime dependencies.
- Shared functions should be exposed through explicit local APIs, exports, imports, or schemas.
- No app may read another app's private filesystem, database, or localStorage state.
- Registry can index and audit the module graph, but it must not become a hidden runtime bus.
