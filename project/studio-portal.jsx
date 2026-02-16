import React, { useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  CheckCircle,
  ClipboardList,
  Database,
  DollarSign,
  FileCheck,
  Fingerprint,
  Layout,
  Maximize2,
  Menu,
  Move,
  Orbit,
  Scale,
  Shield,
  Terminal,
  Users,
  Video,
  Workflow,
  X,
  Zap,
} from "lucide-react";

const DANCER_ROSTER = [
  {
    id: 1,
    name: "V. Seraphina",
    role: "Principal",
    status: "Active",
    condition: 92,
    style: "Classical",
    imageColor: "bg-stone-300",
  },
  {
    id: 2,
    name: "J. Mercer",
    role: "Soloist",
    status: "Injured",
    condition: 45,
    style: "Contemporary",
    imageColor: "bg-red-900",
  },
  {
    id: 3,
    name: "A. Vance",
    role: "Lead",
    status: "Active",
    condition: 88,
    style: "Urban/Fusion",
    imageColor: "bg-emerald-900",
  },
  {
    id: 4,
    name: "Elara",
    role: "Corps",
    status: "Probation",
    condition: 70,
    style: "Neoclassical",
    imageColor: "bg-stone-600",
  },
];

const COMPANY_STATS = {
  monthlyBurn: 12500,
  revenue: 10200,
  daysRunway: 42,
  activeInjuries: 3,
};

const IDENTITY_TIERS = {
  Bronze: { relayDiscount: "5%", color: "text-amber-400" },
  Silver: { relayDiscount: "12%", color: "text-zinc-300" },
  Gold: { relayDiscount: "20%", color: "text-yellow-300" },
  Platinum: { relayDiscount: "35%", color: "text-cyan-300" },
};

const StatusBadge = ({ status }) => {
  const colors = {
    Active: "text-emerald-400 border-emerald-400 bg-emerald-400/10",
    Injured: "text-red-500 border-red-500 bg-red-500/10",
    Probation: "text-amber-500 border-amber-500 bg-amber-500/10",
  };

  return (
    <span
      className={`text-xs uppercase tracking-widest px-2 py-0.5 border ${colors[status] || colors.Active}`}
    >
      {status}
    </span>
  );
};

const MetricCard = ({ label, value, subtext, alert = false }) => (
  <div
    className={`p-6 border ${alert ? "border-red-800 bg-red-900/10" : "border-zinc-800 bg-zinc-900/50"} flex flex-col justify-between h-32`}
  >
    <h3 className="text-zinc-500 text-xs uppercase tracking-widest">{label}</h3>
    <div className="flex items-end justify-between">
      <span
        className={`text-2xl font-light ${alert ? "text-red-400" : "text-zinc-100"}`}
      >
        {value}
      </span>
      {subtext && <span className="text-xs text-zinc-600">{subtext}</span>}
    </div>
  </div>
);

const ArtifactCard = ({ title, icon, value, footer }) => (
  <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 shadow-sm flex flex-col justify-between">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h5 className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
        {title}
      </h5>
    </div>
    <div className="text-sm font-mono font-bold text-zinc-100 break-all mb-3">
      {value}
    </div>
    <div className="text-[10px] text-zinc-500 italic border-t border-zinc-800 pt-2">
      {footer}
    </div>
  </div>
);

const WalletWidget = ({ wallet }) => (
  <div className="border border-zinc-800 rounded-2xl bg-zinc-900/80 p-4 space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">
        Identity Context
      </span>
      <span
        className={`text-xs font-bold ${IDENTITY_TIERS[wallet.tier].color}`}
      >
        {wallet.tier}
      </span>
    </div>
    <div className="space-y-1 text-xs">
      <div className="flex justify-between">
        <span className="text-zinc-400">Stagecoin Ω</span>
        <span>{wallet.stagecoin}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-zinc-400">SentientCents C</span>
        <span>{wallet.sentientCents}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-zinc-400">StreetCred</span>
        <span>{wallet.streetcred}</span>
      </div>
    </div>
    <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
      Relay discount:{" "}
      <span className="text-zinc-200">
        {IDENTITY_TIERS[wallet.tier].relayDiscount}
      </span>
    </div>
  </div>
);

