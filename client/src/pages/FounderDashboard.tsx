import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { founderSteps, getStepIndex, isFinal, loadFounderState, type FounderState } from "../fsm/founderJourney";

type OpState = "IDLE" | "BUILDING" | "THROTTLED" | "ESCALATED";
type Regime = "SAFE" | "OVERDRIVE";

function transition(state: OpState, event: string): OpState {
  switch (state) {
    case "IDLE":
      if (event === "START_BUILD") return "BUILDING";
      if (event === "OVERDRIVE") return "ESCALATED";
      return state;
    case "BUILDING":
      if (event === "THROTTLE") return "THROTTLED";
      if (event === "OVERDRIVE") return "ESCALATED";
      if (event === "RESET") return "IDLE";
      return state;
    case "THROTTLED":
      if (event === "START_BUILD") return "BUILDING";
      if (event === "OVERDRIVE") return "ESCALATED";
      if (event === "RESET") return "IDLE";
      return state;
    case "ESCALATED":
      if (event === "THROTTLE") return "THROTTLED";
      if (event === "RESET") return "IDLE";
      return state;
    default:
      return state;
  }
}

function runRegime(velocity: number): Regime {
  return velocity > 75 ? "OVERDRIVE" : "SAFE";
}

async function hashTransition(from: OpState, to: OpState, event: string): Promise<string> {
  const text = `${from}->${to}:${event}:${Date.now()}`;
  const res = await fetch("/api/documents/hash", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  const sha256 = typeof data?.sha256 === "string" && data.sha256.trim().length > 0 ? data.sha256.trim() : null;

  if (!sha256) {
    throw new Error(`hashTransition: invalid sha256 returned from /api/documents/hash (event=${event})`);
  }

  return sha256;
}

export default function FounderDashboard() {
  const [journeyState] = useState<FounderState>(loadFounderState);
  const [journeyLedgerCount, setJourneyLedgerCount] = useState(0);
  const [ledgerCount, setLedgerCount] = useState(0);
  const [opState, setOpState] = useState<OpState>("IDLE");
  const [velocity, setVelocity] = useState(50);

  async function refreshLedgerCounts() {
    try {
      const [journeyRes, ledgerRes] = await Promise.all([
        fetch("/api/ledger/founder_journey"),
        fetch("/api/ledger/founder-machine"),
      ]);
      const [journeyRows, ledgerRows] = await Promise.all([journeyRes.json(), ledgerRes.json()]);
      setJourneyLedgerCount(Array.isArray(journeyRows) ? journeyRows.length : 0);
      setLedgerCount(Array.isArray(ledgerRows) ? ledgerRows.length : 0);
    } catch {
      setJourneyLedgerCount(0);
      setLedgerCount(0);
    }
  }

  useEffect(() => {
    refreshLedgerCounts();
  }, []);

  const totalSteps = founderSteps.length;
  const journeyStepIdx = getStepIndex(journeyState);
  const completedSteps = Math.min(Math.max(0, journeyStepIdx), totalSteps);
  const regime = runRegime(velocity);

  async function applyEvent(event: string) {
    const from = opState;
    const to = transition(opState, event);
    if (to === from) return;

    const hash = await hashTransition(from, to, event);

    await fetch("/api/ledger/notarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: "founder-machine", hash, eventType: event }),
    });

    setOpState(to);
    await refreshLedgerCounts();
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Founder Dashboard</h1>
      <section style={{ border: "1px solid #333", padding: 16, marginTop: 16 }}>
        <h2>Founder Journey</h2>
        <p>Current state: {journeyState}</p>
        <p>
          Journey progress: {completedSteps} of {totalSteps} steps notarized · {journeyLedgerCount} ledger events
        </p>
        <div style={{ width: "100%", background: "#202020", borderRadius: 9999, height: 8, marginBottom: 8 }}>
          <div
            style={{
              width: `${totalSteps === 0 ? 0 : (completedSteps / totalSteps) * 100}%`,
              height: 8,
              borderRadius: 9999,
              background: "#1d4ed8",
              transition: "width 200ms ease",
            }}
          />
        </div>
        <Link to="/founder/onboarding">{isFinal(journeyState) ? "View Complete Journey" : "Continue Journey →"}</Link>
      </section>

      <section style={{ border: "1px solid #333", padding: 16, marginTop: 16 }}>
        <h2>Founder Operational State</h2>
        <p>Current state: {opState}</p>
        <p>Operational ledger entries: {ledgerCount}</p>
        <p>Regime signal: {regime}</p>
        <input
          type="range"
          min={0}
          max={100}
          value={velocity}
          onChange={(e) => setVelocity(Number(e.target.value))}
        />
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button onClick={() => applyEvent("START_BUILD")}>Start Build</button>
          <button onClick={() => applyEvent("THROTTLE")}>Throttle</button>
          <button onClick={() => applyEvent("OVERDRIVE")}>Overdrive</button>
          <button onClick={() => applyEvent("RESET")}>Reset</button>
        </div>
      </section>
    </main>
  );
}
