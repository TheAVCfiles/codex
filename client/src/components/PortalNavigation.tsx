import { Link } from "react-router-dom";

export default function PortalNavigation() {
  return (
    <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Link to="/">HOME</Link>
      <Link to="/kinetic-ledger">KINETIC LEDGER</Link>
      <Link to="/founderos/sandbox">FOUNDEROS</Link>
      <Link to="/tokens">TOKENS</Link>
      <Link to="/startup-studios">STUDIOOS</Link>
      <Link to="/contracts">CONTRACTS</Link>
    </nav>
  );
}
