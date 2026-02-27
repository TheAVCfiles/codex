import { hashEntry } from "./hash";

const STORAGE_KEY = "founderos-ledger";

function readLedger() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { founders: {} };
  } catch {
    return { founders: {} };
  }
}

function writeLedgerState(ledger) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
}

export async function writeLedger(founderId, entry) {
  if (!founderId || typeof founderId !== "string") {
    throw new Error("Missing or invalid founderId");
  }
  if (!entry || typeof entry !== "object") {
    throw new Error("Missing or invalid ledger entry");
  }

  const event = typeof entry.event === "string" && entry.event.trim().length > 0
    ? entry.event.trim()
    : "NOTARIZE";

  const ledger = readLedger();

  if (!ledger.founders[founderId]) {
    ledger.founders[founderId] = [];
  }

  const safeEntry = { ...entry, event };
  const hash = await hashEntry(safeEntry);
  const hashed = { ...safeEntry, hash };
  ledger.founders[founderId].push(hashed);
  writeLedgerState(ledger);
  return hashed;
}

export function readFounderLedger(founderId) {
  const ledger = readLedger();
  return ledger.founders[founderId] || [];
}
