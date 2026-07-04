import { Link } from "react-router-dom";

export default function PortalFooter() {
  return (
    <footer style={{ marginTop: 24, borderTop: "1px solid #333", paddingTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Link to="/governance">Governance</Link>
      <Link to="/kinetic-ledger">Kinetic Ledger</Link>
      <Link to="/founderos/sandbox">FounderOS</Link>
      <Link to="/startup-studios">StudioOS</Link>
      <Link to="/contracts">Contracts</Link>
      <Link to="/founder">Founder</Link>
    </footer>
  );
}
