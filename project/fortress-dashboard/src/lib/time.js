export function nowIso() {
  return new Date().toISOString();
}

export function nowClock() {
  return new Date().toLocaleTimeString();
}
