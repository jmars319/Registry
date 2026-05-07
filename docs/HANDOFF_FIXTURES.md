# Handoff Fixtures

Generated from `contracts/handoff-catalog.json` by `scripts/generate-suite-contract-docs.mjs`.

Positive fixtures are copied into `contracts/golden-fixtures/` by the generator. Negative fixtures live under `fixtures/negative-handoffs/` and are checked by the catalog verifier.

## Golden Fixtures

| Contract | Source fixture | Schema | Correlation |
| --- | --- | --- | --- |
| `tenra-registry.ledger-export.v1` | `tenra Registry/fixtures/handoffs/ledger-export.json` | `contracts/schemas/tenra-registry.ledger-export.v1.schema.json` | `exportId` |
| `tenra-registry.assembly-document-request.v1` | `tenra Registry/fixtures/handoffs/assembly-document-request.json` | `contracts/schemas/tenra-registry.assembly-document-request.v1.schema.json` | `exportId`, `customerId` |
| `tenra-assembly.proxy-notice-handoff.v1` | `tenra Assembly/fixtures/handoffs/proxy-notice-handoff.json` | `contracts/schemas/tenra-assembly.proxy-notice-handoff.v1.schema.json` | `contentItemId`, `sourceRegistryExportId` |
| `tenra-scout.opportunity-handoff.v1` | `tenra Scout/fixtures/handoffs/opportunity-handoff.json` | `contracts/schemas/tenra-scout.opportunity-handoff.v1.schema.json` | `runId`, `candidateId` |
| `tenra-proxy.shape-external-output-request.v1` | `tenra Proxy/fixtures/handoffs/shape-external-output.json` | `contracts/schemas/tenra-proxy.shape-external-output-request.v1.schema.json` | `traceId` |
| `tenra-proxy.shape-preset-request.v1` | `tenra Proxy/fixtures/handoffs/shape-preset-scout-outreach.json` | `contracts/schemas/tenra-proxy.shape-preset-request.v1.schema.json` | `traceId` |
| `tenra-guardrail.external-action-review.v1` | `tenra Guardrail/fixtures/handoffs/external-action-review.json` | `contracts/schemas/tenra-guardrail.external-action-review.v1.schema.json` | `traceId` |
| `tenra-guardrail.external-action-decision.v1` | `tenra Guardrail/fixtures/handoffs/external-action-decision.json` | `contracts/schemas/tenra-guardrail.external-action-decision.v1.schema.json` | `requestTraceId` |
| `tenra-partition.lab-validation-request.v1` | `tenra Partition/fixtures/handoffs/lab-validation-request.json` | `contracts/schemas/tenra-partition.lab-validation-request.v1.schema.json` | `source.id` |
| `tenra-partition.lab-validation-result.v1` | `tenra Partition/fixtures/handoffs/lab-validation-result.json` | `contracts/schemas/tenra-partition.lab-validation-result.v1.schema.json` | `sourceRequest.id` |
| `tenra-align.alignment-snapshot.v1` | `tenra Align/fixtures/handoffs/alignment-snapshot.json` | `contracts/schemas/tenra-align.alignment-snapshot.v1.schema.json` | `subject.id` |
| `tenra-align.review-reply-route.v1` | `tenra Align/fixtures/handoffs/review-reply-route.json` | `contracts/schemas/tenra-align.review-reply-route.v1.schema.json` | `reviewId`, `guardrailReviewRequest.traceId`, `proxyShapeRequest.traceId` |
| `tenra-facet.orientation-packet.v1` | `tenra Facet/fixtures/handoffs/orientation-packet.json` | `contracts/schemas/tenra-facet.orientation-packet.v1.schema.json` | `handoff.packetId` |
| `tenra-derive.reasoning-brief.v1` | `tenra Derive/fixtures/handoffs/reasoning-brief.json` | `contracts/schemas/tenra-derive.reasoning-brief.v1.schema.json` | `handoff.briefId` |
| `tenra-sentinel.risk-brief.v1` | `tenra Sentinel/fixtures/handoffs/risk-brief.json` | `contracts/schemas/tenra-sentinel.risk-brief.v1.schema.json` | `handoff.briefId` |
| `tenra-vicina.workflow-handoff.v1` | `Vicina by tenra/fixtures/handoffs/workflow-handoff.json` | `contracts/schemas/tenra-vicina.workflow-handoff.v1.schema.json` | `workflow` |

## Negative Fixtures

| Case | Fixture | Expected rejection |
| --- | --- | --- |
| `missing-schema` | `fixtures/negative-handoffs/suite-missing-schema.json` | Schema-bearing contracts must include a schema string. |
| `invalid-timestamp` | `fixtures/negative-handoffs/suite-invalid-timestamp.json` | Timestamp fields must be strings or numbers matching the contract. |
| `wrong-target-app` | `fixtures/negative-handoffs/suite-wrong-target-app.json` | Target apps must match the catalog route. |
| `stale-schema-version` | `fixtures/negative-handoffs/suite-stale-schema-version.json` | Deprecated schema versions are rejected until a migration contract exists. |
| `duplicate-trace` | `fixtures/negative-handoffs/suite-duplicate-trace.json` | Trace IDs are correlation keys and duplicate examples must be explicit. |
