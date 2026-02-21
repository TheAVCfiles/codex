import { hashEntry } from './hash';

const STORAGE_KEY = 'founder_os_ledger_v1';

export type LedgerEntryInput = {
  previousState: string;
  event: string;
  newState: string;
  timestamp: number;
  actor?: string;
  org?: string;
};

export type LedgerEntry = LedgerEntryInput & { hash: string };

type LedgerData = {
  founders: Record<string, LedgerEntry[]>;
};

export function loadLedger(): LedgerData {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as LedgerData) : { founders: {} };
}

function saveLedger(ledgerData: LedgerData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ledgerData));
}

export async function writeLedger(founderId: string, entry: LedgerEntryInput): Promise<LedgerEntry> {
  const ledgerData = loadLedger();

  if (!ledgerData.founders[founderId]) ledgerData.founders[founderId] = [];

  const hash = await hashEntry(entry);

  const row = { ...entry, hash };
  ledgerData.founders[founderId].push(row);

  saveLedger(ledgerData);
  console.log('Ledger persisted:', ledgerData);

  return row;
}
