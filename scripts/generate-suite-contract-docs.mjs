#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const suiteRoot = path.resolve(repoRoot, "..");
const checkMode = process.argv.includes("--check");
const catalogPath = path.join(repoRoot, "contracts/handoff-catalog.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function writeOrCheck(relativePath, content) {
  const fullPath = path.join(repoRoot, relativePath);
  if (checkMode) {
    const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
    if (current !== content) {
      throw new Error(`${relativePath} is out of date. Run pnpm run contracts:generate.`);
    }
    return;
  }

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

function writeSuiteFileOrCheck(relativePath, content) {
  const fullPath = path.join(suiteRoot, relativePath);
  if (checkMode) {
    const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
    if (current !== content) {
      throw new Error(`${relativePath} is out of date. Run pnpm run contracts:generate from tenra Registry.`);
    }
    return;
  }

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

function fieldSchema(type) {
  if (type === "array") return { type: "array" };
  if (type === "boolean") return { type: "boolean" };
  if (type === "number") return { type: "number" };
  if (type === "object") return { type: "object" };
  return { type: "string" };
}

function buildJsonSchema(contract) {
  const required = asArray(contract.requiredFields).filter((field) => !field.includes("."));
  const properties = {};

  for (const [field, type] of Object.entries(contract.fieldTypes ?? {})) {
    if (field.includes(".")) continue;
    properties[field] = fieldSchema(type);
  }

  if (contract.schemaFieldRequired !== false) {
    properties.schema = { const: contract.id, type: "string" };
  }

  return {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": contract.id,
    title: contract.title,
    type: "object",
    additionalProperties: true,
    required,
    properties,
    "x-tenra": {
      ownerApp: contract.ownerApp,
      producerApp: contract.producerApp,
      consumerApps: contract.consumerApps,
      fixture: contract.fixture,
      correlationFields: contract.correlationFields ?? [],
      standardControls: contract.standardControls ?? []
    }
  };
}

function readFixture(relativePath) {
  const fullPath = path.join(suiteRoot, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function mdTable(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`)
  ].join("\n");
}

function appById(appId) {
  return catalog.apps.find((app) => app.id === appId);
}

function appName(appId) {
  return appById(appId)?.name ?? appId;
}

function schemaLink(contract) {
  return `[${contract.id}](${path.relative("docs", contract.schemaFile)})`;
}

function docsGeneratedHeader(title) {
  return `# ${title}\n\nGenerated from \`contracts/handoff-catalog.json\` by \`scripts/generate-suite-contract-docs.mjs\`.\n\n`;
}

function buildCatalogDoc() {
  const contractRows = catalog.contracts.map((contract) => [
    appName(contract.producerApp),
    `\`${contract.id}\``,
    asArray(contract.consumerApps).map(appName).join(", "),
    `\`${contract.fixture}\``,
    asArray(contract.standardControls).join(", ")
  ]);
  const flowRows = catalog.flows.map((flow) => [
    `[${flow.label}](SUITE_FLOW_DIAGRAM.md#${flow.id})`,
    appName(flow.producer),
    asArray(flow.consumers).map(appName).join(", "),
    asArray(flow.contracts).map((id) => `\`${id}\``).join("<br>")
  ]);

  return `${docsGeneratedHeader("Suite Handoff Catalog")}Registry owns the suite-level contract catalog because it is the audit and replay control plane. Each app still owns its product and repo-local implementation.\n\n## Contracts\n\n${mdTable(["Producer", "Contract", "Consumers", "Fixture", "Standard controls"], contractRows)}\n\n## Flows\n\n${mdTable(["Flow", "Producer", "Consumers", "Contracts"], flowRows)}\n\n## Rules\n\n- Apps exchange explicit JSON through local APIs, exports, imports, and fixtures.\n- Consumers can persist local receipt, retry, or decision state, but must not read another app's private store.\n- \`schema\` is the contract id for schema-bearing payloads.\n- \`traceId\`, \`requestTraceId\`, and \`exportId\` are correlation keys.\n- \`suite:smoke\` reads this catalog so CI failures identify the broken app-to-app contract.\n`;
}

function buildFlowDiagramDoc() {
  const sections = catalog.flows.map((flow) => {
    const contracts = asArray(flow.contracts).map((id) => `- \`${id}\``).join("\n");
    const fixtures = asArray(flow.fixtures).map((fixture) => `- \`${fixture}\``).join("\n");
    const statuses = asArray(flow.statuses).map((status) => `\`${status}\``).join(", ");
    return `## ${flow.label}\n\n<a id="${flow.id}"></a>\n\n\`${appName(flow.producer)}\` -> ${asArray(flow.consumers).map((consumer) => `\`${appName(consumer)}\``).join(" -> ")}\n\n${flow.modularBenefit}\n\nStatuses: ${statuses}\n\nContracts:\n\n${contracts}\n\nFixtures:\n\n${fixtures}\n`;
  });

  return `${docsGeneratedHeader("Suite Flow Diagram")}This is the offline suite map. It is intentionally contract-first so it can be verified without running every app.\n\n${sections.join("\n")}`;
}

function buildCapabilitiesDoc() {
  const sections = catalog.apps.map((app) => {
    const emitted = catalog.contracts.filter((contract) => contract.ownerApp === app.id || contract.producerApp === app.id);
    const accepted = catalog.contracts.filter((contract) => asArray(contract.consumerApps).includes(app.id));
    const endpoints = asArray(app.endpoints).length
      ? asArray(app.endpoints)
          .map((endpoint) => `- ${endpoint.method} \`${endpoint.path}\` - ${endpoint.label}`)
          .join("\n")
      : "- No local HTTP endpoint documented yet; use explicit export/import controls.";

    return `## ${app.name}\n\nRole: ${app.modularRole}\n\nIntegration posture: ${app.integrationPosture}\n\nCapabilities:\n\n${asArray(app.capabilities).map((capability) => `- ${capability}`).join("\n")}\n\nEndpoints:\n\n${endpoints}\n\nEmits:\n\n${emitted.length ? emitted.map((contract) => `- \`${contract.id}\``).join("\n") : "- No emitted suite contract yet."}\n\nAccepts:\n\n${accepted.length ? accepted.map((contract) => `- \`${contract.id}\``).join("\n") : "- No accepted suite contract yet."}\n\nLocal storage prefix: \`${app.localStoragePrefix}\`\n`;
  });

  return `${docsGeneratedHeader("App Handoff Capabilities")}This file documents accepted inputs and emitted outputs for each non-vaexcore app.\n\n${sections.join("\n")}`;
}

