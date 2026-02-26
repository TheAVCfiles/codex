import React from "react";
import { Link } from "wouter";

export default function PortalNavigation(): JSX.Element {
  return (
    <nav style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
      <Link href="/">HOME</Link>
      <Link href="/tokens">TOKENS</Link>
      <Link href="/startup-studios" data-testid="link-studioos">STUDIOOS</Link>
      <Link href="/contracts">CONTRACTS</Link>
      <Link href="/founder">FOUNDER</Link>
    </nav>
  );
}
