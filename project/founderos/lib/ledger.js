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
  const ledger = readLedger();

  if (!ledger.founders[founderId]) {
    ledger.founders[founderId] = [];
  }

  const hash = await hashEntry(entry);
  const hashed = { ...entry, hash };
  ledger.founders[founderId].push(hashed);
  writeLedgerState(ledger);
  return hashed;
}

export function readFounderLedger(founderId) {
  const ledger = readLedger();
  return ledger.founders[founderId] || [];
}
