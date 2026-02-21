export const Roles = {
  ADMIN: 'ADMIN',
  FOUNDER: 'FOUNDER',
  OBSERVER: 'OBSERVER',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export function canTrigger(role: Role, action: string): boolean {
  if (role === Roles.ADMIN) return true;
  if (role === Roles.FOUNDER) return action !== 'ESCALATE';
  return false;
}
