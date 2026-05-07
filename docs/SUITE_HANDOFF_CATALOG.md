# Suite Handoff Catalog

Registry owns the suite-level smoke runner because it already verifies the complete non-vaexcore handoff graph. Each app still owns its product and its repo-local contracts.

| Producer | Contract | Consumers | Fixture | Endpoint or action |
| --- | --- | --- | --- | --- |
| Registry | `tenra-registry.ledger-export.v1` | Ledger | `tenra Registry/fixtures/handoffs/ledger-export.json` | `GET /api/handoffs/ledger-export`, replay POST from `/handoffs/[exportId]` |
| Registry | `tenra-registry.assembly-document-request.v1` | Assembly | `tenra Registry/fixtures/handoffs/assembly-document-request.json` | `GET /api/handoffs/assembly-document-request`, replay POST from `/handoffs/[exportId]` |
| Ledger | `tenra-registry.ledger-export.v1` import receipt | Registry | `tenra Ledger/fixtures/handoffs/registry-ledger-entry-import.json` | Desktop Registry tab posts to Registry `/api/handoffs/received` |
| Scout | `tenra-scout.opportunity-handoff.v1` | Assembly, Proxy, Guardrail | `tenra Scout/fixtures/handoffs/direct-delivery-smoke.json` | Lead detail handoff destination controls |
| Assembly | `tenra-assembly.proxy-notice-handoff.v1` | Proxy | `tenra Assembly/fixtures/handoffs/proxy-notice-handoff.json` | Project notes Registry/Scout inbox, Proxy notice export |
| Proxy | Shape request and preset request | Scout, Guardrail, Partition, Assembly, Align | `tenra Proxy/fixtures/handoffs/direct-delivery-smoke-shape.json` | `POST /api/shape-external-output`, `POST /api/shape-preset` |
| Guardrail | `tenra-guardrail.external-action-review.v1` | Guardrail | `tenra Guardrail/fixtures/handoffs/external-action-review.json` | `POST /api/external-reviews` |
| Guardrail | `tenra-guardrail.external-action-decision.v1` | Source apps | `tenra Guardrail/fixtures/handoffs/external-action-decision.json` | `POST /api/external-review-decisions`, callback POST from queue |
| Partition | `tenra-partition.lab-validation-request.v1` | Lab validation | `tenra Partition/fixtures/handoffs/lab-validation-request.json` | App export button |
| Partition | `tenra-partition.lab-validation-result.v1` | Guardrail | `tenra Partition/fixtures/handoffs/lab-validation-result.json` | App import/export buttons |
| Align | `tenra-align.review-reply-route.v1` | Guardrail, Proxy | `tenra Align/fixtures/handoffs/review-reply-route.json` | Review route export and import panels |
| Facet | `tenra-facet.orientation-packet.v1` | Derive, Assembly, Sentinel | `tenra Facet/fixtures/handoffs/orientation-packet.json` | Desktop orientation packet sends |
| Derive | `tenra-derive.reasoning-brief.v1` | Assembly, Guardrail, Sentinel, Proxy | `tenra Derive/fixtures/handoffs/reasoning-brief.json` | Desktop and web reasoning brief export |
| Sentinel | `tenra-sentinel.risk-brief.v1` | Derive, Guardrail, Assembly | `tenra Sentinel/fixtures/handoffs/risk-brief.json` | Desktop risk brief export, Guardrail review export |
| Vicina | `tenra-vicina.workflow-handoff.v1` | Assembly, Guardrail, Sentinel, Proxy | `Vicina by tenra/fixtures/handoffs/workflow-handoff.json` | Web workflow inbox destination controls |

## Rules

- Apps exchange explicit JSON through local APIs, exports, imports, and fixtures.
- A consumer can persist local receipt, retry, or decision state, but it must not read another app's private store.
- `schema` is the contract id. `traceId` is the audit join key for Guardrail and Proxy-shaped return flows.
- `exportId` is required when the producer needs reconciliation or duplicate detection.
- `suite:smoke` prints the flow matrix before running checks so CI failures identify the broken app-to-app contract.
