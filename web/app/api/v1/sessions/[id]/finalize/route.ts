import { NextResponse } from "next/server";

const API_BASE = process.env.STAGEPORT_API_BASE!;

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const res = await fetch(`${API_BASE}/v1/sessions/${id}/finalize`, {
    method: "POST",
  });

  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
