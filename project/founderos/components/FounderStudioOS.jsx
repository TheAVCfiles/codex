import { useMemo, useState } from "react";
import {
  founderSteps,
  getStepIndex,
  isFinal,
  loadFounderState,
  nextState,
  saveFounderState,
} from "../fsm/founderJourney";

async function sha256FromText(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function FounderStudioOS() {
  const [currentState, setCurrentState] = useState(() => loadFounderState());
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [lastHash, setLastHash] = useState("");

  const activeStep = useMemo(
    () =>
      founderSteps.find((step) => step.state === currentState) ||
      founderSteps[0],
    [currentState],
  );

  const totalSteps = founderSteps.length;

  const completedCount = useMemo(
    () => Math.max(0, Math.min(getStepIndex(currentState), totalSteps)),
    [currentState, totalSteps],
  );

  async function markStepComplete() {
    setStatus("");
    setError("");

    try {
      const payload = JSON.stringify({
        step: activeStep.state,
        ts: Date.now(),
      });
      const hash = await sha256FromText(payload);

      const response = await fetch("/api/ledger/notarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: "founder_journey",
          hash,
          eventType: activeStep.ledgerEventType,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to notarize founder journey step");
      }

      setLastHash(hash);
      const newState = nextState(currentState);
      saveFounderState(newState);
      setCurrentState(newState);
      setStatus(`Step complete: ${activeStep.label}`);
    } catch {
      setError(
        "Unable to complete step. Confirm /api/ledger/notarize availability.",
      );
    }
  }

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>FOUNDER ONBOARDING</h2>
      <p style={styles.subtitle}>Your Governed Journey</p>

      <div style={styles.steps}>
        {founderSteps.map((step, index) => {
          const active = step.state === currentState;
          const done = completedCount > index;

          return (
            <div
              key={step.state}
              style={{
                ...styles.stepCard,
                borderColor: active ? "#67e8f9" : done ? "#34d399" : "#2d3340",
                background: active ? "#102431" : done ? "#10281d" : "#141821",
              }}
            >
              <strong>
                {index + 1}. {step.label}
              </strong>
              <p style={styles.stepText}>{step.description}</p>
              <p style={styles.stepText}>
                <em>{step.requiredAction}</em>
              </p>
              {active && !isFinal(currentState) ? (
                <button onClick={markStepComplete}>Mark Step Complete</button>
              ) : null}
            </div>
          );
        })}
      </div>

      <div style={styles.panel}>
        <div style={styles.meta}>
          <strong>Progress:</strong> {completedCount} of {totalSteps} complete
        </div>
        {status ? (
          <div style={styles.meta}>
            <strong>Status:</strong> {status}
          </div>
        ) : null}
        {lastHash ? (
          <div style={styles.meta}>
            <strong>Hash:</strong> {lastHash.slice(0, 14)}...
            {lastHash.slice(-10)}
          </div>
        ) : null}
        {error ? <div style={styles.error}>{error}</div> : null}
      </div>

      {isFinal(currentState) ? (
        <div style={styles.completion}>
          <strong>
            Architecture complete. Your governance trail is on the ledger.
          </strong>
        </div>
      ) : null}
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
    letterSpacing: "0.08em",
  },
  subtitle: {
    marginTop: 0,
    opacity: 0.85,
  },
  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "0.6rem",
    marginBottom: "1rem",
  },
  stepCard: {
    padding: "0.65rem",
    borderRadius: 6,
    border: "1px solid #2d3340",
  },
  stepText: {
    fontSize: 12,
    opacity: 0.9,
  },
  panel: {
    padding: "0.75rem",
    borderRadius: 6,
    background: "#141821",
  },
  completion: {
    marginTop: "1rem",
    padding: "0.75rem",
    borderRadius: 6,
    background: "#0f2c21",
    border: "1px solid #34d399",
  },
  meta: {
    fontSize: 13,
    marginBottom: "0.35rem",
  },
  error: {
    marginTop: "0.6rem",
    color: "#ff8d8d",
  },
};
