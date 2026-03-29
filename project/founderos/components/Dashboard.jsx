import { useEffect, useMemo, useState } from "react";
import { FounderStates, transition } from "../fsm/founderMachine";
import { canTrigger, Roles } from "../lib/auth";
import { readFounderLedger, writeLedger } from "../lib/ledger";
import { runRegime } from "../engines/regimeEngine";
import FounderStudioOS from "./FounderStudioOS";

const FOUNDER_ID = "avc_beta";

export default function Dashboard() {
  const [state, setState] = useState(FounderStates.IDLE);
  const [role, setRole] = useState(Roles.FOUNDER);
  const [ledger, setLedger] = useState(() => readFounderLedger(FOUNDER_ID));
  const [apiLedger, setApiLedger] = useState([]);
  const [ledgerSource, setLedgerSource] = useState("local");
  const [message, setMessage] = useState("");
  const [hieroglyphInput, setHieroglyphInput] = useState("");
  const [hieroglyphResult, setHieroglyphResult] = useState(null);
  const [showDecodeHow, setShowDecodeHow] = useState(false);

  const summary = useMemo(
    () => ({ entries: ledger.length, escalations: ledger.filter((entry) => entry.event === "ESCALATE").length }),
    [ledger],
  );

  async function persistEvent(event, metadata = {}) {
    const newState = transition(state, event);
    if (newState === state) {
      setMessage(`Invalid transition: ${state} cannot handle ${event}.`);
      return false;
    }

    const entry = {
      previousState: state,
      event,
      newState,
      metadata,
      timestamp: Date.now(),
    };

    const saved = await writeLedger(FOUNDER_ID, entry);
    setState(newState);
    setLedger((prev) => [...prev, saved]);
    return true;
  }

  async function guardedEvent(event, metadata) {
    if (!canTrigger(role, event)) {
      setMessage(`Role ${role} cannot trigger ${event}.`);
      return;
    }

    const didPersist = await persistEvent(event, metadata);
    if (didPersist) {
      setMessage(`Transitioned via ${event}.`);
    }
  }

  async function runEngine() {
    const result = runRegime({ velocity: Math.random() * 100 });
    await guardedEvent(result.signal, result);
  }

  function decodeHieroglyphics(text) {
    if (!text?.trim()) {
      return {
        score: 0,
        label: "Balanced Flow",
        emojis: "🪨",
        story: "No input provided.",
      };
    }

    const sentences = text.match(/[^.!?]+[.!?]*/g)?.map((sentence) => sentence.trim()).filter(Boolean) || [text];
    const tokens = text.toLowerCase().split(/\s+/).filter(Boolean);
    const positiveSeeds = /good|great|excellent|beautiful|love|joy|success|win|clarity|flow|grace|progress|strong|clear/i;
    const negativeSeeds = /bad|poor|fail|frustrat|stress|pain|chaos|lost|blocked|dark|delay|risk|stuck|confus/i;
    const negationWords = /not|no|never|without|lack|fail|cannot|unable|avoid|deny|refuse|no longer|hardly|barely/i;

    let weightedTotal = 0;

    sentences.forEach((sentence, index) => {
      const clean = sentence.toLowerCase();
      const sentenceWords = clean.split(/\s+/).filter(Boolean);
      let sentenceScore = 0;

      sentenceWords.forEach((word, wordIndex) => {
        const scope = sentenceWords.slice(Math.max(0, wordIndex - 5), wordIndex + 1).join(" ");
        const isNegated = negationWords.test(scope);
        const delta = positiveSeeds.test(word) ? 2 : negativeSeeds.test(word) ? -2 : 0;
        if (delta !== 0) {
          sentenceScore += isNegated ? -delta : delta;
        }
      });

      const recencyWeight = (index + 1) / sentences.length;
      weightedTotal += sentenceScore * recencyWeight;
    });

    const finalScore = Math.max(-10, Math.min(10, weightedTotal));
    const label =
      finalScore > 3 ? "Positive Resonance" : finalScore < -3 ? "Shadow Tension" : "Balanced Flow";

    let emojis = "⚖️🪨🌿";
    if (finalScore > 5) emojis = "🌟🔥🪶🌊";
    else if (finalScore > 2) emojis = "🌱🌀🕊️";
    else if (finalScore > -2) emojis = "⚖️🪨🌿";
    else if (finalScore > -5) emojis = "🌫️🪨⛓️";
    else emojis = "🌑🔥🪨";

    const negationHits = tokens.filter((token) => negationWords.test(token)).length;

    return {
      score: finalScore,
      label,
      emojis,
      story: `Sentence count: ${sentences.length} | Negation markers: ${negationHits} | Weighted score: ${finalScore.toFixed(1)}`,
    };
  }

  function runHieroglyphics() {
    setHieroglyphResult(decodeHieroglyphics(hieroglyphInput));
  }

  useEffect(() => {
    async function loadLedger() {
      try {
        const response = await fetch("/api/ledger");
        if (!response.ok) throw new Error("ledger unavailable");

        const payload = await response.json();
        const rows = Array.isArray(payload) ? payload : payload.entries || [];
        setApiLedger(rows.slice(-10).reverse());
        setLedgerSource("api");
      } catch {
        setApiLedger(
          [...readFounderLedger(FOUNDER_ID)]
            .reverse()
            .slice(0, 10)
            .map((entry, index) => ({
              id: `${entry.timestamp}-${index}`,
              documentId: entry.metadata?.documentId || "local-founder-log",
              eventType: entry.event,
              timestamp: entry.timestamp,
            })),
        );
        setLedgerSource("local");
      }
    }

    loadLedger();
  }, [ledger]);

  return (
    <div style={styles.container}>
      <h1>FounderOS Console</h1>
      <p style={styles.muted}>Four-lever governance runtime with local append-only hash ledger.</p>

      <div style={styles.row}>
        <div style={styles.card}><strong>Founder:</strong> {FOUNDER_ID}</div>
        <div style={styles.card}><strong>Current State:</strong> {state}</div>
        <label style={styles.card}>
          <strong>Role:</strong>{" "}
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            {Object.values(Roles).map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={styles.row}>
        <button onClick={() => guardedEvent("START_BUILD")}>Start Build</button>
        <button onClick={runEngine}>Run Engine</button>
        <button onClick={() => guardedEvent("THROTTLE")}>Trigger Throttle</button>
        <button onClick={() => guardedEvent("RESET")}>Reset</button>
      </div>

      {message ? <p style={styles.muted}>{message}</p> : null}

      <div style={styles.row}>
        <div style={styles.card}><strong>Total Entries:</strong> {summary.entries}</div>
        <div style={styles.card}><strong>Escalations:</strong> {summary.escalations}</div>
      </div>

      <div style={styles.logBox}>
        <h3>Ledger Preview</h3>
        {[...ledger].reverse().slice(0, 12).map((entry, index) => (
          <div key={`${entry.timestamp}-${index}`} style={styles.logEntry}>
            <div>
              {entry.previousState} → {entry.newState} via <strong>{entry.event}</strong>
            </div>
            <small>{new Date(entry.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div style={styles.logBox}>
        <h3>Ledger API Snapshot ({ledgerSource})</h3>
        {apiLedger.map((entry, index) => (
          <div key={entry.id || `${entry.timestamp}-${index}`} style={styles.logEntry}>
            <div>
              <strong>{entry.eventType || entry.event || "UNKNOWN"}</strong> · {entry.documentId || "n/a"}
            </div>
            <small>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "n/a"}</small>
          </div>
        ))}
      </div>

      <div style={styles.logBox}>
        <h3>Founder StudiOS</h3>
        <a href="/founder-studios" style={styles.link}>Open standalone route: /founder-studios</a>
        <FounderStudioOS />
      </div>

      <div style={styles.logBox}>
        <h3>🪨 Automation Capacitor — Emojitional Hieroglyphics</h3>
        <p style={styles.muted}>
          Decode founder notes, workflow descriptions, and reflections into sentiment tablets.
        </p>
        <textarea
          value={hieroglyphInput}
          onChange={(event) => setHieroglyphInput(event.target.value)}
          placeholder="Paste any text for local sentiment decoding..."
          style={styles.decodeInput}
        />
        <button onClick={runHieroglyphics}>Decode with Hieroglyphics 🪶</button>
        {hieroglyphResult ? (
          <div style={styles.decodeResult}>
            <div>
              <div style={styles.decodeLabel}>Sentiment Score</div>
              <div style={styles.decodeScore}>{hieroglyphResult.score.toFixed(1)}</div>
              <div>{hieroglyphResult.label}</div>
            </div>
            <div style={styles.decodeEmoji}>{hieroglyphResult.emojis}</div>
          </div>
        ) : null}
        {hieroglyphResult ? <small style={styles.muted}>{hieroglyphResult.story}</small> : null}
        <button style={styles.linkButton} onClick={() => setShowDecodeHow((value) => !value)}>
          {showDecodeHow ? "Hide How & Why" : "How & Why does this work?"}
        </button>
        {showDecodeHow ? (
          <p style={styles.muted}>
            Multi-sentence context scoring with recency bias and short-scope negation handling. All processing is
            local in the dashboard runtime.
          </p>
        ) : null}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "system-ui",
    background: "#0f1115",
    color: "#fff",
    minHeight: "100vh",
  },
  muted: { opacity: 0.8 },
  row: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  card: {
    padding: "0.75rem",
    borderRadius: 8,
    background: "#1c1f26",
  },
  logBox: {
    marginTop: "1.25rem",
    padding: "1rem",
    background: "#1c1f26",
    borderRadius: 8,
  },
  logEntry: {
    fontSize: 14,
    borderBottom: "1px solid #2d3340",
    padding: "0.5rem 0",
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
  },
  link: {
    color: "#8de2ff",
    fontSize: 14,
  },
  decodeInput: {
    width: "100%",
    minHeight: 120,
    marginBottom: "0.75rem",
    borderRadius: 8,
    padding: "0.75rem",
    background: "#0f1115",
    color: "#fff",
    border: "1px solid #2d3340",
  },
  decodeResult: {
    marginTop: "1rem",
    padding: "0.75rem",
    borderRadius: 8,
    border: "1px solid #2d3340",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  decodeLabel: {
    fontSize: 12,
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  decodeScore: {
    fontSize: 36,
    lineHeight: 1.2,
  },
  decodeEmoji: {
    fontSize: 48,
    lineHeight: 1,
  },
  linkButton: {
    marginTop: "0.75rem",
    background: "transparent",
    border: "none",
    color: "#8de2ff",
    cursor: "pointer",
    padding: 0,
  },
};
