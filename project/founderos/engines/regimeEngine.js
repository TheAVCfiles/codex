export function runRegime(velocity) {
  const normalizedVelocity = Number(velocity || 0);
  return normalizedVelocity > 75 ? "OVERDRIVE" : "SAFE";
}
