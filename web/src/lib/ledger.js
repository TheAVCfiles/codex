import ledgerData from "../data/ledger.json";
import { hashEntry } from "./hash";

export async function writeLedger(founderId, entry) {
  if (!ledgerData.founders[founderId]) {
    ledgerData.founders[founderId] = [];
  }

  const hash = await hashEntry(entry);

  ledgerData.founders[founderId].push({
    ...entry,
    hash,
  });

  console.log("Ledger updated:", ledgerData);
}
