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

  const summary = useMemo(
    () => ({ entries: ledger.length, escalations: ledger.filter((entry) => entry.event === "ESCALATE").length }),
    [ledger],
  );

  async function persistEvent(event, metadata = {}) {
    const newState = transition(state, event);
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
  }

  async function guardedEvent(event, metadata) {
    if (!canTrigger(role, event)) {
      setMessage(`Role ${role} cannot trigger ${event}.`);
      return;
    }

    await persistEvent(event, metadata);
    setMessage(`Transitioned via ${event}.`);
  }

  async function runEngine() {
    const result = runRegime({ velocity: Math.random() * 100 });
    await guardedEvent(result.signal, result);
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
};
