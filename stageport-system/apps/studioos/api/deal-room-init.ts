import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import slugify from 'slugify';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { tenant_id, title, summary } = req.body;
  const slug = slugify(title, { lower: true, strict: true });

  const { data, error } = await supabase
    .from('deal_rooms')
    .insert([
      {
        tenant_id,
        slug,
        title,
        summary
      }
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true, room: data });
}
