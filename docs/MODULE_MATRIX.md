# Module Matrix

Generated from `contracts/handoff-catalog.json` by `scripts/generate-suite-contract-docs.mjs`.

This is the first modularization layer. It records how each app stands alone, what it can provide to other apps, and which integrations are optional.

| App | Required modules | Optional modules | Provides | Consumes |
| --- | --- | --- | --- | --- |
| tenra Registry | None | tenra Ledger, tenra Assembly | suite catalog, handoff audit, replay bundle, ledger export, assembly document request | handoff receipts |
| tenra Ledger | None | tenra Registry | ledger reconciliation, transaction drilldown, reconciliation export | registry ledger export |
| tenra Assembly | None | tenra Registry, tenra Scout, tenra Proxy, tenra Derive, tenra Sentinel, Vicina by tenra | document drafting, content assembly, project-note inbox, proxy notice handoff | registry document request, scout opportunity, derive reasoning brief, sentinel risk brief, vicina workflow signal |
| tenra Scout | None | tenra Assembly, tenra Proxy, tenra Guardrail | opportunity handoff, candidate evidence, outbound destination presets | proxy shaping result, guardrail decision |
| tenra Proxy | None | tenra Assembly, tenra Scout, tenra Align, tenra Derive, Vicina by tenra | external output shaping, preset shaping, profile constraints, suite endpoint health | shape requests, preset requests |
| tenra Guardrail | None | tenra Scout, tenra Partition, tenra Align, tenra Derive, tenra Sentinel, Vicina by tenra | external action review, decision callback, decision export, failed callback retry | review requests, callback endpoints |
| tenra Partition | None | tenra Guardrail, tenra Proxy | lab validation request, lab validation result, blocked result queue | guardrail decision |
| tenra Align | None | tenra Proxy, tenra Guardrail | alignment snapshot, review reply route, route timeline | proxy shaped reply, guardrail decision |
| tenra Facet | None | tenra Derive, tenra Assembly, tenra Sentinel | orientation packet, endpoint health, send retry queue | None |
| tenra Derive | None | tenra Facet, tenra Sentinel, tenra Assembly, tenra Guardrail, tenra Proxy | reasoning brief, brief history, import preview | orientation packet, risk brief |
| tenra Sentinel | None | tenra Derive, tenra Guardrail, tenra Assembly, tenra Facet | risk brief, derive preview, guardrail preview, import error state | orientation packet, reasoning brief |
| Vicina by tenra | None | tenra Assembly, tenra Guardrail, tenra Sentinel, tenra Proxy | workflow handoff, destination timeline, endpoint health | module health, handoff acknowledgements |

## Enforcement

- `verify:contracts` fails if any app lacks a standalone mode.
- `verify:contracts` fails if a required suite dependency is introduced without changing the modularity policy.
- Optional dependencies must reference registered apps.
