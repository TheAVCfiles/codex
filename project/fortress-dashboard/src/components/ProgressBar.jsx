import React from 'react';

export default function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 bg-slate-800 rounded">
      <div className="h-2 bg-cyan-400 rounded" style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} />
    </div>
  );
}
