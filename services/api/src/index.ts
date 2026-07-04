import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { getAuthContext, requireGroup } from "./auth";
import { createSession } from "./create-session";
import { createUploadUrl } from "./create-upload-url";
import { processSession } from "./process-session";
import { getSessionDetail } from "./get-session";
import { reviewPrimitive } from "./review-session";
import { recomputeSession } from "./recompute-session";
import { finalizeSession } from "./finalize-session";

export const handler = async (event: APIGatewayProxyEventV2) => {
  try {
    const ctx = getAuthContext(event);
    const method = event.requestContext.http.method;
    const path = event.rawPath;

    if (method === "POST" && path === "/v1/sessions") {
      requireGroup(ctx, ["Admin", "Operator"]);
      const body = JSON.parse(event.body ?? "{}");

      return json(
        201,
        await createSession({
          tenantId: ctx.tenantId,
          actorId: ctx.actorId,
          sourceType: body.sourceType || "video"
        })
      );
    }

    if (method === "POST" && /^\/v1\/sessions\/[^/]+\/upload-url$/.test(path)) {
      requireGroup(ctx, ["Admin", "Operator"]);
      const sessionId = path.split("/")[3];
      const body = JSON.parse(event.body ?? "{}");

      return json(
        200,
        await createUploadUrl({
          tenantId: ctx.tenantId,
          sessionId,
          contentType: body.contentType,
          fileName: body.fileName
        })
      );
    }

    if (method === "POST" && /^\/v1\/sessions\/[^/]+\/process$/.test(path)) {
      requireGroup(ctx, ["Admin", "Operator"]);
      const sessionId = path.split("/")[3];
      const body = JSON.parse(event.body ?? "{}");

      return json(
        200,
        await processSession({
          tenantId: ctx.tenantId,
          sessionId,
          actorId: ctx.actorId,
          artifactKey: body.artifactKey
        })
      );
    }

    if (method === "GET" && /^\/v1\/sessions\/[^/]+$/.test(path)) {
      requireGroup(ctx, ["Admin", "Reviewer", "Operator"]);
      const sessionId = path.split("/")[3];
      return json(200, await getSessionDetail(sessionId, ctx.tenantId));
    }

    if (method === "POST" && /^\/v1\/sessions\/[^/]+\/review$/.test(path)) {
      requireGroup(ctx, ["Reviewer", "Operator", "Admin"]);
      const sessionId = path.split("/")[3];
      const body = JSON.parse(event.body ?? "{}");

      await reviewPrimitive({
        sessionId,
        seq: body.seq,
        action: body.action,
        override: body.override,
        reviewerNote: body.reviewerNote,
        actorId: ctx.actorId
      });

      await recomputeSession({ sessionId, tenantId: ctx.tenantId });

      return json(200, await getSessionDetail(sessionId, ctx.tenantId));
    }

    if (method === "POST" && /^\/v1\/sessions\/[^/]+\/finalize$/.test(path)) {
      requireGroup(ctx, ["Reviewer", "Operator", "Admin"]);
      const sessionId = path.split("/")[3];
      await finalizeSession({
        sessionId,
        tenantId: ctx.tenantId,
        actorId: ctx.actorId
      });
      return json(200, await getSessionDetail(sessionId, ctx.tenantId));
    }

    if (method === "GET" && /^\/v1\/sessions\/[^/]+\/export$/.test(path)) {
      requireGroup(ctx, ["Admin", "Reviewer", "Operator"]);
      const sessionId = path.split("/")[3];
      return json(200, await getSessionDetail(sessionId, ctx.tenantId));
    }

    return json(404, { error: "not found" });
  } catch (err: any) {
    if (err.message === "forbidden") return json(403, { error: "forbidden" });
    return json(400, { error: err.message || "request failed" });
  }
};

function json(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  };
}
