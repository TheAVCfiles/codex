import React, { useEffect, useRef, useState } from 'react';
import {
  ShieldCheck,
  Activity,
  Database,
  FileText,
  AlertOctagon,
  Settings,
  Users,
  LayoutDashboard,
  Cpu,
  HardDrive,
  Download,
  Radar,
  Server,
  CheckCircle2,
} from 'lucide-react';

const generateHash = () =>
  `0x${Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`;
const getTime = () => new Date().toISOString().split('T')[1].slice(0, 8);

export default function AVCSingularityOS() {
  const [systemMode, setSystemMode] = useState('NOMINAL');
  const [telemetry, setTelemetry] = useState({ vz: 0.12, az: -0.05, phat: 99 });
  const [operatorLoad, setOperatorLoad] = useState(12);
  const [ledger, setLedger] = useState([]);
  const [koiQueue, setKoiQueue] = useState({ pending: 0, processed: 1420844 });
  const [activeIncident, setActiveIncident] = useState(null);
  const [showExtraction, setShowExtraction] = useState(false);

  const engineRef = useRef(null);
  const daemonRef = useRef(null);

  useEffect(() => {
    engineRef.current = setInterval(() => {
      if (systemMode === 'THRESHOLD_BREACH' || systemMode === 'LOCKOUT') return;

      setTelemetry((prev) => {
        let conf = prev.phat;
        if (Math.random() > 0.92) conf = Math.max(45, conf - 25);
        else conf = Math.min(99, conf + 5);

        return {
          vz: Number.parseFloat((Math.random() * 0.4).toFixed(2)),
          az: Number.parseFloat(((Math.random() * 0.2) - 0.1).toFixed(2)),
          phat: conf,
        };
      });

      setOperatorLoad((prev) => Math.max(0, prev - 3));
    }, 1000);

    return () => clearInterval(engineRef.current);
  }, [systemMode]);

  useEffect(() => {
    daemonRef.current = setInterval(() => {
      setKoiQueue((prev) => {
        if (prev.pending <= 0) return prev;
        const processedNow = Math.min(prev.pending, Math.floor(Math.random() * 3) + 1);
        return { ...prev, pending: prev.pending - processedNow, processed: prev.processed + processedNow };
      });
    }, 2000);

    return () => clearInterval(daemonRef.current);
  }, []);

  const appendLedger = (type, detail, status, isIncident = false) => {
    const entry = {
      id: `EVT-${Math.floor(Math.random() * 90000) + 10000}`,
      time: getTime(),
      type,
      detail,
      hash: generateHash(),
      status,
    };

    setLedger((prev) => [entry, ...prev].slice(0, 10));
    setKoiQueue((prev) => ({ ...prev, pending: prev.pending + 1 }));

    if (isIncident) {
      setActiveIncident({
        id: `INC-${Date.now().toString().slice(-6)}`,
        time: getTime(),
        hash: entry.hash,
      });
    }
  };

  const simulateNoise = () => {
    setTelemetry((prev) => ({ ...prev, phat: 35 }));
    appendLedger('MESH_REJECTION', 'Telemetry dropped. Confidence < 82%.', 'REJECTED');
  };

  const simulatePanic = () => {
    setOperatorLoad((prev) => {
      const next = prev + 45;
      if (next >= 100) {
        setSystemMode('LOCKOUT');
        appendLedger('SOMATIC_GOVERNANCE', 'Operator overwhelm detected. Console locked.', 'THROTTLED');
        return 100;
      }
      return next;
    });
  };

  const triggerRupture = () => {
    if (systemMode === 'LOCKOUT') return;

    setSystemMode('THRESHOLD_BREACH');
    setTelemetry({ vz: 3.84, az: 2.15, phat: 96 });
    setOperatorLoad(100);

    appendLedger('KINEMATIC_BREACH', 'VZ/AZ thresholds exceeded. Elastic deadline engaged.', 'CRITICAL', true);

    setTimeout(() => {
      setSystemMode('LOCKOUT');
      appendLedger('INCIDENT_VAULTED', 'Payload locked to Sovereign Ledger. Modifying access revoked.', 'IMMUTABLE');
    }, 1200);
  };

  const resetSystem = () => {
    setSystemMode('NOMINAL');
    setOperatorLoad(0);
    setActiveIncident(null);
    setShowExtraction(false);
    appendLedger('SYSTEM_RESET', 'Sojourner baseline re-established.', 'VERIFIED');
  };

  const StatusPill = ({ status }) => {
    const colors = {
      VERIFIED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      REJECTED: 'bg-amber-100 text-amber-700 border-amber-200',
      CRITICAL: 'bg-red-100 text-red-700 border-red-200 animate-pulse',
      THROTTLED: 'bg-purple-100 text-purple-700 border-purple-200',
      IMMUTABLE: 'bg-slate-800 text-emerald-400 border-slate-700',
    };

    return (
      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${colors[status] || 'bg-slate-100'}`}>
        {status}
      </span>
    );
  };

  return <div className="min-h-screen bg-slate-50 p-8">Component scaffold ready ({ledger.length} events).</div>;
}
