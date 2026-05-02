import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Activity,
  FileText,
  Gavel,
  Cpu,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  Database,
  Download,
  Users,
  LayoutDashboard,
  Search,
  Bell,
} from 'lucide-react';

const COLORS = {
  navy: '#001F3F',
  gold: '#D4AF37',
  dark: '#020617',
  panel: '#0f172a',
  red: '#ef4444',
  green: '#10b981',
};

const generateHash = () => {
  const chars = '0123456789abcdef';
  return `0x${Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`;
};

const getIsoTime = () => new Date().toISOString().split('T')[1].slice(0, 11);
const getLocalTime = () =>
  new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    fractionalSecondDigits: 2,
  });

export function AVCSynthesisConsole() {
  const [systemState, setSystemState] = useState('NOMINAL');
  const [metrics, setMetrics] = useState({ vz: 0.42, az: -0.15, phat: 0.98 });
  const [ledger, setLedger] = useState([]);
  const [blockCount, setBlockCount] = useState(14208);
  const [logs, setLogs] = useState([
    { ts: getIsoTime(), msg: 'System armed. Zero-Trust Ingestion active.', type: 'info' },
    { ts: getIsoTime(), msg: 'Sojourner baseline established. Hashing active.', type: 'info' },
  ]);
  const [somaticLoad, setSomaticLoad] = useState(0);
  const [throttleActive, setThrottleActive] = useState(false);
  const [showDefenseModal, setShowDefenseModal] = useState(false);

  const engineRef = useRef(null);
  const panicDecayRef = useRef(null);

  const addLog = useCallback((msg, type = 'info') => {
    setLogs((prev) => [{ ts: getIsoTime(), msg, type }, ...prev].slice(0, 15));
  }, []);

  const addLedgerEntry = useCallback((status, color) => {
    setLedger((prev) => [{ ts: getIsoTime(), hash: generateHash(), status, color }, ...prev].slice(0, 8));
    setBlockCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    engineRef.current = setInterval(() => {
      if (systemState === 'ANOMALY') return;
      setMetrics((prev) => {
        let newPhat = prev.phat;
        if (Math.random() > 0.9) newPhat = Math.max(0.6, newPhat - 0.15);
        else newPhat = Math.min(0.99, newPhat + 0.05);
        if (newPhat < 0.82) {
          addLog('DEGRADED_TELEMETRY: Confidence threshold breached. Data flagged.', 'warn');
        }
        return {
          vz: Number((Math.random() * 0.8 + 0.1).toFixed(2)),
          az: Number(((Math.random() * 0.4) - 0.2).toFixed(2)),
          phat: Number(newPhat.toFixed(2)),
        };
      });
      if (Math.random() > 0.7) addLedgerEntry('VERIFIED', COLORS.green);
    }, 800);
    return () => clearInterval(engineRef.current);
  }, [systemState, addLog, addLedgerEntry]);

  useEffect(() => {
    panicDecayRef.current = setInterval(() => {
      setSomaticLoad((prev) => {
        const next = Math.max(0, prev - 5);
        if (next < 80 && throttleActive) setThrottleActive(false);
        return next;
      });
    }, 500);
    return () => clearInterval(panicDecayRef.current);
  }, [throttleActive]);

  const simulateLiabilityEvent = useCallback(() => {
    if (throttleActive) {
      addLog('EXECUTION DENIED: Operator Somatic Overwhelm. System locked.', 'danger');
      return;
    }
    setSystemState('ANOMALY');
    setMetrics({ vz: 3.84, az: 2.15, phat: 0.94 });
    addLog('KINEMATIC ANOMALY DETECTED. VZ/AZ threshold breached.', 'danger');
    addLog('OSHA limit exceeded. Possible structural failure or fall.', 'warn');
    setTimeout(() => addLedgerEntry('INCIDENT_LOCKED', COLORS.red), 400);
    setTimeout(() => {
      addLog('INCIDENT HASHED AND COMMITTED TO VAULT. DATA IMMUTABLE.', 'danger');
      setSystemState('LOCKED');
    }, 1000);
  }, [throttleActive, addLog, addLedgerEntry]);

  return <div className="p-4 text-slate-200">AVC Synthesis Console loaded: {systemState} ({ledger.length} entries)</div>;
}

export default function AVCEnterpriseDashboard() {
  const [telemetry, setTelemetry] = useState({ vz: 0.42, az: -0.15, confidence: 98 });
  const [operatorLoad, setOperatorLoad] = useState(24);
  const [isThrottled, setIsThrottled] = useState(false);
  const [ledger, setLedger] = useState([]);
  const [totalHashes, setTotalHashes] = useState(1420844);
  const [activeIncident, setActiveIncident] = useState(null);
  const engineRef = useRef(null);

  useEffect(() => {
    engineRef.current = setInterval(() => {
      if (activeIncident) return;
      setTelemetry((prev) => {
        let conf = prev.confidence;
        if (Math.random() > 0.95) conf = Math.max(60, conf - 15);
        else conf = Math.min(99, conf + 5);
        return {
          vz: Number((Math.random() * 0.8 + 0.1).toFixed(2)),
          az: Number(((Math.random() * 0.4) - 0.2).toFixed(2)),
          confidence: conf,
        };
      });
      setLedger((prev) => {
        const entry = {
          id: `EVT-${Math.floor(Math.random() * 100000)}`,
          time: getLocalTime(),
          hash: generateHash(),
          status: telemetry.confidence < 82 ? 'REJECTED_DEGRADED' : 'VERIFIED',
        };
        setTotalHashes((h) => h + 1);
        return [entry, ...prev].slice(0, 6);
      });
    }, 1000);
    return () => clearInterval(engineRef.current);
  }, [activeIncident, telemetry.confidence]);

  const triggerLiabilityIncident = () => {
    if (isThrottled) return;
    setTelemetry({ vz: 3.84, az: 2.15, confidence: 96 });
    setActiveIncident({ id: `INC-${Date.now().toString().slice(-6)}`, type: 'Kinematic Threshold Breach (OSHA-1910)', time: getLocalTime() });
  };

  return <div className="p-4">AVC Enterprise Dashboard: {totalHashes.toLocaleString()} hashes</div>;
}
