import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, isoNow } from "./db";

const SESSIONS_TABLE = process.env.SESSIONS_TABLE!;
const AUDIT_LOG_TABLE = process.env.AUDIT_LOG_TABLE!;

export async function processSession(params: {
  tenantId: string;
  sessionId: string;
  actorId: string;
  artifactKey?: string;
}) {
  const { tenantId, sessionId, actorId, artifactKey } = params;
  const now = isoNow();

  await ddb.send(
    new UpdateCommand({
      TableName: SESSIONS_TABLE,
      Key: {
        PK: `TENANT#${tenantId}`,
        SK: `SESSION#${sessionId}`
      },
      UpdateExpression:
        "SET #status = :status, updatedAt = :ts, artifactKey = :artifactKey, GSI1PK = :gsiPk, GSI1SK = :gsiSk",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":status": "PROCESSING",
        ":ts": now,
        ":artifactKey": artifactKey ?? null,
        ":gsiPk": "STATUS#PROCESSING",
        ":gsiSk": now
      }
    })
  );

  await ddb.send(
    new PutCommand({
      TableName: AUDIT_LOG_TABLE,
      Item: {
        PK: `SESSION#${sessionId}`,
        SK: `AUDIT#${now}#SESSION_PROCESSING`,
        sessionId,
        eventType: "SESSION_PROCESSING",
        actorId,
        payload: { artifactKey: artifactKey ?? null },
        createdAt: now
      }
    })
  );

  return { ok: true, status: "PROCESSING" };
}
