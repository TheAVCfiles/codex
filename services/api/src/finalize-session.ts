import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../shared/src/db";
import { sha256 } from "../../shared/src/hash";
import { eventId, isoNow } from "../../shared/src/ids";
import { getSessionDetail } from "./get-session";

const RECEIPTS_TABLE = process.env.RECEIPTS_TABLE!;
const SESSIONS_TABLE = process.env.SESSIONS_TABLE!;
const AUDIT_LOG_TABLE = process.env.AUDIT_LOG_TABLE!;
const RECEIPTS_BUCKET = process.env.RECEIPTS_BUCKET!;

const s3 = new S3Client({});

export async function finalizeSession(params: {
  sessionId: string;
  tenantId: string;
  actorId: string;
}) {
  const { sessionId, tenantId, actorId } = params;
  const now = isoNow();

  const detail = await getSessionDetail(sessionId, tenantId);

  const canonical = {
    session: detail.session,
    primitives: detail.primitives,
    transitions: detail.transitions,
    score: detail.score,
  };

  const hash = sha256(canonical);
  const receiptId = `R_${sessionId}`;
  const artifactKey = `receipts/${tenantId}/${sessionId}.json`;

  await s3.send(
    new PutObjectCommand({
      Bucket: RECEIPTS_BUCKET,
      Key: artifactKey,
      ContentType: "application/json",
      Body: JSON.stringify(
        {
          ...canonical,
          receipt: {
            receiptId,
            hash,
            finalizedAt: now,
          },
          archive: detail.archive,
        },
        null,
        2,
      ),
    }),
  );

  await ddb.send(
    new PutCommand({
      TableName: RECEIPTS_TABLE,
      Item: {
        PK: `TENANT#${tenantId}`,
        SK: `RECEIPT#${receiptId}`,
        tenantId,
        receiptId,
        sessionId,
        authorId: detail.session.authorId,
        hash,
        artifactKey,
        finalizedAt: now,
      },
    }),
  );

  await ddb.send(
    new UpdateCommand({
      TableName: SESSIONS_TABLE,
      Key: {
        PK: `TENANT#${tenantId}`,
        SK: `SESSION#${sessionId}`,
      },
      UpdateExpression: "SET #status = :status, receiptId = :receiptId, updatedAt = :ts",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": "FINALIZED",
        ":receiptId": receiptId,
        ":ts": now,
      },
    }),
  );

  await ddb.send(
    new PutCommand({
      TableName: AUDIT_LOG_TABLE,
      Item: {
        PK: `SESSION#${sessionId}`,
        SK: `AUDIT#${now}#${eventId()}`,
        sessionId,
        eventType: "RECEIPT_FINALIZED",
        actorId,
        payload: { receiptId, hash, artifactKey },
        createdAt: now,
      },
    }),
  );

  return { receiptId, hash, artifactKey, finalizedAt: now };
}
