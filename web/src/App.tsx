import React from 'react';
import {
  Activity,
  Binary,
  CheckCircle2,
  Database,
  Gauge,
  Hash,
  Network,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const pipelineSteps = [
  {
    title: 'Capture',
    description: 'Movement enters as video, sensor streams, or routine specs.',
    bullets: ['Pose tracking telemetry', 'Motion sensors', 'Routine JSON / .rou input'],
    icon: Activity,
  },
  {
    title: 'Compile',
    description: 'ChoreoCode parses movement into symbolic primitives.',
    bullets: ['FIFTH()', 'PASSE(side)', 'SOUTENU(angle)'],
    icon: Binary,
  },
  {
    title: 'Score',
    description: 'PyRouette evaluates technical and artistic performance.',
    bullets: ['TES / PCS / GOE', 'Transparent ontology', 'Deterministic outputs'],
    icon: Gauge,
  },
  {
    title: 'Verify',
    description: 'Governance checks transitions and provenance integrity.',
    bullets: ['FSM transition validation', 'Author + timestamp', 'Hash generation'],
    icon: ShieldCheck,
  },
  {
    title: 'Mint',
    description: 'A performance receipt is archived as a permanent record.',
    bullets: ['Ledger entry created', 'Archive searchable', 'Audit-ready output'],
    icon: Database,
  },
];

const demoEvents = [
  'GLISSADE detected',
  'JETÉ detected',
  'FERMATA detected',
  'TES: 14.500  PCS: 51.001  TOTAL: 73.873',
  'HASH GENERATED: 0x94f3ab…',
  'LEDGER ENTRY CREATED',
];

const App = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded bg-emerald-400/20 p-2">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Global AVC Systems</p>
              <h1 className="text-sm sm:text-base font-semibold">Measurement & Provenance Infrastructure</h1>
            </div>
          </div>
          <a
            href="#demo"
            className="text-xs uppercase tracking-wider rounded border border-emerald-400/40 px-3 py-2 text-emerald-300 hover:bg-emerald-400/10"
          >
            Run Demo Routine
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        <section className="space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">The Instrument</p>
          <h2 className="text-3xl sm:text-5xl font-semibold leading-tight">Measure Human Movement Like Data</h2>
          <p className="max-w-3xl text-slate-300 text-lg">
            Global AVC Systems converts choreography and physical performance into measurable signals, transparent scores,
            and verifiable digital records.
          </p>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Movement → Analysis → Score → Provenance</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {pipelineSteps.map(({ title, description, bullets, icon: Icon }) => (
            <article key={title} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <Icon className="w-5 h-5 text-emerald-300" />
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-slate-300">{description}</p>
              <ul className="text-xs text-slate-400 space-y-1">
                {bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section id="demo" className="grid lg:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live Console Preview</p>
            <h3 className="text-2xl font-semibold">90-Second System Loop</h3>
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs space-y-2">
              <p className="text-slate-500">SESSION: SES_MMEO7CG9_950K</p>
              {demoEvents.map((event) => (
                <p key={event} className="text-emerald-300">&gt; {event}</p>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Core Diagram</p>
            <h3 className="text-2xl font-semibold">Movement → Measurement → Evaluation → Verification → Record</h3>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><Network className="w-4 h-4 mt-0.5 text-emerald-300" /> Signal Capture Layer</li>
              <li className="flex items-start gap-2"><Binary className="w-4 h-4 mt-0.5 text-emerald-300" /> Kinematic Normalization + ChoreoCode Compiler</li>
              <li className="flex items-start gap-2"><Gauge className="w-4 h-4 mt-0.5 text-emerald-300" /> PyRouette Scoring (TES / PCS / GOE)</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-300" /> Governance Validation (FSM transitions)</li>
              <li className="flex items-start gap-2"><Hash className="w-4 h-4 mt-0.5 text-emerald-300" /> Cryptographic Hash + Ledger Archive</li>
            </ol>
          </article>
        </section>

        <section className="rounded-2xl border border-amber-300/30 bg-amber-300/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Institutional Offer</p>
          <h3 className="text-2xl font-semibold mt-1">Licensed Technical Architecture Documentation — $7,500</h3>
          <p className="mt-3 text-slate-300 max-w-4xl">
            Includes architecture report, governance framework, scoring ontology overview, and institutional evaluation license.
            Source code, proprietary algorithms, and production models are explicitly excluded.
          </p>
        </section>
      </main>
    </div>
  );
};

export default App;
