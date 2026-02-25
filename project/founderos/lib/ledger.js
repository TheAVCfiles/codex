import { hashEntry } from "./hash";

const STORAGE_KEY = "founder_os_ledger_v1";

export function loadLedger() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { founders: {} };
}

function saveLedger(ledgerData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ledgerData));
}

export async function writeLedger(founderId, entry) {
  const ledgerData = loadLedger();

  if (!ledgerData.founders[founderId]) ledgerData.founders[founderId] = [];

  const hash = await hashEntry(entry);

  const row = { ...entry, hash };
  ledgerData.founders[founderId].push(row);

  saveLedger(ledgerData);
  console.log("Ledger persisted:", ledgerData);

  return row;
}
