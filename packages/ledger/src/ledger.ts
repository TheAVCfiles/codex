export function calculateOperatingIncome({ revenue, expenses }: { revenue: number; expenses: number }) {
  return revenue - expenses;
}

export function calculateCashFlowProjection({ inflow, outflow, reserve }: { inflow: number; outflow: number; reserve: number }) {
  return reserve + inflow - outflow;
}

export function calculateTrustAllocation({ operatingIncome, trustRate }: { operatingIncome: number; trustRate: number }) {
  return operatingIncome * trustRate;
}
