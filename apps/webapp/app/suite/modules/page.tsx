import Link from "next/link";
import { getModuleRows, getSuiteCatalog } from "../../../src/server/suite-contracts";

export const dynamic = "force-dynamic";

export default function SuiteModulesPage() {
  const catalog = getSuiteCatalog();
  const rows = getModuleRows();
  const requiredDependencyCount = rows.reduce(
    (count, row) => count + row.app.requiredSuiteDependencies.length,
    0
  );
  const assembly = rows.find((row) => row.app.id === "assembly");
  const proxy = rows.find((row) => row.app.id === "proxy");
  const guardrail = rows.find((row) => row.app.id === "guardrail");

  return (
    <section className="stack">
      <div className="hero-card hero-card--compact">
        <p className="eyebrow">Suite modules</p>
        <h1>Standalone-first matrix</h1>
        <p className="hero-card__summary">
          Each app remains a complete product. Integrations are optional module links exposed through explicit
          contracts, local APIs, exports, imports, and fixtures.
        </p>
        <div className="actions-row">
          <Link className="button-secondary button-link no-print" href="/suite">
            Back to suite
          </Link>
          <Link className="button-secondary button-link no-print" href="/suite/fixtures">
            Fixtures
          </Link>
        </div>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span>Apps</span>
          <strong>{rows.length}</strong>
        </article>
        <article className="metric-card">
          <span>Required deps</span>
          <strong>{requiredDependencyCount}</strong>
        </article>
        <article className="metric-card">
          <span>Proxy accepts</span>
          <strong>{proxy?.accepted.length ?? 0}</strong>
        </article>
        <article className="metric-card">
          <span>Guardrail accepts</span>
          <strong>{guardrail?.accepted.length ?? 0}</strong>
        </article>
      </div>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Review</p>
            <h2>Assembly dependency check</h2>
          </div>
          <span className="pill">not foundational</span>
        </div>
        <p className="table-subcopy">
          Assembly accepts {assembly?.accepted.length ?? 0} registered contracts and emits {assembly?.emitted.length ?? 0}.
          Proxy accepts {proxy?.accepted.length ?? 0}, and Guardrail accepts {guardrail?.accepted.length ?? 0}. Assembly is
          a strong drafting module, but the catalog does not make it a required dependency for any app.
        </p>
      </article>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Rules</p>
            <h2>Modularity principles</h2>
          </div>
          <span className="pill">enforced</span>
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
            <p className="eyebrow">Matrix</p>
            <h2>Module surfaces</h2>
          </div>
          <span className="pill">{rows.length} manifests</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>App</th>
                <th>Standalone mode</th>
                <th>Required</th>
                <th>Optional</th>
                <th>Provides</th>
                <th>Consumes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.app.id}>
                  <td>
                    <Link className="table-link" href={`/suite/apps/${row.app.id}`}>
                      {row.app.name}
                    </Link>
                    <div className="table-subcopy">{row.app.modularRole}</div>
                  </td>
                  <td>{row.app.standaloneMode}</td>
                  <td>{row.app.requiredSuiteDependencies.length || "None"}</td>
                  <td>
                    {row.app.optionalSuiteDependencies.map((dependency) => (
                      <span className="pill suite-status-pill" key={dependency.app}>
                        {dependency.app}
                      </span>
                    ))}
                  </td>
                  <td>
                    {row.app.moduleInterfaces.provides.map((item) => (
                      <code className="suite-code-line" key={item}>
                        {item}
                      </code>
                    ))}
                  </td>
                  <td>
                    {row.app.moduleInterfaces.consumes.length
                      ? row.app.moduleInterfaces.consumes.map((item) => (
                          <code className="suite-code-line" key={item}>
                            {item}
                          </code>
                        ))
                      : "None"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