function buildUiStandardDoc() {
  const statusRows = catalog.statusVocabulary.map((entry) => [`\`${entry.status}\``, entry.meaning]);
  const controlRows = catalog.standardUiControls.map((control) => [`\`${control}\``, "Use this exact label where the app already exposes the related action."]);
  const storageRows = catalog.apps.map((app) => [
    app.name,
    `\`${app.localStoragePrefix}\``,
    asArray(app.localStorageKeys).map((key) => `\`${key}\``).join("<br>")
  ]);

  return `${docsGeneratedHeader("Handoff UI Standard")}Use the same lifecycle words and controls across app-specific handoff panels. Apps can skip controls that do not apply to their workflow, but should not rename the same concept differently.\n\n## Status Vocabulary\n\n${mdTable(["Status", "Meaning"], statusRows)}\n\n## Standard Controls\n\n${mdTable(["Control", "Rule"], controlRows)}\n\n## Local Storage Keys\n\n${mdTable(["App", "Prefix", "Keys"], storageRows)}\n`;
}

function buildContractChangelogDoc() {
  const rows = catalog.contracts.map((contract) => [
    `\`${contract.id}\``,
    "current",
    catalog.updatedOn,
    "V1 contract accepted by the suite catalog verifier."
  ]);

  return `${docsGeneratedHeader("Contract Changelog")}This changelog is separate from app changelogs. Update it when a schema version, fixture, routing contract, or lifecycle expectation changes.\n\n${mdTable(["Contract", "State", "Updated", "Note"], rows)}\n\n## Version Policy\n\n- Additive optional fields can remain in v1 when older consumers ignore them.\n- Required field changes need a v2 schema and a migration fixture.\n- Do not remove a v1 fixture until every listed consumer has a migration note.\n`;
}

