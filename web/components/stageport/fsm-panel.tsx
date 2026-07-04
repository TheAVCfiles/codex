import { FsmState, TransitionRecord } from "@/lib/stageport-types";

export function FsmPanel({ currentState, transitions }: { currentState: FsmState; transitions: TransitionRecord[] }) {
  return <div>{currentState} {transitions.length}</div>;
}
