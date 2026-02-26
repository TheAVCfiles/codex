import type { Express, Request, Response } from "express";

type NotarizeFn = (documentId: string, hash: string, eventType: string) => unknown;

export function registerLedgerRoutes(app: Express, notarize: NotarizeFn) {
  app.post("/api/ledger/notarize", (req: Request, res: Response) => {
    const { documentId, hash, eventType } = req.body;

    if (!documentId || typeof documentId !== "string") {
      return res.status(400).json({ message: "Missing or invalid 'documentId'" });
    }

    if (!hash || typeof hash !== "string") {
      return res.status(400).json({ message: "Missing or invalid 'hash'" });
    }

    const entry = notarize(documentId, hash, eventType ?? "NOTARIZE");
    return res.status(201).json(entry);
  });
}