function buildModularIntegrationDoc() {
  const rows = catalog.apps.map((app) => [
    app.name,
    app.modularRole,
    app.standaloneMode,
    asArray(app.optionalSuiteDependencies).map((dependency) => appName(dependency.app)).join(", ") || "None",
    app.integrationPosture
  ]);

  return `${docsGeneratedHeader("Modular App Integration")}The current suite should keep the apps as distinct products. The integration move is modular usage, not folding apps into one another.\n\n## Review Result\n\nThe concern that Assembly was becoming too foundational is directionally valid in the wording, but not in the actual dependency model. Assembly is a useful document module and accepts many inputs, but it is not required by any app. Proxy and Guardrail are the most reusable service modules by inbound contract count. This pass makes the boundary explicit: every app has a standalone mode and zero required suite dependencies.\n\n## Principles\n\n${catalog.modularityPrinciples.map((principle) => `- ${principle}`).join("\n")}\n\n${mdTable(["App", "Modular role", "Standalone mode", "Optional modules", "Posture"], rows)}\n\n## Current Readiness\n\n- Proxy and Guardrail are the clearest reusable service modules because multiple apps already route through them.\n- Assembly is a reusable drafting module, not a foundation layer. Producers must remain useful without it.\n- Registry should index, audit, replay, and verify module contracts without becoming a hidden runtime bus.\n- Vicina should remain a workflow orchestrator that routes to specialized apps through explicit optional handoffs.\n`;
}

function getModuleManifest(app) {
  const emitted = catalog.contracts.filter((contract) => contract.ownerApp === app.id || contract.producerApp === app.id);
  const accepted = catalog.contracts.filter((contract) => asArray(contract.consumerApps).includes(app.id));

  return {
    schema: "tenra-suite.module-manifest.v1",
    appId: app.id,
    name: app.name,
    repo: app.repo,
    primarySurface: app.primarySurface,
    standaloneMode: app.standaloneMode,
    requiredSuiteDependencies: app.requiredSuiteDependencies,
    optionalSuiteDependencies: app.optionalSuiteDependencies,
    moduleInterfaces: app.moduleInterfaces,
    contracts: {
      emits: emitted.map((contract) => contract.id),
      accepts: accepted.map((contract) => contract.id)
    },
    rules: catalog.modularityPrinciples
  };
}

function buildModuleMatrixDoc() {
  const rows = catalog.apps.map((app) => {
    const manifest = getModuleManifest(app);
    return [
      app.name,
      manifest.requiredSuiteDependencies.length ? manifest.requiredSuiteDependencies.map((dependency) => appName(dependency.app)).join(", ") : "None",
      asArray(app.optionalSuiteDependencies).map((dependency) => appName(dependency.app)).join(", ") || "None",
      asArray(app.moduleInterfaces?.provides).join(", "),
      asArray(app.moduleInterfaces?.consumes).join(", ") || "None"
    ];
  });

  return `${docsGeneratedHeader("Module Matrix")}This is the first modularization layer. It records how each app stands alone, what it can provide to other apps, and which integrations are optional.\n\n${mdTable(["App", "Required modules", "Optional modules", "Provides", "Consumes"], rows)}\n\n## Enforcement\n\n- \`verify:contracts\` fails if any app lacks a standalone mode.\n- \`verify:contracts\` fails if a required suite dependency is introduced without changing the modularity policy.\n- Optional dependencies must reference registered apps.\n`;
}

function buildAppModuleManifestDoc(app) {
  const manifest = getModuleManifest(app);
  const optionalDependencies = manifest.optionalSuiteDependencies.length
    ? manifest.optionalSuiteDependencies.map((dependency) => `- ${appName(dependency.app)}: ${dependency.purpose}`).join("\n")
    : "- None";
  const requiredDependencies = manifest.requiredSuiteDependencies.length
    ? manifest.requiredSuiteDependencies.map((dependency) => `- ${appName(dependency.app)}: ${dependency.purpose}`).join("\n")
    : "- None";

  return `# Module Manifest\n\nGenerated from \`tenra Registry/contracts/handoff-catalog.json\` by \`tenra Registry/scripts/generate-suite-contract-docs.mjs\`.\n\n## Standalone Mode\n\n${manifest.standaloneMode}\n\n## Required Suite Dependencies\n\n${requiredDependencies}\n\n## Optional Suite Dependencies\n\n${optionalDependencies}\n\n## Provides\n\n${asArray(manifest.moduleInterfaces.provides).map((item) => `- ${item}`).join("\n")}\n\n## Consumes\n\n${asArray(manifest.moduleInterfaces.consumes).length ? asArray(manifest.moduleInterfaces.consumes).map((item) => `- ${item}`).join("\n") : "- None"}\n\n## Contracts\n\nEmits:\n\n${manifest.contracts.emits.length ? manifest.contracts.emits.map((id) => `- \`${id}\``).join("\n") : "- None"}\n\nAccepts:\n\n${manifest.contracts.accepts.length ? manifest.contracts.accepts.map((id) => `- \`${id}\``).join("\n") : "- None"}\n\n## Rules\n\n${manifest.rules.map((rule) => `- ${rule}`).join("\n")}\n`;
}

