export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const secret = process.env.SHOPIFY_SECRET;
  const domain = process.env.SHOPIFY_DOMAIN;

  if (!secret || !domain) {
    return res.status(500).json({ error: 'Shopify env vars not configured' });
  }

  const path = req.query.path;
  if (!path) return res.status(400).json({ error: 'Missing path param' });

  const { path: _, ...rest } = req.query;
  const qs = new URLSearchParams(rest).toString();
  const url = `https://${domain}/admin/api/2024-01/${path}${qs ? '?' + qs : ''}`;

  try {
    const r = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': secret,
        'Content-Type': 'application/json',
      },
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data });
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
