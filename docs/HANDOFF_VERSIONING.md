# Handoff Versioning

The current suite contract family is `v1`.

## Rules For V1

- Keep existing required fields stable.
- Add optional fields only when older consumers can ignore them.
- Keep fixture examples small enough for review but complete enough to run through the consumer parser.
- Preserve `traceId` when returning decisions, shaped output, or callback acknowledgements.
- Preserve `exportId` when replaying or reconciling a producer export.

## Introducing V2

1. Add the new schema alongside the old parser.
2. Add a v2 fixture without deleting the v1 fixture.
3. Add compatibility checks that prove v1 fixtures still parse.
4. Update `docs/SUITE_HANDOFF_CATALOG.md`.
5. Update Registry `suite:smoke` flow matrix.
6. Only remove v1 after every consumer has a migration note and a passing fixture.

`suite:smoke` now checks that the canonical flow matrix still points at `v1` contracts until this process exists for a specific contract.