const ReceptionView = ({ setView }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <header className="mb-8">
      <h1 className="text-4xl font-light text-zinc-100 tracking-tight">
        The Command Hub
      </h1>
      <p className="text-zinc-500 mt-2">
        Unified motherboard for identity, relay economics, and choreography
        provenance.
      </p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Monthly Burn"
        value={`$${COMPANY_STATS.monthlyBurn.toLocaleString()}`}
        alert
        subtext="High"
      />
      <MetricCard
        label="Current Revenue"
        value={`$${COMPANY_STATS.revenue.toLocaleString()}`}
        alert
        subtext="Deficit"
      />
      <MetricCard
        label="Runway"
        value={`${COMPANY_STATS.daysRunway} Days`}
        alert={COMPANY_STATS.daysRunway < 60}
      />
      <MetricCard
        label="Active Injuries"
        value={COMPANY_STATS.activeInjuries}
        alert={COMPANY_STATS.activeInjuries > 0}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        onClick={() => setView("paygait")}
        className="p-5 border border-zinc-800 rounded-xl text-left hover:bg-zinc-900"
      >
        <Fingerprint className="w-5 h-5 text-blue-400 mb-2" />
        <div className="text-zinc-100 font-medium">PayGait Ingest Engine</div>
        <p className="text-sm text-zinc-500">
          Batch signaling, authorship seals, and settlement controls.
        </p>
      </button>
      <button
        onClick={() => setView("terminal")}
        className="p-5 border border-zinc-800 rounded-xl text-left hover:bg-zinc-900"
      >
        <Terminal className="w-5 h-5 text-emerald-400 mb-2" />
        <div className="text-zinc-100 font-medium">Ops Terminal</div>
        <p className="text-sm text-zinc-500">
          Real-time audit stream for every command-path action.
        </p>
      </button>
      <button
        onClick={() => setView("ecosystem")}
        className="p-5 border border-zinc-800 rounded-xl text-left hover:bg-zinc-900"
      >
        <Workflow className="w-5 h-5 text-amber-400 mb-2" />
        <div className="text-zinc-100 font-medium">System Ontology</div>
        <p className="text-sm text-zinc-500">
          Layered map from Soloist Aura through StagePort OS and theatre
          routing.
        </p>
      </button>
    </div>
  </div>
);

