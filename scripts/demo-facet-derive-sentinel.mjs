#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const suiteRoot = path.resolve(repoRoot, "..");

const steps = [
  {
    label: "Facet -> Derive",
    fixture: "tenra Facet/fixtures/handoffs/orientation-packet.json",
    next: "Import the orientation packet in Derive or send it from Facet's endpoint panel."
  },
  {
    label: "Derive -> Sentinel",
    fixture: "tenra Derive/fixtures/handoffs/reasoning-brief.json",
    next: "Import the reasoning brief in Sentinel's Risk or Derive brief inbox."
  },
  {
    label: "Sentinel -> Guardrail",
    fixture: "tenra Sentinel/fixtures/handoffs/risk-brief.json",
    next: "Export Guardrail review from Sentinel when action posture requires review."
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
  console.log(`  next: ${step.next}`);
}
