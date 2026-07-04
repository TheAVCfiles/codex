"use client";

import { useEffect, useState } from "react";
import { Activity, Landmark, Users, Move, DollarSign, Menu, X, Sparkles } from "lucide-react";
import ReceptionView from "@/components/ReceptionView";
import BalletBankView from "@/components/BalletBankView";
import RosterView from "@/components/RosterView";
import Sandbox3D from "@/components/Sandbox3D";
import CompanyView from "@/components/CompanyView";

export default function StudioPortal() {
  const [currentView, setCurrentView] = useState("reception");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const navItems = [
    { id: "reception", label: "Reception", icon: Activity },
    { id: "bank", label: "Ballet Bank", icon: Landmark },
    { id: "roster", label: "Roster", icon: Users },
    { id: "sandbox", label: "PyRouette Studio", icon: Move },
    { id: "company", label: "Ledger", icon: DollarSign },
  ];

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("view");
    if (v && navItems.some((n) => n.id === v)) setCurrentView(v);
  }, []);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-900 bg-zinc-950">
        <div className="h-20 flex items-center px-8 border-b border-zinc-900">
          <span className="font-playfair text-2xl font-light text-rose-400">StagePort</span>
        </div>
        <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                currentView === item.id ? "bg-zinc-800 text-white shadow-lg shadow-black/30" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-900 z-50 flex items-center justify-between px-4">
        <span className="font-playfair text-xl text-rose-400">StagePort</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/90 z-40 md:hidden pt-16">
          <nav className="p-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-4 text-xl py-4 border-b border-zinc-800 text-zinc-200"
              >
                <item.icon size={24} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {toast && (
        <div className="fixed top-4 right-4 z-[60] bg-emerald-900/90 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl text-sm backdrop-blur-md flex items-center gap-3 shadow-2xl">
          <Sparkles size={18} />
          {toast}
        </div>
      )}

      <main className="flex-1 overflow-auto p-6 md:p-12 pt-20 md:pt-12">
        {currentView === "reception" && <ReceptionView setView={setCurrentView} />}
        {currentView === "bank" && <BalletBankView onNotify={notify} />}
        {currentView === "roster" && <RosterView />}
        {currentView === "sandbox" && <Sandbox3D onNotify={notify} />}
        {currentView === "company" && <CompanyView />}
      </main>
    </div>
  );
}
