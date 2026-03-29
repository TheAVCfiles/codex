import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function sha(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { token } = req.body;
  const token_hash = sha(token);

  const { data: row, error } = await supabase.from('witness_windows').select('*').eq('token_hash', token_hash).single();

  if (error || !row) return res.status(404).json({ error: 'not_found' });

  const now = Date.now();
  const open = new Date(row.open_time).getTime();
  const close = new Date(row.close_time).getTime();

  if (now < open || now > close) return res.status(403).json({ error: 'fail_closed' });
  if (row.one_time_redeem && row.redeemed_at) return res.status(403).json({ error: 'already_redeemed' });

  await supabase
    .from('witness_windows')
    .update({ redeemed_at: new Date().toISOString(), status: 'redeemed' })
    .eq('id', row.id);

  return res.status(200).json({
    ok: true,
    witness_id: row.id,
    artifact_id: row.artifact_id,
    mode: row.mode
  });
}
