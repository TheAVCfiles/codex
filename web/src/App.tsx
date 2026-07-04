import React, { useMemo, useState } from 'react';

type PrimitiveName = 'FIFTH' | 'PASSE' | 'SOUS_SUS' | 'SOUTENU' | 'ECHO';
type ReviewStatus = 'DRAFT' | 'PROMOTED' | 'DISCARDED';
type FsmState = 'GLISSADE' | 'JETE' | 'FERMATA' | 'CODA';

type Primitive = {
  seq: number;
  primitiveName: PrimitiveName;
  params?: Record<string, string | number | boolean>;
  confidence: number;
  baseValue: number;
  dd: number;
  goeStep: number;
  netGoe: number;
  reviewStatus: ReviewStatus;
};

type Session = {
  sessionId: string;
  authorId: string;
  tenantId: string;
  sourceType: 'video' | 'manual' | 'hybrid';
  createdAt: string;
  status: 'INITIALIZED' | 'PROCESSING' | 'REVIEW_READY' | 'FINALIZED';
  currentState: FsmState;
};

const RULES: Record<
  PrimitiveName,
  { baseValue: number; dd: number; goeStep: number; validFrom: FsmState[]; next: FsmState }
> = {
  FIFTH: { baseValue: 1.0, dd: 1.0, goeStep: 0.1, validFrom: ['FERMATA', 'JETE'], next: 'CODA' },
  PASSE: { baseValue: 1.2, dd: 1.05, goeStep: 0.12, validFrom: ['GLISSADE'], next: 'JETE' },
  SOUS_SUS: { baseValue: 1.1, dd: 1.0, goeStep: 0.1, validFrom: ['JETE'], next: 'FERMATA' },
  SOUTENU: { baseValue: 1.4, dd: 1.1, goeStep: 0.15, validFrom: ['GLISSADE', 'JETE'], next: 'JETE' },
  ECHO: { baseValue: 0.8, dd: 1.0, goeStep: 0.08, validFrom: ['JETE', 'FERMATA'], next: 'FERMATA' },
};

const tabs = ['Dashboard', 'Sessions', 'Primitive Stream', 'FSM', 'Scoring', 'Review', 'Receipts', 'Archive'] as const;

const seedSession: Session = {
  sessionId: 'SES_MMEO7CG9_950K',
  authorId: 'AUTH_13900',
  tenantId: 'TENANT_STAGEPORT',
  sourceType: 'hybrid',
  createdAt: new Date().toISOString(),
  status: 'REVIEW_READY',
  currentState: 'FERMATA',
};

const seedPrimitives: Primitive[] = [
  { seq: 1, primitiveName: 'PASSE', params: { side: 'L' }, confidence: 0.94, baseValue: 1.2, dd: 1.05, goeStep: 0.12, netGoe: 1, reviewStatus: 'PROMOTED' },
  { seq: 2, primitiveName: 'SOUTENU', params: { angle: 180 }, confidence: 0.91, baseValue: 1.4, dd: 1.1, goeStep: 0.15, netGoe: 1, reviewStatus: 'PROMOTED' },
  { seq: 3, primitiveName: 'SOUS_SUS', confidence: 0.89, baseValue: 1.1, dd: 1.0, goeStep: 0.1, netGoe: 0, reviewStatus: 'DRAFT' },
  { seq: 4, primitiveName: 'FIFTH', confidence: 0.96, baseValue: 1.0, dd: 1.0, goeStep: 0.1, netGoe: 0, reviewStatus: 'DRAFT' },
];

export default function App(): JSX.Element {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Dashboard');
  const [session, setSession] = useState<Session>(seedSession);
  const [primitives, setPrimitives] = useState<Primitive[]>(seedPrimitives);
  const [log, setLog] = useState<string[]>(['Session loaded', 'Draft primitive stream available', 'Reviewer validation pending']);
  const [receiptHash, setReceiptHash] = useState('');

  const transitions = useMemo(() => {
    let current: FsmState = 'GLISSADE';
    const out: Array<{ seq: number; from: FsmState; to: FsmState; reason: string }> = [];
    for (const p of primitives) {
      const rule = RULES[p.primitiveName];
      if (rule.validFrom.includes(current) && p.reviewStatus !== 'DISCARDED') {
        out.push({ seq: p.seq, from: current, to: rule.next, reason: p.primitiveName });
        current = rule.next;
      }
    }
    return out;
  }, [primitives]);

  const derivedState = transitions.length ? transitions[transitions.length - 1].to : 'GLISSADE';
  const score = useMemo(() => {
    const pcs = 46.64;
    let tes = 0;
    let goe = 0;
    primitives.forEach((p) => {
      if (p.reviewStatus !== 'DISCARDED') {
        tes += p.baseValue * p.dd;
        goe += p.goeStep * p.netGoe;
      }
    });
    return { tes: +tes.toFixed(3), goe: +goe.toFixed(3), pcs, total: +(tes + goe + pcs).toFixed(3) };
  }, [primitives]);

  const updatePrimitive = (seq: number, patch: Partial<Primitive>) => setPrimitives((prev) => prev.map((p) => (p.seq === seq ? { ...p, ...patch } : p)));
  const appendLog = (entry: string) => setLog((prev) => [`${new Date().toISOString()} — ${entry}`, ...prev].slice(0, 40));

  const finalizeReceipt = async () => {
    const payload = JSON.stringify({ session, primitives, transitions, score });
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload));
    const hash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
    setReceiptHash(hash);
    setSession((prev) => ({ ...prev, status: 'FINALIZED', currentState: derivedState }));
    appendLog('Receipt finalized');
  };

  return <div style={{ padding: 20, color: '#fff', background: '#050505', minHeight: '100vh' }}>
    <h1>STAGEPORT REVIEW CONSOLE</h1>
    <p>Session → Primitive Stream → FSM → Score → Review → Receipt</p>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{tabs.map((t) => <button key={t} onClick={() => setTab(t)}>{t}</button>)}</div>
    {tab === 'Dashboard' && <pre>{JSON.stringify({ session: session.sessionId, state: derivedState, score, receipt: receiptHash ? 'Finalized' : 'Pending' }, null, 2)}</pre>}
    {tab === 'Sessions' && <pre>{JSON.stringify(session, null, 2)}</pre>}
    {tab === 'Primitive Stream' && <pre>{JSON.stringify(primitives, null, 2)}</pre>}
    {tab === 'FSM' && <pre>{JSON.stringify(transitions, null, 2)}</pre>}
    {tab === 'Scoring' && <pre>{JSON.stringify(score, null, 2)}</pre>}
    {tab === 'Review' && <div>{primitives.map((p) => <div key={p.seq}><b>#{p.seq} {p.primitiveName}</b>
      <button onClick={() => { updatePrimitive(p.seq, { reviewStatus: 'PROMOTED', netGoe: 1 }); appendLog(`Primitive ${p.seq} promoted`); }}>Promote</button>
      <button onClick={() => { updatePrimitive(p.seq, { reviewStatus: 'DISCARDED', netGoe: 0 }); appendLog(`Primitive ${p.seq} discarded`); }}>Discard</button>
    </div>)}</div>}
    {tab === 'Receipts' && <div><button onClick={finalizeReceipt}>Finalize Receipt</button><pre>{receiptHash}</pre></div>}
    {tab === 'Archive' && <pre>{JSON.stringify(log, null, 2)}</pre>}
  </div>;
}
