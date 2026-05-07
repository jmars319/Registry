import { NextResponse } from "next/server";
import { listHandoffAudits } from "../../../../../../src/server/registry-data";
import { getContractsForFlow, getSuiteFlow } from "../../../../../../src/server/suite-contracts";

interface Params {
  params: Promise<{
    flowId: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: Params) {
  const { flowId } = await params;
  const flow = getSuiteFlow(flowId);

  if (!flow) {
    return NextResponse.json({ error: "Flow not found." }, { status: 404 });
  }

  const contracts = getContractsForFlow(flow);
  const audits = await listHandoffAudits();
  const contractIds = new Set(flow.contracts);

  return NextResponse.json({
    schema: "tenra-registry.flow-audit-bundle.v1",
    exportedAt: new Date().toISOString(),
    flow,
    contracts,
    audits: audits.filter((audit) => contractIds.has(audit.schema))
  });
}
