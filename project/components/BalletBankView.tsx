"use client";

import { useEffect, useMemo, useState } from "react";
import { Landmark, Plus, Download } from "lucide-react";
import { loadState, saveState } from "@/lib/storage";

type BankState = {
  balance: number;
  sweepRate: number;
  receipts: { at: string; amount: number; note: string }[];
};

const DEFAULT_STATE: BankState = {
  balance: 2847,
  sweepRate: 5,
  receipts: [],
};

export default function BalletBankView({ onNotify }: { onNotify?: (msg: string) => void }) {
  const [state, setState] = useState<BankState>(DEFAULT_STATE);

  useEffect(() => {
    setState(loadState<BankState>(DEFAULT_STATE));
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const accrualAmount = useMemo(() => Math.max(1, Math.round(state.balance * (state.sweepRate / 100))), [state]);

  const runAccrualLocal = () => {
    const receipt = {
      at: new Date().toISOString(),
      amount: accrualAmount,
      note: `Tuition sweep ${state.sweepRate}%`,
    };
    setState((prev) => ({
      ...prev,
      balance: prev.balance + accrualAmount,
      receipts: [receipt, ...prev.receipts].slice(0, 20),
    }));
    onNotify?.(`Accrued +${accrualAmount} BBT`);
  };

  const exportReceipts = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ballet_bank_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
          <Landmark className="text-amber-400" />
        </div>
        <div>
          <h2 className="font-playfair text-4xl font-light">Ballet Bank</h2>
          <p className="text-zinc-500">Sovereign creative capital, tracked.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-zinc-500">Balance</div>
          <div className="text-4xl mt-2 text-amber-200">{state.balance.toLocaleString()} BBT</div>
          <div className="text-zinc-500 mt-1 text-sm">local prototype ledger</div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-zinc-500">Sweep Rate</div>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={20}
              value={state.sweepRate}
              onChange={(e) => setState((prev) => ({ ...prev, sweepRate: Number(e.target.value) }))}
              className="flex-1 accent-emerald-500"
            />
            <div className="w-14 text-right text-zinc-200">{state.sweepRate}%</div>
          </div>
          <div className="text-zinc-500 mt-2 text-sm">next accrual: +{accrualAmount} BBT</div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-3">
          <button
            onClick={runAccrualLocal}
            className="bg-gradient-to-r from-rose-500 to-amber-500 text-black px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Run Accrual Now
          </button>

          <button
            onClick={exportReceipts}
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl px-6 py-3 text-sm flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Export Bank JSON
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-800 text-xs uppercase tracking-widest text-zinc-500">Recent Receipts</div>
        {state.receipts.length === 0 ? (
          <div className="p-6 text-zinc-500">No receipts yet. Run an accrual.</div>
        ) : (
          state.receipts.map((r, i) => (
            <div key={i} className="px-5 py-4 border-b border-zinc-900 last:border-b-0 flex justify-between gap-4">
              <div>
                <div className="text-zinc-200">+{r.amount} BBT</div>
                <div className="text-zinc-500 text-sm">{r.note}</div>
              </div>
              <div className="text-zinc-500 text-sm">{new Date(r.at).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
