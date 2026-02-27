type Agreement = {
  id: string;
  title: string;
  type: "service" | "license";
  status: "active" | "draft";
  provisions: string[];
  fullText: string;
};

const agreements: Agreement[] = [
  {
    id: "msa-001",
    title: "Master Services Framework",
    type: "service",
    status: "active",
    provisions: ["Scope controls", "Governance boundaries", "Delivery cadence"],
    fullText: "Master services terms and constraints.",
  },
  {
    id: "dpa-001",
    title: "Data Posture Addendum",
    type: "service",
    status: "active",
    provisions: ["Data boundary protocol", "Retention discipline", "Access controls"],
    fullText: "Data handling and responsibilities.",
  },
  {
    id: "sla-001",
    title: "Operational Reliability Schedule",
    type: "service",
    status: "active",
    provisions: ["Escalation windows", "Recovery obligations", "Incident reporting"],
    fullText: "Service levels and reliability controls.",
  },
  {
    id: "ipl-001",
    title: "IP and Attribution License",
    type: "license",
    status: "active",
    provisions: ["Attribution baseline", "License boundaries", "Reuse controls"],
    fullText: "IP usage, attribution, and transfer boundaries.",
  },
  {
    id: "iga-001",
    title: "Institutional Governance Audit",
    type: "license",
    status: "active",
    provisions: [
      "Structural Risk Review: boundary clarity, data exposure, infrastructure posture",
      "Governance Compression Index: Liability Exposure, Data Boundary Clarity, Escalation Controls, Institutional Readiness, Regulatory Surface (score each 1-5)",
      "Recommendation Output: Safe to Deploy / Deploy with Conditions / Defer Deployment",
    ],
    fullText: `Institutional Governance Audit Template\n\nStructural Risk Review\n- Boundary Clarity\n- Data Exposure\n- Infrastructure Posture\n\nGovernance Compression Index (1-5 each)\n1. Liability Exposure\n2. Data Boundary Clarity\n3. Escalation Controls\n4. Institutional Readiness\n5. Regulatory Surface\n\nScoring Guidance\n- 22-25: Safe to Deploy\n- 16-21: Deploy with Conditions\n- <=15: Defer Deployment\n\nRecommendation\nSelect one output and attach required controls before release.`,
  },
];

function downloadAgreement(agreement: Agreement) {
  const blob = new Blob([agreement.fullText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${agreement.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Contracts() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Contracts</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
        {agreements.map((agreement) => (
          <article key={agreement.id} style={{ border: "1px solid #333", padding: 12 }}>
            <h3>{agreement.title}</h3>
            <p>Type: {agreement.type}</p>
            <p>Status: {agreement.status}</p>
            <ul>
              {agreement.provisions.map((provision) => (
                <li key={provision}>{provision}</li>
              ))}
            </ul>
            <details>
              <summary>View full text</summary>
              <pre style={{ whiteSpace: "pre-wrap" }}>{agreement.fullText}</pre>
            </details>
            <button onClick={() => downloadAgreement(agreement)}>Download</button>
          </article>
        ))}
      </div>
    </main>
  );
}
