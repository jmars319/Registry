import { REGISTRY_APP_NAME, registryModules, registryWebRoutes } from "@registry/config";
import { formatCountLabel } from "@registry/ui";
import Link from "next/link";
import { formatDateRangeLabel, formatRateLabel } from "../src/components/registry/formatters";
import { StatusPill } from "../src/components/registry/status-pill";
import { getDashboardSnapshot } from "../src/server/registry-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();

  const operationalMetrics = [
    {
      label: "Active customers",
      value: String(snapshot.counts.customers),
      note: "Customer records currently open for operations."
    },
    {
      label: "Tracked assets",
      value: String(snapshot.counts.assets),
      note: "All assets currently stored in the operational registry."
    },
    {
      label: "Active assignments",
      value: String(snapshot.counts.activeAssignments),
      note: "Assets currently occupied by an active customer assignment."
    },
    {
      label: "Available assets",
      value: String(snapshot.counts.availableAssets),
      note: "Assets still free to assign right now."
    }
  ] as const;

  return (
    <section className="stack">
      <div className="hero-card">
        <p className="eyebrow">Primary Surface</p>
        <h1>{REGISTRY_APP_NAME}</h1>
        <p className="hero-card__summary">
          Live operational workspace for {snapshot.organization.name}. Customers, assets, and assignments now persist to
          Postgres through the web app.
        </p>
      </div>

      <div className="metric-grid">
        {operationalMetrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.note}</span>
          </article>
        ))}
      </div>

      <div className="overview-grid">
        <section className="panel-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Assignments</p>
              <h2>Current active assignments</h2>
            </div>
            <Link className="inline-link" href={registryWebRoutes.assignments}>
              Open assignments
            </Link>
          </div>

          {snapshot.activeAssignments.length === 0 ? (
            <div className="empty-state">
              <h3>No active assignments yet</h3>
              <p>Create a customer, create an asset, then create an active assignment to occupy it.</p>
            </div>
          ) : (
            <div className="activity-list">
              {snapshot.activeAssignments.map((assignment) => (
                <article className="activity-item" key={assignment.id}>
                  <div>
                    <div className="activity-item__heading">
                      <Link className="inline-link" href={assignment.href}>
                        {assignment.assetCode}
                      </Link>
                      <StatusPill status={assignment.status} />
                    </div>
                    <p>
                      {assignment.customerName} is assigned to {assignment.assetName}
                    </p>
                    <p className="activity-item__meta">
                      {formatDateRangeLabel(assignment.startDate, assignment.endDate)} ·{" "}
                      {formatRateLabel(assignment.rateInCents)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Modules</p>
              <h2>Current working areas</h2>
            </div>
            <span className="pill">{formatCountLabel(registryModules.length, "module")}</span>
          </div>

          <div className="module-grid">
            {registryModules.map((module) => (
              <Link className="module-card" href={module.href} key={module.key}>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <span>Open module</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="panel-card panel-card--soft">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Current Slice</p>
            <h2>What is live right now</h2>
          </div>
        </div>
        <div className="tag-list">
          <span className="tag">Postgres persistence</span>
          <span className="tag">Prisma migrations</span>
          <span className="tag">Customer list/create/detail</span>
          <span className="tag">Asset list/create/detail</span>
          <span className="tag">Assignment list/create/detail</span>
        </div>
      </section>
    </section>
  );
}
