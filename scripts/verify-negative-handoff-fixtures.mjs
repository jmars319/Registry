#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const negativeFixtureDir = path.resolve("fixtures/negative-handoffs");
const catalog = JSON.parse(fs.readFileSync(path.resolve("contracts/handoff-catalog.json"), "utf8"));

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

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function getValue(payload, dottedPath) {
  return dottedPath.split(".").reduce((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return current[key];
  }, payload);
}

function typeMatches(value, expectedType) {
  if (expectedType === "array") return Array.isArray(value);
  if (expectedType === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  return typeof value === expectedType;
}

function validateContractPayload(contract, payload) {
  if (contract.schemaFieldRequired !== false && payload.schema !== contract.id) {
    return false;
  }
  if (contract.schemaFieldRequired === false && payload.schema && payload.schema !== contract.id) {
    return false;
  }

  for (const field of asArray(contract.requiredFields)) {
    const value = getValue(payload, field);
    if (value === undefined || value === null) return false;
  }

  for (const [field, expectedType] of Object.entries(contract.fieldTypes ?? {})) {
    const value = getValue(payload, field);
    if (value === undefined || value === null) continue;
    if (!typeMatches(value, expectedType)) return false;
  }

  const targetLists = [payload.recommendedNextApps, payload.targetApps].filter(Array.isArray);
  for (const targets of targetLists) {
    if (targets.some((target) => !asArray(contract.consumerApps).includes(target))) {
      return false;
    }
  }

  return true;
}

for (const file of files) {
  const payload = JSON.parse(fs.readFileSync(file, "utf8"));
  const matchingContracts = catalog.contracts.filter((contract) => validateContractPayload(contract, payload));
  if (matchingContracts.length) {
    throw new Error(
      `${file} must be rejected, but it matches ${matchingContracts.map((contract) => contract.id).join(", ")}.`
    );
  }
  console.log(`Rejected ${path.relative(process.cwd(), file)}: invalid suite handoff payload`);
}

console.log(`Validated ${files.length} negative Registry handoff fixture(s).`);
