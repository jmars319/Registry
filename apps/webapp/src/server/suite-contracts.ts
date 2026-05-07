import fs from "node:fs";
import path from "node:path";

export type SuiteApp = {
  id: string;
  name: string;
  repo: string;
  primarySurface: string;
  modularRole: string;
  integrationPosture: string;
  standaloneMode: string;
  requiredSuiteDependencies: Array<{
    app: string;
    purpose: string;
  }>;
  optionalSuiteDependencies: Array<{
    app: string;
    purpose: string;
  }>;
  moduleInterfaces: {
    provides: string[];
    consumes: string[];
  };
  localStoragePrefix: string;
  localStorageKeys: string[];
  capabilities: string[];
  endpoints: Array<{
    label: string;
    method: string;
    path: string;
  }>;
};

export type SuiteContract = {
  id: string;
  title: string;
  ownerApp: string;
  producerApp: string;
  consumerApps: string[];
  fixture: string;
  schemaFile: string;
  schemaFieldRequired?: boolean;
  requiredFields: string[];
  correlationFields: string[];
  standardControls: string[];
};

export type SuiteFlow = {
  id: string;
  label: string;
  producer: string;
  consumers: string[];
  contracts: string[];
  fixtures: string[];
  statuses: string[];
  modularBenefit: string;
};

export type SuiteStatus = {
  status: string;
  meaning: string;
};

export type SuiteCatalog = {
  schema: string;
  updatedOn: string;
  milestoneTag: string;
  modularityPrinciples: string[];
  statusVocabulary: SuiteStatus[];
  standardUiControls: string[];
  apps: SuiteApp[];
  contracts: SuiteContract[];
  flows: SuiteFlow[];
  negativeCases: Array<{
    id: string;
    fixture: string;
    expectedReason: string;
  }>;
};

export type FixturePreview = {
  contractId: string;
  fixture: string;
  exists: boolean;
  schema?: string | undefined;
  topLevelKeys: string[];
  preview: unknown;
};

function getRepoRoot(): string {
  const cwd = process.cwd();
  return cwd.endsWith(path.join("apps", "webapp")) ? path.resolve(cwd, "../..") : cwd;
}

function getSuiteRoot(): string {
  return path.resolve(getRepoRoot(), "..");
}

export function getSuiteCatalog(): SuiteCatalog {
  const catalogPath = path.join(getRepoRoot(), "contracts", "handoff-catalog.json");
  return JSON.parse(fs.readFileSync(catalogPath, "utf8")) as SuiteCatalog;
}

export function getSuiteApp(appId: string): SuiteApp | undefined {
  return getSuiteCatalog().apps.find((app) => app.id === appId);
}

export function getSuiteFlow(flowId: string): SuiteFlow | undefined {
  return getSuiteCatalog().flows.find((flow) => flow.id === flowId);
}

export function getSuiteContractsById(): Map<string, SuiteContract> {
  return new Map(getSuiteCatalog().contracts.map((contract) => [contract.id, contract]));
}

export function getContractsForApp(appId: string): { accepted: SuiteContract[]; emitted: SuiteContract[] } {
  const contracts = getSuiteCatalog().contracts;
  return {
    accepted: contracts.filter((contract) => contract.consumerApps.includes(appId)),
    emitted: contracts.filter((contract) => contract.ownerApp === appId || contract.producerApp === appId)
  };
}

export function getContractsForFlow(flow: SuiteFlow): SuiteContract[] {
  const contractsById = getSuiteContractsById();
  return flow.contracts.flatMap((contractId) => {
    const contract = contractsById.get(contractId);
    return contract ? [contract] : [];
  });
}

export function getModuleRows(): Array<{
  app: SuiteApp;
  accepted: SuiteContract[];
  emitted: SuiteContract[];
}> {
  const catalog = getSuiteCatalog();
  return catalog.apps.map((app) => ({
    app,
    ...getContractsForApp(app.id)
  }));
}

export function getFixturePreview(contract: SuiteContract): FixturePreview {
  const fixturePath = path.join(getSuiteRoot(), contract.fixture);
  if (!fs.existsSync(fixturePath)) {
    return {
      contractId: contract.id,
      fixture: contract.fixture,
      exists: false,
      topLevelKeys: [],
      preview: null
    };
  }

  const payload = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as Record<string, unknown>;
  return {
    contractId: contract.id,
    fixture: contract.fixture,
    exists: true,
    schema: typeof payload.schema === "string" ? payload.schema : undefined,
    topLevelKeys: Object.keys(payload),
    preview: payload
  };
}

export function getFixturePreviews(): FixturePreview[] {
  return getSuiteCatalog().contracts.map(getFixturePreview);
}