function buildFixtureDoc() {
  const rows = catalog.contracts.map((contract) => [
    `\`${contract.id}\``,
    `\`${contract.fixture}\``,
    `\`${contract.schemaFile}\``,
    asArray(contract.correlationFields).map((field) => `\`${field}\``).join(", ")
  ]);
  const negativeRows = catalog.negativeCases.map((negativeCase) => [
    `\`${negativeCase.id}\``,
    `\`${negativeCase.fixture}\``,
    negativeCase.expectedReason
  ]);

  return `${docsGeneratedHeader("Handoff Fixtures")}Positive fixtures are copied into \`contracts/golden-fixtures/\` by the generator. Negative fixtures live under \`fixtures/negative-handoffs/\` and are checked by the catalog verifier.\n\n## Golden Fixtures\n\n${mdTable(["Contract", "Source fixture", "Schema", "Correlation"], rows)}\n\n## Negative Fixtures\n\n${mdTable(["Case", "Fixture", "Expected rejection"], negativeRows)}\n`;
}

function buildAppStandardDoc(app) {
  const emitted = catalog.contracts.filter((contract) => contract.ownerApp === app.id || contract.producerApp === app.id);
  const accepted = catalog.contracts.filter((contract) => asArray(contract.consumerApps).includes(app.id));
  const relevantControls = [...new Set([...emitted, ...accepted].flatMap((contract) => asArray(contract.standardControls)))];
  const endpoints = asArray(app.endpoints).length
    ? asArray(app.endpoints)
        .map((endpoint) => `- ${endpoint.method} \`${endpoint.path}\` - ${endpoint.label}`)
        .join("\n")
    : "- No suite HTTP endpoint is documented for this app yet.";

  return `# Suite Handoff Standard\n\nGenerated from \`tenra Registry/contracts/handoff-catalog.json\` by \`tenra Registry/scripts/generate-suite-contract-docs.mjs\`.\n\n## App Role\n\n${app.modularRole}\n\n${app.integrationPosture}\n\n## Standalone Mode\n\n${app.standaloneMode}\n\n## Accepted Inputs\n\n${accepted.length ? accepted.map((contract) => `- \`${contract.id}\` from ${appName(contract.producerApp)}`).join("\n") : "- No accepted suite contract is registered yet."}\n\n## Emitted Outputs\n\n${emitted.length ? emitted.map((contract) => `- \`${contract.id}\` to ${asArray(contract.consumerApps).map(appName).join(", ")}`).join("\n") : "- No emitted suite contract is registered yet."}\n\n## Standard Controls\n\n${relevantControls.length ? relevantControls.map((control) => `- ${control}`).join("\n") : catalog.standardUiControls.map((control) => `- ${control}`).join("\n")}\n\n## Status Vocabulary\n\n${catalog.statusVocabulary.map((entry) => `- \`${entry.status}\`: ${entry.meaning}`).join("\n")}\n\n## Local Storage\n\nPrefix: \`${app.localStoragePrefix}\`\n\n${asArray(app.localStorageKeys).map((key) => `- \`${key}\``).join("\n")}\n\n## Endpoints\n\n${endpoints}\n`;
}

