const allowed = new Set(['id','name','client','roomKeyStatus','stayStart','stayEnd','deliverables']);
export function assertGuestPayload(payload: Record<string, unknown>) {
  for (const key of Object.keys(payload)) {
    if (!allowed.has(key)) throw new Error(`Guest payload field not allow-listed: ${key}`);
  }
  return payload;
}
