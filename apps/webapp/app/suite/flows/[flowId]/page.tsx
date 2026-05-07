import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getContractsForFlow,
  getFixturePreview,
  getSuiteCatalog,
  getSuiteFlow
} from "../../../../src/server/suite-contracts";

interface Params {
  params: Promise<{
    flowId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function SuiteFlowPage({ params }: Params) {
  const { flowId } = await params;
  const catalog = getSuiteCatalog();
  const flow = getSuiteFlow(flowId);

  if (!flow) {
    notFound();
  }

  const contracts = getContractsForFlow(flow);

  return (
    <section className="stack">
      <div className="hero-card hero-card--compact">
        <p className="eyebrow">Suite flow</p>
        <h1>{flow.label}</h1>
        <p className="hero-card__summary">{flow.modularBenefit}</p>
        <div className="actions-row">
          <Link className="button-secondary button-link no-print" href="/suite">
            Back to suite
          </Link>
          <Link className="button-secondary button-link no-print" href={`/api/suite/flows/${flow.id}/bundle`}>
            Export Bundle
          </Link>
        </div>
      </div>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Route</p>
            <h2>Producer and consumers</h2>
          </div>
          <span className="pill">{flow.statuses.length} states</span>
        </div>
        <div className="suite-route">
          <Link href={`/suite/apps/${flow.producer}`}>
            {catalog.apps.find((app) => app.id === flow.producer)?.name ?? flow.producer}
          </Link>
          {flow.consumers.map((consumer) => (
            <Link href={`/suite/apps/${consumer}`} key={consumer}>
              {catalog.apps.find((app) => app.id === consumer)?.name ?? consumer}
            </Link>
          ))}
        </div>
        <div className="actions-row">
          {flow.statuses.map((status) => (
            <span className="pill" key={status}>
              {status}
            </span>
          ))}
        </div>
      </article>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Contracts</p>
            <h2>Schemas and controls</h2>
          </div>
          <span className="pill">{contracts.length} contract(s)</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Contract</th>
                <th>Required fields</th>
                <th>Correlation</th>
                <th>Controls</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td>
                    <code>{contract.id}</code>
                    <div className="table-subcopy">{contract.title}</div>
                  </td>
                  <td>{contract.requiredFields.map((field) => <code className="suite-code-line" key={field}>{field}</code>)}</td>
                  <td>
                    {contract.correlationFields.map((field) => (
                      <span className="pill suite-status-pill" key={field}>
                        {field}
                      </span>
                    ))}
                  </td>
                  <td>{contract.standardControls.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Fixtures</p>
            <h2>Import preview</h2>
          </div>
        </div>
        <div className="suite-card-grid">
          {contracts.map((contract) => {
            const preview = getFixturePreview(contract);
            return (
              <div className="suite-card" key={contract.id}>
                <span className="pill">{preview.exists ? "available" : "missing"}</span>
                <h3>{contract.title}</h3>
                <p>
                  <code>{preview.fixture}</code>
                </p>
                <pre className="code-block">{JSON.stringify(preview.preview, null, 2)}</pre>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}