const PayGaitView = ({ appendLog, wallet, setWallet }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [stakeData, setStakeData] = useState({
    workTitle: "",
    choreographer: "",
    claimType: "Whole-Work",
    stakePercentage: 100,
    ingestMode: "Hardware Upload",
  });
  const [kineticArtifact, setKineticArtifact] = useState(null);

  const inactivityProjection = useMemo(() => {
    const base = wallet.sentientCents;
    return [0, 1, 2, 3, 4].map((epoch) =>
      Math.max(0, Math.round(base * (1 - 0.02) ** epoch)),
    );
  }, [wallet.sentientCents]);

  const handleProcess = () => {
    setIsProcessing(true);
    appendLog(
      "INGEST_BATCH_START",
      `Batch ingest initialized in ${stakeData.ingestMode}.`,
    );

    setTimeout(() => {
      const artifact = {
        qftPeaks: [0.88, 0.42, 0.91, 0.12, 0.67],
        qrngSeed: "7a29f8e1c4b2f0de91ac4f3b5dd3c2a1",
        signature: "PyR_v1_HASH_9921_SIG",
        royalty: {
          sc: "0.042 ETH",
          stagecoin: 500,
          streetcred: "+12.5",
        },
      };

      setKineticArtifact(artifact);
      setIsProcessing(false);
      setProcessingComplete(true);
      appendLog(
        "SEAL_AUTHORSHIP",
        `${stakeData.workTitle || "Untitled"} sealed for ${stakeData.choreographer || "Unspecified"}.`,
      );
      appendLog(
        "KINETIC_DIMENSIONS",
        `Generated ${artifact.qftPeaks.length} QFT dimensions and quantum signature.`,
      );
    }, 1100);
  };

  const handleBridge = () => {
    if (!kineticArtifact) return;

    setWallet((prev) => ({
      ...prev,
      stagecoin: prev.stagecoin + kineticArtifact.royalty.stagecoin,
      sentientCents: Math.max(0, prev.sentientCents - 40),
      streetcred: `${Number.parseFloat(prev.streetcred) + 12.5}`,
    }));

    appendLog(
      "BRIDGE_TO_BASE",
      `Settlement relayed to Base L2. -40 C gasless relay budget, +${kineticArtifact.royalty.stagecoin} Ω Stagecoin minted.`,
    );
  };

  return (
    <div className="max-w-6xl animate-in fade-in duration-500 space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-zinc-100">
          PayGait Command Hub
        </h2>
        <p className="text-zinc-400 mt-1">
          Unified command ingest, authorship sealing, and gasless bridge
          settlement.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Video className="text-blue-500" size={24} />
              <h3 className="text-xl font-bold text-zinc-100">
                Unified Command Ingest
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="space-y-1">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                  Work Title
                </span>
                <input
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100"
                  value={stakeData.workTitle}
                  onChange={(e) =>
                    setStakeData({ ...stakeData, workTitle: e.target.value })
                  }
                  placeholder="e.g. StagePort Variations"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                  Choreographer
                </span>
                <input
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100"
                  value={stakeData.choreographer}
                  onChange={(e) =>
                    setStakeData({
                      ...stakeData,
                      choreographer: e.target.value,
                    })
                  }
                  placeholder="Name or Studio ID"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <label className="space-y-1">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                  Claim Type
                </span>
                <select
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100"
                  value={stakeData.claimType}
                  onChange={(e) =>
                    setStakeData({ ...stakeData, claimType: e.target.value })
                  }
                >
                  <option>Whole-Work</option>
                  <option>Solo</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                  Claim Stake (%)
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100"
                  value={stakeData.stakePercentage}
                  onChange={(e) =>
                    setStakeData({
                      ...stakeData,
                      stakePercentage: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">
                  Ingest Source
                </span>
                <select
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100"
                  value={stakeData.ingestMode}
                  onChange={(e) =>
                    setStakeData({ ...stakeData, ingestMode: e.target.value })
                  }
                >
                  <option>Hardware Upload</option>
                  <option>Remote Node Ingest</option>
                </select>
              </label>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-6 mb-6 text-blue-100 border border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Scale size={16} className="text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Seal Authorship Protocol
                </span>
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                Claiming movement syntax with Balanchine, Laban, Pilates, and
                Py.Rouette mappings. The claim protects compositional
                intelligence, never bodies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-2xl hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Zap className="animate-spin" size={18} />
                ) : (
                  <FileCheck size={18} />
                )}
                {isProcessing ? "Sealing + generating..." : "Seal Authorship"}
              </button>
              <button
                onClick={handleBridge}
                disabled={!processingComplete}
                className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-2xl hover:bg-emerald-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Orbit size={18} /> Bridge to Base (Sim)
              </button>
            </div>
          </div>

          {processingComplete && kineticArtifact && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ArtifactCard
                title="QFT Spectral Peaks"
                icon={<Activity className="text-emerald-500" />}
                value={kineticArtifact.qftPeaks.join(" | ")}
                footer="Domain frequency lattice sealed"
              />
              <ArtifactCard
                title="QRNG Seed Origin"
                icon={<Zap className="text-orange-500" />}
                value={kineticArtifact.qrngSeed}
                footer="Quantum entropy path verified"
              />
              <ArtifactCard
                title="Py.Rouette Signature"
                icon={<Fingerprint className="text-blue-500" />}
                value={kineticArtifact.signature}
                footer="Movement logic hash locked"
              />
              <ArtifactCard
                title="Royalty + Rewards"
                icon={<Award className="text-purple-500" />}
                value={`+${kineticArtifact.royalty.stagecoin} Ω | ${kineticArtifact.royalty.sc} | ${kineticArtifact.royalty.streetcred} cred`}
                footer="Relay-settle and mint pathway ready"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-950 text-white p-6 rounded-3xl shadow-xl border border-zinc-800">
            <h4 className="text-xs font-black uppercase text-blue-400 tracking-widest mb-4">
              Functional Motherboard
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Relay Economy</span>
                <span className="font-mono">Gasless</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Ledger Arbitration</span>
                <span className="font-mono">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Batch Integrity</span>
                <span className="text-emerald-400 font-mono">Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <h4 className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-3">
              Inactivity Decay Monitor
            </h4>
            <div className="space-y-2 text-xs">
              {inactivityProjection.map((value, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-12 text-zinc-500">E{i}</span>
                  <div className="h-2 bg-zinc-800 rounded flex-1 overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-amber-500 to-red-500"
                      style={{
                        width: `${Math.max(5, (value / inactivityProjection[0]) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-14 text-right text-zinc-300">
                    {value} C
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TerminalView = ({ logs }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <header>
      <h2 className="text-3xl font-bold text-zinc-100">Ops Terminal</h2>
      <p className="text-zinc-500 mt-1">
        Real-time audit stream for command, identity, and settlement actions.
      </p>
    </header>

    <div className="border border-zinc-800 bg-zinc-950 rounded-2xl p-5">
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3">
        Live Stream
      </div>
      <div className="space-y-2 font-mono text-xs max-h-[28rem] overflow-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className="grid grid-cols-[120px_180px_1fr] gap-3 border-b border-zinc-900 pb-2"
          >
            <span className="text-zinc-500">{log.time}</span>
            <span className="text-cyan-300">{log.type}</span>
            <span className="text-zinc-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EcosystemMapView = () => {
  const rows = [
    [
      "Identity Layer",
      "Soloist Aura",
      "Memory infrastructure + lineage anchor",
    ],
    [
      "Infrastructure",
      "StagePort OS",
      "PyRouette compiler, validator, GLISSÉ triage",
    ],
    [
      "Product Layer",
      "Studio Shelf",
      "Revenue tools nested as modular command units",
    ],
    ["Orchestration", "Theatre System", "Firebase vault + multi-agent routing"],
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-light text-zinc-100 tracking-tight">
          Ecosystem Map
        </h1>
        <p className="text-zinc-500 mt-2">
          Complete systems ontology for command-hub planning and integration
          sequencing.
        </p>
      </header>

      <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-2xl space-y-3">
        {rows.map(([layer, name, detail]) => (
          <div
            key={layer}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-zinc-900 pb-3"
          >
            <div className="text-zinc-500 text-xs uppercase tracking-widest">
              {layer}
            </div>
            <div className="text-zinc-200 font-medium">{name}</div>
            <div className="text-zinc-400 text-sm">{detail}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-2xl">
          <h4 className="text-zinc-300 text-sm mb-2 flex items-center gap-2">
            <Workflow className="w-4 h-4 text-emerald-500" />
            Unified Interface
          </h4>
          <p className="text-zinc-500 text-sm">
            Run StagePort operations, publishing, and legal context from one
            motherboard.
          </p>
        </div>
        <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-2xl">
          <h4 className="text-zinc-300 text-sm mb-2 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-amber-500" />
            Module Packaging
          </h4>
          <p className="text-zinc-500 text-sm">
            Reframe shelf tools into StagePort modules with shared relay
            economics.
          </p>
        </div>
        <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-2xl">
          <h4 className="text-zinc-300 text-sm mb-2 flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-500" />
            Enterprise Demo
          </h4>
          <p className="text-zinc-500 text-sm">
            Stage a full-stack walkthrough for institutional conversion and
            licensing.
          </p>
        </div>
      </div>
    </div>
  );
};

const RosterView = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <header className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-2xl font-light text-zinc-100">The Roster</h2>
        <p className="text-zinc-500 text-sm">Asset Management</p>
      </div>
      <span className="text-zinc-600 text-xs uppercase tracking-wider">
        {DANCER_ROSTER.length} contracted
      </span>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {DANCER_ROSTER.map((dancer) => (
        <div
          key={dancer.id}
          className="group relative border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-600 transition-colors duration-300"
        >
          <div
            className={`h-48 w-full ${dancer.imageColor} opacity-50 mix-blend-overlay transition-opacity group-hover:opacity-70`}
          />
          <div className="absolute top-0 left-0 w-full h-full p-6 flex flex-col justify-between bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex justify-between items-start">
              <StatusBadge status={dancer.status} />
              <span className="text-zinc-400 text-xs font-mono">
                ID: {`00${dancer.id}`}
              </span>
            </div>
            <div>
              <h3 className="text-xl text-zinc-100 font-medium">
                {dancer.name}
              </h3>
              <p className="text-zinc-400 text-sm">
                {dancer.role} • {dancer.style}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SandboxView = () => {
  const [elements, setElements] = useState([
    { id: 1, x: 100, y: 100, label: "Seraphina", color: "bg-stone-400" },
    { id: 2, x: 200, y: 150, label: "Mercer", color: "bg-red-800" },
    { id: 3, x: 300, y: 100, label: "Vance", color: "bg-emerald-700" },
  ]);
  const [dragging, setDragging] = useState(null);
  const containerRef = useRef(null);

  const handlePointerDown = (event, id) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    setDragging({
      id,
      offset: {
        x: event.clientX - rect.left - rect.width / 2,
        y: event.clientY - rect.top - rect.height / 2,
      },
    });
  };

  const handlePointerMove = (event) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - 24 - dragging.offset.x;
    const y = event.clientY - rect.top - 24 - dragging.offset.y;

    setElements((prev) =>
      prev.map((element) =>
        element.id === dragging.id ? { ...element, x, y } : element,
      ),
    );
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <header className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-zinc-100">The Sandbox</h2>
          <p className="text-zinc-500 text-sm">
            Choreography & Spatial Planning
          </p>
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 border border-zinc-700 bg-zinc-900/50 relative overflow-hidden cursor-crosshair"
        onPointerMove={handlePointerMove}
        onPointerUp={() => setDragging(null)}
        onPointerLeave={() => setDragging(null)}
      >
        {elements.map((element) => (
          <div
            key={element.id}
            onPointerDown={(event) => handlePointerDown(event, element.id)}
            style={{ left: element.x, top: element.y }}
            className={`absolute w-12 h-12 rounded-full ${element.color} shadow-lg shadow-black/50 flex items-center justify-center cursor-move`}
          >
            <span className="text-[10px] text-white font-bold uppercase tracking-tighter truncate w-full text-center px-1 pointer-events-none">
              {element.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BalletBankView = () => {
  const deposits = [
    { date: "2026-02-01", memo: "Tuition flow", amount: 4200 },
    { date: "2026-02-03", memo: "Sponsor pledge", amount: 1500 },
    { date: "2026-02-05", memo: "Payroll out", amount: -4800 },
  ];

  const balance = deposits.reduce(
    (amount, deposit) => amount + deposit.amount,
    0,
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-light text-zinc-100 tracking-tight">
          Ballet Bank
        </h1>
        <p className="text-zinc-500 mt-2">
          Tickets of Time → auditable balance.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Current Balance"
          value={`$${balance.toLocaleString()}`}
          subtext="Draft"
        />
        <MetricCard label="Trust Allocation" value="10%" subtext="Config" />
        <MetricCard label="Next Deposit" value="$1,200" subtext="Forecast" />
      </div>
    </div>
  );
};

const CompanyView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <header className="mb-8">
      <h1 className="text-4xl font-light text-zinc-100 tracking-tight">
        The Ledger
      </h1>
      <p className="text-zinc-500 mt-2">Financial Reality.</p>
    </header>
    <div className="p-4 bg-amber-900/10 border border-amber-900/30 text-amber-500 text-sm">
      <AlertTriangle className="w-4 h-4 inline mr-2" />
      Warning: Cash flow projection indicates insolvency in 42 days without
      intervention.
    </div>
  </div>
);

export default function StudioPortal() {
  const [currentView, setCurrentView] = useState("reception");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wallet, setWallet] = useState({
    tier: "Gold",
    stagecoin: 2200,
    sentientCents: 980,
    streetcred: "42.8",
  });
  const [logs, setLogs] = useState([
    {
      id: 1,
      time: "08:41:02",
      type: "IDENTITY_CONTEXT",
      message: "Wallet tier synchronized: Gold evidence profile loaded.",
    },
    {
      id: 2,
      time: "08:41:11",
      type: "REMOTE_NODE",
      message: "Hardware provenance handshake complete.",
    },
  ]);

  const appendLog = (type, message) => {
    setLogs((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        time: new Date().toLocaleTimeString(),
        type,
        message,
      },
    ]);
  };

  const navItems = [
    {
      id: "reception",
      label: "Command Hub",
      icon: Activity,
      desc: "Identity-first overview",
    },
    {
      id: "paygait",
      label: "PayGait Engine",
      icon: Fingerprint,
      desc: "Batch ingest + relay bridge",
    },
    {
      id: "terminal",
      label: "Ops Terminal",
      icon: Terminal,
      desc: "Real-time audit stream",
    },
    {
      id: "ecosystem",
      label: "Ecosystem",
      icon: Workflow,
      desc: "Layered architecture",
    },
    { id: "roster", label: "Lead Dancers", icon: Users, desc: "Role metadata" },
    {
      id: "sandbox",
      label: "The Floor",
      icon: Move,
      desc: "Spatial rehearsal",
    },
    {
      id: "bank",
      label: "Ballet Bank",
      icon: Maximize2,
      desc: "Treasury state",
    },
    {
      id: "company",
      label: "The Ledger",
      icon: DollarSign,
      desc: "Risk envelope",
    },
  ];

  return (
    <div className="flex h-screen bg-black text-zinc-300 font-sans selection:bg-zinc-700 selection:text-white overflow-hidden">
      <aside className="hidden md:flex w-20 lg:w-72 flex-col border-r border-zinc-900 bg-zinc-950">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-zinc-900">
          <div className="w-8 h-8 bg-gradient-to-br from-zinc-100 to-zinc-600 rounded-sm rotate-45" />
          <span className="ml-4 font-bold tracking-widest text-zinc-100 hidden lg:block">
            STAGEPORT COMMAND HUB
          </span>
        </div>

        <div className="p-3">
          <WalletWidget wallet={wallet} />
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`text-left flex items-center p-3 rounded-md transition-all duration-200 ${currentView === item.id ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"}`}
            >
              <item.icon className="w-5 h-5 lg:mr-3" />
              <span className="hidden lg:block">
                <span className="text-sm font-medium tracking-wide block">
                  {item.label}
                </span>
                <span className="text-[10px] text-zinc-500">{item.desc}</span>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="md:hidden fixed top-0 w-full h-16 bg-zinc-950 border-b border-zinc-900 z-50 flex items-center justify-between px-4">
        <span className="font-bold tracking-widest text-zinc-100">
          STAGEPORT HUB
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-zinc-300"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/95 z-40 pt-20 px-8 md:hidden">
          <WalletWidget wallet={wallet} />
          <nav className="flex flex-col gap-6 mt-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center text-xl font-light ${currentView === item.id ? "text-white" : "text-zinc-500"}`}
              >
                <item.icon className="w-6 h-6 mr-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-24 pt-24 md:pt-12 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <div className="max-w-6xl mx-auto h-full">
            {currentView === "reception" && (
              <ReceptionView setView={setCurrentView} />
            )}
            {currentView === "paygait" && (
              <PayGaitView
                appendLog={appendLog}
                wallet={wallet}
                setWallet={setWallet}
              />
            )}
            {currentView === "terminal" && <TerminalView logs={logs} />}
            {currentView === "ecosystem" && <EcosystemMapView />}
            {currentView === "roster" && <RosterView />}
            {currentView === "sandbox" && <SandboxView />}
            {currentView === "bank" && <BalletBankView />}
            {currentView === "company" && <CompanyView />}
          </div>
        </div>
      </main>
    </div>
  );
}
