export type FounderState = "CRISIS" | "LAB_ACTIVATION" | "RECEIPTS" | "STAGECRED" | "CAPITAL";

export const founderSteps: Array<{
  state: FounderState;
  label: string;
  description: string;
  requiredAction: string;
  ledgerEventType: string;
}> = [
  {
    state: "CRISIS",
    label: "Crisis Recognition",
    description: "Identify the gap: what breaks without a system?",
    requiredAction: "Document your single largest unresolved risk.",
    ledgerEventType: "FOUNDER_ACK_CRISIS",
  },
  {
    state: "LAB_ACTIVATION",
    label: "Lab Activation",
    description: "Read the Governing Principle. Accept alignment of authority and responsibility.",
    requiredAction: "Complete Founder Declaration.",
    ledgerEventType: "FOUNDER_ACK_GOVERNING_PRINCIPLE",
  },
  {
    state: "RECEIPTS",
    label: "Receipts",
    description: "Assign Corridors of Authority. Every corridor must have an owner.",
    requiredAction: "Submit Corridors Assignment.",
    ledgerEventType: "CORRIDORS_ASSIGNED",
  },
  {
    state: "STAGECRED",
    label: "StageCred",
    description: "Activate your Weekly Log. This is your proof trail.",
    requiredAction: "Submit your first Weekly Log entry.",
    ledgerEventType: "WEEKLY_LOG_ENTRY",
  },
  {
    state: "CAPITAL",
    label: "Capital",
    description: "Provenance complete. Architecture is defensible.",
    requiredAction: "Complete Provenance Checklist.",
    ledgerEventType: "PROVENANCE_CHECKLIST_COMPLETE",
  },
];

export function getStepIndex(state: FounderState): number {
  return founderSteps.findIndex((s) => s.state === state);
}

export function nextState(current: FounderState): FounderState {
  const idx = getStepIndex(current);
  if (idx >= 0 && idx < founderSteps.length - 1) return founderSteps[idx + 1].state;
  return current;
}

export function isFinal(state: FounderState): boolean {
  return state === "CAPITAL";
}

const STORAGE_KEY = "stageport:founderState";

export function loadFounderState(): FounderState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && founderSteps.some((s) => s.state === stored)) return stored as FounderState;
} catch (error) { console.error("Failed to load founder state from localStorage:", error); }
  return "CRISIS";
}

export function saveFounderState(state: FounderState): void {
  try {
    localStorage.setItem(STORAGE_KEY, state);
  } catch {}
}
