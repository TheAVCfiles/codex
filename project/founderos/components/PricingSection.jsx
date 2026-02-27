const tiers = [
  {
    name: "Systems Triage™",
    price: "$12,000",
    description:
      "Required Gate — 30-day assessment, system boundaries, IP posture, compliance risk, go/no-go decision.",
  },
  {
    name: "Governance Install™ — Standard",
    price: "$25,000",
    description:
      "90-day fixed-scope, provenance, investor-safe governance receipts.",
    highlighted: true,
  },
  {
    name: "Governance Install™ — Regulated / Gov-Safe",
    price: "$35,000",
    description:
      "Enhanced assurance, compliance-sensitive, offline/air-gap docs, counsel-ready artifacts.",
  },
  {
    name: "Institutional / Studio-Wide License",
    price: "$50,000–$75,000 + $15,000–$50,000/yr",
    description:
      "Multi-project governance installation with reusable structural primitives.",
  },
];

export default function PricingSection() {
  return (
    <section
      style={{
        marginTop: "1.25rem",
        padding: "1rem",
        background: "#1c1f26",
        borderRadius: 8,
      }}
    >
      <h3>AVC Governance Install</h3>
      {tiers.map((tier) => (
        <article
          key={tier.name}
          style={{
            marginBottom: "0.75rem",
            padding: "0.75rem",
            borderRadius: 8,
            border: `1px solid ${tier.highlighted ? "#34d399" : "#2d3340"}`,
          }}
        >
          <div>
            <strong>{tier.name}</strong> · {tier.price}
          </div>
          <div>{tier.description}</div>
          <a href="mailto:governance@avcsystems.studio">Request install</a>
        </article>
      ))}
      <p>
        <strong>Add-on:</strong> Interim Governance Architect —
        $8,000–$20,000/month (executive oversight, risk gating, no
        execution/delivery).
      </p>
      <p>
        Equity is never required and never substitutes for cash. Discounts are
        not offered in exchange for urgency, exposure, or future promises.
      </p>
    </section>
  );
}
