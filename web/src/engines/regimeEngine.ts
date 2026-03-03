export function runRegime({ velocity }: { velocity: number }): { signal: 'OVERDRIVE' | 'SAFE' } {
  if (velocity > 75) {
    return { signal: 'OVERDRIVE' };
  }

  return { signal: 'SAFE' };
}
