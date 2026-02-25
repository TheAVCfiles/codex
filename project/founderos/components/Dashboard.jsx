import { useState } from "react";
import ReactDOMServer from "react-dom/server";
import { FounderStates, transition } from "../fsm/founderMachine";
import { writeLedger } from "../lib/ledger";
import { runRegime } from "../engines/regimeEngine";
import { canTrigger, Roles } from "../lib/auth";
import LedgerReport from "./LedgerReport";

export default function Dashboard() {
  const [state, setState] = useState(FounderStates.IDLE);
  const [role] = useState(Roles.FOUNDER);

  async function handleEvent(event) {
    if (!canTrigger(role, event)) {
      alert("Permission denied.");
      return;
    }

    const newState = transition(state, event);

    const entry = {
      previousState: state,
      event,
      newState,
      timestamp: Date.now(),
      // Optional metadata (shows in PDF if you set it):
      actor: role,
      org: "AVC Systems Studio",
    };

    await writeLedger("avc_beta", entry);
    setState(newState);
  }

  function runEngine() {
    const result = runRegime({ velocity: Math.random() * 100 });

    if (result.signal === "OVERDRIVE") {
      handleEvent("OVERDRIVE");
    } else {
      handleEvent("START_BUILD");
    }
  }

  function exportPdf() {
    const html = ReactDOMServer.renderToStaticMarkup(
      <LedgerReport founderId="avc_beta" />
    );

    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) {
      alert("Popup blocked. Allow popups to export.");
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
        <button onClick={() => handleEvent("THROTTLE")}>Throttle</button>
        <button onClick={() => handleEvent("ESCALATE")}>Escalate</button>
        <button onClick={() => handleEvent("RESET")}>Reset</button>
        <button onClick={exportPdf}>Export PDF</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 40,
    background: "#0f1115",
    color: "white",
    minHeight: "100vh",
    fontFamily: "system-ui",
  },
  buttons: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },
};
