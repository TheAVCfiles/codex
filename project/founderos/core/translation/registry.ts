export const INTERNAL_TERMS = {
  RUNOFF: "Runoff",
  LEDGER: "Ledger",
  SAFETY: "Mercy Gate",
  CHAIR: "Director’s Chair",
} as const;

export const EXTERNAL_TERMS = {
  RUNOFF: "Intake Buffer",
  LEDGER: "Audit Ledger",
  SAFETY: "Incident Log",
  CHAIR: "Operator Console",
} as const;

export type TranslationKey = keyof typeof INTERNAL_TERMS;
