# Choreography Portal React Snippet

This file captures the provided React prototype snippet for future extraction into a full component module.

```jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Users,
  Layout,
  Activity,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Menu,
  X,
  Move,
  Maximize2,
  CreditCard,
  Landmark,
  Play,
  Pause,
  Save,
  Music,
  Clock,
  ChevronRight,
  ChevronLeft,
  Plus,
  SkipBack,
  SkipForward,
  Timer,
  Search,
} from "lucide-react";

// --- Mock Data ---

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
  upcomingShows: 2,
  studioUtilization: 68,
};

// --- Components ---

const StatusBadge = ({ status }) => {
  const colors = {
    Active: "text-emerald-400 border-emerald-400 bg-emerald-400/10",
    Injured: "text-red-500 border-red-500 bg-red-500/10",
    Probation: "text-amber-500 border-amber-500 bg-amber-500/10",
    Recovering: "text-blue-400 border-blue-400 bg-blue-400/10",
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

const LabanControl = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] uppercase text-zinc-500 font-mono tracking-wider">
      {label}
    </span>
    <div className="flex bg-zinc-950 border border-zinc-800 rounded overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 py-2 lg:py-1 text-[10px] uppercase transition-colors active:bg-zinc-800 ${
            value === opt
              ? "bg-zinc-700 text-white font-medium"
              : "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

// ...remaining snippet omitted for brevity in this archival file.
```
