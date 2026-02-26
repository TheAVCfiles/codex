import { useMemo, useState } from "react";

const STEPS = [
  {
    key: "CRISIS",
    title: "Crisis",
    subtitle: "Intake + constraints (what’s breaking, what must not break)",
  },
  {
    key: "LAB",
    title: "Lab Activation",
    subtitle: "Create the studio container (rules, corridors, boundaries)",
  },
  {
    key: "RECEIPTS",
    title: "Receipts",
    subtitle: "Ledger the decisions (proof-of-work, not vibes)",
  },
  {
    key: "STAGECRED",
    title: "StageCred",
    subtitle: "Credential ladder (unlock next tier via receipts)",
  },
  {
    key: "CAPITAL",
    title: "Capital",
    subtitle: "Export proof + metrics into investor-ready artifacts",
  },
];

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hashFile(file) {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return bufferToHex(digest);
}

export default function FounderStudioOS() {
  const [step, setStep] = useState("CRISIS");
  const [fileName, setFileName] = useState("");
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const [isNotarizing, setIsNotarizing] = useState(false);

  const documentId = useMemo(() => "founder-reality-kit-v1", []);

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    setError("");
    setStatus("");
    setHash("");
    setFileName(file?.name || "");

    if (!file) {
      return;
    }

    try {
      setIsHashing(true);
      const fileHash = await hashFile(file);
      setHash(fileHash);
      setStatus("Hash computed");
    } catch (uploadError) {
      setError(uploadError?.message || "Failed to compute hash.");
    } finally {
      setIsHashing(false);
    }
  }

  async function notarizeHash() {
    if (!hash) {
      setError("Compute a hash before notarizing.");
      return;
    }

    try {
      setError("");
      setIsNotarizing(true);
      const response = await fetch("/api/ledger/notarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          hash,
          eventType: "ISSUED",
        }),
      });

      if (!response.ok) {
        throw new Error(`Ledger notarization failed (${response.status}).`);
      }

      setStatus("Ledger notarized");
    } catch (requestError) {
      setError(requestError?.message || "Failed to notarize hash.");
    } finally {
      setIsNotarizing(false);
    }
  }

  return (
    <section style={styles.panel}>
      <h2 style={styles.heading}>StagePort Startup StudiOS</h2>
      <p style={styles.copy}>
        StagePort Startup StudiOS is an operating system for early-stage founders built on conservatory logic:
        barre → repetition → receipts → credential → capital. It’s not dance-themed. It’s discipline-themed—portable
        to any field where chaos eats talent.
      </p>

      <div style={styles.stepGrid}>
        {STEPS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setStep(item.key)}
            style={{
              ...styles.stepButton,
              ...(step === item.key ? styles.stepButtonActive : null),
            }}
          >
            <strong>{item.title}</strong>
            <span style={styles.stepSubtitle}>{item.subtitle}</span>
          </button>
        ))}
      </div>

      <div style={styles.uploadRow}>
        <label htmlFor="reality-kit-upload"><strong>Upload Founder Reality Kit (PDF)</strong></label>
        <input
          id="reality-kit-upload"
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
        />
        <button type="button" onClick={notarizeHash} disabled={!hash || isHashing || isNotarizing}>
          {isNotarizing ? "Notarizing…" : "Notarize to Ledger"}
        </button>
      </div>

      <div style={styles.statusBox}>
        <div><strong>Document ID:</strong> {documentId}</div>
        <div><strong>File:</strong> {fileName || "—"}</div>
        <div><strong>Status:</strong> {isHashing ? "Hashing…" : status || "Waiting for upload"}</div>
        <div><strong>SHA-256:</strong> {hash || "—"}</div>
        {error ? <div style={styles.error}>{error}</div> : null}
      </div>
    </section>
  );
}

const styles = {
  panel: {
    marginTop: "1rem",
    padding: "1rem",
    borderRadius: 8,
    background: "#1c1f26",
    border: "1px solid #2d3340",
  },
  heading: { margin: "0 0 0.5rem" },
  copy: { opacity: 0.9, marginBottom: "1rem" },
  stepGrid: {
    display: "grid",
    gap: "0.5rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    marginBottom: "1rem",
  },
  stepButton: {
    border: "1px solid #2d3340",
    borderRadius: 8,
    background: "#0f1115",
    color: "#fff",
    padding: "0.6rem",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
    cursor: "pointer",
  },
  stepButtonActive: {
    borderColor: "#10b981",
    boxShadow: "0 0 0 1px #10b981",
  },
  stepSubtitle: {
    opacity: 0.8,
    fontSize: 12,
  },
  uploadRow: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  statusBox: {
    display: "grid",
    gap: "0.35rem",
    fontSize: 13,
    wordBreak: "break-all",
  },
  error: {
    color: "#f87171",
  },
};
