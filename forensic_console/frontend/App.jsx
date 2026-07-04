import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Download,
  FileText,
  Layers,
  Link,
  Search,
  Upload,
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('Intake');
  const [logs, setLogs] = useState([]);
  const [entities, setEntities] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchData = async () => {
    try {
      const logRes = await fetch(`${API_BASE}/data/Intake_Log`);
      setLogs(await logRes.json());

      const entRes = await fetch(`${API_BASE}/data/Raw_Entities`);
      setEntities(await entRes.json());
    } catch (error) {
      console.error('Fetch failed', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setStatusMsg('Uploading...');

    await fetch(`${API_BASE}/intake/upload`, { method: 'POST', body: formData });
    setStatusMsg('Upload complete.');
    fetchData();
  };

  const handleUrlPull = async () => {
    if (!urlInput) return;

    setStatusMsg('Fetching URL...');
    await fetch(`${API_BASE}/intake/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlInput }),
    });

    setUrlInput('');
    setStatusMsg('URL pulled.');
    fetchData();
  };

  const startScan = async () => {
    setIsScanning(true);
    setStatusMsg('Scanning document batch...');

    await fetch(`${API_BASE}/scan`, { method: 'POST' });

    setIsScanning(false);
    setStatusMsg('Scan complete. Signals extracted.');
    fetchData();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Intake':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Upload size={20} className="text-blue-600" /> Upload Documents
                </h3>
                <div className="rounded-lg border-2 border-dashed border-slate-200 p-8 text-center transition-colors hover:border-blue-400">
                  <input type="file" onChange={handleUpload} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer text-slate-500">
                    Click to browse or drag files here
                  </label>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Link size={20} className="text-blue-600" /> Pull from URL
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://example.com/archive"
                    value={urlInput}
                    onChange={(event) => setUrlInput(event.target.value)}
                    className="flex-1 rounded border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleUrlPull}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Fetch
                  </button>
                </div>
                <p className="mt-2 text-xs italic text-slate-400">Fetches HTML and extracts text automatically.</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
                <h3 className="font-semibold text-slate-700">Intake Queue (Rain)</h3>
                <span className="font-mono text-xs text-slate-500">SOVEREIGN_LEDGER_OFFLINE</span>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Source</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-mono text-blue-600">{log.doc_id}</td>
                      <td className="max-w-xs truncate px-6 py-3">{log.filename}</td>
                      <td className="px-6 py-3 capitalize">{log.source_type}</td>
                      <td className="px-6 py-3 text-slate-500">
                        {log.import_date ? new Date(log.import_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                            log.status === 'new' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Scan':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-xl bg-slate-900 p-8 text-white shadow-lg">
              <div>
                <h2 className="mb-2 text-2xl font-bold">Signal Extraction Engine</h2>
                <p className="max-w-lg text-slate-400">
                  Process unreviewed documents into structured entity candidates with deterministic parsing.
                </p>
              </div>
              <button
                onClick={startScan}
                disabled={isScanning}
                className="flex transform items-center gap-2 rounded-lg bg-emerald-500 px-8 py-4 font-bold text-white transition-all hover:scale-105 hover:bg-emerald-600 disabled:opacity-50"
              >
                {isScanning ? <Clock className="animate-spin" /> : <Search />}
                START MASS SCAN
              </button>
            </div>
          </div>
        );

      case 'Review':
        return (
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-semibold text-slate-700">Review Queue (Soil)</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">Candidate Signal</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Confidence</th>
                  <th className="px-6 py-3">Source Doc</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entities.map((ent, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-semibold text-slate-900">{ent.raw_text}</td>
                    <td className="px-6 py-3">
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">{ent.type}</span>
                    </td>
                    <td className="px-6 py-3">{ent.confidence}</td>
                    <td className="px-6 py-3 font-mono text-xs">{ent.doc_id}</td>
                    <td className="flex justify-end gap-2 px-6 py-3 text-right">
                      <button className="p-1 text-slate-400 hover:text-emerald-600" title="Promote">
                        <CheckCircle size={18} />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-amber-600" title="Hold">
                        <AlertCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div className="p-20 text-center italic text-slate-400">Module construction in progress...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      <aside className="fixed left-0 top-0 flex h-full w-64 flex-col bg-slate-900 p-6 text-white">
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-lg bg-blue-600 p-2">
            <Layers className="text-white" size={24} />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Forensic Intake</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {['Intake', 'Scan', 'Review', 'Canonical', 'Map', 'Export'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {tab === 'Intake' && <FileText size={18} />}
                {tab === 'Scan' && <Search size={18} />}
                {tab === 'Review' && <CheckCircle size={18} />}
                {tab === 'Canonical' && <Database size={18} />}
                {tab === 'Map' && <Layers size={18} />}
                {tab === 'Export' && <Download size={18} />}
                {tab}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="ml-64 max-w-6xl p-8">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{activeTab}</h2>
            <p className="mt-1 text-slate-500">Local-first forensic intake and review shell.</p>
          </div>
          {statusMsg && (
            <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-blue-700">
              <Clock size={16} className="animate-spin" /> {statusMsg}
            </div>
          )}
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
