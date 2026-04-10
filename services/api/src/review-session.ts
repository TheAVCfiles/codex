export async function reviewPrimitive(_params: {
  sessionId: string;
  seq: number;
  action: string;
  override?: unknown;
  reviewerNote?: string;
  actorId: string;
}) {
  return { ok: true };
}
