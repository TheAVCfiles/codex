import crypto from "node:crypto";
import {
  Primitive,
  PrimitiveName,
  SessionDetailResponse,
  ReviewStatus
} from "@/lib/stageport-types";

const sessions = new Map<string, SessionDetailResponse>();

function seed(id: string): SessionDetailResponse {
  const primitives: Primitive[] = [
    { seq: 1, primitiveName: "PASSE", confidence: 0.94, reviewStatus: "DRAFT", params: { side: "L" } },
    { seq: 2, primitiveName: "SOUTENU", confidence: 0.91, reviewStatus: "DRAFT", params: { angle: 180 } },
    { seq: 3, primitiveName: "SOUS_SUS", confidence: 0.89, reviewStatus: "DRAFT", params: {} },
    { seq: 4, primitiveName: "FIFTH", confidence: 0.97, reviewStatus: "DRAFT", params: {} }
  ];

  return {
    session: {
      sessionId: id,
      sourceType: "video",
      status: "IN_REVIEW",
      authorId: "u_123",
      currentState: "GLISSADE"
    },
    primitives,
    transitions: [],
    score: { tes: 0, goe: 0, pcs: 48, total: 48, rulesetVersion: "0.1.0" },
    receipt: null,
    archive: [{ type: "SESSION_CREATED", ts: new Date().toISOString(), detail: `Session ${id} created` }]
  };
}

function recompute(data: SessionDetailResponse) {
  const promoted = data.primitives.filter((p) => p.reviewStatus === "PROMOTED");
  const tes = Number(promoted.length.toFixed(3));
  const goe = Number((promoted.length * 0.1).toFixed(3));
  const pcs = 48;
  data.score = { tes, goe, pcs, total: Number((tes + goe + pcs).toFixed(3)), rulesetVersion: "0.1.0" };
}

export function getSessionDetail(id: string): SessionDetailResponse {
  if (!sessions.has(id)) sessions.set(id, seed(id));
  return sessions.get(id)!;
}

export function reviewPrimitive(
  id: string,
  seq: number,
  action: "PROMOTE" | "DISCARD",
  override?: PrimitiveName,
  reviewerNote?: string
): SessionDetailResponse {
  const data = getSessionDetail(id);
  const primitive = data.primitives.find((p) => p.seq === seq);
  if (!primitive) throw new Error(`primitive ${seq} not found`);

  if (override) primitive.primitiveName = override;
  primitive.reviewStatus = (action === "PROMOTE" ? "PROMOTED" : "DISCARDED") as ReviewStatus;

  recompute(data);
  data.archive.unshift({
    type: "PRIMITIVE_REVIEWED",
    ts: new Date().toISOString(),
    detail: `seq=${seq} action=${action}${override ? ` override=${override}` : ""}${reviewerNote ? ` note=${reviewerNote}` : ""}`
  });
  return data;
}

export function finalizeReceipt(id: string): SessionDetailResponse {
  const data = getSessionDetail(id);
  const hash = crypto.createHash("sha256").update(JSON.stringify(data.score)).digest("hex");
  data.receipt = {
    receiptId: `r_${id}`,
    hash,
    finalizedAt: new Date().toISOString()
  };
  data.session.status = "FINALIZED";
  data.archive.unshift({ type: "RECEIPT_FINALIZED", ts: new Date().toISOString(), detail: data.receipt.receiptId });
  return data;
}

export function exportReceiptBundle(id: string) {
  const data = getSessionDetail(id);
  return {
    session: data.session,
    primitives: data.primitives,
    transitions: data.transitions,
    score: data.score,
    receipt: data.receipt,
    archive: data.archive
  };
}
