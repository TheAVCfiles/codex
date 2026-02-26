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
  const [message, setMessage] = useState("");
  const [apiLedger, setApiLedger] = useState([]);
  const [apiError, setApiError] = useState("");
  const [view, setView] = useState(() => (window.location.pathname === "/founder-studios" ? "studio" : "dashboard"));

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

  function runTransition(event) {
    const next = transition(state, event);
    setState(next);
    setMessage(`State moved via ${event}.`);
  }

  async function loadLedgerApi() {
    setApiError("");

    try {
      const response = await fetch("/api/ledger");
      if (!response.ok) {
        throw new Error(`Ledger request failed (${response.status})`);
      }

      const payload = await response.json();
      const rows = payload?.entries || payload?.ledger || payload || [];
      setApiLedger(Array.isArray(rows) ? rows.slice(-10).reverse() : []);
    } catch (error) {
      setApiError(error?.message || "Unable to load /api/ledger");
      setApiLedger([]);
    }
  }

  useEffect(() => {
    loadLedgerApi();
  }, []);

  function openStudio() {
    window.history.pushState({}, "", "/founder-studios");
    setView("studio");
  }

  function openDashboard() {
    window.history.pushState({}, "", "/");
    setView("dashboard");
  }

  if (view === "studio") {
    return (
      <div style={styles.container}>
        <button onClick={openDashboard} style={styles.linkButton}>← Back to Founder Dashboard</button>
        <FounderStudioOS />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>FounderOS Console</h1>
      <p style={styles.muted}>Four-lever governance runtime with local append-only hash ledger.</p>

      <div style={styles.statePanel}>
        <div>
          <div style={styles.mutedLabel}>Founder State</div>
          <div style={styles.stateValue}>{state}</div>
        </div>
        <div style={styles.row}>
          <button onClick={() => runTransition("START_BUILD")}>START_BUILD</button>
          <button onClick={() => runTransition("THROTTLE")}>THROTTLE</button>
          <button onClick={() => runTransition("RESET")}>RESET</button>
          <button onClick={loadLedgerApi}>Refresh Ledger</button>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.card}><strong>Founder:</strong> {FOUNDER_ID}</div>
        <label style={styles.card}>
          <strong>Role:</strong>{" "}
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            {Object.values(Roles).map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <button onClick={openStudio} style={styles.linkButton}>Open StudiOS Onboarding →</button>
      </div>

      <div style={styles.row}>
        <button onClick={runEngine}>Run Engine</button>
        <button onClick={() => guardedEvent("THROTTLE")}>Trigger Throttle</button>
        <button onClick={() => guardedEvent("ESCALATE")}>Escalate</button>
        <button onClick={() => guardedEvent("RESET")}>Reset</button>
      </div>

      {message ? <p style={styles.muted}>{message}</p> : null}

      <div style={styles.row}>
        <div style={styles.card}><strong>Total Entries:</strong> {summary.entries}</div>
        <div style={styles.card}><strong>Escalations:</strong> {summary.escalations}</div>
      </div>

      <div style={styles.logBox}>
        <h3>Recent Ledger Entries (/api/ledger)</h3>
        {apiError ? <p style={styles.error}>{apiError}</p> : null}
        {apiLedger.length === 0 ? <p style={styles.muted}>No API ledger entries available.</p> : null}
        {apiLedger.map((entry, index) => (
          <div key={`${entry.id || entry.timestamp || "entry"}-${index}`} style={styles.logEntry}>
            <div>
              <strong>{entry.eventType || entry.type || "EVENT"}</strong>
              {entry.documentId ? ` · ${entry.documentId}` : ""}
            </div>
            <small>{entry.timestamp || "No timestamp"}</small>
          </div>
        ))}
      </div>

      <div style={styles.logBox}>
        <h3>Local Ledger Preview</h3>
        {[...ledger].reverse().slice(0, 12).map((entry, index) => (
          <div key={`${entry.timestamp}-${index}`} style={styles.logEntry}>
            <div>
              {entry.previousState} → {entry.newState} via <strong>{entry.event}</strong>
            </div>
            <small>{new Date(entry.timestamp).toLocaleString()}</small>
          </div>
        ))}
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
  mutedLabel: { opacity: 0.7, fontSize: 12 },
  stateValue: { fontSize: 24, fontWeight: 700 },
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
  statePanel: {
    marginBottom: "1rem",
    padding: "1rem",
    borderRadius: 8,
    background: "#1c1f26",
    border: "1px solid #2d3340",
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
  linkButton: {
    background: "transparent",
    border: "1px solid #2d3340",
    color: "#93c5fd",
    padding: "0.5rem 0.75rem",
    borderRadius: 8,
    cursor: "pointer",
  },
  error: {
    color: "#f87171",
  },
};
