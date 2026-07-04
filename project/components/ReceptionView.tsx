"use client";

import { Layout } from "lucide-react";

export default function ReceptionView({ setView }: { setView: (v: string) => void }) {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-5xl font-light">The Portal</h1>
        <p className="text-zinc-500 mt-2">Good morning, Director. {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <p className="text-xs uppercase tracking-widest text-rose-400">Runway</p>
          <p className="text-4xl font-light mt-2">42 days</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <p className="text-xs uppercase tracking-widest text-amber-400">Ballet Bank</p>
          <p className="text-4xl font-light mt-2">2,847 BBT</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
          <p className="text-xs uppercase tracking-widest text-emerald-400">Active Dancers</p>
          <p className="text-4xl font-light mt-2">6</p>
        </div>

        <button className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl text-left hover:border-zinc-600 transition" onClick={() => setView("sandbox")}>
          <Layout className="w-8 h-8 text-zinc-400 mb-4" />
          <p className="font-medium">Open PyRouette Studio</p>
          <p className="text-zinc-500 text-sm mt-1">Script → Broadcast → Stage</p>
        </button>
      </div>
    </div>
  );
}
