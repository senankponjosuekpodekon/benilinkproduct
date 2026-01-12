import Stripe from 'stripe';

const FCFA_PER_EUR = 655;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY not configured' });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  try {
    const { items, currency = 'EUR', shippingCostEUR } = req.body || {};
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const line_items = items.map((i) => {
      const unitAmountEUR = typeof i.priceEUR === 'number'
        ? Math.max(0.01, i.priceEUR)
        : Math.max(0.01, i.priceFCFA / FCFA_PER_EUR);
      const unitAmountCents = Math.round(unitAmountEUR * 100);
      return {
        price_data: {
          currency,
          unit_amount: unitAmountCents,
          product_data: { name: i.name }
        },
        quantity: i.quantity
      };
    });

    if (typeof shippingCostEUR === 'number' && shippingCostEUR > 0) {
      line_items.push({
        price_data: {
          currency,
          unit_amount: Math.round(Math.max(0.01, shippingCostEUR) * 100),
          product_data: { name: 'Frais de livraison' }
        },
        quantity: 1
      });
    }

    const baseUrl = req.body?.baseUrl || process.env.APP_BASE_URL || req.headers.origin || 'https://benilinkproduct.vercel.app';
    const successPath = req.body?.successPath || process.env.STRIPE_SUCCESS_PATH || '/?checkout=success';
    const cancelPath = req.body?.cancelPath || process.env.STRIPE_CANCEL_PATH || '/?checkout=cancel';
    
    const successUrl = new URL(successPath, baseUrl).toString();
    const cancelUrl = new URL(cancelPath, baseUrl).toString();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Stripe checkout failed', details: err.message });
  }
}
