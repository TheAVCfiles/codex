import React from 'react';

export default function SimulationControls({ onRiskSpike, onOperatorPanic, onReset }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button className="px-3 py-1 bg-rose-700 rounded" onClick={onRiskSpike}>Simulate Sensor Degradation</button>
      <button className="px-3 py-1 bg-amber-700 rounded" onClick={onOperatorPanic}>Simulate Operator Panic</button>
      <button className="px-3 py-1 bg-slate-700 rounded" onClick={onReset}>Reset</button>
    </div>
  );
}
