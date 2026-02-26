import React from "react";

const tiers = [
  {
    name: "Systems Triage™",
    price: "$12,000",
    detail:
      "Required Gate — 30-day assessment for system boundaries, IP posture, compliance risk, and go/no-go decision.",
  },
  {
    name: "Governance Install™ — Standard",
    price: "$25,000",
    detail:
      "90-day fixed-scope install with provenance, licensing posture, and investor-safe governance receipts.",
    featured: true,
  },
  {
    name: "Governance Install™ — Regulated / Gov-Safe",
    price: "$35,000",
    detail:
      "Enhanced assurance for compliance-sensitive operations, offline/air-gap documentation, and counsel-ready artifacts.",
  },
  {
    name: "Institutional / Studio-Wide License",
    price: "$50,000–$75,000 + $15,000–$50,000/yr",
    detail: "Multi-project coverage with reusable governance primitives across the studio portfolio.",
  },
];

export default function PricingSection(): JSX.Element {
  return (
    <section style={{ marginTop: 24 }}>
      <h2>AVC Governance Install</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {tiers.map((tier) => (
          <div
            key={tier.name}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 10,
              padding: 12,
              background: tier.featured ? "#dbeafe" : "#fff",
            }}
          >
            <strong>{tier.name}</strong>
            <p style={{ margin: "4px 0" }}>{tier.price}</p>
            <p style={{ margin: "4px 0" }}>{tier.detail}</p>
            <a href="mailto:governance@avc.systems?subject=Governance%20Install%20Inquiry">Request Scope</a>
          </div>
        ))}
      </div>

      <div style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: 12, marginTop: 12 }}>
        <strong>Interim Governance Architect</strong>
        <p>$8,000–$20,000/month — executive oversight and risk gating without execution delivery.</p>
      </div>

      <p style={{ marginTop: 12 }}>
        Equity is never required and never substitutes for cash. Discounts are not offered in exchange for urgency,
        exposure, or future promises.
      </p>
    </section>
  );
}
