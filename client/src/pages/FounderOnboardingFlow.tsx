import React, { useMemo, useState } from "react";
import {
  FounderState,
  founderSteps,
  isFinal,
  loadFounderState,
  nextState,
  saveFounderState,
} from "../fsm/founderJourney";

type HashResponse = { sha256: string };

export default function FounderOnboardingFlow(): JSX.Element {
  const [state, setState] = useState<FounderState>(() => loadFounderState());
  const [status, setStatus] = useState("");
  const [hashValue, setHashValue] = useState("");
  const [busy, setBusy] = useState(false);

  const activeStep = useMemo(
    () => founderSteps.find((step) => step.state === state) ?? founderSteps[0],
    [state],
  );

  const activeIndex = founderSteps.findIndex((step) => step.state === state);

  async function markStepComplete() {
    setBusy(true);
    setStatus("");

    try {
      const hashResponse = await fetch("/api/documents/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: JSON.stringify({ step: state, ts: Date.now() }) }),
      });

      if (!hashResponse.ok) {
        throw new Error(`Hash request failed (${hashResponse.status})`);
      }

      const hashPayload = (await hashResponse.json()) as HashResponse;
      const sha256 = hashPayload.sha256;

      const notarizeResponse = await fetch("/api/ledger/notarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: "founder_journey",
          hash: sha256,
          eventType: activeStep.ledgerEventType,
        }),
      });

      if (!notarizeResponse.ok) {
        throw new Error(`Notarize request failed (${notarizeResponse.status})`);
      }

      const next = nextState(state);
      saveFounderState(next);
      setState(next);
      setHashValue(sha256);
      setStatus("Step notarized and journey state advanced.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to complete step.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 980 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <a href="/founder">← Back</a>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/governance">Governance</a>
          <a href="/contracts">Contracts</a>
        </div>
      </div>

      <p style={{ letterSpacing: 1, fontSize: 12 }}>FOUNDER ONBOARDING</p>
      <h1>Your Governed Journey</h1>

      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        {founderSteps.map((step, index) => (
          <div
            key={step.state}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 10,
              padding: 12,
              background:
                index === activeIndex ? "#dbeafe" : index < activeIndex ? "#dcfce7" : "#f8fafc",
            }}
          >
            <strong>{step.label}</strong>
            <p style={{ margin: "6px 0" }}>{step.description}</p>
            <p style={{ margin: 0 }}><strong>Next Action:</strong> {step.requiredAction}</p>
            {index === activeIndex && !isFinal(state) ? (
              <button onClick={markStepComplete} disabled={busy} style={{ marginTop: 10 }}>
                {busy ? "Recording…" : "Mark Step Complete"}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {status ? <p>{status}</p> : null}
      {hashValue ? <p><strong>Latest Hash:</strong> {hashValue}</p> : null}

      {isFinal(state) ? (
        <div style={{ border: "1px solid #22c55e", borderRadius: 10, padding: 12 }}>
          <strong>Architecture complete.</strong> Your governance trail is on the ledger. <a href="/founder">Return to dashboard.</a>
        </div>
      ) : null}
    </div>
  );
}
