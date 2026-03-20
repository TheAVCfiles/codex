import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Lock,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

type Verdict = {
  label: 'VALID' | 'INVALID' | 'UNSTABLE';
  confidence: number;
  reason: string;
  signals: string[];
  score: number;
};

const starterExamples = [
  'They said they want a serious relationship, but they only call after midnight and disappear for days.',
  'The client says they are ready to sign this week, but they still will not define scope, owner, or payment date.',
  'My manager says this is a growth opportunity, but the responsibility increased and the authority did not.',
];

const paidSignals = [
  'Unlimited receipts',
  'Pattern tracking across moments',
  'History, trend shifts, and repeat contradictions',
  'Weekly structure summaries',
];

function analyzeMoment(input: string): Verdict {
  const text = input.toLowerCase();

  const contradictionTerms = ['but', 'however', 'except', 'instead', 'still', 'yet', 'although'];
  const avoidanceTerms = ['disappear', 'ghost', 'delay', 'later', 'someday', 'eventually', 'avoid', 'stall'];
  const powerTerms = ['manager', 'boss', 'authority', 'control', 'permission', 'approval', 'scope'];
  const commitmentTerms = ['sign', 'payment', 'serious', 'commitment', 'exclusive', 'contract', 'timeline'];
  const evidenceTerms = ['showed up', 'paid', 'signed', 'defined', 'consistent', 'clear', 'documented'];

  const countMatches = (terms: string[]) => terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0);

  const contradictionScore = countMatches(contradictionTerms);
  const avoidanceScore = countMatches(avoidanceTerms);
  const powerScore = countMatches(powerTerms);
  const commitmentScore = countMatches(commitmentTerms);
  const evidenceScore = countMatches(evidenceTerms);

  let score = 50;
  score += contradictionScore * 14;
  score += avoidanceScore * 13;
  score += powerScore * 9;
  score += commitmentScore * 8;
  score -= evidenceScore * 12;

  const normalizedScore = Math.max(5, Math.min(98, score));
  const confidence = Math.max(58, Math.min(97, 54 + contradictionScore * 11 + avoidanceScore * 9 + powerScore * 5));

  const signals = [
    contradictionScore > 0 ? 'Behavior conflicts with stated intent.' : 'Intent and behavior need more contrast data.',
    avoidanceScore > 0 ? 'Delay or distance pattern detected.' : 'No strong delay pattern detected.',
    powerScore > 0 ? 'Power imbalance raises enforcement risk.' : 'Power relationship appears less central.',
  ];

  if (normalizedScore >= 76) {
    return {
      label: 'INVALID',
      confidence,
      reason: 'Behavior does not match the promise closely enough to treat this as structurally reliable.',
      signals,
      score: normalizedScore,
    };
  }

  if (normalizedScore >= 55) {
    return {
      label: 'UNSTABLE',
      confidence: Math.max(55, confidence - 6),
      reason: 'Some structure exists, but the moment is carrying contradiction or drift that could reverse the outcome.',
      signals,
      score: normalizedScore,
    };
  }

  return {
    label: 'VALID',
    confidence: Math.max(51, 82 - normalizedScore / 2),
    reason: 'The stated intent and observed behavior appear materially aligned enough to proceed with caution, not fear.',
    signals,
    score: normalizedScore,
  };
}

const App = (): JSX.Element => {
  const [moment, setMoment] = useState(starterExamples[0]);
  const verdict = useMemo(() => analyzeMoment(moment), [moment]);

  const verdictTone = {
    VALID: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
    INVALID: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
    UNSTABLE: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
  }[verdict.label];

  const badgeTone = {
    VALID: 'bg-emerald-400/15 text-emerald-300',
    INVALID: 'bg-rose-400/15 text-rose-300',
    UNSTABLE: 'bg-amber-300/15 text-amber-200',
  }[verdict.label];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-stone-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.12),transparent_24%)] pointer-events-none" />

      <header className="relative border-b border-white/10 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-stone-400">Decision Engine</p>
              <h1 className="text-sm font-medium text-stone-200">Proof before action.</h1>
            </div>
          </div>

          <a
            href="#ledger"
            className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-300 transition hover:border-amber-300/40 hover:text-white"
          >
            Unlock Ledger
          </a>
        </div>
      </header>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 py-10 sm:py-16">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-amber-200">
              <Clock3 className="h-4 w-4" />
              First outcome in under 10 seconds
            </div>

            <div className="space-y-4">
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-stone-50 sm:text-6xl">
                You don&apos;t need advice. You need proof.
              </h2>
              <p className="max-w-2xl text-lg text-stone-300 sm:text-xl">
                Check whether a moment actually holds structure before you act on it. One receipt is free. The pattern is what you pay to keep.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-6">
              <label htmlFor="moment" className="mb-3 block text-sm font-medium text-stone-200">
                Describe what happened…
              </label>
              <textarea
                id="moment"
                value={moment}
                onChange={(event) => setMoment(event.target.value)}
                className="min-h-52 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-base text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-amber-300/40 focus:ring-2 focus:ring-amber-300/20"
                placeholder="They said one thing. Their behavior showed another. What happened?"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                {starterExamples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setMoment(example)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-left text-sm text-stone-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    Load example
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className={`rounded-3xl border p-6 shadow-2xl shadow-black/30 ${verdictTone}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-stone-300/90">Decision receipt</p>
                  <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${badgeTone}`}>
                    {verdict.label}
                  </div>
                </div>
                <ShieldAlert className="h-8 w-8 opacity-80" />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-stone-400">Confidence</div>
                  <div className="mt-2 text-4xl font-semibold text-white">{verdict.confidence}%</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-stone-400">Contradiction load</div>
                  <div className="mt-2 text-4xl font-semibold text-white">{verdict.score}</div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-stone-400">Reason</div>
                <p className="mt-2 text-base leading-7 text-stone-100">{verdict.reason}</p>
              </div>

              <div className="mt-6 space-y-3">
                {verdict.signals.map((signal) => (
                  <div key={signal} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-stone-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="ledger" className="rounded-3xl border border-white/10 bg-stone-50 p-6 text-stone-950 shadow-2xl shadow-black/20">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-stone-500">
                <Lock className="h-4 w-4" />
                Track the pattern, not just the moment
              </div>
              <h3 className="mt-3 text-3xl font-semibold">Unlock the Decision Ledger — $29/month</h3>
              <p className="mt-3 text-base leading-7 text-stone-700">
                Save receipts, watch contradictions repeat, and stop re-deciding the same problem from zero every week.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {paidSignals.map((item) => (
                  <div key={item} className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://buy.stripe.com/test_decision_ledger"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-black"
                >
                  Unlock the Ledger
                  <ArrowRight className="h-4 w-4" />
                </a>
                <div className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 px-6 py-3 text-sm text-stone-600">
                  1 product • 1 upgrade • no extra tiers yet
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-400">Enter through emotion</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Decision Receipt</h3>
            <p className="mt-2 text-sm leading-6 text-stone-300">A free first verdict for relationships, deals, and power dynamics.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-400">Stay for pattern memory</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Decision Ledger</h3>
            <p className="mt-2 text-sm leading-6 text-stone-300">Monthly recurring layer for history, structure drift, and repeat behavior tracking.</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-400">Scale later</p>
            <h3 className="mt-3 flex items-center gap-2 text-xl font-semibold text-white">
              <TrendingUp className="h-5 w-5 text-amber-300" />
              Institutional path
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-300">Keep the high-ticket system behind the curtain until the front-door conversion loop is proven.</p>
          </article>
        </section>
      </main>
    </div>
  );
};

export default App;
