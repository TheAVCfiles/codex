import { Score } from "@/lib/stageport-types";

export function ScorePanel({ score }: { score: Score }) { return <div>{score.total}</div>; }
