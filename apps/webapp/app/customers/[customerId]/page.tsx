import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDateRangeLabel } from "../../../src/components/registry/formatters";
import { StatusPill } from "../../../src/components/registry/status-pill";
import { getCustomerDetail } from "../../../src/server/registry-data";

export const dynamic = "force-dynamic";

interface CustomerDetailPageProps {
  params: Promise<{
    customerId: string;
  }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { customerId } = await params;
  const detail = await getCustomerDetail(customerId);

  if (!detail) {
    notFound();
  }

  return (
    <section className="stack">
      <div className="hero-card hero-card--compact">
        <p className="eyebrow">Customer Detail</p>
        <h1>{detail.customer.name}</h1>
        <p className="hero-card__summary">
          {detail.customer.companyName ?? "No company name on file"} · {detail.customer.email ?? "No email"} ·{" "}
          {detail.customer.phone ?? "No phone"}
        </p>
      </div>

      <div className="detail-grid">
        <article className="panel-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Profile</p>
              <h2>Customer record</h2>
            </div>
            <StatusPill status={detail.customer.status} />
          </div>

          <dl className="detail-list">
            <div>
              <dt>Billing address</dt>
              <dd>
                {[
                  detail.customer.billingStreet1,
                  detail.customer.billingStreet2,
                  [detail.customer.billingCity, detail.customer.billingState, detail.customer.billingPostalCode]
                    .filter(Boolean)
                    .join(", "),
                  detail.customer.billingCountry
                ]
                  .filter(Boolean)
                  .map((line) => (
                    <span className="detail-line" key={line}>
                      {line}
                    </span>
                  ))}
              </dd>
            </div>
            <div>
              <dt>Notes</dt>
              <dd>{detail.customer.notes ?? "No notes recorded."}</dd>
            </div>
          </dl>
        </article>

        <article className="panel-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Assignments</p>
              <h2>Assignment history</h2>
            </div>
            <span className="pill">{detail.assignments.length} total</span>
          </div>

          {detail.assignments.length === 0 ? (
            <div className="empty-state empty-state--compact">
              <h3>No assignments yet</h3>
              <p>This customer has not been assigned an asset yet.</p>
            </div>
          ) : (
            <div className="activity-list">
              {detail.assignments.map((assignment) => (
                <article className="activity-item" key={assignment.id}>
                  <div>
                    <div className="activity-item__heading">
                      <Link className="inline-link" href={assignment.href}>
                        {assignment.assetCode}
                      </Link>
                      <StatusPill status={assignment.status} />
                    </div>
                    <p>{assignment.assetName}</p>
                    <p className="activity-item__meta">{formatDateRangeLabel(assignment.startDate, assignment.endDate)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
