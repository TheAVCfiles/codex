import { createHash } from "crypto";

export interface GovernanceDocument {
  id: string;
  title: string;
  type: string;
  version: string;
  status: string;
  sha256: string;
  createdAt: Date;
}

function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

const documents: GovernanceDocument[] = [
  {
    id: "founder_reality_kit_v1",
    title: "AVC Welcome Founder Reality Kit",
    type: "ONBOARDING_KIT",
    version: "v1.0",
    status: "ISSUED",
    sha256: hashText(
      "AVC Founder Reality Kit v1.0 — Governing Principle: Responsibility must bear axis with equity. Speed without memory becomes liability. We build memory first.",
    ),
    createdAt: new Date(),
  },
];

export function getDocuments(): GovernanceDocument[] {
  return documents;
}
