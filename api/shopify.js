export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.SHOPIFY_TOKEN || process.env.SHOPIFY_SECRET;
  const domain = process.env.SHOPIFY_DOMAIN;

  if (!token || !domain) {
    return res.status(500).json({ 
      error: 'env vars missing',
      hasToken: !!token,
      hasDomain: !!domain,
      domain: domain || 'NOT SET'
    });
  }

  const path = req.query.path;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const { path: _, ...rest } = req.query;
  const qs = new URLSearchParams(rest).toString();
  const url = `https://${domain}/admin/api/2024-01/${path}${qs ? '?' + qs : ''}`;

  try {
    const r = await fetch(url, {
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data, url });
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
