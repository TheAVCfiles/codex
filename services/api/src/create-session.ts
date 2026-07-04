import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { ddb, isoNow } from "./db";

const SESSIONS_TABLE = process.env.SESSIONS_TABLE!;
const AUDIT_LOG_TABLE = process.env.AUDIT_LOG_TABLE!;

export async function createSession(params: {
  tenantId: string;
  actorId: string;
  sourceType: "video" | "manual" | "hybrid";
}) {
  const { tenantId, actorId, sourceType } = params;
  const now = isoNow();
  const sessionId = `SES_${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;

  await ddb.send(
    new PutCommand({
      TableName: SESSIONS_TABLE,
      Item: {
        PK: `TENANT#${tenantId}`,
        SK: `SESSION#${sessionId}`,
        GSI1PK: "STATUS#INITIALIZED",
        GSI1SK: now,
        tenantId,
        sessionId,
        authorId: actorId,
        sourceType,
        status: "INITIALIZED",
        currentState: "GLISSADE",
        receiptId: null,
        scoreTotal: 0,
        createdAt: now,
        updatedAt: now
      }
    })
  );

  await ddb.send(
    new PutCommand({
      TableName: AUDIT_LOG_TABLE,
      Item: {
        PK: `SESSION#${sessionId}`,
        SK: `AUDIT#${now}#SESSION_CREATED`,
        sessionId,
        eventType: "SESSION_CREATED",
        actorId,
        payload: { sourceType },
        createdAt: now
      }
    })
  );

  return { sessionId, tenantId, status: "INITIALIZED" };
}
