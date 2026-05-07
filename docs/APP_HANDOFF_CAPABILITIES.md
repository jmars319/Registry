# App Handoff Capabilities

Generated from `contracts/handoff-catalog.json` by `scripts/generate-suite-contract-docs.mjs`.

This file documents accepted inputs and emitted outputs for each non-vaexcore app.

## tenra Registry

Role: suite control plane and rental operations app

Integration posture: keep unique; expose Registry as the audit, replay, catalog, and reconciliation control surface.

Capabilities:

- Handoff catalog
- Ledger export
- Assembly document request export
- Replay audit
- Flow bundle export

Endpoints:

- GET `/api/handoffs/ledger-export` - Ledger export
- GET `/api/handoffs/assembly-document-request` - Assembly document request
- GET/POST `/api/handoffs/replay/[exportId]` - Replay
- POST `/api/handoffs/received` - Receipt intake

Emits:

- `tenra-registry.ledger-export.v1`
- `tenra-registry.assembly-document-request.v1`

Accepts:

- No accepted suite contract yet.

Local storage prefix: `tenra.registry`

## tenra Ledger

Role: financial reconciliation module

Integration posture: keep unique; Registry and other apps should use Ledger through explicit imports and reconciliation exports.

Capabilities:

- Registry Ledger import
- Duplicate-safe reconciliation
- Transaction drilldown
- JSON reconciliation export

Endpoints:

- POST `http://localhost:4174/api/handoffs/registry-ledger` - Registry Ledger desktop import

Emits:

- No emitted suite contract yet.

Accepts:

- `tenra-registry.ledger-export.v1`

Local storage prefix: `tenra.ledger`

## tenra Assembly

Role: document and content assembly module

Integration posture: keep unique; other apps may call Assembly for draft creation, but every producer must still be useful without Assembly.

Capabilities:

- Registry document intake
- Scout opportunity preview
- Proxy notice export
- Project-note inbox

Endpoints:

- POST `/api/handoffs/registry-document` - Registry document intake
- POST `/api/handoffs/scout-opportunity` - Scout opportunity intake
- POST `/api/handoffs/proxy-notice` - Proxy notice intake

Emits:

- `tenra-assembly.proxy-notice-handoff.v1`

Accepts:

- `tenra-registry.assembly-document-request.v1`
- `tenra-scout.opportunity-handoff.v1`
- `tenra-facet.orientation-packet.v1`
- `tenra-derive.reasoning-brief.v1`
- `tenra-sentinel.risk-brief.v1`
- `tenra-vicina.workflow-handoff.v1`

Local storage prefix: `tenra.assembly`

## tenra Scout

Role: lead discovery and opportunity source

Integration posture: keep unique; other apps should consume Scout opportunities, while Scout can use Proxy and Guardrail as reusable services.

Capabilities:

- Opportunity handoff
- Proxy shaping request
- Guardrail review request
- Destination presets

Endpoints:

- GET `/api/handoffs/opportunity/[runId]/[candidateId]` - Opportunity payload
- POST `/api/handoffs/deliver/[runId]/[candidateId]` - Direct delivery
- GET `/api/handoffs/health` - Handoff health

Emits:

- `tenra-scout.opportunity-handoff.v1`

Accepts:

- No accepted suite contract yet.

Local storage prefix: `tenra.scout`

## tenra Proxy

Role: shared shaping and tone service

Integration posture: keep unique as a reusable module; many apps should call Proxy rather than duplicating shaping logic.

Capabilities:

- External output shaping
- Preset shaping
- Suite health timeline
- Profile and constraint management

Endpoints:

- POST `/api/shape-external-output` - Shape external output
- POST `/api/shape-preset` - Shape preset

Emits:

- `tenra-proxy.shape-external-output-request.v1`
- `tenra-proxy.shape-preset-request.v1`

Accepts:

- `tenra-assembly.proxy-notice-handoff.v1`
- `tenra-scout.opportunity-handoff.v1`
- `tenra-proxy.shape-external-output-request.v1`
- `tenra-proxy.shape-preset-request.v1`
- `tenra-align.review-reply-route.v1`
- `tenra-derive.reasoning-brief.v1`
- `tenra-vicina.workflow-handoff.v1`

Local storage prefix: `tenra.proxy`

## tenra Guardrail

Role: shared review and decision service

