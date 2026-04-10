import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../shared/src/db";

const SESSIONS_TABLE = process.env.SESSIONS_TABLE!;
const PRIMITIVES_TABLE = process.env.PRIMITIVES_TABLE!;
const STATE_TRANSITIONS_TABLE = process.env.STATE_TRANSITIONS_TABLE!;
const SCORES_TABLE = process.env.SCORES_TABLE!;
const RECEIPTS_TABLE = process.env.RECEIPTS_TABLE!;
const AUDIT_LOG_TABLE = process.env.AUDIT_LOG_TABLE!;

export async function getSessionDetail(sessionId: string, tenantId: string) {
  const session = await ddb.send(
    new GetCommand({
      TableName: SESSIONS_TABLE,
      Key: {
        PK: `TENANT#${tenantId}`,
        SK: `SESSION#${sessionId}`,
      },
    }),
  );

  if (!session.Item) {
    throw new Error("session not found");
  }

  const primitives = await ddb.send(
    new QueryCommand({
      TableName: PRIMITIVES_TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `SESSION#${sessionId}`,
      },
    }),
  );

  const transitions = await ddb.send(
    new QueryCommand({
      TableName: STATE_TRANSITIONS_TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `SESSION#${sessionId}`,
      },
    }),
  );

  const scores = await ddb.send(
    new QueryCommand({
      TableName: SCORES_TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `SESSION#${sessionId}`,
      },
      ScanIndexForward: false,
      Limit: 1,
    }),
  );

  const receiptId = session.Item.receiptId;
  let receipt = null;

  if (receiptId) {
    const receiptRes = await ddb.send(
      new GetCommand({
        TableName: RECEIPTS_TABLE,
        Key: {
          PK: `TENANT#${tenantId}`,
          SK: `RECEIPT#${receiptId}`,
        },
      }),
    );
    receipt = receiptRes.Item || null;
  }

  const audit = await ddb.send(
    new QueryCommand({
      TableName: AUDIT_LOG_TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `SESSION#${sessionId}`,
      },
      ScanIndexForward: false,
      Limit: 50,
    }),
  );

  return {
    session: session.Item,
    primitives: primitives.Items || [],
    transitions: transitions.Items || [],
    score: scores.Items?.[0] || null,
    receipt,
    archive: audit.Items || [],
  };
}
