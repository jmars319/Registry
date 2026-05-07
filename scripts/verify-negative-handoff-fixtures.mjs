#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const negativeFixtureDir = path.resolve("fixtures/negative-handoffs");

function listJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? listJsonFiles(fullPath) : entry.name.endsWith(".json") ? [fullPath] : [];
  });
}

const files = listJsonFiles(negativeFixtureDir);
if (!files.length) {
  throw new Error("No negative handoff fixtures found.");
}

for (const file of files) {
  const payload = JSON.parse(fs.readFileSync(file, "utf8"));
  const isValidLedgerExport =
    payload?.schema === "tenra-registry.ledger-export.v1" &&
    typeof payload.exportId === "string" &&
    typeof payload.exportedAt === "string" &&
    payload.sourceApp === "registry" &&
    Array.isArray(payload.rows);
  if (isValidLedgerExport) {
    throw new Error(`${file} must be rejected by the Registry Ledger export parser.`);
  }
  console.log(`Rejected ${path.relative(process.cwd(), file)}: invalid Ledger export payload`);
}

console.log(`Validated ${files.length} negative Registry handoff fixture(s).`);
