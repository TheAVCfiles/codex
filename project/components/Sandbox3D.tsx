"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Download, Send } from "lucide-react";
import PyRouetteStudio from "@/components/PyRouetteStudio";
import { loadState, saveState } from "@/lib/storage";

type Laban = { weight: string; space: string; time: string; flow: string };
type Dancer = { id: number; label: string; x: number; y: number; z: number; color: string; laban?: Laban };

type SandboxState = {
  dancers: Dancer[];
  keyframes: { time: number; dancers: Dancer[] }[];
  bpm: number;
  duration: number;
};

const DEFAULT: SandboxState = {
  dancers: [
    { id: 1, label: "Seraphina", x: 35, y: 40, z: 0, color: "#a1a1aa" },
    { id: 2, label: "Mercer", x: 55, y: 50, z: 8, color: "#991b1b" },
    { id: 3, label: "Vance", x: 70, y: 35, z: 5, color: "#065f46" },
  ],
  keyframes: [],
  bpm: 120,
  duration: 30,
};

export default function Sandbox3D({ onNotify }: { onNotify?: (msg: string) => void }) {
  const [state, setState] = useState<SandboxState>(DEFAULT);
  const [selectedDancerId, setSelectedDancerId] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [t, setT] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const captureElRef = useRef<HTMLElement | null>(null);

  useEffect(() => setState(loadState<SandboxState>(DEFAULT)), []);
  useEffect(() => saveState(state), [state]);

  const dancers = state.dancers;

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = containerRef.current;
    if (!canvas || !stage) return;

    const resize = () => {
      canvas.width = stage.clientWidth;
      canvas.height = stage.clientHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        dancers.forEach((a, i) => {
          dancers.slice(i + 1).forEach((b, j) => {
            const ax = (a.x / 100) * canvas.width;
            const ay = (a.y / 100) * canvas.height;
            const bx = (b.x / 100) * canvas.width;
            const by = (b.y / 100) * canvas.height;

            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);

            const alpha = 0.25 + Math.sin(Date.now() / 260 + i + j) * 0.15;
            ctx.strokeStyle = `rgba(236, 72, 153, ${alpha})`;
            ctx.lineWidth = 1.25 + Math.sin(Date.now() / 500) * 0.6;
            ctx.stroke();
          });
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, dancers]);

  const handlePointerDown = (e: React.PointerEvent, id: number) => {
    e.preventDefault();
    if (isPlaying) return;
    setDraggingId(id);
    setSelectedDancerId(id);

    pointerIdRef.current = e.pointerId;
    captureElRef.current = e.currentTarget as HTMLElement;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerUp = () => {
    if (captureElRef.current && pointerIdRef.current != null) {
      try {
        captureElRef.current.releasePointerCapture(pointerIdRef.current);
      } catch {}
      captureElRef.current = null;
      pointerIdRef.current = null;
    }
    setDraggingId(null);
  };

  const handlePointerMove = (e: PointerEvent | React.PointerEvent) => {
    if (draggingId == null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 40, e.clientX - rect.left));
    const y = Math.max(20, Math.min(rect.height - 40, e.clientY - rect.top));

    setState((prev) => ({
      ...prev,
      dancers: prev.dancers.map((el) => (el.id === draggingId ? { ...el, x: (x / rect.width) * 100, y: (y / rect.height) * 100 } : el)),
    }));
  };

  useEffect(() => {
    const move = (e: PointerEvent) => handlePointerMove(e);
    const up = () => handlePointerUp();

    if (draggingId != null) {
      document.addEventListener("pointermove", move, { passive: false });
      document.addEventListener("pointerup", up);
      document.addEventListener("pointercancel", up);
    }

    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
    };
  }, [draggingId]);

  const snap = () => {
    setState((prev) => ({ ...prev, keyframes: [...prev.keyframes, { time: t, dancers: structuredClone(prev.dancers) }].sort((a, b) => a.time - b.time) }));
    onNotify?.("Snapped keyframe");
  };

  const exportSequence = () => {
    const payload = { duration: state.duration, bpm: state.bpm, keyframes: state.keyframes, dancers: state.dancers };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stageport_sandbox_sequence.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const broadcastToStage = (incoming: Dancer[]) => {
    setState((prev) => ({ ...prev, dancers: incoming.map((d) => ({ ...d, laban: d.laban ?? undefined })) }));
    onNotify?.("Broadcast received → dancers placed on stage");
  };

  useEffect(() => {
    if (!isPlaying) return;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((prev) => {
        const next = prev + dt;
        return next > state.duration ? 0 : next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, state.duration]);

  const selected = useMemo(() => dancers.find((d) => d.id === selectedDancerId) ?? null, [dancers, selectedDancerId]);

  return (
    <div className="space-y-6">
      <div className="h-[520px]">
        <PyRouetteStudio onBroadcastToSandbox={(d) => broadcastToStage(d as unknown as Dancer[])} />
      </div>
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <div className="font-playfair text-2xl">3D Sandbox</div>
            <div className="text-zinc-500 text-sm">Drag dancers. Snap frames. Export sequence.</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsPlaying((p) => !p)} className={`px-4 py-2 rounded-xl border ${isPlaying ? "border-emerald-500 text-emerald-200 bg-emerald-900/20" : "border-zinc-700 text-zinc-200 bg-zinc-900/40"}`}>{isPlaying ? "Playing" : "Play"}</button>
            <button onClick={snap} disabled={isPlaying} className="px-4 py-2 rounded-xl bg-amber-500 text-black font-medium disabled:opacity-50">Snap Frame</button>
            <button onClick={exportSequence} className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 flex items-center gap-2"><Download size={16} />Export</button>
          </div>
        </div>

        <div ref={containerRef} className="relative h-[520px] overflow-hidden touch-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} style={{ backgroundImage: "radial-gradient(circle, rgba(63,63,70,0.65) 1px, transparent 1px)", backgroundSize: "44px 44px" }}>
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
          {dancers.map((d) => (
            <div key={d.id} className="absolute w-16 h-16 rounded-full shadow-2xl shadow-black/60 z-10 cursor-grab active:cursor-grabbing" style={{ left: `${d.x}%`, top: `${d.y}%`, transform: `translate(-50%, -50%) translateZ(${d.z}px) rotateX(14deg)`, background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), ${d.color})`, boxShadow: selectedDancerId === d.id ? "0 0 40px rgba(255,255,255,0.30)" : undefined }} onPointerDown={(e) => handlePointerDown(e, d.id)}>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white tracking-tight">{d.label.slice(0, 3).toUpperCase()}</div>
            </div>
          ))}

          <button onClick={() => onNotify?.("Broadcast: Sandbox → Live Stage (simulated)")} className="absolute bottom-5 left-5 bg-gradient-to-r from-rose-500 to-amber-500 text-black font-bold px-5 py-3 rounded-2xl flex items-center gap-3"><Send size={18} /> Broadcast to Live Stage</button>

          <div className="absolute bottom-5 right-5 text-xs text-zinc-400 bg-black/40 border border-zinc-800 rounded-xl px-3 py-2">t = {t.toFixed(2)}s • frames: {state.keyframes.length}</div>
        </div>

        {selected && (
          <div className="px-5 py-4 border-t border-zinc-800 text-sm text-zinc-400">Selected: <span className="text-zinc-200">{selected.label}</span> • x:{selected.x.toFixed(1)} y:{selected.y.toFixed(1)} z:{selected.z}</div>
        )}
      </div>
    </div>
  );
}
