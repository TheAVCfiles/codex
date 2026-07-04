"use client";

import { useEffect, useState } from "react";
import { exportSessionBundle, fetchSession, finalizeSessionReceipt, reviewSessionPrimitive } from "@/lib/stageport-api";
import { PrimitiveName, SessionDetailResponse } from "@/lib/stageport-types";
import { ArchivePanel } from "@/components/stageport/archive-panel";
import { FsmPanel } from "@/components/stageport/fsm-panel";
import { PrimitiveStream } from "@/components/stageport/primitive-stream";
import { ReceiptPanel } from "@/components/stageport/receipt-panel";
import { ScorePanel } from "@/components/stageport/score-panel";
import { SessionHeader } from "@/components/stageport/session-header";

const tabs = ["Sessions", "Primitive Stream", "FSM", "Scoring", "Review", "Receipts", "Archive"] as const;

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Sessions");
  const [sessionId, setSessionId] = useState<string>("");
  const [data, setData] = useState<SessionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { params.then(({ id }) => setSessionId(id)); }, [params]);
  useEffect(() => { if (!sessionId) return; setLoading(true); fetchSession(sessionId).then(setData).finally(() => setLoading(false)); }, [sessionId]);

  async function promote(seq: number) { if (!sessionId) return; setData(await reviewSessionPrimitive(sessionId, { seq, action: "PROMOTE" })); }
  async function discard(seq: number) { if (!sessionId) return; setData(await reviewSessionPrimitive(sessionId, { seq, action: "DISCARD" })); }
  async function override(seq: number, primitive: PrimitiveName) { if (!sessionId) return; setData(await reviewSessionPrimitive(sessionId, { seq, action: "PROMOTE", override: primitive })); }
  async function finalize() { if (!sessionId) return; setData(await finalizeSessionReceipt(sessionId)); }
  async function exportBundle() { if (!sessionId) return; await exportSessionBundle(sessionId); }

  if (loading || !data) return <main>Loading session...</main>;
  return <main><SessionHeader session={data.session} />{tabs.map((t) => <button key={t} onClick={() => setTab(t)}>{t}</button>)}{(tab === "Primitive Stream" || tab === "Review") && <PrimitiveStream primitives={data.primitives} onPromote={promote} onDiscard={discard} onOverride={override} />}{tab === "FSM" && <FsmPanel currentState={data.session.currentState} transitions={data.transitions} />}{tab === "Scoring" && <ScorePanel score={data.score} />}{tab === "Receipts" && <ReceiptPanel receipt={data.receipt} onFinalize={finalize} onExport={exportBundle} />}{tab === "Archive" && <ArchivePanel archive={data.archive} />}</main>;
}
