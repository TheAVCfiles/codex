import React from 'react';

export default function LedgerTable({ rows }) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="text-slate-400">
        <tr><th>Time</th><th>Event</th><th>Hash</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.hash} className="border-t border-slate-800">
            <td>{r.time}</td><td>{r.event}</td><td className="font-mono text-xs">{r.hash}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
