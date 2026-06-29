import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../shared/src/db";
import { isoNow } from "../../shared/src/ids";

const PRIMITIVES_TABLE = process.env.PRIMITIVES_TABLE!;
const STATE_TRANSITIONS_TABLE = process.env.STATE_TRANSITIONS_TABLE!;
const SCORES_TABLE = process.env.SCORES_TABLE!;
const SESSIONS_TABLE = process.env.SESSIONS_TABLE!;

type FsmState = "GLISSADE" | "JETE" | "FERMATA" | "CODA";

const TRANSITIONS: Record<string, { validFrom: FsmState[]; next: FsmState }> = {
  FIFTH: { validFrom: ["FERMATA", "JETE"], next: "CODA" },
  PASSE: { validFrom: ["GLISSADE"], next: "JETE" },
  SOUS_SUS: { validFrom: ["JETE"], next: "FERMATA" },
  SOUTENU: { validFrom: ["GLISSADE", "JETE"], next: "JETE" },
  ECHO: { validFrom: ["JETE", "FERMATA"], next: "FERMATA" },
};

export async function recomputeSession(params: { sessionId: string; tenantId: string }) {
  const { sessionId, tenantId } = params;
  const now = isoNow();

  const primitiveRes = await ddb.send(
    new QueryCommand({
      TableName: PRIMITIVES_TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `SESSION#${sessionId}`,
      },
    }),
  );

  const primitives = (primitiveRes.Items || []).sort((a, b) => a.seq - b.seq);

  let current: FsmState = "GLISSADE";
  const transitions = [];

  for (const p of primitives) {
    if (p.reviewStatus === "DISCARDED") continue;
    const rule = TRANSITIONS[p.primitiveName];
    if (!rule) continue;
    if (!rule.validFrom.includes(current)) continue;

    transitions.push({
      PK: `SESSION#${sessionId}`,
      SK: `STATE#${p.seq}`,
      sessionId,
      seq: p.seq,
      fromState: current,
      toState: rule.next,
      reason: p.primitiveName,
      createdAt: now,
    });

    current = rule.next;
  }

  for (const t of transitions) {
    await ddb.send(
      new PutCommand({
        TableName: STATE_TRANSITIONS_TABLE,
        Item: t,
      }),
    );
  }

  let tes = 0;
  let goe = 0;

  for (const p of primitives) {
    if (p.reviewStatus === "DISCARDED") continue;
    tes += p.baseValue * p.dd;
    goe += p.goeStep * p.netGoe;
  }

  const pcs = 49.11;
  const total = Number((tes + goe + pcs).toFixed(3));

  await ddb.send(
    new PutCommand({
      TableName: SCORES_TABLE,
      Item: {
        PK: `SESSION#${sessionId}`,
        SK: `SCORE#0.1.0`,
        sessionId,
        tes: Number(tes.toFixed(3)),
        goe: Number(goe.toFixed(3)),
        pcs,
        total,
        rulesetVersion: "0.1.0",
        createdAt: now,
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
      UpdateExpression: "SET currentState = :state, scoreTotal = :score, updatedAt = :ts",
      ExpressionAttributeValues: {
        ":state": current,
        ":score": total,
        ":ts": now,
      },
    }),
  );

  return { currentState: current, total };
}
