import crypto from "node:crypto";

export type GovernanceDocument = {
  id: string;
  title: string;
  type: string;
  version: string;
  status: string;
  sha256: string;
  createdAt: Date;
  createdAtISO: string;
};

function sha256Hex(text: string): string {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

const issuedAt = new Date();

const documents: GovernanceDocument[] = [
  {
    id: "founder_reality_kit_v1",
    title: "AVC Welcome Founder Reality Kit",
    type: "ONBOARDING_KIT",
    version: "v1.0",
    status: "ISSUED",
    sha256: sha256Hex(
      "AVC Founder Reality Kit v1.0 — Governing Principle: Responsibility must bear axis with equity. Speed without memory becomes liability. We build memory first.",
    ),
    createdAt: issuedAt,
    createdAtISO: issuedAt.toISOString(),
  },
];

export function listDocuments(): GovernanceDocument[] {
  return documents;
}
