export async function finalizeSession(_params: {
  sessionId: string;
  tenantId: string;
  actorId: string;
}) {
  return { ok: true };
}
