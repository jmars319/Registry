# Suite Flow Diagram

Generated from `contracts/handoff-catalog.json` by `scripts/generate-suite-contract-docs.mjs`.

This is the offline suite map. It is intentionally contract-first so it can be verified without running every app.

## Registry to Ledger reconciliation

<a id="registry-ledger-reconciliation"></a>

`tenra Registry` -> `tenra Ledger` -> `tenra Registry`

Ledger remains the finance module while Registry stays the rental control plane.

Statuses: `previewed`, `sent`, `received`, `replayed`

Contracts:

- `tenra-registry.ledger-export.v1`

Fixtures:

- `tenra Registry/fixtures/handoffs/ledger-export.json`
- `tenra Ledger/fixtures/handoffs/registry-ledger-entry-import.json`

## Registry to Assembly documents

<a id="registry-assembly-documents"></a>

`tenra Registry` -> `tenra Assembly`

Assembly provides document generation without being folded into Registry.

Statuses: `previewed`, `sent`, `accepted`, `replayed`

Contracts:

- `tenra-registry.assembly-document-request.v1`

Fixtures:

- `tenra Registry/fixtures/handoffs/assembly-document-request.json`
- `tenra Assembly/fixtures/handoffs/registry-document-request.json`

## Scout opportunity to Assembly and Proxy

<a id="scout-assembly-proxy"></a>

`tenra Scout` -> `tenra Assembly` -> `tenra Proxy` -> `tenra Guardrail`

Scout finds leads, Assembly drafts content, and Proxy standardizes the output tone.

Statuses: `previewed`, `queued`, `sent`, `accepted`, `failed`

Contracts:

- `tenra-scout.opportunity-handoff.v1`
- `tenra-assembly.proxy-notice-handoff.v1`
- `tenra-proxy.shape-external-output-request.v1`

Fixtures:

- `tenra Scout/fixtures/handoffs/direct-delivery-smoke.json`
- `tenra Assembly/fixtures/handoffs/direct-delivery-smoke-proxy-notice.json`
- `tenra Proxy/fixtures/handoffs/direct-delivery-smoke-shape.json`

## Align review route through Guardrail and Proxy

<a id="align-guardrail-proxy"></a>

`tenra Align` -> `tenra Guardrail` -> `tenra Proxy`

Align owns review routing while Guardrail and Proxy remain reusable approval and shaping services.

Statuses: `draft`, `previewed`, `queued`, `accepted`, `rejected`

Contracts:

- `tenra-align.review-reply-route.v1`
- `tenra-guardrail.external-action-review.v1`
- `tenra-proxy.shape-external-output-request.v1`

Fixtures:

- `tenra Align/fixtures/handoffs/review-reply-route.json`

## Partition lab validation to Guardrail

<a id="partition-guardrail"></a>

`tenra Partition` -> `tenra Guardrail`

Partition keeps its specialist simulation surface and asks Guardrail for unsafe-action review.

Statuses: `previewed`, `sent`, `accepted`, `rejected`

Contracts:

- `tenra-partition.lab-validation-request.v1`
- `tenra-partition.lab-validation-result.v1`
- `tenra-guardrail.external-action-review.v1`

Fixtures:

- `tenra Partition/fixtures/handoffs/lab-validation-request.json`
- `tenra Partition/fixtures/handoffs/lab-validation-result.json`

## Facet to Derive and Sentinel reasoning

<a id="facet-derive-sentinel"></a>

`tenra Facet` -> `tenra Derive` -> `tenra Assembly` -> `tenra Sentinel`

Facet, Derive, and Sentinel stay distinct because their functions are useful to multiple apps.

Statuses: `previewed`, `queued`, `sent`, `accepted`, `failed`

Contracts:

- `tenra-facet.orientation-packet.v1`
- `tenra-derive.reasoning-brief.v1`
- `tenra-sentinel.risk-brief.v1`

Fixtures:

- `tenra Facet/fixtures/handoffs/orientation-packet.json`
- `tenra Derive/fixtures/handoffs/reasoning-brief.json`
- `tenra Sentinel/fixtures/handoffs/risk-brief.json`

## Vicina workflow routing

<a id="vicina-workflow-routing"></a>

`Vicina by tenra` -> `tenra Assembly` -> `tenra Guardrail` -> `tenra Sentinel` -> `tenra Proxy`

Vicina can orchestrate workflows while delegated apps keep their own domain-specific logic.

Statuses: `draft`, `previewed`, `queued`, `sent`, `accepted`, `failed`

Contracts:

- `tenra-vicina.workflow-handoff.v1`
- `tenra-guardrail.external-action-review.v1`
- `tenra-proxy.shape-external-output-request.v1`

Fixtures:

- `Vicina by tenra/fixtures/handoffs/workflow-handoff.json`
