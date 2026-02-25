export function runRegime({ velocity }) {
  if (velocity > 75) {
    return { signal: "OVERDRIVE" };
  }

  return { signal: "SAFE" };
}
