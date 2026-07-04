import type { NormalizedEvent } from "./normalize";

export function mintCents(event: NormalizedEvent, rate: number) {
  const base = Math.max(event.weight ?? 1, 0);
  return Number((base * rate).toFixed(4));
}
