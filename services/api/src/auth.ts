export type AuthContext = {
  actorId: string;
  tenantId: string;
  groups: string[];
  email?: string;
};

export function getAuthContext(event: any): AuthContext {
  const claims = event?.requestContext?.authorizer?.jwt?.claims ?? {};

  const actorId = claims.sub as string | undefined;
  const tenantId = claims["custom:tenant_id"] as string | undefined;
  const rawGroups = claims["cognito:groups"] as string | string[] | undefined;

  const groups = Array.isArray(rawGroups)
    ? rawGroups
    : typeof rawGroups === "string"
      ? rawGroups.split(",")
      : [];

  if (!actorId) throw new Error("missing actor identity");
  if (!tenantId) throw new Error("missing tenant identity");

  return {
    actorId,
    tenantId,
    groups,
    email: claims.email as string | undefined
  };
}

export function requireGroup(ctx: AuthContext, allowed: string[]) {
  const ok = ctx.groups.some((group) => allowed.includes(group));
  if (!ok) throw new Error("forbidden");
}
