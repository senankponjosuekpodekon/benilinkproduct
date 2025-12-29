import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { createServer as createViteServer } from 'vite';

const app = express();
app.use(cors());
app.use(express.json());

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY manquant dans .env.local');
}
const stripe = new Stripe(STRIPE_SECRET_KEY || '');

// Simple FCFA -> EUR conversion (approx)
const FCFA_PER_EUR = 655;

// API routes (same origin under /api)
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items, currency = 'EUR' } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items' });
    }

    const line_items = items.map((i) => {
      const unitAmountEUR = Math.max(0.01, i.priceFCFA / FCFA_PER_EUR);
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

    const reqOrigin = req.headers.origin;
    const baseUrl = req.body?.baseUrl || process.env.APP_BASE_URL || reqOrigin || 'http://localhost:3000';
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

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error('Stripe error', err);
    res.status(500).json({ error: 'Stripe error' });
  }
});

// Vite integration (dev) or static (prod)
const PORT = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';

async function start() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dist = path.resolve(__dirname, 'dist');
    app.use(express.static(dist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(dist, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`✅ Server ready on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Server start failed', err);
  process.exit(1);
});
