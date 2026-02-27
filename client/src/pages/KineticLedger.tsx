import { useEffect, useMemo, useState } from "react";

const CONTACT_EMAIL = "hello@avc.systems";

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(text: string): Promise<string> {
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(text));
  return toHex(digest);
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function KineticLedger() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [summary, setSummary] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canGenerate = company.trim().length > 0 && summary.trim().length > 0;

  const mailtoTriage = useMemo(() => {
    const subject = encodeURIComponent("Governance Triage Sprint — $2,500 (Kinetic Ledger)");
    return `mailto:${CONTACT_EMAIL}?subject=${subject}`;
  }, []);

  useEffect(() => {
    document.title = "Kinetic Ledger — Founder Contribution Protection | Global AVC Systems";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      "Founder contribution protection with timestamped SHA-256 proof snapshots. Capture motion, anchor authorship, and export governance artifacts.",
    );
  }, []);

  async function generateSnapshot() {
    setIsGenerating(true);
    try {
      const ts = new Date().toISOString();
      const payload = [
        `NAME=${name.trim()}`,
        `COMPANY=${company.trim()}`,
        `ROLE=${role.trim()}`,
        `SUMMARY=${summary.trim()}`,
        `TS=${ts}`,
      ].join("|");

      const h = await sha256Hex(payload);
      setHash(h);
      setTimestamp(ts);

      const artifact = [
        "KINETIC LEDGER — FOUNDER PROOF SNAPSHOT",
        "=====================================",
        "",
        `Timestamp (ISO): ${ts}`,
        `Hash (SHA-256):  ${h}`,
        "",
        `Name:    ${name.trim()}`,
        `Company: ${company.trim()}`,
        `Role:    ${role.trim()}`,
        "",
        "Contribution Summary:",
        summary.trim(),
        "",
        "Notes:",
        "- This artifact is generated client-side.",
        "- No server storage. Founder-authored declaration only.",
        "- Hash anchors the declaration for later verification.",
      ].join("\n");

      downloadText(`kinetic-ledger-proof-${company.trim().replace(/\s+/g, "-").toLowerCase()}.txt`, artifact);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <section style={{ marginBottom: 24 }}>
        <p>KINETIC LEDGER</p>
        <h1>Protect What You Build Before Anyone Questions It</h1>
        <p>
          Kinetic Ledger anchors founder contribution in dynamic environments. Capture motion. Hash transitions. Export
          proof.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href={mailtoTriage}>Book Governance Triage Sprint — $2,500</a>
          <button onClick={() => document.getElementById("proof-snapshot")?.scrollIntoView({ behavior: "smooth" })}>
            Generate Founder Proof Snapshot
          </button>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Why Founders Lose Leverage</h2>
        <ul>
          <li>Contribution is not recorded.</li>
          <li>Territory is not documented.</li>
          <li>Architecture decisions are not timestamped.</li>
          <li>Early IP is not anchored.</li>
          <li>Verbal alignment replaces written record.</li>
        </ul>
        <p>When conflict happens, the person who controls the record controls the narrative.</p>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 24 }}>
        <article style={{ border: "1px solid #333", padding: 12 }}>
          <h3>Capture Motion</h3>
          <p>Founder-authored declarations tied to timestamped events.</p>
        </article>
        <article style={{ border: "1px solid #333", padding: 12 }}>
          <h3>Anchor Authorship</h3>
          <p>Hash-based provenance to prove integrity over time.</p>
        </article>
        <article style={{ border: "1px solid #333", padding: 12 }}>
          <h3>Export Proof</h3>
          <p>Portable artifacts you can store locally and share selectively.</p>
        </article>
      </section>
      <p style={{ marginBottom: 24 }}>
        We do not store proprietary corporate data. We anchor founder-authored contribution declarations.
      </p>

      <section id="proof-snapshot" style={{ border: "1px solid #333", padding: 12, marginBottom: 24 }}>
        <h2>Founder Proof Snapshot</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
          <input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
          <textarea
            style={{ gridColumn: "1 / -1" }}
            placeholder="Contribution Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <button onClick={generateSnapshot} disabled={!canGenerate || isGenerating}>
            {isGenerating ? "Generating..." : "Generate + Download Proof"}
          </button>
        </div>
        {hash && timestamp ? (
          <div style={{ marginTop: 8 }}>
            <p>Timestamp: {timestamp}</p>
            <p style={{ wordBreak: "break-all" }}>SHA-256: {hash}</p>
          </div>
        ) : null}
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2>Governance Triage Sprint — $2,500</h2>
        <ul>
          <li>75–90 min intake call</li>
          <li>One-page risk map + corridor sketch</li>
          <li>Ledger-notarized Findings + Constraints PDF</li>
          <li>Explicit go/no-go + next tier recommendation</li>
        </ul>
        <a href={mailtoTriage}>Book Triage Sprint</a>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        <article style={{ border: "1px solid #333", padding: 12 }}>
          <h3>Systems Triage — $12K</h3>
        </article>
        <article style={{ border: "1px solid #333", padding: 12 }}>
          <h3>Governance Install — $25K–$50K</h3>
        </article>
        <article style={{ border: "1px solid #333", padding: 12 }}>
          <h3>Institutional Licensing</h3>
        </article>
      </section>
    </main>
  );
}
