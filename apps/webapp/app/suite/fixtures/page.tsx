import Link from "next/link";
import { getFixturePreviews, getSuiteCatalog } from "../../../src/server/suite-contracts";

export const dynamic = "force-dynamic";

export default function SuiteFixturesPage() {
  const catalog = getSuiteCatalog();
  const previews = getFixturePreviews();

  return (
    <section className="stack">
      <div className="hero-card hero-card--compact">
        <p className="eyebrow">Suite fixtures</p>
        <h1>Import preview</h1>
        <p className="hero-card__summary">
          Golden fixture snapshots, top-level keys, negative cases, and schema paths for offline contract review.
        </p>
        <div className="actions-row">
          <Link className="button-secondary button-link no-print" href="/suite">
            Back to suite
          </Link>
        </div>
      </div>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Golden fixtures</p>
            <h2>Contract payloads</h2>
          </div>
          <span className="pill">{previews.length} fixture(s)</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Contract</th>
                <th>Fixture</th>
                <th>Schema</th>
                <th>Top-level keys</th>
              </tr>
            </thead>
            <tbody>
              {previews.map((preview) => (
                <tr key={preview.contractId}>
                  <td>
                    <code>{preview.contractId}</code>
                  </td>
                  <td>
                    <code>{preview.fixture}</code>
                  </td>
                  <td>{preview.schema ? <span className="pill">{preview.schema}</span> : <span className="pill">schema-less</span>}</td>
                  <td>{preview.topLevelKeys.map((key) => <code className="suite-code-line" key={key}>{key}</code>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Negative coverage</p>
            <h2>Expected rejections</h2>
          </div>
          <span className="pill">{catalog.negativeCases.length} case(s)</span>
        </div>
        <div className="suite-card-grid">
          {catalog.negativeCases.map((negativeCase) => (
            <div className="suite-card" key={negativeCase.id}>
              <span className="pill">{negativeCase.id}</span>
              <p>
                <code>{negativeCase.fixture}</code>
              </p>
              <p>{negativeCase.expectedReason}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
