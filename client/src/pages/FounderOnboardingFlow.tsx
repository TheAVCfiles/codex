import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FounderState,
  founderSteps,
  isFinal,
  loadFounderState,
  nextState,
  saveFounderState,
} from "../fsm/founderJourney";

async function hashStep(text: string): Promise<string> {
  const res = await fetch("/api/documents/hash", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  const sha256 = typeof data?.sha256 === "string" && data.sha256.trim().length > 0 ? data.sha256.trim() : null;
  if (!sha256) {
    throw new Error("hashStep: invalid sha256 returned from /api/documents/hash");
  }

  return sha256;
}

export default function FounderOnboardingFlow() {
  const [state, setState] = useState<FounderState>(() => loadFounderState());
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const activeIndex = useMemo(() => founderSteps.findIndex((s) => s.state === state), [state]);
  const activeStep = founderSteps[activeIndex];

  async function markStepComplete() {
    if (!activeStep || busy) return;
    setBusy(true);
    setMessage("");

    try {
      const sha256 = await hashStep(JSON.stringify({ step: activeStep.state, ts: Date.now() }));

      const notarizeRes = await fetch("/api/ledger/notarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: "founder_journey",
          hash: sha256,
          eventType: activeStep.ledgerEventType,
        }),
      });
      if (!notarizeRes.ok) throw new Error("Failed to notarize");

      const next = nextState(state);
      saveFounderState(next);
      setState(next);
      setMessage(`Step recorded with hash ${sha256.slice(0, 16)}...`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unable to record step on ledger.";
      setMessage(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Link to="/founder">← Back</Link>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/governance">GOVERNANCE</Link>
          <Link to="/contracts">CONTRACTS</Link>
        </div>
      </div>
      <p>FOUNDER ONBOARDING</p>
      <h1>Your Governed Journey</h1>

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        {founderSteps.map((step, i) => {
          const done = i < activeIndex;
          const current = i === activeIndex;
          return (
            <section
              key={step.state}
              style={{
                border: "1px solid #2d2d2d",
                padding: 16,
                background: current ? "#1c2836" : done ? "#17291a" : "#151515",
              }}
            >
              <h3>{step.label}</h3>
              <p>{step.description}</p>
              <small>{step.requiredAction}</small>
              {current && !isFinal(state) ? (
                <div style={{ marginTop: 10 }}>
                  <button onClick={markStepComplete} disabled={busy}>
                    {busy ? "Recording..." : "Mark Step Complete"}
                  </button>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      {message ? <p style={{ marginTop: 16 }}>{message}</p> : null}

      {isFinal(state) ? (
        <section style={{ marginTop: 24, border: "1px solid #264e2b", padding: 16 }}>
          <h2>Architecture complete. Your governance trail is on the ledger.</h2>
          <Link to="/founder">Return to Founder Dashboard</Link>
        </section>
      ) : null}
    </main>
  );
}
