import { calculateOperatingIncome, calculateTrustAllocation } from "@studioos/ledger";

export async function GET(): Promise<Response> {
  const operatingIncome = calculateOperatingIncome({ revenue: 185000, expenses: 91000 });
  const trust = calculateTrustAllocation({ operatingIncome, trustRate: 0.15 });

  return Response.json({ operatingIncome, trust });
}
