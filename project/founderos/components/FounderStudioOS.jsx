import { useMemo, useState } from "react";

const STEPS = ["Crisis", "Lab Activation", "Receipts", "StageCred", "Capital"];

export default function FounderStudioOS() {
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const shortHash = useMemo(() => (hash ? `${hash.slice(0, 18)}...${hash.slice(-12)}` : ""), [hash]);

  async function computeSha256(file) {
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    const view = Array.from(new Uint8Array(digest));
    return view.map((value) => value.toString(16).padStart(2, "0")).join("");
  }

  async function handleUpload(event) {
    setError("");
    setStatus("");

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const digest = await computeSha256(file);
      setSelectedName(file.name);
      setHash(digest);
      setStatus("Hash computed");
    } catch {
      setError("Unable to compute file hash.");
    }
  }

  async function notarizeHash() {
    if (!hash) return;

    setError("");
    try {
      const response = await fetch("/api/ledger/notarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: "founder_reality_kit_v1",
          hash,
          eventType: "ISSUED",
        }),
      });

      if (!response.ok) {
        throw new Error("Ledger notarize failed");
      }

      setStatus("Ledger notarized");
    } catch {
      setError("Ledger notarization failed. Check /api/ledger/notarize availability.");
    }
  }

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>StagePort Startup StudiOS</h2>
      <p style={styles.subtitle}>
        Conservatory logic for founders: barre → repetition → receipts → credential → capital.
      </p>

      <div style={styles.steps}>
        {STEPS.map((step, index) => (
          <div key={step} style={styles.stepCard}>
            <strong>{index + 1}. {step}</strong>
          </div>
        ))}
      </div>

      <div style={styles.panel}>
        <label style={styles.label}>
          Upload Founder Reality Kit (PDF)
          <input type="file" accept="application/pdf" onChange={handleUpload} style={styles.input} />
        </label>

        <div style={styles.actions}>
          <button onClick={notarizeHash} disabled={!hash}>Notarize in Ledger</button>
        </div>

        {selectedName ? <div style={styles.meta}><strong>File:</strong> {selectedName}</div> : null}
        {status ? <div style={styles.meta}><strong>Status:</strong> {status}</div> : null}
        {hash ? <div style={styles.meta}><strong>SHA-256:</strong> {shortHash}</div> : null}
        {hash ? <code style={styles.hashBlock}>{hash}</code> : null}
        {error ? <div style={styles.error}>{error}</div> : null}
      </div>
    </section>
  );
}

const styles = {
  container: {
    marginTop: "1.25rem",
    padding: "1rem",
    background: "#1c1f26",
    borderRadius: 8,
  },
  title: {
    margin: 0,
    marginBottom: "0.25rem",
  },
  subtitle: {
    marginTop: 0,
    opacity: 0.85,
  },
  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "0.6rem",
    marginBottom: "1rem",
  },
  stepCard: {
    padding: "0.65rem",
    borderRadius: 6,
    background: "#141821",
    border: "1px solid #2d3340",
  },
  panel: {
    padding: "0.75rem",
    borderRadius: 6,
    background: "#141821",
  },
  label: {
    display: "grid",
    gap: "0.5rem",
    marginBottom: "0.75rem",
  },
  input: {
    color: "#fff",
  },
  actions: {
    marginBottom: "0.75rem",
  },
  meta: {
    fontSize: 13,
    marginBottom: "0.35rem",
  },
  hashBlock: {
    display: "block",
    whiteSpace: "break-spaces",
    overflowWrap: "anywhere",
    fontSize: 12,
    padding: "0.5rem",
    background: "#0d1118",
    borderRadius: 4,
  },
  error: {
    marginTop: "0.6rem",
    color: "#ff8d8d",
  },
};
