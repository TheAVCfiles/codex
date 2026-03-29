import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function sha(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { tenant_id, artifact_id, minutes = 30 } = req.body;

  const rawToken = crypto.randomBytes(24).toString('hex');
  const salt = crypto.randomBytes(24).toString('hex');
  const token_hash = sha(rawToken);
  const salt_hash = sha(salt);

  const open_time = new Date();
  const close_time = new Date(Date.now() + minutes * 60 * 1000);

  const { data, error } = await supabase
    .from('witness_windows')
    .insert([
      {
        tenant_id,
        artifact_id,
        mode: 'rehearsal',
        open_time,
        close_time,
        silence_buffer_seconds: 30,
        token_hash,
        salt_hash,
        one_time_redeem: true,
        status: 'open'
      }
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({
    ok: true,
    token: rawToken,
    open_time,
    close_time,
    witness_id: data.id
  });
}
