# Handoff Fixture Conventions

Use this pattern for new fixtures:

```text
fixtures/handoffs/{producer}-to-{consumer}-{purpose}.json
```

Examples:

- `registry-to-ledger-receivable-export.json`
- `scout-to-assembly-opportunity.json`
- `guardrail-to-align-review-decision.json`

Legacy fixture names remain valid while they are referenced by tests and smoke checks. Rename them only in a dedicated fixture-maintenance commit that updates all script references.

## Positive Fixtures

- Must contain an object payload with a string `schema`.
- Must use the exact schema id the consumer parser expects.
- Should include stable ids and timestamps so diff output remains readable.

## Negative Fixtures

- Keep malformed examples under a verifier-specific negative folder, not in the main handoff fixture scan, unless the script explicitly expects invalid JSON.
- A negative fixture should identify the expected rejection reason in its filename or surrounding verifier code.
- CI output should print the failing fixture path and schema issue directly.
