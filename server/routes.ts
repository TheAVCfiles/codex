import crypto from "node:crypto";
import type { Express, Request, Response } from "express";

type LedgerEntry = {
  id: string;
  documentId: string;
  hash: string;
  eventType: string;
  timestamp: string;
};

const ledger: LedgerEntry[] = [];

function notarize(documentId: string, hash: string, eventType = "NOTARIZE"): LedgerEntry {
  const entry: LedgerEntry = {
    id: `${Date.now()}-${ledger.length + 1}`,
    documentId,
    hash,
    eventType,
    timestamp: new Date().toISOString(),
  };

  ledger.push(entry);
  return entry;
}

export function registerRoutes(app: Express): void {
  app.post("/api/ledger/notarize", (req: Request, res: Response) => {
    const { documentId, hash, eventType } = req.body;

    if (!documentId || typeof documentId !== "string") {
      return res.status(400).json({ message: "Missing or invalid 'documentId'" });
    }

    if (!hash || typeof hash !== "string") {
      return res.status(400).json({ message: "Missing or invalid 'hash'" });
    }

    const safeEventType =
      typeof eventType === "string" && eventType.trim().length > 0 ? eventType.trim() : "NOTARIZE";

    const entry = notarize(documentId, hash, safeEventType);
    return res.status(201).json(entry);
  });

  app.get("/api/ledger", (_req: Request, res: Response) => {
    res.json({ entries: ledger });
  });

  app.get("/api/ledger/:documentId", (req: Request, res: Response) => {
    res.json({ entries: ledger.filter((entry) => entry.documentId === req.params.documentId) });
  });

  app.post("/api/documents/hash", (req: Request, res: Response) => {
    const text = String(req.body?.text || "");
    const sha256 = crypto.createHash("sha256").update(text).digest("hex");
    res.json({ sha256 });
  });
}
