export type PrimitiveName = "FIFTH" | "PASSE" | "SOUS_SUS" | "SOUTENU" | "ECHO";

export type ReviewAction = "PROMOTE" | "DISCARD";

export type ReviewStatus = "DRAFT" | "PROMOTED" | "DISCARDED";

export type FsmState = "GLISSADE" | "JETE" | "FERMATA" | "CODA";

export interface Session {
  sessionId: string;
  sourceType: "video" | "manual" | "hybrid";
  status: string;
  authorId: string;
  currentState: FsmState;
}

export interface Primitive {
  seq: number;
  primitiveName: PrimitiveName;
  confidence: number;
  reviewStatus: ReviewStatus;
  params?: Record<string, unknown>;
}

export interface TransitionRecord {
  seq: number;
  from: FsmState;
  to: FsmState;
  reason: string;
}

export interface Score {
  tes: number;
  goe: number;
  pcs: number;
  total: number;
  rulesetVersion?: string;
}

export interface Receipt {
  receiptId: string;
  hash: string;
  finalizedAt: string;
}

export interface ArchiveEvent {
  type: string;
  ts: string;
  detail: string;
}

export interface SessionDetailResponse {
  session: Session;
  primitives: Primitive[];
  transitions: TransitionRecord[];
  score: Score;
  receipt?: Receipt | null;
  archive: ArchiveEvent[];
}
