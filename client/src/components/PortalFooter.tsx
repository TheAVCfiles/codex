import React from "react";
import { Link } from "wouter";

export default function PortalFooter(): JSX.Element {
  return (
    <footer style={{ marginTop: 24, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/startup-studios" data-testid="link-footer-studioos">StudiOS</Link>
        <Link href="/founder" data-testid="link-footer-founder">Founder</Link>
        <Link href="/founder/onboarding">Founder Onboarding</Link>
      </div>
    </footer>
  );
}
