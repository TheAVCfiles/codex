import { useEffect, useState } from 'react';

type WitnessPayload = {
  artifact_id: string;
  mode: string;
};

export default function WitnessWindow({ token }: { token: string }) {
  const [state, setState] = useState<'loading' | 'open' | 'closed'>('loading');
  const [artifact, setArtifact] = useState<WitnessPayload | null>(null);

  useEffect(() => {
    fetch('/api/witness-redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setArtifact(data);
        setState('open');
      })
      .catch(() => setState('closed'));
  }, [token]);

  if (state === 'loading') return <div>Initializing access…</div>;
  if (state === 'closed') return <div>Access closed.</div>;

  return (
    <div style={{ background: '#050505', color: '#e5e5e5', minHeight: '100vh', padding: '32px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#9ca3af' }}>
          Witness Window
        </div>
        <h1 style={{ marginTop: 12 }}>Restricted Preview</h1>
        <p style={{ color: '#b3b3b3' }}>This view is time-bounded, non-export, and interaction-limited.</p>

        <div style={{ border: '1px solid #262626', borderRadius: 16, padding: 24, background: '#111' }}>
          <p>Artifact: {artifact?.artifact_id}</p>
          <p>Mode: {artifact?.mode}</p>
          <p>No source. No metrics. No notifications.</p>
        </div>

        <div style={{ marginTop: 20 }}>
          <button style={{ padding: '12px 16px', borderRadius: 12 }}>Request full access</button>
          <button style={{ padding: '12px 16px', borderRadius: 12, marginLeft: 12 }}>Commission adaptation</button>
        </div>
      </div>
    </div>
  );
}
