import { Primitive, PrimitiveName } from "@/lib/stageport-types";

export function PrimitiveStream({ primitives, onPromote, onDiscard, onOverride }: { primitives: Primitive[]; onPromote: (seq: number) => void; onDiscard: (seq: number) => void; onOverride: (seq: number, primitive: PrimitiveName) => void; }) {
  return <div>{primitives.map((p) => <div key={p.seq}><button onClick={() => onPromote(p.seq)}>Promote</button><button onClick={() => onDiscard(p.seq)}>Discard</button><button onClick={() => onOverride(p.seq, "FIFTH")}>Override</button></div>)}</div>;
}
