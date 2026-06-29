import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../shared/src/db";
import { eventId, isoNow } from "../../shared/src/ids";

const PRIMITIVES_TABLE = process.env.PRIMITIVES_TABLE!;
const AUDIT_LOG_TABLE = process.env.AUDIT_LOG_TABLE!;

const RULES: Record<string, { baseValue: number; dd: number; goeStep: number }> = {
  FIFTH: { baseValue: 1.0, dd: 1.0, goeStep: 0.1 },
  PASSE: { baseValue: 1.2, dd: 1.05, goeStep: 0.12 },
  SOUS_SUS: { baseValue: 1.1, dd: 1.0, goeStep: 0.1 },
  SOUTENU: { baseValue: 1.4, dd: 1.1, goeStep: 0.15 },
  ECHO: { baseValue: 0.8, dd: 1.0, goeStep: 0.08 },
};

export async function reviewPrimitive(params: {
  sessionId: string;
  seq: number;
  action: "PROMOTE" | "DISCARD";
  override?: string;
  reviewerNote?: string;
  actorId: string;
}) {
  const { sessionId, seq, action, override, reviewerNote, actorId } = params;

  const existing = await ddb.send(
    new GetCommand({
      TableName: PRIMITIVES_TABLE,
      Key: {
        PK: `SESSION#${sessionId}`,
        SK: `PRIMITIVE#${seq}`,
      },
    }),
  );

  if (!existing.Item) throw new Error("primitive not found");

  const next = { ...existing.Item };
  const now = isoNow();

  if (override) {
    const rule = RULES[override];
    if (!rule) throw new Error("invalid override primitive");

    next.primitiveName = override;
    next.baseValue = rule.baseValue;
    next.dd = rule.dd;
    next.goeStep = rule.goeStep;
  }

  next.reviewStatus = action === "PROMOTE" ? "PROMOTED" : "DISCARDED";
  next.netGoe = action === "PROMOTE" ? 1 : 0;
  next.reviewerNote = reviewerNote ?? null;
  next.updatedAt = now;

  await ddb.send(
    new PutCommand({
      TableName: PRIMITIVES_TABLE,
      Item: next,
    }),
  );

  await ddb.send(
    new PutCommand({
      TableName: AUDIT_LOG_TABLE,
      Item: {
        PK: `SESSION#${sessionId}`,
        SK: `AUDIT#${now}#${eventId()}`,
        sessionId,
        eventType: `PRIMITIVE_${action}`,
        actorId,
        payload: {
          seq,
          override: override ?? null,
          reviewerNote: reviewerNote ?? null,
        },
        createdAt: now,
      },
    }),
  );

  return { ok: true };
}
