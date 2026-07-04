"use client";

export default function CompanyView() {
  return (
    <div className="space-y-6">
      <h2 className="font-playfair text-4xl font-light">Ledger</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-zinc-500">Monthly Burn</div>
          <div className="text-3xl mt-2">$3,240</div>
          <div className="text-zinc-500 mt-1 text-sm">mock value</div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-zinc-500">Cash On Hand</div>
          <div className="text-3xl mt-2">$9,800</div>
          <div className="text-zinc-500 mt-1 text-sm">mock value</div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-zinc-500">Risk</div>
          <div className="text-3xl mt-2 text-amber-300">Medium</div>
          <div className="text-zinc-500 mt-1 text-sm">tighten scope</div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <div className="text-zinc-400">
          When you connect the backend, this is where <span className="text-zinc-200">/ledger</span> renders.
        </div>
      </div>
    </div>
  );
}
