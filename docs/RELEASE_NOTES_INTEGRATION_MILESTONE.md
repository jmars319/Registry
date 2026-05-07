# Suite Integration Milestone Notes

Date: 2026-05-06

This milestone turns the non-vaexcore suite from isolated fixtures into visible, retryable handoff surfaces.

- Registry can replay Ledger and Assembly handoffs and runs the cross-app smoke matrix.
- Ledger imports Registry receivables, acknowledges receipt, and exports reconciliation CSVs.
- Assembly accepts Registry and Scout intake and retries Proxy delivery attempts.
- Guardrail queues external reviews, filters them, records decisions, and sends callbacks.
- Proxy persists health history and validates/reset profile overrides.
- Scout stores endpoint config, checks destination health, and resends handoff history.
- Partition imports Guardrail decisions for blocked lab results.
- Align tracks Guardrail route state and retains conflicting Proxy-shaped replies.
- Facet stores endpoint config, validates packets, and queues failed sends.
- Derive and Sentinel round-trip reasoning briefs as explicit review context.
- Vicina remains a unique workflow app and participates through explicit Guardrail/Sentinel/Proxy/Assembly handoffs.

Next product depth should focus on real user workflows around these visible handoff controls, not background automation.
