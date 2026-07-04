const OVERDRIVE_VELOCITY_THRESHOLD = 75;

export function runRegime({ velocity }) {
  if (velocity > OVERDRIVE_VELOCITY_THRESHOLD) {
    return { signal: "OVERDRIVE" };
  }

  return { signal: "SAFE" };
}
