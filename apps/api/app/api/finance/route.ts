import { calculateCashFlowProjection } from "@studioos/ledger";

export async function GET(): Promise<Response> {
  const projection = calculateCashFlowProjection({ inflow: 42000, outflow: 28000, reserve: 6000 });
  return Response.json({ cashFlowProjection: projection });
}
