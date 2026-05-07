# Modular App Integration

Generated from `contracts/handoff-catalog.json` by `scripts/generate-suite-contract-docs.mjs`.

The current suite should keep the apps as distinct products. The integration move is modular usage, not folding apps into one another.

## Review Result

The concern that Assembly was becoming too foundational is directionally valid in the wording, but not in the actual dependency model. Assembly is a useful document module and accepts many inputs, but it is not required by any app. Proxy and Guardrail are the most reusable service modules by inbound contract count. This pass makes the boundary explicit: every app has a standalone mode and zero required suite dependencies.

## Principles

- Each app must remain complete and usable without another tenra app running.
- Suite integrations are optional module links, not required runtime dependencies.
- Shared functions should be exposed through explicit local APIs, exports, imports, or schemas.
- No app may read another app's private filesystem, database, or localStorage state.
- Registry can index and audit the module graph, but it must not become a hidden runtime bus.

| App | Modular role | Standalone mode | Optional modules | Posture |
| --- | --- | --- | --- | --- |
| tenra Registry | suite control plane and rental operations app | Runs as a complete rental operations app with its own customers, assets, assignments, receivables, documents, imports, reports, and settings. | tenra Ledger, tenra Assembly | keep unique; expose Registry as the audit, replay, catalog, and reconciliation control surface. |
| tenra Ledger | financial reconciliation module | Runs as a complete ledger and reconciliation workspace with local transactions, imports, duplicate checks, drilldowns, and exports. | tenra Registry | keep unique; Registry and other apps should use Ledger through explicit imports and reconciliation exports. |
| tenra Assembly | document and content assembly module | Runs as a complete document and project-note workspace with local drafting, content records, project notes, and proxy-notice export. | tenra Registry, tenra Scout, tenra Proxy, tenra Derive, tenra Sentinel, Vicina by tenra | keep unique; other apps may call Assembly for draft creation, but every producer must still be useful without Assembly. |
| tenra Scout | lead discovery and opportunity source | Runs as a complete lead discovery and opportunity review app with local lead inbox, candidate details, outreach context, and run controls. | tenra Assembly, tenra Proxy, tenra Guardrail | keep unique; other apps should consume Scout opportunities, while Scout can use Proxy and Guardrail as reusable services. |
| tenra Proxy | shared shaping and tone service | Runs as a complete shaping workspace with profiles, presets, constraints, health history, and shaping previews. | tenra Assembly, tenra Scout, tenra Align, tenra Derive, Vicina by tenra | keep unique as a reusable module; many apps should call Proxy rather than duplicating shaping logic. |
| tenra Guardrail | shared review and decision service | Runs as a complete review queue and decision workspace with local requests, templates, decisions, callback retries, and exports. | tenra Scout, tenra Partition, tenra Align, tenra Derive, tenra Sentinel, Vicina by tenra | keep unique as a reusable module; source apps should request decisions instead of embedding review policy. |
| tenra Partition | disk-layout simulation and lab validation app | Runs as a complete partition planning and lab validation app with local simulation, refusal checks, safety review, and result queues. | tenra Guardrail, tenra Proxy | keep unique; Guardrail can review unsafe changes and Proxy can shape operator-facing explanations. |
| tenra Align | review reply and route alignment app | Runs as a complete review routing and reply alignment app with local snapshots, route drafts, conflict history, and reply choices. | tenra Proxy, tenra Guardrail | keep unique; use Proxy for reply shaping and Guardrail for publish review. |
| tenra Facet | research orientation and packet source | Runs as a complete research orientation app with local queries, responses, orientation packets, endpoint checks, and retry queues. | tenra Derive, tenra Assembly, tenra Sentinel | keep unique; Derive, Assembly, and Sentinel should consume orientation packets as modular inputs. |
| tenra Derive | reasoning brief and comparison module | Runs as a complete reasoning workspace with local questions, answers, brief history, import previews, and comparison state. | tenra Facet, tenra Sentinel, tenra Assembly, tenra Guardrail, tenra Proxy | keep unique; consume Facet/Sentinel inputs and emit reasoning briefs to Assembly, Guardrail, Sentinel, and Proxy. |
| tenra Sentinel | risk lookup and brief source | Runs as a complete risk lookup and brief review app with local lookup state, risk briefs, outbound previews, and import error handling. | tenra Derive, tenra Guardrail, tenra Assembly, tenra Facet | keep unique; emit risk briefs to Derive, Guardrail, and Assembly rather than duplicating lookup workflows. |
| Vicina by tenra | workflow handoff orchestrator | Runs as a complete workflow orchestration app with local workflow state, handoff timelines, endpoint health, and operator notes. | tenra Assembly, tenra Guardrail, tenra Sentinel, tenra Proxy | keep unique; route workflow signals to Assembly, Guardrail, Sentinel, and Proxy through explicit handoffs. |

## Current Readiness

- Proxy and Guardrail are the clearest reusable service modules because multiple apps already route through them.
- Assembly is a reusable drafting module, not a foundation layer. Producers must remain useful without it.
- Registry should index, audit, replay, and verify module contracts without becoming a hidden runtime bus.
- Vicina should remain a workflow orchestrator that routes to specialized apps through explicit optional handoffs.
