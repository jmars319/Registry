#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const suiteRoot = path.resolve(repoRoot, "..");

const steps = [
  {
    label: "Partition -> Guardrail",
    fixture: "tenra Partition/fixtures/handoffs/lab-validation-result.json",
    callback: "Import Guardrail decision JSON back into Partition's lab panel."
  },
  {
    label: "Align -> Guardrail -> Proxy",
    fixture: "tenra Align/fixtures/handoffs/review-reply-route.json",
    callback: "Apply Guardrail decision and Proxy shaped reply in Align's return panels."
  },
  {
    label: "Vicina -> Guardrail",
    fixture: "Vicina by tenra/fixtures/handoffs/workflow-handoff.json",
    callback: "Use Vicina workflow inbox endpoint fields to send a Guardrail review."
  },
  {
    label: "Guardrail decision",
    fixture: "tenra Guardrail/fixtures/handoffs/external-action-decision.json",
    callback: "Post with /api/external-review-callbacks or paste into the source app."
  }
];

for (const step of steps) {
  const fullPath = path.join(suiteRoot, step.fixture);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing demo fixture: ${step.fixture}`);
  }
  const payload = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  console.log(`${step.label}`);
  console.log(`  schema: ${payload.schema}`);
  console.log(`  fixture: ${step.fixture}`);
  console.log(`  return: ${step.callback}`);
}
