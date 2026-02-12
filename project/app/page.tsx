"use client";

import Link from "next/link";
import { ArrowRight, Landmark, Move, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(190,24,93,0.10),transparent_45%)]" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="font-playfair text-6xl md:text-8xl font-light tracking-tight mb-6 leading-none">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400">StagePort</span>
            <span className="block text-zinc-100 mt-2 text-4xl md:text-6xl">StudioOS</span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 font-light">
            The movement operating system. Where rehearsals become credentials and gesture becomes proof.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/portal"
              className="group px-10 py-5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl transition-all shadow-2xl shadow-rose-900/30 hover:shadow-rose-900/50 flex items-center justify-center gap-3 text-lg"
            >
              Enter the Portal
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/ballet-bank"
              className="px-10 py-5 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 rounded-xl transition-all flex items-center justify-center gap-3 text-lg backdrop-blur-sm"
            >
              <Landmark size={20} />
              Ballet Bank
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <Move className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-playfair mb-2">The Floor</h3>
            <p className="text-zinc-400">3D sandbox • keyframes • energy lines • export</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <Landmark className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-2xl font-playfair mb-2">Ballet Bank</h3>
            <p className="text-zinc-400">Accrue BBT • lock windows • receipts</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <Users className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-2xl font-playfair mb-2">Roster & Ledger</h3>
            <p className="text-zinc-400">People index • status • simple runway view</p>
          </div>
        </div>
      </section>
    </div>
  );
}
