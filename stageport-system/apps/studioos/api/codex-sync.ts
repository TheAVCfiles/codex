import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${process.env.CODEX_SYNC_TOKEN}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const payload = req.body;

  const { data, error } = await supabase
    .from('codex_dumps')
    .insert([
      {
        repo: payload.repo,
        pr_number: payload.pr_number,
        title: payload.title,
        body: payload.body,
        branch: payload.branch,
        labels: payload.labels,
        classification: payload.classification,
        merged: payload.merged
      }
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('ledger_entries').insert([
    {
      tenant_id: process.env.DEFAULT_TENANT_ID,
      entry_type: 'CODEX_DUMP_INGESTED',
      payload: {
        dump_id: data.id,
        repo: payload.repo,
        pr_number: payload.pr_number,
        classification: payload.classification
      }
    }
  ]);

  return res.status(200).json({ ok: true, dump: data });
}
