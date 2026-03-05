import type { ReactNode } from "react";

export function SectionShell({ children }: { children: ReactNode }) {
  return <section className="space-y-4 rounded-lg border border-slate-800 p-4">{children}</section>;
}
