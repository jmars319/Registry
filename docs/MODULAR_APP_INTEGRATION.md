# Modular App Integration

Generated from `contracts/handoff-catalog.json` by `scripts/generate-suite-contract-docs.mjs`.

The current suite should keep the apps as distinct products. The integration move is modular usage, not folding apps into one another.

| App | Modular role | Posture |
| --- | --- | --- |
| tenra Registry | suite control plane and rental operations app | keep unique; expose Registry as the audit, replay, catalog, and reconciliation control surface. |
| tenra Ledger | financial reconciliation module | keep unique; Registry and other apps should use Ledger through explicit imports and reconciliation exports. |
| tenra Assembly | document and content assembly module | keep unique; Registry, Scout, Derive, Sentinel, and Vicina should call Assembly for draft creation instead of embedding its editor. |
| tenra Scout | lead discovery and opportunity source | keep unique; other apps should consume Scout opportunities, while Scout can use Proxy and Guardrail as reusable services. |
| tenra Proxy | shared shaping and tone service | keep unique as a reusable module; many apps should call Proxy rather than duplicating shaping logic. |
| tenra Guardrail | shared review and decision service | keep unique as a reusable module; source apps should request decisions instead of embedding review policy. |
| tenra Partition | disk-layout simulation and lab validation app | keep unique; Guardrail can review unsafe changes and Proxy can shape operator-facing explanations. |
| tenra Align | review reply and route alignment app | keep unique; use Proxy for reply shaping and Guardrail for publish review. |
| tenra Facet | research orientation and packet source | keep unique; Derive, Assembly, and Sentinel should consume orientation packets as modular inputs. |
| tenra Derive | reasoning brief and comparison module | keep unique; consume Facet/Sentinel inputs and emit reasoning briefs to Assembly, Guardrail, Sentinel, and Proxy. |
| tenra Sentinel | risk lookup and brief source | keep unique; emit risk briefs to Derive, Guardrail, and Assembly rather than duplicating lookup workflows. |
| Vicina by tenra | workflow handoff orchestrator | keep unique; route workflow signals to Assembly, Guardrail, Sentinel, and Proxy through explicit handoffs. |

## Current Readiness

- Proxy and Guardrail are the clearest reusable service modules because multiple apps already route through them.
- Assembly, Derive, Sentinel, Facet, Ledger, and Scout should remain unique apps with explicit handoff contracts.
- Registry should become the suite control plane for catalog, audit, replay, fixture preview, compatibility, and release checks.
- Vicina should remain a workflow orchestrator that routes to the specialized apps instead of absorbing them.
