export type ThresholdAlert = {
  org?: string;
  actor?: string;
  prev: string;
  stage: string;
  timestamp: number;
  hash: string;
};

export async function triggerThresholdAlert(entry: ThresholdAlert): Promise<{ ok: boolean; suppressed?: boolean; status?: number; error?: string }> {
  const webhookUrl = import.meta.env.VITE_ALERT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('Alert suppressed: VITE_ALERT_WEBHOOK_URL not set.');
    return { ok: false, suppressed: true };
  }

  const payload = {
    text: '🚨 STATE ESCALATION DETECTED',
    attachments: [
      {
        color: '#7F1D1D',
        fields: [
          { title: 'Organization', value: entry.org ?? 'Unknown', short: true },
          { title: 'Actor', value: entry.actor ?? 'Unknown', short: true },
          { title: 'Transition', value: `${entry.prev} → ${entry.stage}`, short: false },
          { title: 'Proof Hash', value: entry.hash ?? '(missing)', short: false },
          { title: 'Timestamp', value: new Date(entry.timestamp).toISOString(), short: false },
        ],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('Alert dispatch failed:', res.status, text);
      return { ok: false, status: res.status };
    }

    console.log('External alert dispatched.');
    return { ok: true };
  } catch (err) {
    console.error('Alert dispatch error:', err);
    return { ok: false, error: String(err) };
  }
}
