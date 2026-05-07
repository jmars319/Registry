#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const suiteRoot = path.resolve(repoRoot, "..");

const steps = [
  {
    label: "Registry -> Ledger",
    fixture: "tenra Registry/fixtures/handoffs/ledger-export.json",
    consumer: "Ledger desktop Registry tab",
    endpoint: "Paste JSON into Ledger; optional receipt endpoint is Registry /api/handoffs/received."
  },
  {
    label: "Registry -> Assembly",
    fixture: "tenra Registry/fixtures/handoffs/assembly-document-request.json",
    consumer: "Assembly Project Notes inbox",
    endpoint: "POST to Assembly /api/handoffs/registry-document or paste in the inbox."
  },
  {
    label: "Assembly -> Proxy",
    fixture: "tenra Assembly/fixtures/handoffs/proxy-notice-handoff.json",
    consumer: "Proxy shape endpoint",
    endpoint: "POST to Proxy /api/shape-external-output from Assembly's Proxy notice action."
  }
];

for (const step of steps) {
  const fullPath = path.join(suiteRoot, step.fixture);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing demo fixture: ${step.fixture}`);
  }
  const payload = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  console.log(`${step.label}`);
  console.log(`  schema: ${payload.schema ?? payload.proxyShapeRequest?.schema ?? "shape-request"}`);
  console.log(`  fixture: ${step.fixture}`);
  console.log(`  consumer: ${step.consumer}`);
  console.log(`  next: ${step.endpoint}`);
}
