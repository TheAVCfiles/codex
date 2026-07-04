import { useMemo, useState } from "react";

const CONTACT_EMAIL = "hello@avc.systems";

type RiskTier = "LOW" | "MODERATE" | "HIGH";

async function postHash(text: string): Promise<string> {
  const res = await fetch("/api/documents/hash", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  const sha256 = typeof data?.sha256 === "string" && data.sha256.trim().length > 0 ? data.sha256.trim() : null;
  if (!sha256) throw new Error("FounderOS: invalid sha256 returned from /api/documents/hash");
  return sha256;
}

async function notarize(documentId: string, hash: string, eventType: string) {
  const res = await fetch("/api/ledger/notarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentId, hash, eventType }),
  });
  if (!res.ok) {
    throw new Error("FounderOS: failed to notarize ledger entry");
  }
}

function clampDocIdCompany(company: string) {
  const base = company.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, "-");
  return base.length ? base.slice(0, 64) : "unknown";
}

export default function FounderOSSandbox() {
  const mailtoTriage = useMemo(() => {
    const subject = encodeURIComponent("Governance Triage Sprint — $2,500 (FounderOS Sandbox)");
    return `mailto:${CONTACT_EMAIL}?subject=${subject}`;
  }, []);

  const [founderName, setFounderName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [contribSummary, setContribSummary] = useState("");
  const [contribResult, setContribResult] = useState<{ hash: string; ts: string } | null>(null);
  const [contribBusy, setContribBusy] = useState(false);

  const [decisionTitle, setDecisionTitle] = useState("");
  const [decisionContext, setDecisionContext] = useState("");
  const [decisionDate, setDecisionDate] = useState("");
  const [decisionResult, setDecisionResult] = useState<{ hash: string; ts: string } | null>(null);
  const [decisionBusy, setDecisionBusy] = useState(false);

  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const questions = [
    "Is your role documentation explicit and versioned?",
    "Do you timestamp architecture decisions?",
    "Do you control an independent copy of records?",
    "Are contributions attributable by actor and date?",
    "Are ownership corridors documented?",
    "Is equity alignment recorded against contribution?",
    "Can you export proof without admin dependency?",
    "Do you have conflict escalation controls?",
    "Is early IP anchored before outside exposure?",
    "Could someone rewrite your narrative if you leave tomorrow?",
  ];

  const riskTier: RiskTier = useMemo(() => {
    const yesCount = Object.values(answers).filter(Boolean).length;
    if (yesCount >= 8) return "LOW";
    if (yesCount >= 5) return "MODERATE";
    return "HIGH";
  }, [answers]);

  async function generateContributionAnchor() {
    const c = company.trim();
    const s = contribSummary.trim();
    if (!c || !s) return;

    setContribBusy(true);
    setError(null);
    try {
      const ts = new Date().toISOString();
      const text = [
        "FOUNDEROS_SANDBOX_CONTRIBUTION",
        `TS=${ts}`,
        `NAME=${founderName.trim()}`,
        `COMPANY=${c}`,
        `ROLE=${role.trim()}`,
        `SUMMARY=${s}`,
      ].join("|");

      const h = await postHash(text);
      const docId = `founderos:${clampDocIdCompany(c)}`;
      await notarize(docId, h, "FOUNDEROS_SANDBOX_ANCHOR");

      setContribResult({ hash: h, ts });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to notarize contribution.");
    } finally {
      setContribBusy(false);
    }
  }

  async function generateDecisionAnchor() {
    const c = company.trim();
    const t = decisionTitle.trim();
    if (!c || !t) return;

    setDecisionBusy(true);
    setError(null);
    try {
      const ts = new Date().toISOString();
      const text = [
        "FOUNDEROS_SANDBOX_DECISION",
        `TS=${ts}`,
        `COMPANY=${c}`,
        `TITLE=${t}`,
        `CONTEXT=${decisionContext.trim()}`,
        `DATE=${decisionDate.trim()}`,
      ].join("|");

      const h = await postHash(text);
      const docId = `founderos:${clampDocIdCompany(c)}`;
      await notarize(docId, h, "FOUNDEROS_DECISION_ANCHOR");

      setDecisionResult({ hash: h, ts });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to notarize decision.");
    } finally {
      setDecisionBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <section style={{ marginBottom: 24 }}>
        <p>FOUNDEROS SANDBOX</p>
        <h1>FounderOS Sandbox — Governance as a Service</h1>
        <p>Powered by StagePort. Document contribution. Anchor decisions. Export proof.</p>
        <p style={{ fontSize: 12 }}>Founder-authored entries only. We do not store proprietary corporate data.</p>
      </section>

      <section style={{ border: "1px solid #333", padding: 12, marginBottom: 20 }}>
        <h2>A — Contribution Log</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input placeholder="Founder Name" value={founderName} onChange={(e) => setFounderName(e.target.value)} />
          <input placeholder="Company (required)" value={company} onChange={(e) => setCompany(e.target.value)} />
          <input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
          <textarea
            style={{ gridColumn: "1 / -1" }}
            placeholder="Contribution Summary (required)"
            value={contribSummary}
            onChange={(e) => setContribSummary(e.target.value)}
          />
        </div>
        <button
          onClick={generateContributionAnchor}
          disabled={contribBusy || company.trim() === "" || contribSummary.trim() === ""}
        >
          {contribBusy ? "Anchoring..." : "Generate Ledger Anchor"}
        </button>

        {contribResult && (
          <div style={{ marginTop: 8 }}>
            <p>Timestamp: {contribResult.ts}</p>
            <p style={{ wordBreak: "break-all" }}>SHA-256: {contribResult.hash}</p>
          </div>
        )}
      </section>

      <section style={{ border: "1px solid #333", padding: 12, marginBottom: 20 }}>
        <h2>B — Decision Log</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input
            placeholder="Decision Title (required)"
            value={decisionTitle}
            onChange={(e) => setDecisionTitle(e.target.value)}
          />
          <input placeholder="Date" value={decisionDate} onChange={(e) => setDecisionDate(e.target.value)} />
          <textarea
            style={{ gridColumn: "1 / -1" }}
            placeholder="Context / Constraints"
            value={decisionContext}
            onChange={(e) => setDecisionContext(e.target.value)}
          />
        </div>
        <button onClick={generateDecisionAnchor} disabled={decisionBusy || company.trim() === "" || decisionTitle.trim() === ""}>
          {decisionBusy ? "Anchoring..." : "Generate Ledger Anchor"}
        </button>

        {decisionResult && (
          <div style={{ marginTop: 8 }}>
            <p>Timestamp: {decisionResult.ts}</p>
            <p style={{ wordBreak: "break-all" }}>SHA-256: {decisionResult.hash}</p>
          </div>
        )}
      </section>

      <section style={{ border: "1px solid #333", padding: 12, marginBottom: 20 }}>
        <h2>C — Risk Corridor Self-Assessment</h2>
        <div style={{ display: "grid", gap: 6 }}>
          {questions.map((q, i) => (
            <label key={q} style={{ display: "flex", gap: 6 }}>
              <input
                type="checkbox"
                checked={!!answers[i]}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.checked }))}
              />
              <span>{q}</span>
            </label>
          ))}
        </div>
        <p style={{ marginTop: 8 }}>Risk Tier: {riskTier}</p>
        {riskTier === "HIGH" ? <a href={mailtoTriage}>Book Governance Triage Sprint — $2,500</a> : null}
      </section>

      <section style={{ border: "1px solid #333", padding: 12, marginBottom: 20 }}>
        <h2>D — Upgrade</h2>
        <p>Need multi-user logging? Secure server-side storage? Weighted contribution modeling?</p>
        <div style={{ display: "flex", gap: 8 }}>
          <a href={mailtoTriage}>Triage Sprint</a>
          <a href="/startup-studios">StudiOS</a>
        </div>
      </section>

      {error ? <p style={{ color: "#ef4444" }}>{error}</p> : null}
    </main>
  );
}
