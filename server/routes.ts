import express from "express";
import crypto from "node:crypto";

type LedgerEntry = {
  id: string;
  documentId: string;
  hash: string;
  eventType: string;
  timestamp: number;
};

const router = express.Router();
const ledger: LedgerEntry[] = [];

function notarize(documentId: string, hash: string, eventType = "NOTARIZE"): LedgerEntry {
  const entry: LedgerEntry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    documentId,
    hash,
    eventType,
    timestamp: Date.now(),
  };
  ledger.push(entry);
  return entry;
}

router.post("/api/ledger/notarize", (req, res) => {
  const { documentId, hash, eventType } = req.body ?? {};

  if (!documentId || typeof documentId !== "string") {
    return res.status(400).json({ message: "Missing or invalid 'documentId'" });
  }
  if (!hash || typeof hash !== "string") {
    return res.status(400).json({ message: "Missing or invalid 'hash'" });
  }

  const safeEventType = typeof eventType === "string" && eventType.trim().length > 0 ? eventType.trim() : "NOTARIZE";
  const entry = notarize(documentId, hash, safeEventType);
  return res.status(201).json(entry);
});

router.post("/api/documents/hash", (req, res) => {
  const text = String(req.body?.text ?? "");
  const digest = crypto.createHash("sha256").update(text).digest("hex");
  res.json({ sha256: digest });
});

router.get("/api/ledger/:documentId", (req, res) => {
  res.json(ledger.filter((item) => item.documentId === req.params.documentId));
});

export default router;
