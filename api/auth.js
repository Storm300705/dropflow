export default async function handler(req, res) {
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  const shop = process.env.SHOPIFY_DOMAIN;
  const redirectUri = `https://dropflow-silk.vercel.app/api/callback`;

  if (req.query.action === 'install') {
    const scopes = 'read_orders,read_products,read_customers,read_all_orders';
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
    return res.redirect(authUrl);
  }
  res.json({ error: 'add ?action=install to URL' });
}
