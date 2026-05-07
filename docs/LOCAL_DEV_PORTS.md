# Suite Local Dev Ports

Use these defaults for endpoint presets and operator checklists. Repos can override ports locally, but these names keep handoff setup predictable.

| App | Default surface | Suggested local URL | Handoff endpoint examples |
| --- | --- | --- | --- |
| Registry | Next web runtime | `http://localhost:3000` | `/api/handoffs/received`, `/api/handoffs/replay/:exportId` |
| Ledger | Tauri desktop | n/a | Desktop import panel consumes Registry JSON directly |
| Assembly | Next web runtime | `http://localhost:3001` | `/api/handoffs/registry-document`, `/api/handoffs/scout-opportunity`, `/api/handoffs/proxy-notice` |
| Proxy | Vite web runtime | `http://localhost:5173` | `/api/shape-external-output`, `/api/shape-preset`, `/api/suite-health` |
| Scout | Next web runtime | `http://localhost:3002` | `/api/handoffs/deliver/:runId/:candidateId`, `/api/handoffs/health` |
| Guardrail | Vite web runtime | `http://localhost:5174` | `/api/external-reviews`, `/api/external-review-decisions`, `/api/external-review-callbacks` |
| Partition | Vite app | `http://localhost:5175` | File import/export only in the local app |
| Align | Vite web runtime | `http://localhost:5176` | File import/export only in the local app |
| Facet | Tauri desktop | n/a | Desktop sends orientation packets to configured local endpoints |
| Derive | Desktop/web | `http://localhost:3003` | File import/export in desktop and web |
| Sentinel | Desktop/web | `http://localhost:3004` | File import/export in desktop and web |
| Vicina | Next web runtime | `http://localhost:3005` | Workflow inbox sends to configured local endpoints |

When a port is unavailable, use the endpoint fields in the producing app. Do not hard-code a different port into another app's source without updating this table.
