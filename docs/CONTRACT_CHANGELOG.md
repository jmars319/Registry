# Contract Changelog

Generated from `contracts/handoff-catalog.json` by `scripts/generate-suite-contract-docs.mjs`.

This changelog is separate from app changelogs. Update it when a schema version, fixture, routing contract, or lifecycle expectation changes.

| Contract | State | Updated | Note |
| --- | --- | --- | --- |
| `tenra-registry.ledger-export.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-registry.assembly-document-request.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-assembly.proxy-notice-handoff.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-scout.opportunity-handoff.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-proxy.shape-external-output-request.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-proxy.shape-preset-request.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-guardrail.external-action-review.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-guardrail.external-action-decision.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-partition.lab-validation-request.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-partition.lab-validation-result.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-align.alignment-snapshot.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-align.review-reply-route.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-facet.orientation-packet.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-derive.reasoning-brief.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-sentinel.risk-brief.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |
| `tenra-vicina.workflow-handoff.v1` | current | 2026-05-07 | V1 contract accepted by the suite catalog verifier. |

## Version Policy

- Additive optional fields can remain in v1 when older consumers ignore them.
- Required field changes need a v2 schema and a migration fixture.
- Do not remove a v1 fixture until every listed consumer has a migration note.
