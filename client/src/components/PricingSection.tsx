const CONTACT_EMAIL = "hello@avc.systems";

const tiers = [
  {
    name: "Governance Triage Sprint",
    price: "$2,500 one-time",
    detail: "75–90 min intake call; one-page risk map + corridor sketch; ledger-notarized findings PDF; go/no-go recommendation",
    note: "This is an evaluation artifact — not a mini-install",
  },
  {
    name: "Systems Triage™",
    price: "$12,000",
    detail:
      "Required Gate — 30-day assessment, system boundaries, IP posture, compliance risk, go/no-go decision",
  },
  {
    name: "Governance Install™ — Standard",
    price: "$25,000",
    detail: "90-day fixed-scope, provenance, investor-safe governance receipts",
    highlight: true,
  },
  {
    name: "Governance Install™ — Regulated / Gov-Safe",
    price: "$35,000",
    detail: "enhanced assurance, compliance-sensitive, offline/air-gap docs, counsel-ready artifacts",
  },
  {
    name: "Institutional / Studio-Wide License",
    price: "$50,000–$75,000 + $15,000–$50,000/yr",
    detail: "multi-project, reusable primitives",
  },
];

export default function PricingSection() {
  return (
    <section>
      <h2>AVC Governance Install</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        {tiers.map((tier) => (
          <article key={tier.name} style={{ border: `1px solid ${tier.highlight ? "#0ea5e9" : "#333"}`, padding: 12 }}>
            <h3>{tier.name}</h3>
            <p>{tier.price}</p>
            <p>{tier.detail}</p>
            {tier.note ? <p style={{ fontSize: 12 }}>{tier.note}</p> : null}
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${tier.name} Inquiry`)}`}>Inquire</a>
          </article>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <h3>Add-on: Interim Governance Architect</h3>
        <p>$8,000–$20,000/month — executive oversight, risk gating, no execution/delivery</p>
      </div>
      <p style={{ marginTop: 12 }}>
        Equity is never required and never substitutes for cash. Discounts are not offered in exchange for urgency,
        exposure, or future promises.
      </p>
    </section>
  );
}
