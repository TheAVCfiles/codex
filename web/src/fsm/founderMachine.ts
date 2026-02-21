export const FounderStates = {
  IDLE: 'IDLE',
  BUILDING: 'BUILDING',
  THROTTLED: 'THROTTLED',
  ESCALATED: 'ESCALATED',
} as const;

export type FounderState = (typeof FounderStates)[keyof typeof FounderStates];

export type FounderEvent = 'START_BUILD' | 'THROTTLE' | 'OVERDRIVE' | 'RESET' | 'ESCALATE';

export function transition(state: FounderState, event: FounderEvent): FounderState {
  switch (state) {
    case FounderStates.IDLE:
      if (event === 'START_BUILD') return FounderStates.BUILDING;
      break;

    case FounderStates.BUILDING:
      if (event === 'THROTTLE') return FounderStates.THROTTLED;
      if (event === 'OVERDRIVE') return FounderStates.ESCALATED;
      break;

    case FounderStates.THROTTLED:
      if (event === 'RESET') return FounderStates.IDLE;
      break;

    case FounderStates.ESCALATED:
      if (event === 'RESET') return FounderStates.IDLE;
      break;
  }

  return state;
}
