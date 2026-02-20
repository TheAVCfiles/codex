export const FounderStates = {
  IDLE: "IDLE",
  BUILDING: "BUILDING",
  PRESSURED: "PRESSURED",
  OVERSPEED: "OVERSPEED",
  THROTTLED: "THROTTLED",
  ESCALATED: "ESCALATED",
  RECOVERING: "RECOVERING",
};

export function transition(state, event) {
  switch (state) {
    case FounderStates.IDLE:
      if (event === "START_BUILD") return FounderStates.BUILDING;
      break;

    case FounderStates.BUILDING:
      if (event === "PRESSURE_SPIKE") return FounderStates.PRESSURED;
      if (event === "OVERDRIVE") return FounderStates.OVERSPEED;
      if (event === "RESET") return FounderStates.IDLE;
      break;

    case FounderStates.PRESSURED:
      if (event === "THROTTLE") return FounderStates.THROTTLED;
      if (event === "RESET") return FounderStates.IDLE;
      break;

    case FounderStates.OVERSPEED:
      if (event === "AUTO_THROTTLE") return FounderStates.THROTTLED;
      if (event === "RESET") return FounderStates.IDLE;
      break;

    case FounderStates.THROTTLED:
      if (event === "ESCALATE") return FounderStates.ESCALATED;
      if (event === "STABILIZE") return FounderStates.RECOVERING;
      if (event === "RESET") return FounderStates.IDLE;
      break;

    case FounderStates.ESCALATED:
      if (event === "STABILIZE") return FounderStates.RECOVERING;
      if (event === "RESET") return FounderStates.IDLE;
      break;

    case FounderStates.RECOVERING:
      if (event === "RESET") return FounderStates.IDLE;
      if (event === "START_BUILD") return FounderStates.BUILDING;
      break;

    default:
      return state;
  }

  return state;
}
