export function runRegime(input) {
  const velocity = Number(input.velocity || 0);
  if (velocity >= 85) {
    return { signal: "OVERDRIVE", velocity, timestamp: Date.now() };
  }

  if (velocity >= 60) {
    return { signal: "PRESSURE_SPIKE", velocity, timestamp: Date.now() };
  }

  return { signal: "START_BUILD", velocity, timestamp: Date.now() };
}