Integration posture: keep unique as a reusable module; source apps should request decisions instead of embedding review policy.

Capabilities:

- External action review
- Decision callback
- Failed callback retry
- Decision detail export

Endpoints:

- POST `/api/external-reviews` - External reviews
- POST `/api/external-review-decisions` - External review decisions

Emits:

- `tenra-guardrail.external-action-review.v1`
- `tenra-guardrail.external-action-decision.v1`

Accepts:

- `tenra-scout.opportunity-handoff.v1`
- `tenra-guardrail.external-action-review.v1`
- `tenra-partition.lab-validation-request.v1`
- `tenra-partition.lab-validation-result.v1`
- `tenra-align.review-reply-route.v1`
- `tenra-derive.reasoning-brief.v1`
- `tenra-sentinel.risk-brief.v1`
- `tenra-vicina.workflow-handoff.v1`

Local storage prefix: `tenra.guardrail`

## tenra Partition

Role: disk-layout simulation and lab validation app

Integration posture: keep unique; Guardrail can review unsafe changes and Proxy can shape operator-facing explanations.

Capabilities:

- Lab validation request
- Lab validation result import
- Guardrail decision import
- Blocked result queue

Endpoints:

- No local HTTP endpoint documented yet; use explicit export/import controls.

Emits:

- `tenra-partition.lab-validation-request.v1`
- `tenra-partition.lab-validation-result.v1`

Accepts:

- No accepted suite contract yet.

Local storage prefix: `tenra.partition`

## tenra Align

Role: review reply and route alignment app

Integration posture: keep unique; use Proxy for reply shaping and Guardrail for publish review.

Capabilities:

- Alignment snapshot
- Review reply route
- Proxy reply choice
- Guardrail route timeline

Endpoints:

- No local HTTP endpoint documented yet; use explicit export/import controls.

Emits:

- `tenra-align.alignment-snapshot.v1`
- `tenra-align.review-reply-route.v1`

Accepts:

- No accepted suite contract yet.

Local storage prefix: `tenra.align`

## tenra Facet

Role: research orientation and packet source

Integration posture: keep unique; Derive, Assembly, and Sentinel should consume orientation packets as modular inputs.

Capabilities:

- Orientation packet export
- Endpoint health
- Retry queue
- Payload inspection

Endpoints:

- No local HTTP endpoint documented yet; use explicit export/import controls.

Emits:

- `tenra-facet.orientation-packet.v1`

Accepts:

- No accepted suite contract yet.

Local storage prefix: `tenra.facet`

## tenra Derive

Role: reasoning brief and comparison module

Integration posture: keep unique; consume Facet/Sentinel inputs and emit reasoning briefs to Assembly, Guardrail, Sentinel, and Proxy.

Capabilities:

- Reasoning brief export
- Import preview
- Brief history
- Consumer routing metadata

Endpoints:

- No local HTTP endpoint documented yet; use explicit export/import controls.

Emits:

- `tenra-derive.reasoning-brief.v1`

Accepts:

- `tenra-facet.orientation-packet.v1`
- `tenra-sentinel.risk-brief.v1`

Local storage prefix: `tenra.derive`

## tenra Sentinel

Role: risk lookup and brief source

Integration posture: keep unique; emit risk briefs to Derive, Guardrail, and Assembly rather than duplicating lookup workflows.

Capabilities:

- Risk brief export
- Derive preview
- Guardrail preview
- Inline import errors

Endpoints:

- No local HTTP endpoint documented yet; use explicit export/import controls.

Emits:

- `tenra-sentinel.risk-brief.v1`

Accepts:

- `tenra-facet.orientation-packet.v1`
- `tenra-derive.reasoning-brief.v1`
- `tenra-vicina.workflow-handoff.v1`

Local storage prefix: `tenra.sentinel`

## Vicina by tenra

Role: workflow handoff orchestrator

Integration posture: keep unique; route workflow signals to Assembly, Guardrail, Sentinel, and Proxy through explicit handoffs.

Capabilities:

- Workflow handoff
- Endpoint health
- Destination timeline
- Guardrail review builder

Endpoints:

- No local HTTP endpoint documented yet; use explicit export/import controls.

Emits:

- `tenra-vicina.workflow-handoff.v1`

Accepts:

- No accepted suite contract yet.

Local storage prefix: `tenra.vicina`
