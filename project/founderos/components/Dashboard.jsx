import { useEffect, useMemo, useState } from "react";
import { FounderStates, transition } from "../fsm/founderMachine";
import { canTrigger, Roles } from "../lib/auth";
import { readFounderLedger, writeLedger } from "../lib/ledger";
import {
  founderSteps,
  getStepIndex,
  isFinal,
  loadFounderState,
} from "../fsm/founderJourney";
import { runRegime } from "../engines/regimeEngine";
import FounderStudioOS from "./FounderStudioOS";
import StartupStudios from "./StartupStudios";
import PricingSection from "./PricingSection";

const FOUNDER_ID = "avc_beta";

async function sha256FromText(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function Dashboard() {
  const [state, setState] = useState(FounderStates.IDLE);
  const [role, setRole] = useState(Roles.FOUNDER);
  const [velocity, setVelocity] = useState(50);
  const [ledger, setLedger] = useState(() => readFounderLedger(FOUNDER_ID));
  const [apiLedger, setApiLedger] = useState([]);
  const [ledgerSource, setLedgerSource] = useState("local");
  const [message, setMessage] = useState("");
  const [journeyState, setJourneyState] = useState(() => loadFounderState());
  const [journeyLedgerCount, setJourneyLedgerCount] = useState(0);

  const summary = useMemo(
    () => ({
      entries: ledger.length,
      escalations: ledger.filter((entry) => entry.event === "OVERDRIVE").length,
    }),
    [ledger],
  );

  const totalSteps = founderSteps.length;
  const journeyIndex = getStepIndex(journeyState);
  const journeyProgress = Math.max(0, Math.min(journeyIndex, totalSteps));
  const regime = runRegime(velocity);

  async function persistEvent(event, metadata = {}) {
    const previousState = state;
    const newState = transition(previousState, event);
    const timestamp = Date.now();
    if (newState === previousState) {
      setMessage(`No transition for ${event} from ${previousState}.`);
      return false;
    }

    const transitionHash = await sha256FromText(
      `${previousState}->${newState}:${event}:${timestamp}`,
    );

    const entry = {
      previousState,
      event,
      newState,
      metadata,
      timestamp,
      transitionHash,
    };

    const saved = await writeLedger(FOUNDER_ID, entry);
    setState(newState);
    setLedger((prev) => [...prev, saved]);

    try {
      await fetch("/api/ledger/notarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: "founder-machine",
          hash: transitionHash,
          eventType: event,
        }),
      });
    } catch {
      // local fallback remains the source of truth when API is unavailable
    }

    return true;
  }

  async function guardedEvent(event, metadata) {
    if (!canTrigger(role, event)) {
      setMessage(`Role ${role} cannot trigger ${event}.`);
      return;
    }

    const didTransition = await persistEvent(event, metadata);
    if (didTransition) {
      setMessage(`Transitioned via ${event}.`);
    }
  }

  useEffect(() => {
    async function loadLedger() {
      try {
        const [recentResponse, journeyResponse] = await Promise.all([
          fetch("/api/ledger"),
          fetch("/api/ledger/founder_journey"),
        ]);

        if (!recentResponse.ok) {
          throw new Error("ledger unavailable");
        }

        const payload = await recentResponse.json();
        const rows = Array.isArray(payload) ? payload : payload.entries || [];
        setApiLedger(rows.slice(-10).reverse());
        setLedgerSource("api");

        if (journeyResponse.ok) {
          const journeyPayload = await journeyResponse.json();
          const journeyRows = Array.isArray(journeyPayload)
            ? journeyPayload
            : journeyPayload.entries || [];
          setJourneyLedgerCount(journeyRows.length);
        }
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
        setJourneyLedgerCount(
          ledger.filter(
            (entry) => entry.metadata?.documentId === "founder_journey",
          ).length,
        );
      }

      setJourneyState(loadFounderState());
    }

    loadLedger();
  }, [ledger]);

  return (
    <div style={styles.container}>
      <h1>FounderOS Console</h1>
      <p style={styles.muted}>
        Governed runtime: doctrine, state transitions, and append-only receipts.
      </p>

      <div style={styles.row}>
        <div style={styles.card}>
          <strong>Founder:</strong> {FOUNDER_ID}
        </div>
        <div style={styles.card}>
          <strong>Current State:</strong> {state}
        </div>
        <label style={styles.card}>
          <strong>Role:</strong>{" "}
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            {Object.values(Roles).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={styles.row}>
        <button onClick={() => guardedEvent("START_BUILD")}>Start Build</button>
        <button onClick={() => guardedEvent("THROTTLE")}>Throttle</button>
        <button onClick={() => guardedEvent("OVERDRIVE")}>Overdrive</button>
        <button onClick={() => guardedEvent("RESET")}>Reset</button>
      </div>

      {message ? <p style={styles.muted}>{message}</p> : null}

      <div style={styles.row}>
        <div style={styles.card}>
          <strong>Total Entries:</strong> {summary.entries}
        </div>
        <div style={styles.card}>
          <strong>Escalations:</strong> {summary.escalations}
        </div>
      </div>

      <div style={styles.logBox}>
        <h3>Founder Journey</h3>
        <div style={styles.row}>
          <div style={styles.card}>
            <strong>State:</strong> {journeyState}
          </div>
          <div style={styles.card}>
            <strong>Progress:</strong> {journeyProgress} of {totalSteps}
          </div>
          <div style={styles.card}>
            <strong>Ledger Entries:</strong> {journeyLedgerCount}
          </div>
          <a href="/founder/onboarding" style={styles.link}>
            {isFinal(journeyState)
              ? "View Complete Journey"
              : "Continue Journey →"}
          </a>
        </div>
      </div>

      <div style={styles.logBox}>
        <h3>Founder Operational State</h3>
        <div style={styles.row}>
          <div style={styles.card}>
            <strong>State:</strong> {state}
          </div>
          <div style={styles.card}>
            <strong>Regime:</strong> {regime}
          </div>
          <div style={styles.card}>
            <strong>Velocity:</strong> {velocity}
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={velocity}
          onChange={(event) => setVelocity(Number(event.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div style={styles.logBox}>
        <h3>Ledger Preview</h3>
        {[...ledger]
          .reverse()
          .slice(0, 12)
          .map((entry, index) => (
            <div key={`${entry.timestamp}-${index}`} style={styles.logEntry}>
              <div>
                {entry.previousState} → {entry.newState} via{" "}
                <strong>{entry.event}</strong>
              </div>
              <small>{new Date(entry.timestamp).toLocaleString()}</small>
            </div>
          ))}
      </div>

      <div style={styles.logBox}>
        <h3>Ledger API Snapshot ({ledgerSource})</h3>
        {apiLedger.map((entry, index) => (
          <div
            key={entry.id || `${entry.timestamp}-${index}`}
            style={styles.logEntry}
          >
            <div>
              <strong>{entry.eventType || entry.event || "UNKNOWN"}</strong> ·{" "}
              {entry.documentId || "n/a"}
            </div>
            <small>
              {entry.timestamp
                ? new Date(entry.timestamp).toLocaleString()
                : "n/a"}
            </small>
          </div>
        ))}
      </div>

      <div style={styles.logBox}>
        <h3>Founder Onboarding</h3>
        <a href="/founder/onboarding" style={styles.link}>
          Open standalone route: /founder/onboarding
        </a>
        <FounderStudioOS />
      </div>

      <StartupStudios />
      <PricingSection />
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
    alignItems: "center",
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
