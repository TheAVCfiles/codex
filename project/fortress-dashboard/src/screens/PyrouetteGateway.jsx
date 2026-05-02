import React, { useMemo, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import LedgerTable from '../components/LedgerTable';
import DiscoveryModal from '../components/DiscoveryModal';
import TelemetryPanel from '../components/TelemetryPanel';
import OperatorLoadPanel from '../components/OperatorLoadPanel';
import SimulationControls from '../components/SimulationControls';
import { mockHash } from '../lib/mockHash';
import { nowClock } from '../lib/time';
import { nextStateFromRisk } from '../lib/fsm';

export default function PyrouetteGateway() {
  const [risk, setRisk] = useState(20);
  const [motion, setMotion] = useState(44);
  const [operatorLoad, setOperatorLoad] = useState(30);
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);

  const state = nextStateFromRisk(risk, operatorLoad);
  const tone = state === 'BLOCKED' ? 'red' : state === 'PERMITTED' ? 'green' : 'amber';

  const rows = useMemo(() => [
    { time: nowClock(), event: `FSM ${state}`, hash: mockHash('fsm') },
    { time: nowClock(), event: 'Receipt generated', hash: mockHash('rcpt') },
  ], [state]);

  const simulateSensorDegradation = () => { setRisk(88); setMotion(90); };
  const simulateOperatorPanic = () => setOperatorLoad(95);
  const reset = () => { setRisk(20); setMotion(44); setOperatorLoad(30); };

  return <div className="space-y-4">
    <div>
      <h1 className="text-2xl font-bold">PyRouette Gateway</h1>
      <p className="text-slate-400">Structural Execution Authority</p>
    </div>
    <StatusBadge label={`State: ${state}`} tone={tone} />
    <SimulationControls onRiskSpike={simulateSensorDegradation} onOperatorPanic={simulateOperatorPanic} onReset={reset} />
    <TelemetryPanel risk={risk} motion={motion} />
    <OperatorLoadPanel load={operatorLoad} />
    <button className="px-3 py-1 rounded bg-cyan-700" onClick={() => setShowDiscoveryModal(true)}>Open Discovery</button>
    <LedgerTable rows={rows} />
    <DiscoveryModal open={showDiscoveryModal} onClose={() => setShowDiscoveryModal(false)} />
  </div>;
}
