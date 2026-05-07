# Suite Operator Checklist

1. Pull `main` in every non-vaexcore app repo.
2. Copy each repo's `.env.example` to `.env` only where local overrides are needed.
3. Start the consuming app before configuring a producer endpoint.
4. Run `pnpm run verify:handoffs` or `npm run verify:handoffs` in the repo being changed.
5. Run `pnpm run suite:smoke` from Registry after changing any handoff fixture, endpoint, parser, or callback.
6. Use the app UI to paste/import the producer fixture before sending to a real endpoint.
7. Prefer "copy JSON" fallback when a consumer is not running.
8. Confirm retry queues and callback queues are empty or intentionally retained before ending a test session.
9. Export any reconciliation/report CSVs needed for human review.
10. Commit and push only after the repo-local verifier and Registry `suite:smoke` pass.

## Demo Flows

- Registry to Ledger and Assembly: `pnpm run suite:demo:registry`
- Facet to Derive to Sentinel: `pnpm run suite:demo:reasoning`
- Partition, Vicina, and Align through Guardrail callbacks: `pnpm run suite:demo:guardrail`

The demo scripts do not mutate app stores. They read fixtures, print the contracts, and identify the next endpoint or import panel to use.
