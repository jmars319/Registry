#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const suiteRoot = path.resolve(repoRoot, "..");
const catalog = JSON.parse(fs.readFileSync(path.join(repoRoot, "contracts/handoff-catalog.json"), "utf8"));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function readJson(fullPath) {
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function relativeSuitePath(relativePath) {
  return path.join(suiteRoot, relativePath);
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
    return `schema must be ${contract.id}`;
  }
  if (contract.schemaFieldRequired === false && payload.schema && payload.schema !== contract.id) {
    return `optional schema must be ${contract.id}`;
  }

  for (const field of asArray(contract.requiredFields)) {
    const value = getValue(payload, field);
    if (value === undefined || value === null) {
      return `missing required field ${field}`;
    }
  }

  for (const [field, expectedType] of Object.entries(contract.fieldTypes ?? {})) {
    const value = getValue(payload, field);
    if (value === undefined || value === null) continue;
    if (!typeMatches(value, expectedType)) {
      return `${field} must be ${expectedType}`;
    }
  }

  const targetLists = [payload.recommendedNextApps, payload.targetApps].filter(Array.isArray);
  for (const targets of targetLists) {
    const unknownTargets = targets.filter((target) => !asArray(contract.consumerApps).includes(target));
    if (unknownTargets.length) {
      return `unknown target app(s): ${unknownTargets.join(", ")}`;
    }
  }

  return null;
}

function findMatchingContracts(payload) {
  return catalog.contracts.filter((contract) => validateContractPayload(contract, payload) === null);
}

