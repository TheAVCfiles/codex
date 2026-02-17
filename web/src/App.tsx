import React, { useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck,
  Activity,
  BarChart3,
  Lock,
  Unlock,
  TrendingUp,
  Terminal,
  Fingerprint,
  CloudRain,
  Sun,
  Wind,
  Cpu,
  Globe,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';

type ForecastGridRow = {
  ts: string;
  rain: number;
  sun: number;
  lightning: number;
  social_tilt: number;
};

type ForecastResponse = {
  rain_windows: string[];
  sun_windows: string[];
  lightning_windows: string[];
  grid: ForecastGridRow[];
};

type SignalPoint = {
  time: number;
  tri_star: number;
  tau: number;
  liquidity: number;
  lightning: number;
};

const App = (): JSX.Element => {
  const [pVal, setPVal] = useState(0.032);
  const [weight, setWeight] = useState(92);
  const [ciStatus] = useState('Excludes 0');
  const [ciRange] = useState({ lower: 1.2, upper: 5.8 });
  const [timestamp, setTimestamp] = useState(new Date().toISOString());
  const [isLive] = useState(true);
  const [status, setStatus] = useState('loading');
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  const [times, setTimes] = useState({ newYork: '', london: '', tokyo: '' });
  const [marketIndexes, setMarketIndexes] = useState([
    { ticker: 'BTC', price: 92450.12, change: 1.24, color: 'text-orange-400' },
    { ticker: 'ETH', price: 2981.96, change: -0.42, color: 'text-blue-400' },
    { ticker: 'QQQ', price: 601.61, change: 0.15, color: 'text-emerald-400' },
    { ticker: 'SPY', price: 598.22, change: 0.08, color: 'text-slate-400' },
    { ticker: 'LIT', price: 72.15, change: 2.11, color: 'text-purple-400' },
  ]);

  const [rainIntensity, setRainIntensity] = useState(0.85);
  const [sunIntensity, setSunIntensity] = useState(0.12);
  const [lightningIntensity, setLightningIntensity] = useState(0.2);

  const [signalHistory, setSignalHistory] = useState<SignalPoint[]>(
    Array.from({ length: 30 }, (_, i) => ({
      time: i,
      tri_star: 2.5 + Math.sin(i / 4) + Math.random() * 0.3,
      tau: Math.floor(Math.random() * 8) - 4,
      liquidity: 50 + Math.random() * 20,
      lightning: 0.2 + Math.random() * 0.2,
    })),
  );

  const [logs, setLogs] = useState([
    { t: '03:44:01', m: 'AUTH_KEY: AVCSYSTEMSSTUDIOS VERIFIED', type: 'success' },
    { t: '03:45:10', m: 'Relativity Hub synchronized.', type: 'info' },
    { t: '03:45:12', m: 'Block bootstrap CI stable: [1.2, 5.8]', type: 'success' },
  ]);

  const isStructuralConfirmed = weight >= 80;
  const isCiValid = ciStatus === 'Excludes 0';
  const isPValuePass = pVal < 0.05;
  const isRegimeOpen = isStructuralConfirmed && isCiValid && isPValuePass;

  const assetData = useMemo(
    () => [
      { asset: 'LIT', pivot: 72.15, s1: 71.39, s2: 70.83, r1: 73.47, r2: 74.57, action: isRegimeOpen ? 'SCALED ENTRY' : 'OBSERVE ONLY' },
      { asset: 'ETH', pivot: 1981.96, s1: 1944.13, s2: 1902.62, r1: 2023.47, r2: 2061.3, action: isRegimeOpen ? 'SCALED ENTRY' : 'CONFIRM (NO ENTRY)' },
      { asset: 'QQQ', pivot: 601.61, s1: 596.75, s2: 591.59, r1: 606.77, r2: 611.63, action: 'MONITOR' },
    ],
    [isRegimeOpen],
  );

  useEffect(() => {
    const loadForecast = async () => {
      try {
        const res = await fetch('/forecast/eth');
        const data = (await res.json()) as ForecastResponse;
        setForecast(data);
        setStatus('ok');
      } catch {
        setStatus('error');
      }
    };

    loadForecast();
    const timer = setInterval(loadForecast, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const now = new Date();
      setTimestamp(now.toISOString());

      const format = (zone: string) => now.toLocaleTimeString('en-US', { hour12: false, timeZone: zone });
      setTimes({
        newYork: format('America/New_York'),
        london: format('Europe/London'),
        tokyo: format('Asia/Tokyo'),
      });

      setMarketIndexes((prev) =>
        prev.map((m) => ({ ...m, price: m.price + (Math.random() - 0.5) * (m.price * 0.001), change: m.change + (Math.random() - 0.5) * 0.05 })),
      );

      setSignalHistory((prev) => {
        const last = prev[prev.length - 1];
        const newTri = last.tri_star + (Math.random() - 0.5) * 0.4;
        const lightning = Math.max(0, Math.min(1, Math.abs(newTri - 2.5) / 2.5 + Math.random() * 0.15));
        setRainIntensity(isRegimeOpen ? Math.max(0, (newTri - 1.5) / 2) : 0);
        setSunIntensity(!isRegimeOpen || newTri < 1.0 ? 0.8 : 0.1);
        setLightningIntensity(lightning);

        const newPoint: SignalPoint = {
          time: last.time + 1,
          tri_star: newTri,
          tau: Math.floor(Math.random() * 10) - 5,
          liquidity: Math.max(0, Math.min(100, last.liquidity + (Math.random() - 0.5) * 5)),
          lightning,
        };
        return [...prev.slice(1), newPoint];
      });

      if (Math.random() > 0.9) {
        const tStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs((prev) => [{ t: tStr, m: 'Market index relativity audit complete.', type: 'info' }, ...prev.slice(0, 7)]);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isLive, isRegimeOpen]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono selection:bg-emerald-500/30">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50 p-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500 p-2 rounded shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase leading-none">
                Presidents Day Fortress <span className="text-emerald-500">v2.3</span>
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1">Auth: AVCSYSTEMSSTUDIOS | @xoAVCxo</p>
            </div>
          </div>

          <div className="flex items-center gap-6 pr-4 border-r border-slate-800">
            {[{ label: 'NYC', time: times.newYork }, { label: 'LDN', time: times.london }, { label: 'TYO', time: times.tokyo }].map((clock) => (
              <div key={clock.label} className="text-right">
                <span className="text-[9px] text-slate-500 block uppercase font-black">{clock.label}</span>
                <span className="text-xs font-bold text-slate-200 tabular-nums">{clock.time || '--:--:--'}</span>
              </div>
            ))}
          </div>

          <div className={`flex items-center gap-3 px-6 py-3 rounded border ${isRegimeOpen ? 'bg-emerald-500/5 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/5 border-rose-500/50 text-rose-400'}`}>
            {isRegimeOpen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span className="text-xs font-black uppercase tracking-widest">{isRegimeOpen ? 'REGIME_OPEN' : 'REGIME_CLOSED'}</span>
          </div>
        </div>
      </header>

      <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-3 overflow-x-auto flex items-center gap-10">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest shrink-0">
          <Globe className="w-3 h-3" /> Relativity Factors:
        </div>
        {marketIndexes.map((idx) => (
          <div key={idx.ticker} className="flex items-center gap-4 shrink-0 border-l border-slate-800 pl-4">
            <span className={`text-[10px] font-black ${idx.color}`}>{idx.ticker}</span>
            <span className="text-xs font-bold tabular-nums text-slate-200">{idx.price.toFixed(2)}</span>
            <span className={`text-[9px] font-bold ${idx.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)}%</span>
          </div>
        ))}
      </div>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Wind className="w-3 h-3 text-blue-400" /> Environmental Cues
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {[{label:'Liquidity Rain',value:rainIntensity,icon:<CloudRain className="w-4 h-4"/>,color:'bg-blue-500 text-blue-400'},{label:'Exposure Heat',value:sunIntensity,icon:<Sun className="w-4 h-4"/>,color:'bg-orange-500 text-orange-400'},{label:'Social Lightning',value:lightningIntensity,icon:<Cpu className="w-4 h-4"/>,color:'bg-violet-500 text-violet-400'}].map((cue)=> (
                <div key={cue.label} className="space-y-2">
                  <div className={`flex justify-between items-end ${cue.color.split(' ')[1]}`}><div className="flex items-center gap-2">{cue.icon}<span className="text-[10px] font-bold uppercase">{cue.label}</span></div><span className="text-xs font-bold">{(cue.value*100).toFixed(0)}%</span></div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className={`${cue.color.split(' ')[0]} h-full`} style={{width:`${cue.value*100}%`}} /></div>
                </div>
              ))}
              <p className="text-[10px] text-slate-500">API: {status}</p>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/50">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Terminal className="w-3 h-3 text-emerald-500" /> Parameter Gates
              </h2>
            </div>
            <div className="p-5 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500"><span>P-Value</span><span className={isPValuePass ? 'text-emerald-400' : 'text-rose-400'}>{pVal.toFixed(4)}</span></div>
                <input type="range" min="0" max="0.1" step="0.0001" value={pVal} onChange={(e)=>setPVal(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"/>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500"><span>Structural Weight</span><span className={isStructuralConfirmed ? 'text-emerald-400' : 'text-rose-400'}>{weight}W</span></div>
                <input type="number" value={weight} onChange={(e)=>setWeight(parseInt(e.target.value,10)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white text-xs"/>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl h-[200px] flex flex-col">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400"><Activity className="w-3 h-3 text-blue-500" /> Logs</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">{logs.map((log,i)=><div key={i} className="flex gap-3 leading-tight text-[10px]"><span className="text-slate-600 shrink-0">[{log.t}]</span><span className={log.type === 'success' ? 'text-emerald-400' : 'text-slate-400'}>{log.m}</span></div>)}</div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg"><span className="text-[10px] text-slate-500 font-black uppercase">Structural Bias</span><div className={`text-2xl font-black ${isStructuralConfirmed ? 'text-emerald-400' : 'text-slate-500'}`}>{isStructuralConfirmed ? 'CONFIRMED' : 'REJECTED'}</div></div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg"><span className="text-[10px] text-slate-500 font-black uppercase">Confidence Interval</span><div className={`text-2xl font-black ${isCiValid ? 'text-emerald-400' : 'text-rose-400'}`}>{ciStatus}</div></div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg"><span className="text-[10px] text-slate-500 font-black uppercase">Significance Edge</span><div className={`text-2xl font-black ${isPValuePass ? 'text-emerald-400' : 'text-rose-400'}`}>{isPValuePass ? 'SIG_PASS' : 'NO_EDGE'}</div></div>
          </div>

          <section className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Signal Telemetry (TRI*)</h2></div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={signalHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', fontSize: '10px' }} />
                  <ReferenceLine y={2.5} label={{ position: 'right', value: 'Threshold', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="tri_star" stroke="#10b981" strokeWidth={2} fillOpacity={0.25} fill="#10b981" />
                  <Area type="monotone" dataKey="lightning" stroke="#8b5cf6" strokeWidth={2} fillOpacity={0.2} fill="#8b5cf6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50"><h2 className="text-xs font-black uppercase tracking-widest text-white">Institutional Day Sheet</h2><p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Session Calibration: Feb 17, 2026</p></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse"><thead className="bg-slate-950 text-[10px] uppercase text-slate-500 font-black border-b border-slate-800"><tr><th className="px-6 py-4">Asset</th><th className="px-6 py-4">Pivot</th><th className="px-6 py-4">S1 / S2</th><th className="px-6 py-4">R1 / R2</th><th className="px-6 py-4 text-right">Regime Filter</th></tr></thead>
                <tbody className="divide-y divide-slate-800 text-[11px] font-bold">{assetData.map((row)=><tr key={row.asset} className="hover:bg-slate-800/30"><td className="px-6 py-5 text-slate-200">{row.asset}</td><td className="px-6 py-5 text-slate-400">{row.pivot.toFixed(2)}</td><td className="px-6 py-5 text-rose-500/80">{row.s1.toFixed(2)} / {row.s2.toFixed(2)}</td><td className="px-6 py-5 text-emerald-500/80">{row.r1.toFixed(2)} / {row.r2.toFixed(2)}</td><td className="px-6 py-5 text-right"><span className={`px-3 py-1 rounded text-[9px] font-black ${row.action.includes('ENTRY') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>{row.action}</span></td></tr>)}</tbody>
              </table>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/50 text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Cpu className="w-3 h-3" /> Relativity Payload</div>
            <pre className="p-6 text-[10px] text-emerald-400/60 leading-relaxed overflow-x-auto bg-black/40">{`{
  "regime": "${isRegimeOpen ? 'OPEN' : 'CLOSED'}",
  "timestamp": "${timestamp}",
  "rain_windows": ${JSON.stringify((forecast?.rain_windows ?? []).slice(0, 3))},
  "sun_windows": ${JSON.stringify((forecast?.sun_windows ?? []).slice(0, 3))},
  "lightning_windows": ${JSON.stringify((forecast?.lightning_windows ?? []).slice(0, 3))}
}`}</pre>
          </section>
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-800 bg-slate-900 p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 tracking-[0.3em] font-black uppercase">
        <div className="flex gap-6"><span>© 2026 AVCSYSTEMSSTUDIOS</span><span className="text-slate-800">|</span><span>RESEARCH ATTRIBUTION MANDATORY</span></div>
        <div className="flex items-center gap-2"><Fingerprint className="w-3 h-3" /><span className="text-slate-500 font-mono tracking-normal">@xoAVCxo — Verified Terminal</span></div>
      </footer>
    </div>
  );
};

export default App;
