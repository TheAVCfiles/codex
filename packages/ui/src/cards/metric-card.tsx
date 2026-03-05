import type { ReactNode } from "react";

export function MetricCard({ title, value }: { title: string; value: ReactNode }) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </article>
  );
}
