import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

type ScoreInput = {
  title: string;
  body: string;
  labels: string[];
};

function computeScores(input: ScoreInput) {
  const text = `${input.title}\n${input.body}`.toLowerCase();

  const intensity = (text.match(/must|now|urgent|critical|deploy|launch|public|witness|fund|sale/g) || [])
    .length * 8;

  const clarity = (text.match(/system|workflow|schema|deploy|operator|ledger|report|demo/g) || []).length * 7;

  const market = (text.match(/buyer|enterprise|pilot|license|pricing|install|demo|report/g) || []).length * 9;

  const timeliness = (text.match(/right now|this week|today|launch|current|public/g) || []).length * 12;

  const leakRisk =
    (text.match(/compiler|core code|internal language|token issuance|authority rules|prompt/g) || []).length *
    14;

  const raw = Math.min(100, intensity + clarity + market + timeliness) - Math.min(60, leakRisk);

  let releaseState: 'public_now' | 'gated_preview' | 'private_hold' = 'private_hold';
  if (raw >= 75 && leakRisk < 20) releaseState = 'public_now';
  else if (raw >= 45) releaseState = 'gated_preview';

  return {
    intensity_score: Math.min(100, intensity),
    clarity_score: Math.min(100, clarity),
    market_score: Math.min(100, market),
    timeliness_score: Math.min(100, timeliness),
    leak_risk_score: Math.min(100, leakRisk),
    release_score: Math.max(0, raw),
    release_state: releaseState
  };
}

export default async function runScoring() {
  const { data: dumps, error } = await supabase
    .from('codex_dumps')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  for (const dump of dumps || []) {
    const scores = computeScores({
      title: dump.title,
      body: dump.body || '',
      labels: Array.isArray(dump.labels) ? dump.labels : []
    });

    await supabase.from('musings').upsert(
      [
        {
          source_dump_id: dump.id,
          title: dump.title,
          content: dump.body || '',
          theme: dump.classification,
          ...scores
        }
      ],
      { onConflict: 'source_dump_id' }
    );
  }
}
