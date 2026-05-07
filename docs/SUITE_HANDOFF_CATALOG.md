# Suite Handoff Catalog

Generated from `contracts/handoff-catalog.json` by `scripts/generate-suite-contract-docs.mjs`.

Registry owns the suite-level contract catalog because it is the audit and replay control plane. Each app still owns its product and repo-local implementation.

## Contracts

| Producer | Contract | Consumers | Fixture | Standard controls |
| --- | --- | --- | --- | --- |
| tenra Registry | `tenra-registry.ledger-export.v1` | tenra Ledger | `tenra Registry/fixtures/handoffs/ledger-export.json` | schema badge, download JSON, replay, history, correlation id |
| tenra Registry | `tenra-registry.assembly-document-request.v1` | tenra Assembly | `tenra Registry/fixtures/handoffs/assembly-document-request.json` | schema badge, preview payload, download JSON, replay, history |
| tenra Assembly | `tenra-assembly.proxy-notice-handoff.v1` | tenra Proxy | `tenra Assembly/fixtures/handoffs/proxy-notice-handoff.json` | schema badge, preview payload, copy payload, send or export, history |
| tenra Scout | `tenra-scout.opportunity-handoff.v1` | tenra Assembly, tenra Proxy, tenra Guardrail | `tenra Scout/fixtures/handoffs/opportunity-handoff.json` | schema badge, destination presets, preview payload, send or export, history |
| source apps | `tenra-proxy.shape-external-output-request.v1` | tenra Proxy | `tenra Proxy/fixtures/handoffs/shape-external-output.json` | correlation id, preview payload, retry failed, history |
| source apps | `tenra-proxy.shape-preset-request.v1` | tenra Proxy | `tenra Proxy/fixtures/handoffs/shape-preset-scout-outreach.json` | correlation id, preview payload, preset import/export, history |
| source apps | `tenra-guardrail.external-action-review.v1` | tenra Guardrail | `tenra Guardrail/fixtures/handoffs/external-action-review.json` | schema badge, correlation id, preview payload, decision templates, history |
| tenra Guardrail | `tenra-guardrail.external-action-decision.v1` | source apps | `tenra Guardrail/fixtures/handoffs/external-action-decision.json` | schema badge, correlation id, retry failed, download JSON, history |
| tenra Partition | `tenra-partition.lab-validation-request.v1` | lab validation, tenra Guardrail | `tenra Partition/fixtures/handoffs/lab-validation-request.json` | schema badge, preview payload, download JSON, import history |
| tenra Partition | `tenra-partition.lab-validation-result.v1` | tenra Guardrail | `tenra Partition/fixtures/handoffs/lab-validation-result.json` | schema badge, preview payload, blocked queue, history |
| tenra Align | `tenra-align.alignment-snapshot.v1` | suite review surfaces | `tenra Align/fixtures/handoffs/alignment-snapshot.json` | schema badge, copy payload, download JSON, history |
| tenra Align | `tenra-align.review-reply-route.v1` | tenra Guardrail, tenra Proxy | `tenra Align/fixtures/handoffs/review-reply-route.json` | schema badge, correlation id, route timeline, conflict history, history |
| tenra Facet | `tenra-facet.orientation-packet.v1` | tenra Derive, tenra Assembly, tenra Sentinel | `tenra Facet/fixtures/handoffs/orientation-packet.json` | schema badge, endpoint health, retry failed, payload inspection, history |
| tenra Derive | `tenra-derive.reasoning-brief.v1` | tenra Assembly, tenra Guardrail, tenra Sentinel, tenra Proxy | `tenra Derive/fixtures/handoffs/reasoning-brief.json` | schema badge, preview payload, brief comparison, history |
| tenra Sentinel | `tenra-sentinel.risk-brief.v1` | tenra Derive, tenra Guardrail, tenra Assembly | `tenra Sentinel/fixtures/handoffs/risk-brief.json` | schema badge, preview payload, version comparison, history, inline errors |
| Vicina by tenra | `tenra-vicina.workflow-handoff.v1` | tenra Assembly, tenra Guardrail, tenra Sentinel, tenra Proxy | `Vicina by tenra/fixtures/handoffs/workflow-handoff.json` | schema badge, endpoint health, workflow timeline, preview payload, history |

## Flows

| Flow | Producer | Consumers | Contracts |
| --- | --- | --- | --- |
| [Registry to Ledger reconciliation](SUITE_FLOW_DIAGRAM.md#registry-ledger-reconciliation) | tenra Registry | tenra Ledger, tenra Registry | `tenra-registry.ledger-export.v1` |
| [Registry to Assembly documents](SUITE_FLOW_DIAGRAM.md#registry-assembly-documents) | tenra Registry | tenra Assembly | `tenra-registry.assembly-document-request.v1` |
| [Scout opportunity to Assembly and Proxy](SUITE_FLOW_DIAGRAM.md#scout-assembly-proxy) | tenra Scout | tenra Assembly, tenra Proxy, tenra Guardrail | `tenra-scout.opportunity-handoff.v1`<br>`tenra-assembly.proxy-notice-handoff.v1`<br>`tenra-proxy.shape-external-output-request.v1` |
| [Align review route through Guardrail and Proxy](SUITE_FLOW_DIAGRAM.md#align-guardrail-proxy) | tenra Align | tenra Guardrail, tenra Proxy | `tenra-align.review-reply-route.v1`<br>`tenra-guardrail.external-action-review.v1`<br>`tenra-proxy.shape-external-output-request.v1` |
| [Partition lab validation to Guardrail](SUITE_FLOW_DIAGRAM.md#partition-guardrail) | tenra Partition | tenra Guardrail | `tenra-partition.lab-validation-request.v1`<br>`tenra-partition.lab-validation-result.v1`<br>`tenra-guardrail.external-action-review.v1` |
| [Facet to Derive and Sentinel reasoning](SUITE_FLOW_DIAGRAM.md#facet-derive-sentinel) | tenra Facet | tenra Derive, tenra Assembly, tenra Sentinel | `tenra-facet.orientation-packet.v1`<br>`tenra-derive.reasoning-brief.v1`<br>`tenra-sentinel.risk-brief.v1` |
| [Vicina workflow routing](SUITE_FLOW_DIAGRAM.md#vicina-workflow-routing) | Vicina by tenra | tenra Assembly, tenra Guardrail, tenra Sentinel, tenra Proxy | `tenra-vicina.workflow-handoff.v1`<br>`tenra-guardrail.external-action-review.v1`<br>`tenra-proxy.shape-external-output-request.v1` |

## Rules

- Apps exchange explicit JSON through local APIs, exports, imports, and fixtures.
- Consumers can persist local receipt, retry, or decision state, but must not read another app's private store.
- `schema` is the contract id for schema-bearing payloads.
- `traceId`, `requestTraceId`, and `exportId` are correlation keys.
- `suite:smoke` reads this catalog so CI failures identify the broken app-to-app contract.
