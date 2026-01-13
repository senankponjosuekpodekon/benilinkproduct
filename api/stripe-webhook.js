import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!WEBHOOK_SECRET) {
    console.error('❌ STRIPE_WEBHOOK_SECRET manquante');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'No signature provided' });
  }

  let event;
  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
      signature,
      WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Erreur signature webhook:', err);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(`✅ Paiement Stripe confirmé: ${session.id}`);

        // Récupérer les métadonnées de la session
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items']
        });

        // Extraire les données de la commande depuis la session
        const orderData = {
          orderId: `BNL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          timestamp: new Date().toISOString(),
          currency: 'EUR',
          paymentMethod: 'stripe',
          stripeSessionId: session.id,
          customerId: session.customer || 'anonymous',
          items: sessionWithLineItems.line_items.data
            .filter(item => item.price_data?.product_data?.name !== 'Frais de livraison')
            .map(item => ({
              name: item.price_data?.product_data?.name || 'Produit inconnu',
              quantity: item.quantity,
              priceEUR: item.amount_total / 100 / (item.quantity || 1)
            })),
          subtotal: session.amount_subtotal / 100,
          shippingCost: sessionWithLineItems.line_items.data
            .filter(item => item.price_data?.product_data?.name === 'Frais de livraison')
            .reduce((sum, item) => sum + item.amount_total / 100, 0),
          totalAmount: session.amount_total / 100,
          amountEUR: session.amount_total / 100,
          // Les métadonnées de livraison devraient être dans session.metadata
          deliveryInfo: session.metadata || {},
          metadata: {
            ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'webhook',
            userAgent: req.headers['user-agent'] || 'stripe-webhook'
          }
        };

        // 💾 SAUVEGARDE DE LA COMMANDE
        const ordersDir = path.join(process.cwd(), 'orders');
        if (!fs.existsSync(ordersDir)) {
          fs.mkdirSync(ordersDir, { recursive: true });
        }

        const ordersJsonFile = path.join(ordersDir, 'orders.json');
        let orders = [];
        
        if (fs.existsSync(ordersJsonFile)) {
          const jsonContent = fs.readFileSync(ordersJsonFile, 'utf8');
          try {
            orders = JSON.parse(jsonContent);
          } catch (e) {
            console.error('Erreur parsing JSON:', e);
            orders = [];
          }
        }

        orders.push(orderData);
        fs.writeFileSync(ordersJsonFile, JSON.stringify(orders, null, 2));

        console.log(`✅ Commande Stripe ${orderData.orderId} sauvegardée`);

        // 📧 ENVOYER EMAIL DE CONFIRMATION
        try {
          await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/send-order-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderData })
          });
          console.log('✅ Email de confirmation envoyé');
        } catch (emailError) {
          console.warn('⚠️ Erreur envoi email (non bloquant):', emailError.message);
        }

        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        console.log(`⚠️ Remboursement Stripe: ${charge.id}`);
        break;
      }

      default:
        console.log(`ℹ️ Événement Stripe non géré: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Erreur traitement webhook:', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
