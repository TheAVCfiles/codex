import { finalizeSession } from "./finalize-session";
import { getSessionDetail } from "./get-session";
import { recomputeSession } from "./recompute-session";
import { reviewPrimitive } from "./review-session";

export const handler = async (event: any) => {
  const method = event.requestContext.http.method;
  const path = event.rawPath;
  const tenantId = event.headers["x-tenant-id"] || "TENANT_STAGEPORT";
  const actorId = event.headers["x-actor-id"] || "REVIEWER_DEMO";

  try {
    if (method === "GET" && /^\/v1\/sessions\/[^/]+$/.test(path)) {
      const sessionId = path.split("/")[3];
      return json(200, await getSessionDetail(sessionId, tenantId));
    }

    if (method === "POST" && /^\/v1\/sessions\/[^/]+\/review$/.test(path)) {
      const sessionId = path.split("/")[3];
      const body = JSON.parse(event.body || "{}");

      await reviewPrimitive({
        sessionId,
        seq: body.seq,
        action: body.action,
        override: body.override,
        reviewerNote: body.reviewerNote,
        actorId,
      });

      await recomputeSession({ sessionId, tenantId });

      return json(200, await getSessionDetail(sessionId, tenantId));
    }

    if (method === "POST" && /^\/v1\/sessions\/[^/]+\/finalize$/.test(path)) {
      const sessionId = path.split("/")[3];
      await finalizeSession({ sessionId, tenantId, actorId });
      return json(200, await getSessionDetail(sessionId, tenantId));
    }

    if (method === "GET" && /^\/v1\/sessions\/[^/]+\/export$/.test(path)) {
      const sessionId = path.split("/")[3];
      return json(200, await getSessionDetail(sessionId, tenantId));
    }

    return json(404, { error: "not found" });
  } catch (err: any) {
    return json(400, { error: err.message || "request failed" });
  }
};

function json(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}
