# Handoff UI Standard

Generated from `contracts/handoff-catalog.json` by `scripts/generate-suite-contract-docs.mjs`.

Use the same lifecycle words and controls across app-specific handoff panels. Apps can skip controls that do not apply to their workflow, but should not rename the same concept differently.

## Status Vocabulary

| Status | Meaning |
| --- | --- |
| `draft` | Payload or route exists locally but has not been previewed. |
| `previewed` | Payload was built and inspected without delivery. |
| `queued` | Delivery is waiting for an endpoint, retry, or operator action. |
| `sent` | Producer posted or exported the payload successfully. |
| `accepted` | Consumer parsed and retained the payload. |
| `rejected` | Consumer refused the payload for schema, routing, safety, or policy reasons. |
| `failed` | Delivery failed before acceptance or rejection was known. |
| `replayed` | Registry or a producer regenerated a prior payload for another delivery attempt. |
| `received` | Consumer acknowledged receipt back to the source app. |
| `dismissed` | Operator intentionally removed an item from an inbox, queue, or retry list. |

## Standard Controls

| Control | Rule |
| --- | --- |
| `schema badge` | Use this exact label where the app already exposes the related action. |
| `correlation id` | Use this exact label where the app already exposes the related action. |
| `preview payload` | Use this exact label where the app already exposes the related action. |
| `copy payload` | Use this exact label where the app already exposes the related action. |
| `download JSON` | Use this exact label where the app already exposes the related action. |
| `send or export` | Use this exact label where the app already exposes the related action. |
| `retry failed` | Use this exact label where the app already exposes the related action. |
| `dismiss` | Use this exact label where the app already exposes the related action. |
| `reset demo state` | Use this exact label where the app already exposes the related action. |
| `import history` | Use this exact label where the app already exposes the related action. |
| `export history` | Use this exact label where the app already exposes the related action. |

## Local Storage Keys

| App | Prefix | Keys |
| --- | --- | --- |
| tenra Registry | `tenra.registry` | `tenra.registry.handoffFilters.v1`<br>`tenra.registry.endpointPresets.v1` |
| tenra Ledger | `tenra.ledger` | `tenra.ledger.registryReconciliation.v1`<br>`tenra.ledger.handoffHistory.v1` |
| tenra Assembly | `tenra.assembly` | `tenra.assembly.registryInbox.v1`<br>`tenra.assembly.scoutInbox.v1`<br>`tenra.assembly.proxyNoticeHistory.v1` |
| tenra Scout | `tenra.scout` | `tenra.scout.handoffEndpoints.v1`<br>`tenra.scout.outboundHistory.v1` |
| tenra Proxy | `tenra.proxy` | `tenra.proxy.shapeHistory.v1`<br>`tenra.proxy.endpointHealth.v1`<br>`tenra.proxy.presetOverrides.v1` |
| tenra Guardrail | `tenra.guardrail` | `tenra.guardrail.reviewQueue.v1`<br>`tenra.guardrail.decisionHistory.v1`<br>`tenra.guardrail.callbackRetries.v1` |
| tenra Partition | `tenra.partition` | `tenra.partition.labValidationHistory.v1`<br>`tenra.partition.guardrailDecisionHistory.v1` |
| tenra Align | `tenra.align` | `tenra.align.routeDrafts.v1`<br>`tenra.align.routeHistory.v1`<br>`tenra.align.proxyReplies.v1` |
| tenra Facet | `tenra.facet` | `tenra.facet.orientationHistory.v1`<br>`tenra.facet.retryQueue.v1`<br>`tenra.facet.endpointHealth.v1` |
| tenra Derive | `tenra.derive` | `tenra.derive.reasoningBriefHistory.v1`<br>`tenra.derive.importHistory.v1` |
| tenra Sentinel | `tenra.sentinel` | `tenra.sentinel.riskBriefHistory.v1`<br>`tenra.sentinel.outboundPreview.v1`<br>`tenra.sentinel.importErrors.v1` |
| Vicina by tenra | `tenra.vicina` | `tenra.vicina.workflowHandoffHistory.v1`<br>`tenra.vicina.endpointHealth.v1` |
