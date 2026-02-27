export const FounderJourneyStates = {
  CRISIS: "CRISIS",
  LAB_ACTIVATION: "LAB_ACTIVATION",
  RECEIPTS: "RECEIPTS",
  STAGECRED: "STAGECRED",
  CAPITAL: "CAPITAL",
};

export const founderSteps = [
  {
    state: FounderJourneyStates.CRISIS,
    label: "Crisis Recognition",
    description: "Identify the gap: what breaks without a system?",
    requiredAction: "Document your single largest unresolved risk.",
    ledgerEventType: "FOUNDER_ACK_CRISIS",
  },
  {
    state: FounderJourneyStates.LAB_ACTIVATION,
    label: "Lab Activation",
    description:
      "Read the Governing Principle. Accept alignment of authority and responsibility.",
    requiredAction: "Complete Founder Declaration.",
    ledgerEventType: "FOUNDER_ACK_GOVERNING_PRINCIPLE",
  },
  {
    state: FounderJourneyStates.RECEIPTS,
    label: "Receipts",
    description:
      "Assign Corridors of Authority. Every corridor must have an owner.",
    requiredAction: "Submit Corridors Assignment.",
    ledgerEventType: "CORRIDORS_ASSIGNED",
  },
  {
    state: FounderJourneyStates.STAGECRED,
    label: "StageCred",
    description: "Activate your Weekly Log. This is your proof trail.",
    requiredAction: "Submit your first Weekly Log entry.",
    ledgerEventType: "WEEKLY_LOG_ENTRY",
  },
  {
    state: FounderJourneyStates.CAPITAL,
    label: "Capital",
    description: "Provenance complete. Architecture is defensible.",
    requiredAction: "Complete Provenance Checklist.",
    ledgerEventType: "PROVENANCE_CHECKLIST_COMPLETE",
  },
];

const STORAGE_KEY = "stageport:founderState";

export function nextState(current) {
  const index = founderSteps.findIndex((step) => step.state === current);
  if (index < founderSteps.length - 1) {
    return founderSteps[index + 1].state;
  }

  return current;
}

export function isFinal(state) {
  return state === FounderJourneyStates.CAPITAL;
}

export function getStepIndex(state) {
  const index = founderSteps.findIndex((step) => step.state === state);
  return index >= 0 ? index : founderSteps.length;
}

export function loadFounderState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && founderSteps.some((step) => step.state === stored)) {
      return stored;
    }
  } catch {
    return FounderJourneyStates.CRISIS;
  }

  return FounderJourneyStates.CRISIS;
}

export function saveFounderState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, state);
  } catch {
    // no-op in restricted contexts
  }
}
