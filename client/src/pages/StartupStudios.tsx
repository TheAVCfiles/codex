import { Link } from "react-router-dom";

const transferGrid = [
  ["Postural Alignment", "Architecture that holds under load"],
  ["Precision Repetition", "Versioning and roadmapping"],
  ["Delayed Gratification", "Governance before growth"],
  ["Authority Hierarchy", "Corridors of ownership (no phantom equity)"],
  ["Correction Without Ego Collapse", "Peer review culture"],
  ["Ritualized Rehearsal", "28-day mutation engine"],
];

const corridors = [
  ["Glissade", "Stabilize & ship"],
  ["Jeté", "Execute & win"],
  ["Fermata", "Pause/lock — enforce safety"],
  ["Coda", "Publish, notarize, archive, license"],
];

const protocol = [
  "Codify What Only You Can Do",
  "Engineer Temporal Predictability",
  "Own Your Data and Narrative",
  "Build a Lattice of Self-Sufficient Units",
  "Design Graceful Degradation",
];

export default function StartupStudios() {
  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/">← Back</Link>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/governance">Governance</Link>
          <Link to="/contracts">Contracts</Link>
          <Link to="/founder">Founder</Link>
        </div>
      </div>
      <p>STARTUP STUDIOOS</p>
      <h1>The Barre Is the Operating System</h1>
      <p>
        Whether you began as a dancer or a coder — conservatory-grade structural coherence is the rarest competitive
        advantage. StagePort makes it transferable. We do not build features. We build the structure that makes
        features defensible.
      </p>

      <h2>The Transfer Grid</h2>
      {transferGrid.map(([title, text]) => (
        <article key={title}>
          <strong>{title}</strong>
          <p>{text}</p>
        </article>
      ))}

      <h2>Four Corridors</h2>
      {corridors.map(([title, text]) => (
        <article key={title}>
          <strong>{title}</strong>
          <p>{text}</p>
        </article>
      ))}

      <h2>The Dependability Protocol</h2>
      {protocol.map((item) => (
        <p key={item}>{item}</p>
      ))}

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Link to="/governance">Enter Governance</Link>
        <Link to="/founder/onboarding">Founder Reality Kit</Link>
        <Link to="/founder">Founder Dashboard</Link>
      </div>
    </main>
  );
}
