import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminToken = process.env.ADMIN_DASH_TOKEN;
  if (!adminToken) {
    console.error('⚠️ ADMIN_DASH_TOKEN manquant');
    return res.status(500).json({ error: 'Configuration manquante (ADMIN_DASH_TOKEN)' });
  }

  const headerToken = req.headers['x-admin-token'] || (req.headers.authorization || '').replace('Bearer ', '');
  if (headerToken !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const ordersPath = path.join(process.cwd(), 'orders', 'orders.json');
    let orders = [];

    if (fs.existsSync(ordersPath)) {
      const fileContent = fs.readFileSync(ordersPath, 'utf8');
      try {
        orders = JSON.parse(fileContent);
      } catch (parseErr) {
        console.error('Erreur parsing orders.json', parseErr);
        orders = [];
      }
    }

    // Trier du plus récent au plus ancien
    orders = orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('❌ Erreur récupération commandes admin:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
