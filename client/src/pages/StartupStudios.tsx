import React from "react";
import PortalFooter from "../components/PortalFooter";
import PortalNavigation from "../components/PortalNavigation";
import PricingSection from "../components/PricingSection";

const transfer = [
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
  ["Fermata", "Pause/lock — enforce boundaries"],
  ["Coda", "Publish, notarize, archive, license"],
];

const protocol = [
  ["Codify What Only You Can Do", "Name your irreducible contribution and encode it."],
  ["Engineer Temporal Predictability", "Create repeatable cadence under pressure."],
  ["Own Your Data and Narrative", "Control source records and interpretation layer."],
  ["Build a Lattice of Self-Sufficient Units", "Design independent modules with clear interfaces."],
  ["Design Graceful Degradation", "When stress rises, fail safe with bounded loss."],
  ["Constrain Before Expanding", "Raise governance baseline before increasing scope."],
  ["Default to Receipts", "Every material move must be evidentiary."],
  ["Preserve Decision Memory", "Record context, action, and owner for retrieval."],
  ["Escalate by Protocol", "Replace emotion-driven reaction with governed escalation."],
  ["Align Authority to Responsibility", "No ownership ambiguity, no unaccountable power."],
];

export default function StartupStudios(): JSX.Element {
  return (
    <div style={{ padding: 24, maxWidth: 1100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <a href="/">← Back</a>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/governance">Governance</a>
          <a href="/contracts">Contracts</a>
          <a href="/founder">Founder</a>
        </div>
      </div>

      <PortalNavigation />

      <p style={{ letterSpacing: 1, fontSize: 12 }}>STARTUP STUDIOOS</p>
      <h1>The Barre Is the Operating System</h1>
      <p>
        Whether you began as a dancer or a coder — conservatory-grade structural coherence is the rarest competitive
        advantage. StagePort makes it transferable.
      </p>
      <p>We do not build features. We build the structure that makes features defensible.</p>

      <h2>The Transfer Grid</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        {transfer.map(([left, right]) => (
          <div key={left} style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: 12 }}>
            <strong>{left}</strong>
            <p>{right}</p>
          </div>
        ))}
      </div>

      <h2>Four Corridors</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        {corridors.map(([name, desc]) => (
          <div key={name} style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: 12 }}>
            <strong>{name}</strong>
            <p>{desc}</p>
          </div>
        ))}
      </div>

      <h2>The Dependability Protocol</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        {protocol.map(([name, desc]) => (
          <div key={name} style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: 12 }}>
            <strong>{name}</strong>
            <p>{desc}</p>
          </div>
        ))}
      </div>

      <h2>Enter the Governed Stack</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        <a href="/governance">Enter Governance</a>
        <a href="/founder/onboarding">Founder Reality Kit</a>
        <a href="/founder">Founder Dashboard</a>
      </div>

      <PricingSection />
      <PortalFooter />
    </div>
  );
}