function buildNegativeFixtures() {
  return new Map([
    [
      "fixtures/negative-handoffs/suite-missing-schema.json",
      {
        exportId: "registry-ledger-missing-schema",
        exportedAt: "2026-05-07T00:00:00.000Z",
        organizationId: "org-demo",
        sourceApp: "registry",
        rows: []
      }
    ],
    [
      "fixtures/negative-handoffs/suite-invalid-timestamp.json",
      {
        schema: "tenra-registry.assembly-document-request.v1",
        exportId: "registry-assembly-invalid-time",
        exportedAt: false,
        sourceApp: "registry",
        organizationId: "org-demo",
        customerId: "cust-demo",
        documentType: "past-due-notice",
        title: "Invalid timestamp fixture",
        contextMarkdown: "Timestamp must be an ISO string.",
        desiredOutput: "notice"
      }
    ],
    [
      "fixtures/negative-handoffs/suite-wrong-target-app.json",
      {
        schema: "tenra-scout.opportunity-handoff.v1",
        exportedAt: "2026-05-07T00:00:00.000Z",
        sourceApp: "scout",
        runId: "run-wrong-target",
        candidateId: "candidate-wrong-target",
        businessName: "Wrong Target Inc",
        primaryUrl: "https://example.invalid",
        evidenceMarkdown: "This fixture intentionally omits required recommended apps.",
        recommendedNextApps: ["ledger"],
        proxyShapeRequest: {}
      }
    ],
    [
      "fixtures/negative-handoffs/suite-stale-schema-version.json",
      {
        schema: "tenra-derive.reasoning-brief.v0",
        exportedAt: "2026-05-07T00:00:00.000Z",
        sourceApp: "derive",
        question: "Why is this stale?",
        answer: "The suite only accepts v1 here.",
        handoff: {}
      }
    ],
    [
      "fixtures/negative-handoffs/suite-duplicate-trace.json",
      {
        schema: "tenra-guardrail.external-action-review.v1",
        exportedAt: "2026-05-07T00:00:00.000Z",
        sourceApp: "assembly",
        actionKind: "publish",
        actorLabel: "Operator",
        targetLabel: "Duplicate trace fixture",
        summary: "Duplicate trace fixtures must be explicit, not silently accepted as canonical.",
        evidence: [],
        recommendedDecision: "hold",
        traceId: ["duplicate-trace-id", "duplicate-trace-id"],
        duplicateTraceOf: "duplicate-trace-id"
      }
    ]
  ]);
}

for (const contract of catalog.contracts) {
  writeOrCheck(contract.schemaFile, formatJson(buildJsonSchema(contract)));
  const fixture = readFixture(contract.fixture);
  writeOrCheck(`contracts/golden-fixtures/${contract.id}.json`, formatJson(fixture));
}

writeOrCheck("contracts/status-vocabulary.json", formatJson({
  schema: "tenra-suite.status-vocabulary.v1",
  statuses: catalog.statusVocabulary
}));
writeOrCheck("contracts/local-storage-keys.json", formatJson({
  schema: "tenra-suite.local-storage-keys.v1",
  apps: catalog.apps.map((app) => ({
    appId: app.id,
    prefix: app.localStoragePrefix,
    keys: app.localStorageKeys
  }))
}));
writeOrCheck("contracts/module-manifests/index.json", formatJson({
  schema: "tenra-suite.module-manifest-index.v1",
  updatedOn: catalog.updatedOn,
  manifests: catalog.apps.map((app) => ({
    appId: app.id,
    path: `contracts/module-manifests/${app.id}.json`
  }))
}));
for (const app of catalog.apps) {
  writeOrCheck(`contracts/module-manifests/${app.id}.json`, formatJson(getModuleManifest(app)));
}
writeOrCheck("contracts/known-compatible-versions.json", formatJson({
  schema: "tenra-suite.known-compatible-versions.v1",
  milestoneTag: catalog.milestoneTag,
  updatedOn: catalog.updatedOn,
  contracts: catalog.contracts.map((contract) => ({
    id: contract.id,
    ownerApp: contract.ownerApp,
    state: "current",
    version: "v1",
    fixture: contract.fixture
  }))
}));

for (const [relativePath, payload] of buildNegativeFixtures()) {
  writeOrCheck(relativePath, formatJson(payload));
}

writeOrCheck("docs/SUITE_HANDOFF_CATALOG.md", buildCatalogDoc());
writeOrCheck("docs/SUITE_FLOW_DIAGRAM.md", buildFlowDiagramDoc());
writeOrCheck("docs/APP_HANDOFF_CAPABILITIES.md", buildCapabilitiesDoc());
writeOrCheck("docs/HANDOFF_UI_STANDARD.md", buildUiStandardDoc());
writeOrCheck("docs/CONTRACT_CHANGELOG.md", buildContractChangelogDoc());
writeOrCheck("docs/MODULAR_APP_INTEGRATION.md", buildModularIntegrationDoc());
writeOrCheck("docs/MODULE_MATRIX.md", buildModuleMatrixDoc());
writeOrCheck("docs/HANDOFF_FIXTURES.md", buildFixtureDoc());

for (const app of catalog.apps) {
  writeSuiteFileOrCheck(`${app.repo}/docs/SUITE_HANDOFF_STANDARD.md`, buildAppStandardDoc(app));
  writeSuiteFileOrCheck(`${app.repo}/docs/MODULE_MANIFEST.md`, buildAppModuleManifestDoc(app));
}

if (!checkMode) {
  console.log(`Generated ${catalog.contracts.length} schemas, ${catalog.flows.length} flow docs, and ${catalog.apps.length} module manifests.`);
}
