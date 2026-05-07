# Suite Handoff Standard

Generated from `tenra Registry/contracts/handoff-catalog.json` by `tenra Registry/scripts/generate-suite-contract-docs.mjs`.

## App Role

suite control plane and rental operations app

keep unique; expose Registry as the audit, replay, catalog, and reconciliation control surface.

## Accepted Inputs

- No accepted suite contract is registered yet.

## Emitted Outputs

- `tenra-registry.ledger-export.v1` to tenra Ledger
- `tenra-registry.assembly-document-request.v1` to tenra Assembly

## Standard Controls

- schema badge
- download JSON
- replay
- history
- correlation id
- preview payload

## Status Vocabulary

- `draft`: Payload or route exists locally but has not been previewed.
- `previewed`: Payload was built and inspected without delivery.
- `queued`: Delivery is waiting for an endpoint, retry, or operator action.
- `sent`: Producer posted or exported the payload successfully.
- `accepted`: Consumer parsed and retained the payload.
- `rejected`: Consumer refused the payload for schema, routing, safety, or policy reasons.
- `failed`: Delivery failed before acceptance or rejection was known.
- `replayed`: Registry or a producer regenerated a prior payload for another delivery attempt.
- `received`: Consumer acknowledged receipt back to the source app.
- `dismissed`: Operator intentionally removed an item from an inbox, queue, or retry list.

## Local Storage

Prefix: `tenra.registry`

- `tenra.registry.handoffFilters.v1`
- `tenra.registry.endpointPresets.v1`

## Endpoints

- GET `/api/handoffs/ledger-export` - Ledger export
- GET `/api/handoffs/assembly-document-request` - Assembly document request
- GET/POST `/api/handoffs/replay/[exportId]` - Replay
- POST `/api/handoffs/received` - Receipt intake