function verifyGeneratedFiles() {
  const result = spawnSync(process.execPath, ["scripts/generate-suite-contract-docs.mjs", "--check"], {
    cwd: repoRoot,
    stdio: "inherit"
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function verifyCatalogShape() {
  assert(catalog.schema === "tenra-suite.handoff-catalog.v1", "Catalog schema id changed unexpectedly.");
  assert(asArray(catalog.apps).length >= 12, "Catalog must include all non-vaexcore apps.");
  assert(asArray(catalog.contracts).length >= 16, "Catalog must include every current suite handoff contract.");
  assert(asArray(catalog.flows).length >= 7, "Catalog must include current cross-app flows.");
  assert(asArray(catalog.modularityPrinciples).length >= 5, "Catalog must define suite modularity principles.");

  const appIds = new Set(catalog.apps.map((app) => app.id));
  assert(appIds.size === catalog.apps.length, "App ids must be unique.");

  const statusIds = new Set(catalog.statusVocabulary.map((entry) => entry.status));
  assert(statusIds.size === catalog.statusVocabulary.length, "Status vocabulary cannot contain duplicate statuses.");
  for (const requiredStatus of ["draft", "previewed", "queued", "sent", "accepted", "rejected", "failed", "replayed"]) {
    assert(statusIds.has(requiredStatus), `Status vocabulary must include ${requiredStatus}.`);
  }

  for (const app of catalog.apps) {
    assert(app.repo && fs.existsSync(relativeSuitePath(`${app.repo}/.git`)), `${app.name} must point at a local git repo.`);
    assert(typeof app.standaloneMode === "string" && app.standaloneMode.length > 40, `${app.name} must define standaloneMode.`);
    assert(Array.isArray(app.requiredSuiteDependencies), `${app.name} must declare requiredSuiteDependencies.`);
    assert(
      app.requiredSuiteDependencies.length === 0,
      `${app.name} cannot require another suite app while the modularity policy is standalone-first.`
    );
    assert(Array.isArray(app.optionalSuiteDependencies), `${app.name} must declare optionalSuiteDependencies.`);
    for (const dependency of app.optionalSuiteDependencies) {
      assert(appIds.has(dependency.app), `${app.name} optional dependency ${dependency.app} must be a registered app.`);
      assert(dependency.app !== app.id, `${app.name} cannot list itself as an optional dependency.`);
      assert(typeof dependency.purpose === "string" && dependency.purpose.length > 10, `${app.name} optional dependency ${dependency.app} needs a purpose.`);
    }
    assert(Array.isArray(app.moduleInterfaces?.provides), `${app.name} must declare provided module interfaces.`);
    assert(Array.isArray(app.moduleInterfaces?.consumes), `${app.name} must declare consumed module interfaces.`);
    assert(app.localStoragePrefix?.startsWith("tenra."), `${app.name} localStorage prefix must start with tenra.`);
    for (const key of asArray(app.localStorageKeys)) {
      assert(key.startsWith(app.localStoragePrefix), `${app.name} localStorage key ${key} must use ${app.localStoragePrefix}.`);
      assert(key.endsWith(".v1"), `${app.name} localStorage key ${key} must be versioned.`);
    }
    assert(
      fs.existsSync(path.join(repoRoot, "contracts/module-manifests", `${app.id}.json`)),
      `${app.name} module manifest is missing.`
    );
  }

  for (const flow of catalog.flows) {
    assert(appIds.has(flow.producer), `${flow.id} producer ${flow.producer} must be a registered app.`);
    for (const status of asArray(flow.statuses)) {
      assert(statusIds.has(status), `${flow.id} uses unknown status ${status}.`);
    }
  }
}

function verifyContracts() {
  const contractIds = new Set(catalog.contracts.map((contract) => contract.id));
  assert(contractIds.size === catalog.contracts.length, "Contract ids must be unique.");

  for (const contract of catalog.contracts) {
    const fixturePath = relativeSuitePath(contract.fixture);
    const schemaPath = path.join(repoRoot, contract.schemaFile);
    const goldenPath = path.join(repoRoot, "contracts/golden-fixtures", `${contract.id}.json`);

    assert(fs.existsSync(fixturePath), `${contract.id} fixture is missing: ${contract.fixture}`);
    assert(fs.existsSync(schemaPath), `${contract.id} JSON Schema file is missing.`);
    assert(fs.existsSync(goldenPath), `${contract.id} golden fixture is missing.`);

    const payload = readJson(fixturePath);
    const validationError = validateContractPayload(contract, payload);
    assert(!validationError, `${contract.fixture} failed ${contract.id}: ${validationError}`);

    const goldenPayload = readJson(goldenPath);
    assert(
      JSON.stringify(payload) === JSON.stringify(goldenPayload),
      `${contract.id} golden fixture is out of sync with ${contract.fixture}.`
    );

    const schema = readJson(schemaPath);
    assert(schema.$id === contract.id, `${contract.schemaFile} must use $id ${contract.id}.`);
  }

  for (const flow of catalog.flows) {
    for (const contractId of asArray(flow.contracts)) {
      assert(contractIds.has(contractId), `${flow.id} references unknown contract ${contractId}.`);
    }
    for (const fixture of asArray(flow.fixtures)) {
      assert(fs.existsSync(relativeSuitePath(fixture)), `${flow.id} fixture is missing: ${fixture}`);
    }
  }
}

function verifyNegativeFixtures() {
  const seenNegativeIds = new Set();
  for (const negativeCase of catalog.negativeCases) {
    assert(!seenNegativeIds.has(negativeCase.id), `Duplicate negative fixture id ${negativeCase.id}.`);
    seenNegativeIds.add(negativeCase.id);

    const fixturePath = path.join(repoRoot, negativeCase.fixture);
    assert(fs.existsSync(fixturePath), `${negativeCase.id} negative fixture is missing.`);
    const payload = readJson(fixturePath);
    const matches = findMatchingContracts(payload);
    assert(matches.length === 0, `${negativeCase.fixture} must not match a valid suite contract.`);
  }
}

verifyGeneratedFiles();
verifyCatalogShape();
verifyContracts();
verifyNegativeFixtures();

console.log(
  `Verified ${catalog.contracts.length} suite contracts, ${catalog.flows.length} flows, ${catalog.apps.length} module manifests, and ${catalog.negativeCases.length} negative fixtures.`
);
