import Link from "next/link";
import { notFound } from "next/navigation";
import { getContractsForApp, getSuiteApp } from "../../../../src/server/suite-contracts";

interface Params {
  params: Promise<{
    appId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function SuiteAppPage({ params }: Params) {
  const { appId } = await params;
  const app = getSuiteApp(appId);

  if (!app) {
    notFound();
  }

  const contracts = getContractsForApp(app.id);

  return (
    <section className="stack">
      <div className="hero-card hero-card--compact">
        <p className="eyebrow">Suite app</p>
        <h1>{app.name}</h1>
        <p className="hero-card__summary">{app.integrationPosture}</p>
        <div className="actions-row">
          <Link className="button-secondary button-link no-print" href="/suite">
            Back to suite
          </Link>
          <Link className="button-secondary button-link no-print" href="/suite/fixtures">
            Fixtures
          </Link>
        </div>
      </div>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Role</p>
            <h2>Capabilities</h2>
          </div>
          <span className="pill">{app.primarySurface}</span>
        </div>
        <div className="detail-grid">
          <div>
            <span>Repository</span>
            <strong>{app.repo}</strong>
          </div>
          <div>
            <span>Local storage prefix</span>
            <strong>{app.localStoragePrefix}</strong>
          </div>
        </div>
        <ul className="inline-issues suite-list">
          {app.capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
      </article>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Contracts</p>
            <h2>Accepted inputs and emitted outputs</h2>
          </div>
        </div>
        <div className="form-grid two">
          <div className="suite-subpanel">
            <h3>Accepted</h3>
            {contracts.accepted.length ? (
              <ul className="suite-list">
                {contracts.accepted.map((contract) => (
                  <li key={contract.id}>
                    <code>{contract.id}</code>
                    <span>{contract.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="table-subcopy">No accepted suite contract is registered yet.</p>
            )}
          </div>
          <div className="suite-subpanel">
            <h3>Emitted</h3>
            {contracts.emitted.length ? (
              <ul className="suite-list">
                {contracts.emitted.map((contract) => (
                  <li key={contract.id}>
                    <code>{contract.id}</code>
                    <span>{contract.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="table-subcopy">No emitted suite contract is registered yet.</p>
            )}
          </div>
        </div>
      </article>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Endpoints and state</p>
            <h2>Local integration surface</h2>
          </div>
        </div>
        <div className="form-grid two">
          <div className="suite-subpanel">
            <h3>Endpoints</h3>
            {app.endpoints.length ? (
              <ul className="suite-list">
                {app.endpoints.map((endpoint) => (
                  <li key={`${endpoint.method}:${endpoint.path}`}>
                    <code>{endpoint.method}</code>
                    <span>{endpoint.path}</span>
                    <small>{endpoint.label}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="table-subcopy">No suite HTTP endpoint is documented for this app yet.</p>
            )}
          </div>
          <div className="suite-subpanel">
            <h3>Local storage</h3>
            <ul className="suite-list">
              {app.localStorageKeys.map((key) => (
                <li key={key}>
                  <code>{key}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </section>
  );
}
