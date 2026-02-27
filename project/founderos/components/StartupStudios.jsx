const transferGrid = [
  ["Postural Alignment", "Architecture that holds under load"],
  ["Precision Repetition", "Versioning and roadmapping"],
  ["Delayed Gratification", "Governance before growth"],
  ["Authority Hierarchy", "Corridors of ownership (no phantom equity)"],
  ["Correction Without Ego Collapse", "Peer review culture"],
  ["Ritualized Rehearsal", "28-day mutation engine"],
];

const corridors = [
  ["Glissade", "Stabilize & ship with gentle progress"],
  ["Jeté", "Execute & win (demos, launches, closes)"],
  ["Fermata", "Pause/lock, enforce boundaries"],
  ["Coda", "Publish, notarize, archive, license"],
];

const dependability = [
  [
    "Codify What Only You Can Do",
    "Document unique founder decisions as reusable protocol.",
  ],
  [
    "Engineer Temporal Predictability",
    "Run governance cadence that is resilient to volatility.",
  ],
  [
    "Own Your Data and Narrative",
    "Build evidence trails before external storytelling.",
  ],
  [
    "Build a Lattice of Self-Sufficient Units",
    "Design teams that can execute independently.",
  ],
  ["Design Graceful Degradation", "Pre-plan fallback operations under stress."],
];

export default function StartupStudios() {
  return (
    <section
      style={{
        marginTop: "1.25rem",
        padding: "1rem",
        background: "#1c1f26",
        borderRadius: 8,
      }}
    >
      <h2>STARTUP STUDIOOS</h2>
      <p>
        <strong>The Barre Is the Operating System</strong>
      </p>
      <p>
        Whether you began as a dancer or a coder — conservatory-grade structural
        coherence is the rarest competitive advantage. StagePort makes it
        transferable.
      </p>
      <p>
        We do not build features. We build the structure that makes features
        defensible.
      </p>

      <h3>The Transfer Grid</h3>
      {transferGrid.map(([title, detail]) => (
        <div key={title}>
          <strong>{title}</strong> — {detail}
        </div>
      ))}

      <h3>Four Corridors</h3>
      {corridors.map(([title, detail]) => (
        <div key={title}>
          <strong>{title}</strong> — {detail}
        </div>
      ))}

      <h3>The Dependability Protocol</h3>
      {dependability.map(([title, detail]) => (
        <div key={title}>
          <strong>{title}</strong> — {detail}
        </div>
      ))}
    </section>
  );
}
