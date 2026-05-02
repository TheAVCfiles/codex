import React, { useState } from 'react';
import SovereignOS from './screens/SovereignOS';
import SingularityOS from './screens/SingularityOS';
import PyrouetteGateway from './screens/PyrouetteGateway';

export default function App() {
  const [screen, setScreen] = useState('gateway');
  const Screen = screen === 'sovereign' ? SovereignOS : screen === 'singularity' ? SingularityOS : PyrouetteGateway;
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setScreen('gateway')} className="px-2 py-1 bg-slate-800 rounded">Gateway</button>
        <button onClick={() => setScreen('sovereign')} className="px-2 py-1 bg-slate-800 rounded">SovereignOS</button>
        <button onClick={() => setScreen('singularity')} className="px-2 py-1 bg-slate-800 rounded">SingularityOS</button>
      </div>
      <Screen />
    </div>
  );
}
