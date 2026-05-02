import React from 'react';

export default function StatusBadge({ label, tone = 'slate' }) {
  const tones = {
    green: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300',
    red: 'bg-rose-500/10 border-rose-500/50 text-rose-300',
    amber: 'bg-amber-500/10 border-amber-500/50 text-amber-300',
    slate: 'bg-slate-500/10 border-slate-500/50 text-slate-300',
  };
  return <span className={`px-2 py-1 text-xs rounded border ${tones[tone]}`}>{label}</span>;
}
