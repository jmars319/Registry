import Link from "next/link";
import { AssetCreateForm } from "../../src/components/forms/asset-create-form";
import { StatusPill } from "../../src/components/registry/status-pill";
import { getDefaultOrganization, listAssets } from "../../src/server/registry-data";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const [organization, assets] = await Promise.all([getDefaultOrganization(), listAssets()]);

  return (
    <section className="stack">
      <div className="hero-card hero-card--compact">
        <p className="eyebrow">Assets</p>
        <h1>Asset registry</h1>
        <p className="hero-card__summary">
          Track generalized operational assets for {organization.name}, including current location and assignment-ready
          availability.
        </p>
      </div>

      <div className="workspace-grid">
        <div className="panel-stack">
          <AssetCreateForm />
          <article className="panel-card panel-card--soft">
            <h2>Current rule</h2>
            <p>
              Asset codes must be unique within the organization, and only active assignments occupy an asset for
              scheduling purposes.
            </p>
          </article>
        </div>

        <article className="panel-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">List View</p>
              <h2>Assets</h2>
            </div>
            <span className="pill">{assets.length} total</span>
          </div>

          {assets.length === 0 ? (
            <div className="empty-state">
              <h3>No assets yet</h3>
              <p>Create the first asset to make assignment workflows possible.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Current assignment</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id}>
                      <td>
                        <Link className="table-link" href={asset.href}>
                          {asset.assetCode}
                        </Link>
                        <div className="table-subcopy">{asset.name}</div>
                      </td>
                      <td>{asset.category}</td>
                      <td>{asset.currentLocation ?? <span className="table-subcopy">Not set</span>}</td>
                      <td>
                        <StatusPill status={asset.status} />
                      </td>
                      <td>
                        {asset.activeAssignment ? (
                          <div>
                            <div>{asset.activeAssignment.customerName}</div>
                            <div className="table-subcopy">Assignment active</div>
                          </div>
                        ) : (
                          <span className="table-subcopy">No active assignment</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
