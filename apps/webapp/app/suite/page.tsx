import Link from "next/link";
import { getSuiteCatalog } from "../../src/server/suite-contracts";

export const dynamic = "force-dynamic";

export default function SuitePage() {
  const catalog = getSuiteCatalog();

  return (
    <section className="stack">
      <div className="hero-card hero-card--compact">
        <p className="eyebrow">Suite control</p>
        <h1>Handoff map</h1>
        <p className="hero-card__summary">
          Offline contract catalog, app capabilities, flow routes, fixture previews, and modular integration posture
          for the non-vaexcore tenra apps.
        </p>
        <div className="actions-row">
          <Link className="button-secondary button-link no-print" href="/suite/modules">
            Module Matrix
          </Link>
          <Link className="button-secondary button-link no-print" href="/suite/fixtures">
            Fixture Browser
          </Link>
          <Link className="button-secondary button-link no-print" href="/handoffs">
            Registry Audit
          </Link>
        </div>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span>Apps</span>
          <strong>{catalog.apps.length}</strong>
        </article>
        <article className="metric-card">
          <span>Contracts</span>
          <strong>{catalog.contracts.length}</strong>
        </article>
        <article className="metric-card">
          <span>Flows</span>
          <strong>{catalog.flows.length}</strong>
        </article>
        <article className="metric-card">
          <span>Milestone</span>
          <strong className="metric-card__tag">{catalog.milestoneTag}</strong>
        </article>
      </div>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Apps</p>
            <h2>Modular roles</h2>
          </div>
          <span className="pill">{catalog.apps.length} products</span>
        </div>
        <div className="suite-card-grid">
          {catalog.apps.map((app) => (
            <Link className="suite-card" href={`/suite/apps/${app.id}`} key={app.id}>
              <span className="pill">{app.primarySurface}</span>
              <h3>{app.name}</h3>
              <p>{app.modularRole}</p>
              <p className="table-subcopy">{app.standaloneMode}</p>
            </Link>
          ))}
        </div>
      </article>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Modularity</p>
            <h2>Standalone-first rules</h2>
          </div>
          <span className="pill">required deps: 0</span>
        </div>
        <div className="suite-card-grid suite-card-grid--compact">
          {catalog.modularityPrinciples.map((principle) => (
            <div className="suite-card" key={principle}>
              <p>{principle}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Flows</p>
            <h2>Contract routes</h2>
          </div>
          <span className="pill">{catalog.flows.length} routes</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Flow</th>
                <th>Producer</th>
                <th>Consumers</th>
                <th>Contracts</th>
                <th>Status words</th>
              </tr>
            </thead>
            <tbody>
              {catalog.flows.map((flow) => (
                <tr key={flow.id}>
                  <td>
                    <Link className="table-link" href={`/suite/flows/${flow.id}`}>
                      {flow.label}
                    </Link>
                    <div className="table-subcopy">{flow.modularBenefit}</div>
                  </td>
                  <td>{catalog.apps.find((app) => app.id === flow.producer)?.name ?? flow.producer}</td>
                  <td>{flow.consumers.map((consumer) => catalog.apps.find((app) => app.id === consumer)?.name ?? consumer).join(", ")}</td>
                  <td>
                    {flow.contracts.map((contractId) => (
                      <code className="suite-code-line" key={contractId}>
                        {contractId}
                      </code>
                    ))}
                  </td>
                  <td>{flow.statuses.map((status) => <span className="pill suite-status-pill" key={status}>{status}</span>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Lifecycle</p>
            <h2>Status vocabulary</h2>
          </div>
        </div>
        <div className="suite-card-grid suite-card-grid--compact">
          {catalog.statusVocabulary.map((entry) => (
            <div className="suite-card" key={entry.status}>
              <span className="pill">{entry.status}</span>
              <p>{entry.meaning}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
