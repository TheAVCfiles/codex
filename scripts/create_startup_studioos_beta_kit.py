import datetime
import json
import os
import shutil
import zipfile


BASE_DIR = "/mnt/data/startup_studioos_local_v1"
ZIP_PATH = "/mnt/data/Startup_StudioOS_LocalFirst_Beta_Kit_v1.zip"


def ensure_clean_dir(path: str) -> None:
    if os.path.exists(path):
        shutil.rmtree(path)
    os.makedirs(path, exist_ok=True)


def write_text(path: str, content: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def write_json(path: str, data: dict) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def main() -> None:
    ensure_clean_dir(BASE_DIR)

    dirs = [
        "01_START_HERE",
        "02_APP/startup-studioos",
        "03_DOCS",
        "04_TEMPLATES",
        "05_DEMOS",
        "06_IMPORT_FROM_YOU",
    ]
    for d in dirs:
        os.makedirs(os.path.join(BASE_DIR, d), exist_ok=True)

    uploads = {
        "StagePort_StudioOS_MVP_Architectural_Synthesis.pdf": "/mnt/data/StagePort StudioOS MVP v1: Architectural Synthesis....pdf",
        "Founder_Safe_Systems_Primer_v1.0.pdf": "/mnt/data/The_Founder-Safe_Systems_Primer_v1.0.pdf",
        "Sunday_Rinse_Report_Card_iPhone_Friendly.pdf": "/mnt/data/Sunday_Rinse_Report_Card_iPhone_Friendly.pdf",
        "Sentient_Cents_FactSheet_v2.pdf": "/mnt/data/Decrypt_The_Girl_Sentient_Cents_FactSheet_v2.pdf",
        "Sentient_Cents_Model_and_Sims.pdf": "/mnt/data/Sentient_Cents_Model_and_Sims.pdf",
        "30Day_Sprint_Plan.pdf": "/mnt/data/10_30Day_Sprint_Plan.pdf",
        "Syvaq_MVP_Activation_Plan.pdf": "/mnt/data/SYVAQ_MVP_Activation_Plan_AVC 2.pdf",
        "FoundHer_Syvaq_Founder_Protection_and_Licensing_Pack.pdf": "/mnt/data/FoundHer_Syvaq_Founder_Protection_and_Licensing_Pack.pdf",
        "StudioOS_Capsule_Drop_Kit_Onboarding_Ritual.pdf": "/mnt/data/StudioOS Capsule Drop Kit and Onboarding Ritual 4.pdf",
        "StagePort_Signal_Console_v0_1.html": "/mnt/data/stageport_signal_console_v0_1.html",
        "Sentient_Cents_Ledger_Template.json": "/mnt/data/Sentient_Cents_Ledger_Template.json",
        "sentient_cents_template.xlsx": "/mnt/data/sentient_cents_template.xlsx",
        "sentient_cents_daily_template.csv": "/mnt/data/sentient_cents_daily_template.csv",
        "Sentient_Cents_30Day_Simulation.csv": "/mnt/data/Sentient_Cents_30Day_Simulation.csv",
    }

    for name, path in uploads.items():
        if os.path.exists(path):
            if name.endswith(".html"):
                dest = os.path.join(BASE_DIR, "05_DEMOS", name)
            elif name.endswith((".json", ".csv", ".xlsx", ".md")):
                dest = os.path.join(BASE_DIR, "04_TEMPLATES", name)
            else:
                dest = os.path.join(BASE_DIR, "03_DOCS", name)
            shutil.copy2(path, dest)

    app_dir = os.path.join(BASE_DIR, "02_APP", "startup-studioos")
    os.makedirs(os.path.join(app_dir, "src", "components"), exist_ok=True)
    os.makedirs(os.path.join(app_dir, "src", "utils"), exist_ok=True)

    write_json(
        os.path.join(app_dir, "package.json"),
        {
            "name": "startup-studioos",
            "private": True,
            "version": "0.1.0",
            "type": "module",
            "scripts": {"dev": "vite", "build": "vite build", "preview": "vite preview"},
            "dependencies": {"react": "^18.3.1", "react-dom": "^18.3.1"},
            "devDependencies": {"@vitejs/plugin-react": "^4.3.1", "vite": "^5.4.0"},
        },
    )

    write_text(
        os.path.join(app_dir, "vite.config.js"),
        """import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n  server: { port: 5173, strictPort: true },\n  build: { outDir: 'dist' }\n})\n""",
    )
    write_text(
        os.path.join(app_dir, "index.html"),
        """<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Startup StudioOS • Local-First</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.jsx\"></script>\n  </body>\n</html>\n""",
    )
    write_text(
        os.path.join(app_dir, "src", "main.jsx"),
        """import React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport App from './App.jsx'\nimport './styles.css'\n\ncreateRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n)\n""",
    )
    write_text(
        os.path.join(app_dir, "src", "styles.css"),
        ":root{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}\n"
        "body{margin:0;background:#0b0b12;color:#f2f2f7}\n"
        "a{color:#9ad}\n"
        ".container{max-width:980px;margin:0 auto;padding:20px}\n"
        ".card{background:#141424;border:1px solid #272744;border-radius:14px;padding:14px}\n"
        ".row{display:flex;gap:10px;flex-wrap:wrap}\n"
        ".btn{background:#2b2b44;border:1px solid #3b3b66;color:#f2f2f7;border-radius:999px;padding:8px 12px;cursor:pointer}\n"
        ".btn.primary{background:#f2d675;color:#101018;border-color:#f2d675;font-weight:700}\n"
        ".btn.danger{background:#a33;border-color:#c44}\n"
        "input,textarea,select{width:100%;padding:10px;border-radius:10px;border:1px solid #30304f;background:#0f0f1a;color:#f2f2f7}\n"
        "label{font-size:12px;color:#bfbfda}\n"
        "h1{font-size:20px;margin:0 0 8px 0}\n"
        "small{color:#bfbfda}\n"
        ".kpi{display:flex;gap:14px;flex-wrap:wrap}\n"
        ".kpi .pill{background:#0f0f1a;border:1px solid #30304f;border-radius:999px;padding:6px 10px;font-size:12px}\n"
        "hr{border:none;border-top:1px solid #2a2a44;margin:14px 0}\n",
    )

    write_text(
        os.path.join(app_dir, "src", "utils", "hash.js"),
        """export async function sha256(text) {\n  const enc = new TextEncoder()\n  const buf = await crypto.subtle.digest('SHA-256', enc.encode(text))\n  const bytes = Array.from(new Uint8Array(buf))\n  return bytes.map(b => b.toString(16).padStart(2,'0')).join('')\n}\n\nexport async function sha256File(file) {\n  const buf = await file.arrayBuffer()\n  const digest = await crypto.subtle.digest('SHA-256', buf)\n  const bytes = Array.from(new Uint8Array(digest))\n  return bytes.map(b => b.toString(16).padStart(2,'0')).join('')\n}\n""",
    )
    write_text(
        os.path.join(app_dir, "src", "utils", "storage.js"),
        """const KEY = 'startup_studioos_v1'\n\nexport function loadState() {\n  try {\n    const raw = localStorage.getItem(KEY)\n    if (!raw) return { ledger: [], meta: { monthlyCount: 0, pressureIndex: 'green', monthKey: currentMonthKey() } }\n    const st = JSON.parse(raw)\n    const mk = currentMonthKey()\n    if (st?.meta?.monthKey !== mk) {\n      st.meta.monthKey = mk\n      st.meta.monthlyCount = 0\n    }\n    return st\n  } catch {\n    return { ledger: [], meta: { monthlyCount: 0, pressureIndex: 'green', monthKey: currentMonthKey() } }\n  }\n}\n\nexport function saveState(state) {\n  localStorage.setItem(KEY, JSON.stringify(state))\n}\n\nexport function currentMonthKey() {\n  const d = new Date()\n  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`\n}\n""",
    )
    write_text(
        os.path.join(app_dir, "src", "utils", "throttle.js"),
        """export function computePressureIndex(ledger) {\n  const now = Date.now()\n  const within = (hours) => (e) =>\n    e.type === 'pressure' && (now - new Date(e.timestamp).getTime()) < hours * 60 * 60 * 1000\n\n  const last48 = ledger.filter(within(48)).length\n  const last24 = ledger.filter(within(24)).length\n  const last6  = ledger.filter(within(6)).length\n\n  if (last48 >= 6 || last24 >= 4 || last6 >= 3) return 'red'\n  if (last48 >= 3 || last24 >= 2) return 'yellow'\n  return 'green'\n}\n""",
    )

    # Components
    write_text(
        os.path.join(app_dir, "src", "App.jsx"),
        """import React, { useMemo, useState } from 'react'\nimport Dashboard from './components/Dashboard.jsx'\nimport LogDecision from './components/LogDecision.jsx'\nimport LogPressure from './components/LogPressure.jsx'\nimport AnchorContract from './components/AnchorContract.jsx'\nimport SundayRinse from './components/SundayRinse.jsx'\nimport { loadState, saveState } from './utils/storage.js'\nimport { computePressureIndex } from './utils/throttle.js'\n\nconst MAX_FREE_LOGS = 25\n\nexport default function App() {\n  const [view, setView] = useState('dashboard')\n  const [state, setState] = useState(loadState())\n\n  const locked = state.meta.monthlyCount >= MAX_FREE_LOGS\n\n  const pressureIndex = useMemo(() => computePressureIndex(state.ledger), [state.ledger])\n\n  const updateState = (next) => {\n    next.meta.pressureIndex = computePressureIndex(next.ledger)\n    setState(next)\n    saveState(next)\n  }\n\n  const addEntry = (entry) => {\n    const next = structuredClone(state)\n    next.ledger.unshift(entry)\n    next.meta.monthlyCount = (next.meta.monthlyCount || 0) + 1\n    updateState(next)\n  }\n\n  const exportSnapshot = () => {\n    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })\n    const url = URL.createObjectURL(blob)\n    const a = document.createElement('a')\n    const d = new Date()\n    const stamp = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`\n    a.href = url\n    a.download = `startup_studioos_snapshot_${stamp}.json`\n    a.click()\n    URL.revokeObjectURL(url)\n  }\n\n  const commonProps = { setView, addEntry, locked }\n\n  return (\n    <div className=\"container\">\n      <div className=\"row\" style={{justifyContent:'space-between',alignItems:'center'}}>\n        <div>\n          <h1>Startup StudioOS • Local-First</h1>\n          <small>Runs in your browser. Stores locally. Exports as JSON. No server required.</small>\n        </div>\n        <div className=\"row\">\n          <button className=\"btn secondary\" onClick={exportSnapshot}>Export Snapshot</button>\n          <button className=\"btn\" onClick={() => setView('dashboard')}>Home</button>\n        </div>\n      </div>\n\n      <div className=\"card\" style={{marginTop:12}}>\n        <div className=\"kpi\">\n          <div className=\"pill\">Month logs: <b>{state.meta.monthlyCount}</b> / {MAX_FREE_LOGS}</div>\n          <div className=\"pill\">Pressure Index: <b>{pressureIndex.toUpperCase()}</b></div>\n          <div className=\"pill\">Mode: <b>{locked ? 'LOCKED' : 'ACTIVE'}</b></div>\n        </div>\n        {pressureIndex === 'red' && (\n          <div style={{marginTop:10}}>\n            <b>Red state:</b> pause decisions. Trigger external review mode (human check) before signing / shipping.\n          </div>\n        )}\n        {pressureIndex === 'yellow' && (\n          <div style={{marginTop:10}}>\n            <b>Yellow state:</b> slow down. Do the Sunday Rinse before changing scope.\n          </div>\n        )}\n      </div>\n\n      <div style={{marginTop:12}}>\n        {view === 'dashboard' && <Dashboard setView={setView} locked={locked} />}\n        {view === 'decision' && <LogDecision {...commonProps} />}\n        {view === 'pressure' && <LogPressure {...commonProps} />}\n        {view === 'contract' && <AnchorContract {...commonProps} />}\n        {view === 'rinse' && <SundayRinse {...commonProps} />}\n      </div>\n\n      <div style={{marginTop:14}}>\n        <small>\n          Tip: In Chrome/Safari on iPhone, use <b>Share → Add to Home Screen</b> for “opens like an app.”\n        </small>\n      </div>\n    </div>\n  )\n}\n""",
    )
    write_text(
        os.path.join(app_dir, "src", "components", "Dashboard.jsx"),
        """import React from 'react'\n\nexport default function Dashboard({ setView, locked }) {\n  return (\n    <div className=\"card\">\n      <h2 style={{marginTop:0}}>4-Button Console</h2>\n      <div className=\"row\">\n        <button className={\"btn primary\"} onClick={() => setView('decision')} disabled={locked}>1) Log Decision</button>\n        <button className={\"btn\"} onClick={() => setView('pressure')} disabled={locked}>2) Log Pressure</button>\n        <button className={\"btn\"} onClick={() => setView('contract')} disabled={locked}>3) Anchor Contract</button>\n        <button className={\"btn\"} onClick={() => setView('rinse')} disabled={locked}>4) Sunday Rinse</button>\n      </div>\n      {locked && (\n        <div style={{marginTop:10}}>\n          <b>Monthly limit reached.</b> Upgrade to keep logging this month (or export + start new month).\n        </div>\n      )}\n      <hr />\n      <p style={{margin:0}}>\n        This is the founder version: no ballet framing. Same file-native, ledgered, archival spine.\n      </p>\n    </div>\n  )\n}\n""",
    )
    write_text(
        os.path.join(app_dir, "src", "components", "LogDecision.jsx"),
        """import React, { useState } from 'react'\nimport { sha256 } from '../utils/hash.js'\n\nexport default function LogDecision({ setView, addEntry, locked }) {\n  const [role, setRole] = useState('Founder')\n  const [title, setTitle] = useState('')\n  const [notes, setNotes] = useState('')\n\n  const submit = async () => {\n    const timestamp = new Date().toISOString()\n    const payload = { role, title, notes }\n    const hash = await sha256(JSON.stringify(payload) + timestamp)\n    addEntry({ id: crypto.randomUUID(), type: 'decision', role, content: { title, notes }, timestamp, hash })\n    setView('dashboard')\n  }\n\n  return (\n    <div className=\"card\">\n      <h2 style={{marginTop:0}}>Log Decision</h2>\n      <label>Role</label>\n      <select value={role} onChange={e=>setRole(e.target.value)}>\n        <option>Founder</option>\n        <option>Operator</option>\n        <option>Architect</option>\n        <option>Witness</option>\n      </select>\n      <div style={{height:8}} />\n      <label>Decision title</label>\n      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder=\"e.g., Approve Phase I packet for review\" />\n      <div style={{height:8}} />\n      <label>Notes</label>\n      <textarea rows=\"6\" value={notes} onChange={e=>setNotes(e.target.value)} placeholder=\"What did you decide, why, and what are the exit conditions?\" />\n      <div className=\"row\" style={{marginTop:10}}>\n        <button className=\"btn\" onClick={()=>setView('dashboard')}>Cancel</button>\n        <button className=\"btn primary\" onClick={submit} disabled={locked || !title.trim()}>Save</button>\n      </div>\n    </div>\n  )\n}\n""",
    )
    write_text(
        os.path.join(app_dir, "src", "components", "LogPressure.jsx"),
        """import React, { useState } from 'react'\nimport { sha256 } from '../utils/hash.js'\n\nexport default function LogPressure({ setView, addEntry, locked }) {\n  const [source, setSource] = useState('External')\n  const [urgency, setUrgency] = useState('Medium')\n  const [what, setWhat] = useState('')\n\n  const submit = async () => {\n    const timestamp = new Date().toISOString()\n    const payload = { source, urgency, what }\n    const hash = await sha256(JSON.stringify(payload) + timestamp)\n    addEntry({ id: crypto.randomUUID(), type: 'pressure', role: 'Founder', content: payload, timestamp, hash })\n    setView('dashboard')\n  }\n\n  return (\n    <div className=\"card\">\n      <h2 style={{marginTop:0}}>Log Pressure Event</h2>\n      <div className=\"row\">\n        <div style={{flex:1}}>\n          <label>Source</label>\n          <select value={source} onChange={e=>setSource(e.target.value)}>\n            <option>External</option>\n            <option>Internal</option>\n            <option>Money</option>\n            <option>Team</option>\n            <option>Social</option>\n          </select>\n        </div>\n        <div style={{flex:1}}>\n          <label>Urgency</label>\n          <select value={urgency} onChange={e=>setUrgency(e.target.value)}>\n            <option>Low</option>\n            <option>Medium</option>\n            <option>High</option>\n          </select>\n        </div>\n      </div>\n      <div style={{height:8}} />\n      <label>What is happening?</label>\n      <textarea rows=\"6\" value={what} onChange={e=>setWhat(e.target.value)} placeholder=\"Short factual description. No essay. Just signal.\" />\n      <div className=\"row\" style={{marginTop:10}}>\n        <button className=\"btn\" onClick={()=>setView('dashboard')}>Cancel</button>\n        <button className=\"btn primary\" onClick={submit} disabled={locked || !what.trim()}>Save</button>\n      </div>\n    </div>\n  )\n}\n""",
    )
    write_text(
        os.path.join(app_dir, "src", "components", "AnchorContract.jsx"),
        """import React, { useState } from 'react'\nimport { sha256File } from '../utils/hash.js'\n\nexport default function AnchorContract({ setView, addEntry, locked }) {\n  const [file, setFile] = useState(null)\n  const [label, setLabel] = useState('')\n\n  const submit = async () => {\n    if (!file) return\n    const timestamp = new Date().toISOString()\n    const hash = await sha256File(file)\n    addEntry({\n      id: crypto.randomUUID(),\n      type: 'contract',\n      role: 'Founder',\n      content: { label: label || file.name, fileName: file.name, size: file.size, mime: file.type },\n      timestamp,\n      hash\n    })\n    setView('dashboard')\n  }\n\n  return (\n    <div className=\"card\">\n      <h2 style={{marginTop:0}}>Anchor Contract / Artifact</h2>\n      <label>Label (optional)</label>\n      <input value={label} onChange={e=>setLabel(e.target.value)} placeholder=\"e.g., SYVAQ Phase I SOW vFinal\" />\n      <div style={{height:8}} />\n      <label>Choose file (hash only; file NOT stored)</label>\n      <input type=\"file\" onChange={e=>setFile(e.target.files?.[0] || null)} />\n      <div style={{marginTop:8}}>\n        <small>{file ? `Selected: ${file.name} (${file.size} bytes)` : 'No file selected yet.'}</small>\n      </div>\n      <div className=\"row\" style={{marginTop:10}}>\n        <button className=\"btn\" onClick={()=>setView('dashboard')}>Cancel</button>\n        <button className=\"btn primary\" onClick={submit} disabled={locked || !file}>Anchor</button>\n      </div>\n    </div>\n  )\n}\n""",
    )
    write_text(
        os.path.join(app_dir, "src", "components", "SundayRinse.jsx"),
        """import React, { useState } from 'react'\nimport { sha256 } from '../utils/hash.js'\n\nexport default function SundayRinse({ setView, addEntry, locked }) {\n  const [wins, setWins] = useState('')\n  const [risks, setRisks] = useState('')\n  const [next, setNext] = useState('')\n\n  const submit = async () => {\n    const timestamp = new Date().toISOString()\n    const payload = { wins, risks, next }\n    const hash = await sha256(JSON.stringify(payload) + timestamp)\n    addEntry({ id: crypto.randomUUID(), type: 'rinse', role: 'Founder', content: payload, timestamp, hash })\n    setView('dashboard')\n  }\n\n  return (\n    <div className=\"card\">\n      <h2 style={{marginTop:0}}>Sunday Rinse</h2>\n      <label>Wins (3 bullets)</label>\n      <textarea rows=\"3\" value={wins} onChange={e=>setWins(e.target.value)} placeholder=\"• ...\" />\n      <div style={{height:8}} />\n      <label>Risks (3 bullets)</label>\n      <textarea rows=\"3\" value={risks} onChange={e=>setRisks(e.target.value)} placeholder=\"• ...\" />\n      <div style={{height:8}} />\n      <label>Next (3 bullets)</label>\n      <textarea rows=\"3\" value={next} onChange={e=>setNext(e.target.value)} placeholder=\"• ...\" />\n      <div className=\"row\" style={{marginTop:10}}>\n        <button className=\"btn\" onClick={()=>setView('dashboard')}>Cancel</button>\n        <button className=\"btn primary\" onClick={submit} disabled={locked}>Save</button>\n      </div>\n      <hr />\n      <small>Reference card included in /03_DOCS.</small>\n    </div>\n  )\n}\n""",
    )

    now = datetime.datetime.now()
    write_text(
        os.path.join(BASE_DIR, "01_START_HERE", "README_START_HERE.txt"),
        f"""Startup StudioOS — Local-First Beta Kit (v1)\nGenerated: {now.strftime('%Y-%m-%d %H:%M')} (America/New_York)\n\nGoal\n- One coherent kit (no zip hell) for founder daily use.\n- File-native, local-first, hashed receipts, exportable proof.\n- “Startup StudioOS” framing (no ballet words required).\n\nWhat’s inside\n- /02_APP/startup-studioos  → a minimal working local-first React app\n- /03_DOCS                 → your key spec + sprint plan + governance pack\n- /04_TEMPLATES            → Sentient Cents templates + ledger JSON\n- /05_DEMOS                → StagePort Signal Console HTML (your existing demo)\n- /06_IMPORT_FROM_YOU       → drop anything you want folded in next pass\n\nRun it (fast)\n1) Open Terminal in /02_APP/startup-studioos\n2) npm install\n3) npm run dev\n4) Open http://localhost:5173\n5) iPhone: Share → Add to Home Screen (opens like an app)\n\nFounder Relief Mode (rules)\n- 4 buttons only.\n- Red/Yellow/Green pressure index auto-computed.\n- File hashing anchors contracts without uploading them anywhere.\n- Export Snapshot creates a portable JSON proof file.\n\nNext consolidation move\n- When you’re ready, we will fold YOUR existing Replit React shell into this exact skeleton\n  and keep the same folder semantics so future drops are boring + predictable.\n""",
    )

    write_text(
        os.path.join(BASE_DIR, "01_START_HERE", "COVER_SHEET.txt"),
        """COVER SHEET — Startup StudioOS Beta (Founder Edition)\n\nThis kit is the “debranded” (non-ballet) founder version of StagePort / StudioOS.\nCore spine: file-native, ledgered, archival, anti-harvest. (See MVP doc.)\n\nNon-negotiables\n- Local-first by default.\n- Hash receipts for every entry.\n- Exportable proof (JSON) at any time.\n- Minimal UI: 4-button console.\n\nOperational promise\n- Relieve founders, don’t burden them.\n- Less logging than journaling.\n- More protection than a doc folder.\n\nIncluded artifacts (already in this kit)\n- Governance + licensing pack (Phase I)\n- 30-day sprint plan\n- Sentient Cents scholarship model + templates\n- Sunday Rinse report card\n""",
    )

    write_text(
        os.path.join(BASE_DIR, "01_START_HERE", "RECIPE.txt"),
        """RECIPE — How to treat files like ingredients (and stop zip hell)\n\nRule: everything must land in ONE of these bins:\n1) APP (runnable)\n2) DOCS (readable)\n3) TEMPLATES (fillable)\n4) DEMOS (proof)\n5) IMPORT (to be folded in next pass)\n\nWhen you get a new file:\n- If it runs → /02_APP\n- If it explains → /03_DOCS\n- If it’s a schema/template → /04_TEMPLATES\n- If it’s a demo/visual → /05_DEMOS\n- If you’re unsure → /06_IMPORT_FROM_YOU\n\nOnce a week:\n- Empty /06_IMPORT_FROM_YOU into the right bins\n- Delete duplicates\n- Keep ONE canonical version only\n""",
    )

    write_text(
        os.path.join(BASE_DIR, "06_IMPORT_FROM_YOU", "DROP_FILES_HERE.txt"),
        "Drop anything here you want folded into the next pass. This folder should be empty after each weekly consolidation.\n",
    )

    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)

    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(BASE_DIR):
            for filename in files:
                full = os.path.join(root, filename)
                rel = os.path.relpath(full, BASE_DIR)
                z.write(full, arcname=f"Startup_StudioOS_LocalFirst_Beta_Kit_v1/{rel}")

    print(ZIP_PATH)


if __name__ == "__main__":
    main()
