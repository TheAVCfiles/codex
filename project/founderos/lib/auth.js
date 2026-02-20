export const Roles = {
  ADMIN: "ADMIN",
  FOUNDER: "FOUNDER",
  OBSERVER: "OBSERVER",
};

const ACTION_BLOCKLIST = {
  FOUNDER: new Set(["ESCALATE"]),
  OBSERVER: new Set(["START_BUILD", "PRESSURE_SPIKE", "OVERDRIVE", "THROTTLE", "AUTO_THROTTLE", "ESCALATE", "STABILIZE", "RESET"]),
};

export function canTrigger(role, action) {
  if (role === Roles.ADMIN) return true;
  return !ACTION_BLOCKLIST[role]?.has(action);
}
