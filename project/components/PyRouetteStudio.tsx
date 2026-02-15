"use client";

import React, { useMemo, useRef, useState } from "react";
import { Play, Download, Send, Sparkles, Code2 } from "lucide-react";

const INITIAL_SCRIPT = `# PyRouette Studio Script v2.0
dancers = ["Seraphina", "Mercer", "Vance"]

set_formation(dancers, "V_shape")
execute("Seraphina", "pirouette_double")
group_glissade(dancers, direction="right", count=8)
execute("Vance", "arabesque_hold", duration=12)
set_formation(dancers, "circle")
execute("Mercer", "grand_jete")
`;

type ParsedDancer = { id: number; label: string; x: number; y: number; z: number; color: string };

export default function PyRouetteStudio({ onBroadcastToSandbox }: { onBroadcastToSandbox?: (dancers: ParsedDancer[]) => void }) {
  const [script, setScript] = useState(INITIAL_SCRIPT);
  const [output, setOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [parsed, setParsed] = useState<ParsedDancer[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stats = useMemo(() => {
    const dancerMatch = script.match(/dancers\s*=\s*\[(.*?)\]/s);
    const dancerNames = dancerMatch ? dancerMatch[1].split(",").map((n) => n.trim().replace(/["']/g, "")).filter(Boolean) : ["Seraphina", "Mercer", "Vance"];
    const moveMatches = (script.match(/execute\([^)]+\)/g) || []).length;
    const groupMatches = (script.match(/group_/g) || []).length;
    const totalMoves = moveMatches + groupMatches;
    return { dancers: dancerNames.length, moves: totalMoves, beats: totalMoves * 8, seconds: Math.round(totalMoves * 8 * 0.6), dancerNames };
  }, [script]);

  const executeScript = () => {
    setIsExecuting(true);
    setOutput(["Compiling..."]);

    setTimeout(() => {
      const dancerNames = stats.dancerNames;
      const colors = ["#a1a1aa", "#991b1b", "#065f46", "#7c3aed", "#0ea5e9", "#f59e0b"];
      const mapped: ParsedDancer[] = dancerNames.map((name, i) => ({ id: i + 1, label: name, x: 30 + i * 20, y: 45 + (i % 2) * 18, z: (i % 3) * 6, color: colors[i % colors.length] }));
      setParsed(mapped);
      setOutput([
        `✓ Parsed ${dancerNames.length} dancers`,
        `✓ ${stats.moves} movement phrases compiled`,
        `✓ Total duration: ${stats.seconds}s (${stats.beats} beats)`,
        `→ Ready for Sandbox broadcast`,
      ]);
      setIsExecuting(false);
    }, 420);
  };

  const exportLaban = () => {
    const laban = [
      "PYROUETTE → LABANOTATION EXPORT",
      "=================================",
      `Dancers: ${stats.dancers}`,
      `Total Beats: ${stats.beats}`,
      `Duration: ${stats.seconds}s`,
      "",
      script,
      "",
      "Laban Symbols:",
      "   ○ Strong Weight",
      "   ↝ Indirect Space",
      "   ▶ Sudden Time",
      "   ∞ Free Flow",
    ].join("\n");

    const blob = new Blob([laban], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pyrouette_laban_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const json = JSON.stringify({ script, stats, dancers: parsed }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pyrouette_choreography.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const broadcast = () => {
    if (!parsed.length) {
      setOutput((prev) => ["⚠ Execute first (to parse dancers).", ...prev]);
      return;
    }
    onBroadcastToSandbox?.(parsed);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="border-b border-zinc-800 p-4 flex items-center justify-between bg-black/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-amber-400 rounded-xl flex items-center justify-center">
            <Code2 className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="font-playfair text-2xl text-white">PyRouette</h2>
            <p className="text-[10px] uppercase tracking-[2px] text-emerald-400 font-mono">Movement as Code</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={executeScript} disabled={isExecuting} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-black font-medium px-6 py-2.5 rounded-xl transition-all active:scale-95">
            <Play size={18} />
            {isExecuting ? "Executing..." : "Execute"}
          </button>

          <button onClick={broadcast} className="flex items-center gap-2 border border-amber-500/50 hover:border-amber-400 text-amber-300 px-5 py-2.5 rounded-xl transition-all text-sm">
            <Send size={18} />
            Broadcast
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col border-r border-zinc-800 min-w-0">
          <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <Sparkles size={14} className="text-amber-400" />
            script.pyrouette
          </div>

          <textarea ref={textareaRef} value={script} onChange={(e) => setScript(e.target.value)} className="flex-1 bg-transparent p-6 font-mono text-sm text-emerald-300 resize-none focus:outline-none leading-relaxed" spellCheck={false} />
        </div>

        <div className="w-96 max-w-[45vw] bg-zinc-950 flex flex-col">
          <div className="grid grid-cols-4 border-b border-zinc-800">
            <Stat label="Dancers" value={`${stats.dancers}`} />
            <Stat label="Moves" value={`${stats.moves}`} />
            <Stat label="Beats" value={`${stats.beats}`} />
            <Stat label="Duration" value={`${stats.seconds}s`} />
          </div>

          <div className="flex-1 p-6 overflow-auto font-mono text-xs text-zinc-400 bg-black/40">
            {output.length === 0 ? <div className="text-zinc-600 italic">Press Execute to compile choreography</div> : output.map((line, i) => <div key={i} className="mb-1">{line}</div>)}
          </div>

          <div className="border-t border-zinc-800 p-4 flex gap-3 bg-zinc-950">
            <button onClick={exportLaban} className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl py-3 text-xs uppercase tracking-widest transition-colors">
              <Download size={16} />
              Laban
            </button>

            <button onClick={exportJSON} className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-black rounded-xl py-3 text-xs uppercase tracking-widest font-medium transition-colors">
              Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 border-r border-zinc-800 last:border-r-0 text-center">
      <div className="text-2xl font-light text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</div>
    </div>
  );
}
