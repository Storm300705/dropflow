// api/auth-abash.js — OAuth install flow for Abash Icons
export default function handler(req, res) {
  const { action } = req.query;

  const CLIENT_ID = '199428859ae3ce73c75e3b18e1939722';
  const SHOP = 'abashevmodel.myshopify.com';
  const REDIRECT = 'https://dropflow-silk.vercel.app/api/callback-abash';
  const SCOPES = 'read_orders,read_products,read_customers,read_inventory,read_fulfillments';

  if (action === 'install') {
    const url = `https://${SHOP}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${encodeURIComponent(REDIRECT)}`;
    return res.redirect(url);
  }

  return res.status(400).json({ error: 'add ?action=install to URL' });
}
