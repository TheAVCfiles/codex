import React, { useEffect, useMemo, useState } from "react";
import {
  founderSteps,
  getStepIndex,
  isFinal,
  loadFounderState,
  FounderState,
} from "../fsm/founderJourney";

type LedgerEntry = {
  id?: string;
  documentId?: string;
  hash?: string;
  eventType?: string;
  timestamp?: string;
};

type UIOpState = "IDLE" | "BUILDING" | "THROTTLED" | "ESCALATED";

function transition(state: UIOpState, event: string): UIOpState {
  if (state === "IDLE" && event === "START_BUILD") return "BUILDING";
  if (state === "BUILDING" && event === "THROTTLE") return "THROTTLED";
  if (state === "BUILDING" && event === "OVERDRIVE") return "ESCALATED";
  if (event === "RESET") return "IDLE";
  return state;
}

function runRegime(velocity: number): "SAFE" | "OVERDRIVE" {
  return velocity > 75 ? "OVERDRIVE" : "SAFE";
}

async function hashTransition(from: UIOpState, to: UIOpState, event: string): Promise<string> {
  const text = `${from}->${to}:${event}:${Date.now()}`;
  const response = await fetch("/api/documents/hash", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`Hash request failed (${response.status})`);
  }

  const data = (await response.json()) as { sha256: string };
  return data.sha256;
}

export default function FounderDashboard(): JSX.Element {
  const [journeyState, setJourneyState] = useState<FounderState>("CRISIS");
  const [journeyEvents, setJourneyEvents] = useState<LedgerEntry[]>([]);
  const [opState, setOpState] = useState<UIOpState>("IDLE");
  const [velocity, setVelocity] = useState(40);
  const [recent, setRecent] = useState<LedgerEntry[]>([]);

  const journeyStepIdx = useMemo(() => getStepIndex(journeyState), [journeyState]);
  const completedSteps = journeyStepIdx;
  const totalSteps = founderSteps.length;
  const regimeSignal = runRegime(velocity);

  async function refreshLedgers() {
    const [journeyRes, recentRes] = await Promise.all([
      fetch("/api/ledger/founder_journey").then((r) => r.json()).catch(() => ({ entries: [] })),
      fetch("/api/ledger").then((r) => r.json()).catch(() => ({ entries: [] })),
    ]);

    const journeyRows = journeyRes?.entries || journeyRes || [];
    const recentRows = recentRes?.entries || recentRes?.ledger || recentRes || [];
    setJourneyEvents(Array.isArray(journeyRows) ? journeyRows : []);
    setRecent(Array.isArray(recentRows) ? recentRows.slice(-10).reverse() : []);
  }

  useEffect(() => {
    setJourneyState(loadFounderState());
    refreshLedgers();
  }, []);

  async function submitTransition(event: "START_BUILD" | "THROTTLE" | "OVERDRIVE" | "RESET") {
    const from = opState;
    const to = transition(from, event);

    if (to === from) {
      return;
    }

    try {
      const hash = await hashTransition(from, to, event);
      await fetch("/api/ledger/notarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: "founder-machine", hash, eventType: event }),
      });
      setOpState(to);
      await refreshLedgers();
    } catch {
      // no-op
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Founder Dashboard</h1>

      <section style={styles.card}>
        <h2>Founder Journey</h2>
        <p>
          <strong>Current State:</strong> {journeyState}
        </p>
        <p>
          <strong>Journey Progress:</strong> {completedSteps} of {totalSteps} steps complete
        </p>
        <p>
          <strong>Total Ledger Events:</strong> {journeyEvents.length}
        </p>
        <div style={{ width: "100%", background: "#e5e7eb", borderRadius: 9999, height: 6, marginBottom: 12 }}>
          <div
            style={{
              width: `${(completedSteps / totalSteps) * 100}%`,
              background: "#0ea5e9",
              borderRadius: 9999,
              height: 6,
            }}
          />
        </div>
        <a href="/founder/onboarding">
          {isFinal(journeyState) ? "View Complete Journey →" : "Continue Journey →"}
        </a>
      </section>

      <section style={styles.card}>
        <h2>Founder Operational State</h2>
        <p>
          <strong>State:</strong> {opState}
        </p>
        <p>
          <strong>Regime Signal:</strong> {regimeSignal}
        </p>
        <label>
          Velocity: {velocity}
          <input
            type="range"
            min={0}
            max={100}
            value={velocity}
            onChange={(event) => setVelocity(Number(event.target.value))}
            style={{ display: "block", width: "100%" }}
          />
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <button onClick={() => submitTransition("START_BUILD")}>Start Build</button>
          <button onClick={() => submitTransition("THROTTLE")}>Throttle</button>
          <button onClick={() => submitTransition("OVERDRIVE")}>Overdrive</button>
          <button onClick={() => submitTransition("RESET")}>Reset</button>
        </div>
      </section>

      <section style={styles.card}>
        <h2>Recent Ledger Activity</h2>
        {recent.map((entry, index) => (
          <div key={`${entry.id || entry.timestamp || "row"}-${index}`} style={styles.row}>
            <span>{entry.eventType || "EVENT"}</span>
            <span>{entry.documentId || "document"}</span>
            <span>{entry.timestamp || "timestamp"}</span>
          </div>
        ))}
      </section>

      <section style={styles.card}>
        <h2>Quick Access</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="/startup-studios">Startup StudiOS</a>
          <a href="/founder/onboarding">Founder Onboarding</a>
        </div>
      </section>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #d1d5db",
    borderRadius: 10,
    padding: 16,
    maxWidth: 720,
    marginBottom: 16,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 8,
    borderTop: "1px solid #e5e7eb",
    paddingTop: 8,
    marginTop: 8,
    fontSize: 13,
  },
};
