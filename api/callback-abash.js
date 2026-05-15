// api/callback-abash.js — OAuth callback for Abash Icons
export default async function handler(req, res) {
  const { code } = req.query;

  const CLIENT_ID = '199428859ae3ce73c75e3b18e1939722';
  const CLIENT_SECRET = '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';
  const SHOP = 'abashevmodel.myshopify.com';

  if (!code) return res.status(400).json({ error: 'No code' });

  try {
    const r = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
    });

    const data = await r.json();
    const token = data.access_token;

    if (!token) return res.status(400).json({ error: 'No token returned', data });

    // Return a page that shows the token and auto-copies it
    return res.send(`<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Abash Icons connected</title>
  <style>
    body{font-family:-apple-system,sans-serif;background:#0d0d0d;color:#f0f0f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box}
    .box{background:#161616;border:1px solid #282828;border-radius:16px;padding:28px;max-width:420px;width:100%;text-align:center}
    h2{color:#1ec978;margin:0 0 8px}
    p{color:#8a8a8a;font-size:14px;margin:0 0 20px;line-height:1.5}
    .token{background:#0d0d0d;border:1px solid #323232;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;word-break:break-all;color:#4c7bff;margin-bottom:16px}
    button{background:#4c7bff;color:#fff;border:none;border-radius:8px;padding:12px 24px;font-size:15px;font-weight:700;cursor:pointer;width:100%}
    .note{font-size:12px;color:#505050;margin-top:12px}
  </style>
</head>
<body>
<div class="box">
  <h2>✓ Abash Icons connected!</h2>
  <p>Your access token — copy it and paste into DropFlow Settings for the Abash Icons store.</p>
  <div class="token" id="tok">${token}</div>
  <button onclick="navigator.clipboard.writeText('${token}').then(()=>this.textContent='Copied!')">Copy token</button>
  <p class="note">Paste this in DropFlow → More → Switch to Abash Icons → Settings → Access token field → Save → Sync</p>
</div>
</body>
</html>`);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
