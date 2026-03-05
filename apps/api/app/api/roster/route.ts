export async function GET(): Promise<Response> {
  return Response.json({
    dancers: [
      { id: "dcr_001", stageName: "Nova", status: "active" },
      { id: "dcr_002", stageName: "Sol", status: "training" }
    ]
  });
}
