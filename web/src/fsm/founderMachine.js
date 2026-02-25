export const FounderStates = {
  IDLE: "IDLE",
  BUILDING: "BUILDING",
  THROTTLED: "THROTTLED",
  ESCALATED: "ESCALATED",
};

export function transition(state, event) {
  switch (state) {
    case FounderStates.IDLE:
      if (event === "START_BUILD") return FounderStates.BUILDING;
      break;

    case FounderStates.BUILDING:
      if (event === "THROTTLE") return FounderStates.THROTTLED;
      if (event === "OVERDRIVE") return FounderStates.ESCALATED;
      break;

    case FounderStates.THROTTLED:
      if (event === "RESET") return FounderStates.IDLE;
      break;

    case FounderStates.ESCALATED:
      if (event === "RESET") return FounderStates.IDLE;
      break;
  }

  return state;
}
