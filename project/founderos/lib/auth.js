export const Roles = {
  ADMIN: "ADMIN",
  FOUNDER: "FOUNDER",
  OBSERVER: "OBSERVER",
};

export const Credentials = {
  FOUNDING: "FOUNDING",
  ACTIVE: "ACTIVE",
  LEGACY: "LEGACY",
};

export const Statuses = {
  GOOD_STANDING: "GOOD_STANDING",
  FLAGGED: "FLAGGED",
  REVOKED: "REVOKED",
};

export const Capabilities = {
  LEDGER_EXPORT: "LEDGER_EXPORT",
  SAFETY_ESCALATION: "SAFETY_ESCALATION",
};

const ACTION_BLOCKLIST = {
  FOUNDER: new Set(["ESCALATE"]),
  OBSERVER: new Set(["START_BUILD", "PRESSURE_SPIKE", "OVERDRIVE", "THROTTLE", "AUTO_THROTTLE", "ESCALATE", "STABILIZE", "RESET"]),
};

export function canTrigger(role, action, authority = {}) {
  if (authority.status && authority.status !== Statuses.GOOD_STANDING) return false;
  if (action === "ESCALATE" && authority.credential === Credentials.LEGACY) return false;
  if (role === Roles.ADMIN) return true;
  return !ACTION_BLOCKLIST[role]?.has(action);
}

export function canAccessCapability(authority, capability) {
  if (!authority || authority.status !== Statuses.GOOD_STANDING) return false;

  if (capability === Capabilities.LEDGER_EXPORT) {
    return authority.role === Roles.ADMIN || authority.role === Roles.FOUNDER;
  }

  if (capability === Capabilities.SAFETY_ESCALATION) {
    return authority.role === Roles.ADMIN || authority.credential !== Credentials.LEGACY;
  }

  return false;
}
