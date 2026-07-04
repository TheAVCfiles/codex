import { useMemo, useState } from "react";

const STEPS = ["Crisis", "Lab Activation", "Receipts", "StageCred", "Capital"];

function decodeHieroglyphics(text) {
  if (!text.trim()) {
    return {
      score: 0,
      label: "Balanced Flow",
      emojis: "🪨",
      story: "No input provided.",
    };
  }

  const sentences = text.match(/[^.!?]+[.!?]*/g)?.map((entry) => entry.trim()).filter(Boolean) || [text.trim()];
  const positiveSignals = /good|great|excellent|beautiful|love|joy|success|win|clarity|flow|grace|steady|aligned/i;
  const negativeSignals = /bad|poor|fail|frustrat|stress|pain|chaos|lost|blocked|dark|overwhelm|risk/i;
  const negationWords = /\b(not|no|never|without|lack|cannot|unable|avoid|deny|refuse|no longer)\b/i;

  let weightedScore = 0;
  sentences.forEach((sentence, index) => {
    let sentenceScore = 0;
    if (positiveSignals.test(sentence)) sentenceScore += 2;
    if (negativeSignals.test(sentence)) sentenceScore -= 2;
    if (negationWords.test(sentence)) sentenceScore *= -1;

    const recencyWeight = (index + 1) / sentences.length;
    weightedScore += sentenceScore * recencyWeight;
  });

  const finalScore = Math.max(-10, Math.min(10, weightedScore * sentences.length));
  const label = finalScore > 3 ? "Positive Resonance" : finalScore < -3 ? "Shadow Tension" : "Balanced Flow";

  let emojis = "⚖️🪨🌿";
  if (finalScore > 5) emojis = "🌟🔥🪶🌊";
  else if (finalScore > 2) emojis = "🌱🌀🕊️";
  else if (finalScore <= -5) emojis = "🌑🔥🪨";
  else if (finalScore < -2) emojis = "🌫️🪨⛓️";

  return {
    score: finalScore,
    label,
    emojis,
    story: `Sentence count: ${sentences.length} · Weighted score: ${finalScore.toFixed(1)}`,
  };
}

export default function FounderStudioOS() {
  const [hash, setHash] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [hieroglyphInput, setHieroglyphInput] = useState("");
  const [hieroglyphResult, setHieroglyphResult] = useState(null);

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

  function runHieroglyphics() {
    setHieroglyphResult(decodeHieroglyphics(hieroglyphInput));
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

      <div style={styles.panel}>
        <h3 style={styles.hubTitle}>Automation Capacitor · Emojitional Hieroglyphics</h3>
        <p style={styles.subtitle}>Drop in any founder notes, workflow text, abstract draft, or metrics reflection.</p>
        <textarea
          value={hieroglyphInput}
          onChange={(event) => setHieroglyphInput(event.target.value)}
          placeholder="Paste founder text for local sentiment tablets..."
          style={styles.textarea}
        />

        <div style={styles.actions}>
          <button onClick={runHieroglyphics} disabled={!hieroglyphInput.trim()}>
            Decode with Hieroglyphics 🪶
          </button>
        </div>

        {hieroglyphResult ? (
          <div style={styles.resultCard}>
            <div>
              <div style={styles.resultLabel}>Sentiment Score</div>
              <div style={styles.resultScore}>{hieroglyphResult.score.toFixed(1)}</div>
              <div style={styles.meta}>{hieroglyphResult.label}</div>
            </div>
            <div style={styles.resultEmoji}>{hieroglyphResult.emojis}</div>
            <div style={styles.meta}>{hieroglyphResult.story}</div>
          </div>
        ) : null}

        <details style={styles.details}>
          <summary style={styles.summary}>How & Why does this work?</summary>
          <p style={styles.meta}>
            Multi-sentence context scoring with recency bias and negation-aware inversion. Output is rendered as
            local emoji tablets for transparent sentiment narration without external calls.
          </p>
        </details>
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
    marginTop: "0.9rem",
    padding: "0.75rem",
    borderRadius: 6,
    background: "#141821",
  },
  hubTitle: {
    marginTop: 0,
    marginBottom: "0.35rem",
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
  textarea: {
    width: "100%",
    minHeight: "7.5rem",
    resize: "vertical",
    background: "#0d1118",
    color: "#fff",
    border: "1px solid #2d3340",
    borderRadius: 6,
    padding: "0.65rem",
    marginBottom: "0.75rem",
    fontFamily: "inherit",
  },
  resultCard: {
    border: "1px solid #2d3340",
    borderRadius: 6,
    padding: "0.75rem",
    display: "grid",
    gap: "0.35rem",
    marginBottom: "0.75rem",
    background: "#0f1420",
  },
  resultLabel: {
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    opacity: 0.8,
  },
  resultScore: {
    fontSize: 36,
    lineHeight: 1,
  },
  resultEmoji: {
    fontSize: 42,
  },
  details: {
    borderTop: "1px solid #2d3340",
    paddingTop: "0.65rem",
  },
  summary: {
    cursor: "pointer",
    fontSize: 13,
    marginBottom: "0.4rem",
  },
};
