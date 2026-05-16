// api/shopify.js — multi-store proxy with hardcoded tokens per domain
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path, domain: reqDomain, ...params } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  // Token map — add more stores here as needed
  const TOKENS = {
    'carlynx-2.myshopify.com': process.env.SHOPIFY_TOKEN || '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',
    'abashevmodel.myshopify.com': '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',
  };

  const domain = reqDomain || process.env.SHOPIFY_DOMAIN || 'carlynx-2.myshopify.com';
  const token = TOKENS[domain];

  if (!token) {
    return res.status(401).json({ error: 'No token configured for domain: ' + domain });
  }

  const qs = new URLSearchParams(params).toString();
  const url = `https://${domain}/admin/api/2024-01/${path}${qs ? '?' + qs : ''}`;

  try {
    const r = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.errors || 'Shopify error' });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
