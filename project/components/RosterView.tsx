"use client";

const ROSTER = [
  { name: "Seraphina", status: "Active", note: "Strong / Direct" },
  { name: "Mercer", status: "Active", note: "Light / Free" },
  { name: "Vance", status: "Active", note: "Strong / Sustained" },
  { name: "Ariadne", status: "Injury Watch", note: "Knee load cap" },
  { name: "Nova", status: "Active", note: "Rehearsal-ready" },
  { name: "Lumen", status: "Hold", note: "Travel week" },
];

function Badge({ status }: { status: string }) {
  const cls =
    status === "Active"
      ? "bg-emerald-900/40 border-emerald-600 text-emerald-200"
      : status === "Injury Watch"
        ? "bg-amber-900/40 border-amber-600 text-amber-200"
        : "bg-zinc-900/60 border-zinc-700 text-zinc-200";
  return <span className={`text-xs px-2.5 py-1 rounded-full border ${cls}`}>{status}</span>;
}

export default function RosterView() {
  return (
    <div className="space-y-6">
      <h2 className="font-playfair text-4xl font-light">Roster</h2>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-3 text-xs uppercase tracking-widest text-zinc-500 px-5 py-3 border-b border-zinc-800">
          <div>Dancer</div>
          <div>Status</div>
          <div>Note</div>
        </div>
        {ROSTER.map((d, i) => (
          <div key={i} className="grid grid-cols-3 px-5 py-4 border-b border-zinc-900 last:border-b-0">
            <div className="text-zinc-100">{d.name}</div>
            <div>
              <Badge status={d.status} />
            </div>
            <div className="text-zinc-400">{d.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
