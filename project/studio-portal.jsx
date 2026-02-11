import React, { useState, useRef } from "react";
import {
  Users,
  Layout,
  Activity,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Menu,
  X,
  Move,
  Maximize2,
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
  {
    id: 5,
    name: "K. Thorne",
    role: "Soloist",
    status: "Active",
    condition: 95,
    style: "Avant-Garde",
    imageColor: "bg-purple-900",
  },
  {
    id: 6,
    name: "M. Graves",
    role: "Apprentice",
    status: "Active",
    condition: 82,
    style: "Commercial",
    imageColor: "bg-amber-900",
  },
];

const COMPANY_STATS = {
  monthlyBurn: 12500,
  revenue: 10200,
  daysRunway: 42,
  activeInjuries: 3,
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

const startCheckout = async () => {
  const res = await fetch("/api/stripe/create-checkout-session", {
    method: "POST",
  });
  const data = await res.json();
  if (data?.url) {
    window.location.href = data.url;
  }
};

const ReceptionView = ({ setView }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <header className="mb-8">
      <h1 className="text-4xl font-light text-zinc-100 tracking-tight">
        The Portal
      </h1>
      <p className="text-zinc-500 mt-2">
        Operational Overview. {new Date().toLocaleDateString()}
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

    <div className="flex flex-wrap gap-3">
      <button
        onClick={() =>
          window.open(
            "https://gumroad.com/l/idol-energy-confidence-kit",
            "_blank",
            "noopener,noreferrer",
          )
        }
        className="px-4 py-3 border border-zinc-700 hover:bg-zinc-900 transition-colors"
      >
        Buy Idol Energy Kit — $39
      </button>
      <button
        onClick={startCheckout}
        className="px-4 py-3 border border-zinc-700 hover:bg-zinc-900 transition-colors"
      >
        Subscribe — StudioOS + Ballet Bank • $497/mo
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="lg:col-span-2 border border-zinc-800 p-6 bg-zinc-900/30">
        <h2 className="text-zinc-400 text-sm uppercase tracking-widest mb-6">
          Upcoming Actions
        </h2>
        <ul className="space-y-4">
          <li className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <span className="text-zinc-300">Lease Renewal Negotiation</span>
            <span className="text-xs text-red-400">Due in 3 days</span>
          </li>
          <li className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <span className="text-zinc-300">Physio Evaluation: J. Mercer</span>
            <span className="text-xs text-zinc-500">Tomorrow</span>
          </li>
          <li className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <span className="text-zinc-300">Gala Fundraiser Planning</span>
            <span className="text-xs text-zinc-500">Pending</span>
          </li>
        </ul>
      </div>

      <div
        className="border border-zinc-800 p-6 bg-zinc-900/30 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-zinc-800/50 transition-colors"
        onClick={() => setView("sandbox")}
      >
        <Layout className="w-12 h-12 text-zinc-600 mb-4" />
        <h3 className="text-zinc-200 font-medium">Enter Sandbox</h3>
        <p className="text-zinc-500 text-sm mt-2">
          Visualize floor plans & choreography
        </p>
      </div>
    </div>
  </div>
);

const RosterView = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <header className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-2xl font-light text-zinc-100">The Roster</h2>
        <p className="text-zinc-500 text-sm">Asset Management</p>
      </div>
      <div className="text-right">
        <span className="text-3xl text-zinc-100 font-light">
          {DANCER_ROSTER.length}
        </span>
        <span className="text-zinc-600 text-xs uppercase tracking-wider block">
          Total Contracted
        </span>
      </div>
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

  const handlePointerUp = () => setDragging(null);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <header className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-zinc-100">The Sandbox</h2>
          <p className="text-zinc-500 text-sm">
            Choreography & Spatial Planning
          </p>
        </div>
        <div className="text-xs text-zinc-500">
          Drag dots to position assets
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 border border-zinc-700 bg-zinc-900/50 relative overflow-hidden cursor-crosshair"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          backgroundImage:
            "radial-gradient(circle, #3f3f46 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-800 pointer-events-none" />
        <div className="absolute top-0 left-1/2 h-full w-px bg-zinc-800 pointer-events-none" />

        {elements.map((element) => (
          <div
            key={element.id}
            onPointerDown={(event) => handlePointerDown(event, element.id)}
            style={{ left: element.x, top: element.y }}
            className={`absolute w-12 h-12 rounded-full ${element.color} shadow-lg shadow-black/50 flex items-center justify-center cursor-move hover:scale-110 transition-transform z-10`}
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
      <header className="mb-2">
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

      <div className="border border-zinc-800 bg-zinc-950 p-6">
        <h3 className="text-zinc-400 uppercase text-xs tracking-widest mb-4">
          Recent Activity
        </h3>
        <div className="space-y-2 font-mono text-sm">
          {deposits.map((deposit) => (
            <div
              key={`${deposit.date}-${deposit.memo}`}
              className="flex justify-between py-2 border-b border-zinc-900"
            >
              <span className="text-zinc-500">{deposit.date}</span>
              <span className="text-zinc-300">{deposit.memo}</span>
              <span
                className={
                  deposit.amount < 0 ? "text-red-400" : "text-emerald-400"
                }
              >
                {deposit.amount < 0
                  ? `($${Math.abs(deposit.amount).toLocaleString()})`
                  : `$${deposit.amount.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-emerald-900/10 border border-emerald-900/30 text-emerald-400 text-sm">
        <CheckCircle className="w-4 h-4 inline mr-2" />
        Bank tab is live. Next: connect this feed to real receipts (Stripe +
        ledger API).
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

  const navItems = [
    { id: "reception", label: "Reception", icon: Activity },
    { id: "roster", label: "Lead Dancers", icon: Users },
    { id: "sandbox", label: "The Floor", icon: Move },
    { id: "bank", label: "Ballet Bank", icon: Maximize2 },
    { id: "company", label: "The Ledger", icon: DollarSign },
  ];

  return (
    <div className="flex h-screen bg-black text-zinc-300 font-sans selection:bg-zinc-700 selection:text-white overflow-hidden">
      <aside className="hidden md:flex w-20 lg:w-64 flex-col border-r border-zinc-900 bg-zinc-950">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-zinc-900">
          <div className="w-8 h-8 bg-zinc-100 rounded-sm rotate-45" />
          <span className="ml-4 font-bold tracking-widest text-zinc-100 hidden lg:block">
            STUDIO.OS
          </span>
        </div>
        <nav className="flex-1 py-8 flex flex-col gap-2 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center p-3 rounded-md transition-all duration-200 ${
                currentView === item.id
                  ? "bg-zinc-800 text-white shadow-lg"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              <item.icon className="w-5 h-5 lg:mr-3" />
              <span className="hidden lg:block text-sm font-medium tracking-wide">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="md:hidden fixed top-0 w-full h-16 bg-zinc-950 border-b border-zinc-900 z-50 flex items-center justify-between px-4">
        <span className="font-bold tracking-widest text-zinc-100">
          STUDIO.OS
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
          <nav className="flex flex-col gap-6">
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
