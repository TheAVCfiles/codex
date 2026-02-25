export const Roles = {
  ADMIN: "ADMIN",
  FOUNDER: "FOUNDER",
  OBSERVER: "OBSERVER",
};

export function canTrigger(role, action) {
  if (role === Roles.ADMIN) return true;
  if (role === Roles.FOUNDER) return action !== "ESCALATE";
  return false;
}
