import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function sanitizeForPublic(text: string) {
  return text
    .replace(/internal|prompt|compiler|authority rules|service role key|token issuance/gi, '[redacted]')
    .slice(0, 2400);
}

function buildDemoHTML(title: string, summary: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body { background:#050505; color:#e7e7e7; font-family:system-ui; margin:0; padding:40px; }
    .wrap { max-width:900px; margin:0 auto; }
    .card { border:1px solid #262626; background:#111; padding:24px; border-radius:16px; }
    .eyebrow { color:#9ca3af; letter-spacing:.12em; text-transform:uppercase; font-size:12px; }
    h1 { font-size:40px; margin:12px 0 16px; }
    p { color:#b3b3b3; line-height:1.6; }
    .cta { display:inline-block; margin-top:18px; padding:12px 18px; border:1px solid #333; border-radius:12px; color:#fff; text-decoration:none; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="eyebrow">Preview Artifact</div>
      <h1>${title}</h1>
      <p>${summary}</p>
      <a class="cta" href="/w/${encodeURIComponent(title)}">Request access</a>
    </div>
  </div>
</body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${process.env.DEMO_BUILD_TOKEN}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { title, body, dump_id, tenant_id } = req.body;
  const summary = sanitizeForPublic(body || '');
  const demo_html = buildDemoHTML(title, summary);

  const { data, error } = await supabase
    .from('demos')
    .insert([
      {
        tenant_id: tenant_id || process.env.DEFAULT_TENANT_ID,
        dump_id,
        input_summary: title,
        output_summary: summary,
        demo_html,
        release_state: 'private'
      }
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ ok: true, demo: data });
}
