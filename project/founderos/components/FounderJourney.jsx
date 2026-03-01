import { useMemo } from "react";

const JOURNEY_STEPS = [
  { key: "CRISIS", label: "Crisis" },
  { key: "LAB_ACTIVATION", label: "Lab Activation" },
  { key: "RECEIPTS", label: "Receipts" },
  { key: "STAGECRED", label: "StageCred" },
  { key: "CAPITAL", label: "Capital" },
];

const stateStyle = {
  complete: { borderColor: "#3fb950", color: "#3fb950" },
  current: { borderColor: "#58a6ff", color: "#58a6ff" },
  pending: { borderColor: "#2d3340", color: "#9ea7b3" },
};

export default function FounderJourney({ currentStep, journeyLedgerCount }) {
  const capped = Math.max(0, Math.min(currentStep, JOURNEY_STEPS.length));
  const progressPct = useMemo(
    () => (capped / JOURNEY_STEPS.length) * 100,
    [capped],
  );

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>Founder Journey</h2>
      <p style={styles.subtitle}>
        Crisis → Lab Activation → Receipts → StageCred → Capital. Each completed
        stage should leave a ledger artifact.
      </p>

      <div style={styles.progressWrap}>
        <div style={{ ...styles.progressBar, width: `${progressPct}%` }} />
      </div>
      <p style={styles.meta}>
        {capped} of {JOURNEY_STEPS.length} steps completed ·{" "}
        {journeyLedgerCount} journey ledger entries
      </p>

      <div style={styles.grid}>
        {JOURNEY_STEPS.map((step, index) => {
          const variant =
            index < capped
              ? "complete"
              : index === capped
                ? "current"
                : "pending";
          return (
            <div
              key={step.key}
              style={{ ...styles.card, ...stateStyle[variant] }}
            >
              <small style={styles.stepNum}>Step {index + 1}</small>
              <strong>{step.label}</strong>
            </div>
          );
        })}
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
  progressWrap: {
    marginTop: "0.75rem",
    background: "#141821",
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #58a6ff, #3fb950)",
    transition: "width 200ms ease",
  },
  meta: {
    fontSize: 13,
    opacity: 0.85,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "0.6rem",
    marginTop: "0.6rem",
  },
  card: {
    padding: "0.65rem",
    borderRadius: 6,
    border: "1px solid",
    background: "#141821",
  },
  stepNum: {
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: 11,
    marginBottom: 4,
  },
};
