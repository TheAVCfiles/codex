import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "./db";

const SESSIONS_TABLE = process.env.SESSIONS_TABLE!;

export async function getSessionDetail(sessionId: string, tenantId: string) {
  const result = await ddb.send(
    new GetCommand({
      TableName: SESSIONS_TABLE,
      Key: {
        PK: `TENANT#${tenantId}`,
        SK: `SESSION#${sessionId}`
      }
    })
  );

  return result.Item ?? { sessionId, tenantId, status: "NOT_FOUND" };
}
