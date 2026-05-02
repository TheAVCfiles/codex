import { SessionDetailResponse } from "./stageport-types";

export async function fetchSession(sessionId: string): Promise<SessionDetailResponse> {
  const res = await fetch(`/api/v1/sessions/${sessionId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("failed to fetch session");
  return res.json();
}

export async function reviewSessionPrimitive(
  sessionId: string,
  payload: {
    seq: number;
    action: "PROMOTE" | "DISCARD";
    override?: "FIFTH" | "PASSE" | "SOUS_SUS" | "SOUTENU" | "ECHO";
    reviewerNote?: string;
  }
): Promise<SessionDetailResponse> {
  const res = await fetch(`/api/v1/sessions/${sessionId}/review`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("failed to review primitive");
  return res.json();
}

export async function finalizeSessionReceipt(sessionId: string): Promise<SessionDetailResponse> {
  const res = await fetch(`/api/v1/sessions/${sessionId}/finalize`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("failed to finalize receipt");
  return res.json();
}

export async function exportSessionBundle(sessionId: string): Promise<any> {
  const res = await fetch(`/api/v1/sessions/${sessionId}/export`, {
    method: "GET"
  });
  if (!res.ok) throw new Error("failed to export bundle");
  return res.json();
}
