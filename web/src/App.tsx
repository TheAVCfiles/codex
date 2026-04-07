import React from 'react';
import {
  Shield,
  FileText,
  Briefcase,
  ChevronRight,
  Lock,
  Terminal,
  Database,
  Activity,
  FileCheck2,
  GitMerge,
  Search,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      <nav className="flex items-center justify-between px-6 py-6 border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-lg uppercase">AVC Systems Studio</span>
          <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">Intuition Labs R+D</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
          <a href="#bundles" className="hover:text-slate-900 transition-colors">Infrastructure</a>
          <a href="#custom" className="hover:text-slate-900 transition-colors">Governance Installs</a>
          <a href="#proof" className="hover:text-slate-900 transition-colors">Proof of Execution</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            System Live
          </div>
          <a href="mailto:avancura@globalavcsystems.com" className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">
            Request Triage
          </a>
        </div>
      </nav>

      <header className="px-6 py-24 md:py-32 max-w-5xl mx-auto">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-widest text-slate-600 uppercase bg-slate-200 rounded-sm">
          StagePort Protocol Active
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-8">
          Governance precedes code. <br />
          <span className="text-slate-400">Structure before scale.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-10">
          A governance system to ensure AI is a sustainable solution—led by a real person and multi-system, multi-corporation founder. We engineer Founder-Safe Systems™ for higher-risk, trust-sensitive environments, installing proof, not just software.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#custom" className="flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">
            Start Systems Triage™ <ChevronRight className="w-4 h-4 ml-2" />
          </a>
          <a href="#bundles" className="flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
            License Self-Serve Infrastructure
          </a>
        </div>
      </header>

      <section className="bg-slate-900 text-white py-24 px-6 border-y border-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Founder failure is a first-order safety risk.</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Informal structures create ethical blind spots. Traditional startup governance optimizes for speed, not safety. We build fixed-state structural clarity to protect founders against three existential threats:
            </p>
            <ul className="space-y-4 mt-8">
              <li className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sm text-white block">Burnout</strong>
                  <span className="text-sm text-slate-400">Leading directly to decision fatigue and judgment collapse.</span>
                </div>
              </li>
              <li className="flex items-start">
                <Lock className="w-5 h-5 text-amber-400 mr-3 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sm text-white block">Political Capture</strong>
                  <span className="text-sm text-slate-400">Investor or institutional override of safety protocols.</span>
                </div>
              </li>
              <li className="flex items-start">
                <Activity className="w-5 h-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sm text-white block">Invisible Labor Extraction</strong>
                  <span className="text-sm text-slate-400">Silent operational fragility due to undocumented responsibilities.</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="border border-slate-700 bg-slate-800/50 p-8 rounded-lg shadow-2xl">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-slate-400 mb-6">The Recoupment Protocol</h3>
            <p className="text-sm text-slate-200 leading-relaxed mb-4">
              Self-service infrastructure removes risk. If you license our operational runtimes and later determine you lack the bandwidth to deploy them safely, the capital is protected.
            </p>
            <div className="bg-slate-900 border border-slate-700 p-4 rounded text-sm text-emerald-400 font-mono">
              100% of your self-serve licensing fees are credited against a custom Phase I Governance Install if triggered within 90 days.
            </div>
          </div>
        </div>
      </section>

      <section id="custom" className="py-24 px-6 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Custom Deployment Ladder</h2>
            <p className="text-slate-600 max-w-2xl">
              Institutional pricing bands for audit-ready governance, risk containment, and investor-legible system deployment. All engagements are fixed-scope. Equity is never required and never substitutes for cash.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-slate-900 p-6 rounded transition-colors bg-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                Required Gate
              </div>
              <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Phase I</div>
              <h3 className="text-xl font-bold mb-2">Systems Triage &amp; Capital Readiness</h3>
              <div className="text-lg font-bold text-slate-900 mb-4">Starting at $2,500</div>
              <p className="text-sm text-slate-600 mb-6">
                30-day fixed-scope sprint. Establishes system boundaries, IP licensing posture, risk containment, and an investor-safe capital proof packet. Ends in a binary deployment recommendation.
              </p>
            </div>

            <div className="border border-slate-200 p-6 rounded hover:border-slate-400 transition-colors bg-slate-50">
              <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">7-Day Sprint</div>
              <h3 className="text-xl font-bold mb-2">Interim CTO Activation Bridge</h3>
              <div className="text-lg font-bold text-slate-900 mb-4">Starting at $3,500</div>
              <p className="text-sm text-slate-600 mb-6">
                Short, bounded execution window for sequencing startup cloud credits, technical infrastructure preparation, and platform deployment readiness prior to full Phase II build.
              </p>
            </div>

            <div className="border border-slate-200 p-6 rounded hover:border-slate-400 transition-colors bg-slate-50">
              <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Phase II</div>
              <h3 className="text-xl font-bold mb-2">Commercial Deployment</h3>
              <div className="text-lg font-bold text-slate-900 mb-4">Starting at $7,500</div>
              <p className="text-sm text-slate-600 mb-6">
                Backend deployment, live infrastructure activation, and transition into recurring license economics. Requires completion of Phase I boundaries and a separate written agreement.
              </p>
            </div>

            <div className="border border-slate-200 p-6 rounded hover:border-slate-400 transition-colors bg-slate-50">
              <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Scale</div>
              <h3 className="text-xl font-bold mb-2">Institutional Licensure</h3>
              <div className="text-lg font-bold text-slate-900 mb-4">Starting at $50,000</div>
              <p className="text-sm text-slate-600 mb-6">
                Multi-project governance coverage. We license our proprietary frameworks, Dual-Protection NDAs, and Custodial Trust structures to accelerators and venture studios.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className="py-24 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Proof of Execution</h2>
            <p className="text-slate-600 max-w-2xl">
              We do not deal in theory. Our structural installs yield highly specific, legally reviewable artifacts designed to survive institutional diligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 p-6 rounded shadow-sm">
              <Search className="w-6 h-6 text-slate-900 mb-4" />
              <h4 className="font-bold mb-2">Founder Readiness Reports</h4>
              <p className="text-sm text-slate-600">
                Binary diagnostics mapping &quot;Responsibility vs. Authority&quot; gaps. We identify shared credential risks, undocumented IP assumptions, and hygiene blockers prior to capitalization.
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded shadow-sm">
              <Shield className="w-6 h-6 text-slate-900 mb-4" />
              <h4 className="font-bold mb-2">Dual-Protection NDAs</h4>
              <p className="text-sm text-slate-600">
                Proprietary legal structures that protect founder business secrets while simultaneously protecting the architectural IP and frameworks of the operator.
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded shadow-sm">
              <FileText className="w-6 h-6 text-slate-900 mb-4" />
              <h4 className="font-bold mb-2">Phase I Closeout Packets</h4>
              <p className="text-sm text-slate-600">
                Clean, defined exit gates. Our installations result in explicit Architectural Ownership Notices, SaaS banking maps, and firm Interim CTO activation boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="bundles" className="py-24 px-6 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Self-Serve Institutional Bundles</h2>
            <p className="text-slate-600 max-w-2xl">
              Complete architectural stacks available for immediate licensing. Designed for teams who need the mechanism to satisfy diligence without hiring custom labor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col border-2 border-slate-200 rounded-lg hover:border-slate-400 transition-colors bg-white shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 p-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">Operational Layer</div>
                  <span className="text-sm font-bold text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-full">Starting at $1,750</span>
                </div>
                <h3 className="text-2xl font-bold">The Studio Blueprint</h3>
                <p className="text-sm text-slate-600 mt-2">The complete suite for establishing IP boundaries, safe funding lanes, and product generation.</p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="text-sm text-slate-700 space-y-4 mb-8">
                  <li className="flex items-start"><GitMerge className="w-4 h-4 text-slate-400 mr-3 mt-0.5" /> <strong>StudioOS Console:</strong> Local-first PWA for PRD generation and product specs.</li>
                  <li className="flex items-start"><FileCheck2 className="w-4 h-4 text-slate-400 mr-3 mt-0.5" /> <strong>365-Day Corporate OS:</strong> Lawful historical cleanup and board ratification templates.</li>
                  <li className="flex items-start"><Briefcase className="w-4 h-4 text-slate-400 mr-3 mt-0.5" /> <strong>Capital Readiness:</strong> Founder stock purchase frameworks, expense policies, and IP assignments.</li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <button className="w-full py-3 text-sm font-bold text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">
                  License Blueprint
                </button>
              </div>
            </div>

            <div className="flex flex-col border-2 border-slate-900 rounded-lg bg-white shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                Highest Leverage
              </div>
              <div className="bg-slate-50 border-b border-slate-200 p-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xs font-bold tracking-widest text-slate-400 uppercase">Technical Layer</div>
                  <span className="text-sm font-bold text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-full">Starting at $3,500</span>
                </div>
                <h3 className="text-2xl font-bold">Trust &amp; Systems Engine</h3>
                <p className="text-sm text-slate-600 mt-2">For AI and memory-based products. Enforce governance, prove safety, and keep an auditable ledger.</p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="text-sm text-slate-700 space-y-4 mb-8">
                  <li className="flex items-start"><Database className="w-4 h-4 text-slate-400 mr-3 mt-0.5" /> <strong>Governed Memory (GMS):</strong> Session-bound audit trails and traversal constraints.</li>
                  <li className="flex items-start"><Terminal className="w-4 h-4 text-slate-400 mr-3 mt-0.5" /> <strong>MythOS Local Foundation:</strong> FastAPI server, provenance ledgers, and alignment metrics (Air-gapped compatible).</li>
                  <li className="flex items-start"><Shield className="w-4 h-4 text-slate-400 mr-3 mt-0.5" /> <strong>Safety Signal Runtimes:</strong> Exportable JSON audit logs and deterministic fallback mechanics.</li>
                </ul>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <button className="w-full py-3 text-sm font-bold text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors">
                  License Engine
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-16 px-6 text-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 pb-12 border-b border-slate-800">
          <div className="md:col-span-2">
            <span className="font-bold text-white uppercase tracking-wider block mb-2">Global AVC Systems, Inc.</span>
            <p className="text-xs max-w-sm leading-relaxed mb-4">
              Operating as AVC Systems Studio / Intuition Labs R+D. A governance system ensuring AI is a sustainable solution—led by a multi-system, multi-corporation founder providing operational frameworks for safety-critical environments.
            </p>
            <div className="flex space-x-4">
              <span className="inline-block px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] uppercase tracking-wider">Delaware C-Corp</span>
              <span className="inline-block px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] uppercase tracking-wider">System Restore Active</span>
            </div>
          </div>

          <div>
            <span className="font-bold text-white block mb-4">Company</span>
            <ul className="space-y-3 text-xs">
              <li><a href="#bundles" className="hover:text-white transition-colors">Infrastructure Bundles</a></li>
              <li><a href="#custom" className="hover:text-white transition-colors">Governance Installs</a></li>
              <li><a href="#proof" className="hover:text-white transition-colors">Proof of Execution</a></li>
              <li><a href="mailto:avancura@globalavcsystems.com" className="hover:text-white transition-colors">Contact Operator</a></li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white block mb-4">Legal &amp; Policies</span>
            <ul className="space-y-3 text-xs">
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#refunds" className="hover:text-white transition-colors">Delivery &amp; Refunds</a></li>
              <li><a href="#compliance" className="hover:text-white transition-colors">Compliance Frameworks</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Global AVC Systems, Inc. All rights reserved. <span className="ml-2 hidden sm:inline">| StagePort Signal: Confirmed</span></p>
          <p className="mt-4 md:mt-0 uppercase tracking-widest font-semibold">Governance Precedes Code.</p>
        </div>
      </footer>
    </div>
  );
}
