import { NextResponse } from "next/server";
import { reviewPrimitive } from "@/lib/stageport-mock-db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  try {
    const data = reviewPrimitive(
      id,
      body.seq,
      body.action,
      body.override,
      body.reviewerNote
    );
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
