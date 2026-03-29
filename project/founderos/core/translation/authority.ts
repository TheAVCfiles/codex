export type AccessFeature =
  | "EXPORT_LEDGER"
  | "SAFETY_ESCALATION"
  | "ADVANCED_TOOLS";

export type AuthorityState = {
  settings: {
    role: string;
    credential: string;
    status: string;
  };
};

export function canAccess(feature: AccessFeature, state: AuthorityState) {
  const { role, credential, status } = state.settings;

  if (status !== "GOOD_STANDING") return false;

  const rules: Record<AccessFeature, boolean> = {
    EXPORT_LEDGER: role === "DIRECTOR",
    SAFETY_ESCALATION: role === "DIRECTOR" && credential !== "LEGACY",
    ADVANCED_TOOLS: credential === "ACTIVE" || credential === "FOUNDING",
  };

  return rules[feature] || false;
}
