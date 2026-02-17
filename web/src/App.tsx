import React, { useEffect, useState } from 'react';

type ForecastResponse = {
  rain_windows: string[];
  sun_windows: string[];
};

export function App(): JSX.Element {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [status, setStatus] = useState<string>('loading');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/forecast/eth');
        const data = (await res.json()) as ForecastResponse;
        setForecast(data);
        setStatus('ok');
      } catch {
        setStatus('error');
      }
    };

    load();
    const timer = setInterval(load, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>PRIMA Fortress Dashboard</h1>
      <p>API status: {status}</p>
      <section>
        <h2>Next Rain Windows (≥ 70%)</h2>
        <ul>
          {(forecast?.rain_windows ?? []).slice(0, 5).map((w) => (
            <li key={`rain-${w}`}>{new Date(w).toLocaleString()}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Next Sun Windows (≥ 70%)</h2>
        <ul>
          {(forecast?.sun_windows ?? []).slice(0, 5).map((w) => (
            <li key={`sun-${w}`}>{new Date(w).toLocaleString()}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
