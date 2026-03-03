import type { CSSProperties } from 'react';
import { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { FounderStates, transition, type FounderEvent } from '../fsm/founderMachine';
import { writeLedger } from '../lib/ledger';
import { runRegime } from '../engines/regimeEngine';
import { canTrigger, Roles } from '../lib/auth';
import LedgerReport from './LedgerReport';
import { triggerThresholdAlert } from '../lib/alerts';

export default function Dashboard(): JSX.Element {
  const [state, setState] = useState(FounderStates.IDLE);
  const [role] = useState(Roles.FOUNDER);

  async function handleEvent(event: FounderEvent): Promise<void> {
    if (!canTrigger(role, event)) {
      alert('Permission denied.');
      return;
    }

    const newState = transition(state, event);

    const entry = {
      previousState: state,
      event,
      newState,
      timestamp: Date.now(),
      actor: role,
      org: 'AVC Systems Studio',
    };

    const row = await writeLedger('avc_beta', entry);

    if (newState === FounderStates.ESCALATED) {
      await triggerThresholdAlert({
        org: row.org,
        actor: row.actor,
        prev: row.previousState,
        stage: row.newState,
        timestamp: row.timestamp,
        hash: row.hash,
      });
    }

    setState(newState);
  }

  function runEngine(): void {
    const result = runRegime({ velocity: Math.random() * 100 });

    if (result.signal === 'OVERDRIVE') {
      void handleEvent('OVERDRIVE');
    } else {
      void handleEvent('START_BUILD');
    }
  }

  function exportPdf(): void {
    const html = ReactDOMServer.renderToStaticMarkup(<LedgerReport founderId="avc_beta" />);

    const win = window.open('', '_blank', 'noopener,noreferrer');
    if (!win) {
      alert('Popup blocked. Allow popups to export.');
      return;
    }

    win.document.open();
    win.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>FounderOS Ledger Export</title>
  </head>
  <body>${html}</body>
</html>`);
    win.document.close();

    setTimeout(() => win.print(), 250);
  }

  return (
    <div style={styles.container}>
      <h1>FounderOS Console</h1>
      <p>Current State: {state}</p>

      <div style={styles.buttons}>
        <button onClick={runEngine}>Run Engine</button>
        <button onClick={() => void handleEvent('THROTTLE')}>Throttle</button>
        <button onClick={() => void handleEvent('ESCALATE')}>Escalate</button>
        <button onClick={() => void handleEvent('RESET')}>Reset</button>
        <button onClick={exportPdf}>Export PDF</button>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    padding: 40,
    background: '#0f1115',
    color: 'white',
    minHeight: '100vh',
    fontFamily: 'system-ui',
  },
  buttons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },
};
