import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Weight-based shipping tiers (EUR) - matches frontend logic
const getShippingRateEUR = (weightKg) => {
  if (weightKg < 5) return 3.00;
  if (weightKg < 200) return 3.00;
  if (weightKg < 500) return 2.75;
  if (weightKg < 1000) return 2.50;
  if (weightKg < 2000) return 2.25;
  return 1.75;
};

// Taux TVA
const TVA_RATE = 0.20; // 20% pour la France

export default async function handler(req, res) {
  // Load PRODUCTS inside handler
  let PRODUCTS = [];
  try {
    const constantsModule = await import('../constants.js');
    PRODUCTS = constantsModule.PRODUCTS || [];
  } catch (e) {
    console.error('Failed to load PRODUCTS:', e);
    return res.status(500).json({ error: 'Failed to load product database' });
  }

  // Build product lookup by name
  const PRODUCT_PRICES = PRODUCTS.reduce((acc, p) => {
    acc[p.name] = { eur: p.price, unit: p.unit };
    return acc;
  }, {});

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { items, deliveryInfo, paymentMethod, deliveryMethod } = req.body;

    // ✅ VALIDATION DES DONNÉES
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Panier vide ou invalide' });
    }

    if (!deliveryInfo || !deliveryInfo.country || !deliveryInfo.fullName) {
      return res.status(400).json({ error: 'Informations de livraison incomplètes' });
    }

    // Helper: estimate weight from unit
    const getUnitWeightKg = (name, unit, qty) => {
      const nameLower = name.toLowerCase();
      const gramMatch = nameLower.match(/(\d{2,4})\s*g/);
      if (unit === 'g' && gramMatch) {
        return Math.max(0.05, parseInt(gramMatch[1], 10) / 1000) * qty;
      }
      const mlMatch = nameLower.match(/(\d{2,4})\s*ml/);
      if (unit === 'ml' && mlMatch) {
        return Math.max(0.05, parseInt(mlMatch[1], 10) / 1000) * qty;
      }
      if (unit === 'kilo') return 1 * qty;
      if (unit === 'litre') return 1 * qty;
      return 0.5 * qty; // sachet/unité estimate
    };

    // ✅ CALCUL SÉCURISÉ DES PRIX CÔTÉ SERVEUR (EUR TTC)
    let calculatedSubtotalEUR = 0;
    let totalWeightKg = 0;
    const validatedItems = [];

    for (const item of items) {
      const productPrice = PRODUCT_PRICES[item.name];
      
      if (!productPrice) {
        console.error(`⚠️ Produit inconnu: ${item.name}`);
        return res.status(400).json({ 
          error: `Produit invalide: ${item.name}`,
          details: 'Ce produit n\'existe pas dans notre catalogue'
        });
      }

      if (!item.quantity || item.quantity < 1 || item.quantity > 99) {
        return res.status(400).json({ 
          error: 'Quantité invalide',
          details: `La quantité doit être entre 1 et 99 pour ${item.name}`
        });
      }

      // Recalculate EUR total (prices already include VAT)
      const itemTotalEUR = productPrice.eur * item.quantity;
      calculatedSubtotalEUR += itemTotalEUR;
      totalWeightKg += getUnitWeightKg(item.name, productPrice.unit, item.quantity);

      validatedItems.push({
        name: item.name,
        quantity: item.quantity,
        priceEUR: productPrice.eur,
        totalEUR: itemTotalEUR,
        unit: productPrice.unit
      });
    }

    // ✅ VALIDATION POIDS MINIMUM (5kg)
    if (totalWeightKg < 5) {
      return res.status(400).json({ 
        error: 'Poids minimum non atteint',
        details: `Le poids total de votre commande est de ${totalWeightKg.toFixed(2)} kg. Le poids minimum requis est de 5 kg.`
      });
    }
    
    // ✅ VALIDATION POIDS MINIMUM (5kg)
    if (totalWeightKg < 5) {
      return res.status(400).json({ 
        error: 'Poids minimum non atteint',
        details: `Le poids total de votre commande est de ${totalWeightKg.toFixed(2)} kg. Le poids minimum requis est de 5 kg.`
      });
    }
    
    // ✅ CALCUL SÉCURISÉ DES FRAIS DE LIVRAISON (weight-based EUR) - TOUJOURS APPLIQUÉ
    const delivery = deliveryMethod || 'pickup-tence';
    const ratePerKg = getShippingRateEUR(totalWeightKg);
    const shippingCostHT = Math.round(totalWeightKg * ratePerKg * 100) / 100;
    // Ajouter la TVA sur les frais de livraison (20%)
    const shippingCostTTC = Math.round(shippingCostHT * (1 + TVA_RATE) * 100) / 100;
    
    // Frais Colissimo/Relais supplémentaires (optionnel, à ajouter)
    let additionalShippingEUR = 0;
    if (delivery === 'colissimo' || delivery === 'relais') {
      // TODO: ajouter frais Colissimo/Relais selon poids
      // additionalShippingEUR = ...;
    }

    // ✅ CALCUL DE LA TVA (sur produits et livraison)
    const productVATIncluded = Math.round((calculatedSubtotalEUR * (TVA_RATE / (1 + TVA_RATE))) * 100) / 100;
    const shippingVAT = Math.round((shippingCostTTC - shippingCostHT) * 100) / 100;
    const totalVAT = Math.round((productVATIncluded + shippingVAT) * 100) / 100;

    // ✅ TOTAL FINAL VÉRIFIÉ (EUR) - Shipping TTC + Additional fees
    const totalShippingEUR = shippingCostTTC + additionalShippingEUR;
    const totalAmountEUR = calculatedSubtotalEUR + totalShippingEUR;

    // 📊 DONNÉES DE LA COMMANDE VALIDÉES (EUR-first)
    const orderData = {
      orderId: `BNL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      currency: 'EUR',
      items: validatedItems,
      subtotal: calculatedSubtotalEUR,
      subtotalHT: Math.round((calculatedSubtotalEUR / (1 + TVA_RATE)) * 100) / 100,
      shippingCostHT: shippingCostHT,
      shippingCostTTC: shippingCostTTC,
      additionalShippingCost: additionalShippingEUR,
      totalShippingCost: totalShippingEUR,
      productVAT: productVATIncluded,
      shippingVAT: shippingVAT,
      totalVAT: totalVAT,
      totalAmount: totalAmountEUR,
      amountEUR: totalAmountEUR,
      totalWeightKg: Math.round(totalWeightKg * 100) / 100,
      deliveryMethod: delivery,
      deliveryInfo: {
        fullName: deliveryInfo.fullName,
        email: deliveryInfo.email || '',
        phone: deliveryInfo.phone,
        address: deliveryInfo.address,
        postalCode: deliveryInfo.postalCode || '',
        city: deliveryInfo.city,
        country: deliveryInfo.country
      },
      paymentMethod: paymentMethod || 'whatsapp',
      metadata: {
        ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown'
      }
    };

    // 💾 SAUVEGARDE DE LA COMMANDE
    const ordersDir = path.join(process.cwd(), 'orders');
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir, { recursive: true });
    }

    const ordersFile = path.join(ordersDir, 'orders.txt');
    const ordersJsonFile = path.join(ordersDir, 'orders.json');

    // Format TXT (lisible) - EUR-first
    const orderText = `
═══════════════════════════════════════════════════════════════
📦 COMMANDE: ${orderData.orderId}
📅 DATE: ${new Date(orderData.timestamp).toLocaleString('fr-FR')}
═══════════════════════════════════════════════════════════════

🛍️ PRODUITS:
${orderData.items.map(item => 
  `  • ${item.name} × ${item.quantity} = ${item.totalEUR.toFixed(2)} EUR`
).join('\n')}

💰 FINANCIER:
  Sous-total (TTC): ${orderData.subtotal.toFixed(2)} EUR
  Livraison HT:     ${orderData.shippingCostHT.toFixed(2)} EUR (${orderData.totalWeightKg} kg)
  TVA (20%):        ${orderData.totalVAT.toFixed(2)} EUR
  ────────────────────────────────────
  TOTAL TTC:        ${orderData.amountEUR.toFixed(2)} EUR

👤 CLIENT:
  Nom:       ${orderData.deliveryInfo.fullName}
  Email:     ${orderData.deliveryInfo.email || 'Non fourni'}
  Téléphone: ${orderData.deliveryInfo.phone}

📍 LIVRAISON:
  Mode:      ${orderData.deliveryMethod}
  Adresse:   ${orderData.deliveryInfo.address}
  Code postal: ${orderData.deliveryInfo.postalCode || 'N/A'}
  Ville:     ${orderData.deliveryInfo.city}
  Pays:      ${orderData.deliveryInfo.country}

💳 PAIEMENT: ${orderData.paymentMethod.toUpperCase()}

🔧 TECHNIQUE:
  IP: ${orderData.metadata.ip}
  User-Agent: ${orderData.metadata.userAgent}

═══════════════════════════════════════════════════════════════

`;

    fs.appendFileSync(ordersFile, orderText);

    // Format JSON (structuré)
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

    console.log(`✅ Commande ${orderData.orderId} validée et sauvegardée`);

    // 🗄️ Sauvegarde Supabase (optionnelle)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;
    if (supabaseUrl && supabaseServiceRole) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseServiceRole);
        const { error } = await supabase.from('orders').insert({
          order_id: orderData.orderId,
          created_at: orderData.timestamp,
          currency: 'EUR',
          subtotal_eur: orderData.subtotal,
          shipping_eur: orderData.shippingCost,
          tax_eur: orderData.taxAmount,
          total_eur: orderData.amountEUR,
          total_weight_kg: orderData.totalWeightKg,
          delivery_method: orderData.deliveryMethod,
          payment_method: orderData.paymentMethod,
          delivery_info: orderData.deliveryInfo,
          items: orderData.items,
          metadata: orderData.metadata
        });
        if (error) {
          console.warn('⚠️ Supabase insert error:', error.message);
        } else {
          console.log('✅ Commande enregistrée dans Supabase');
        }
      } catch (supabaseError) {
        console.warn('⚠️ Supabase non disponible:', supabaseError.message);
      }
    } else {
      console.warn('ℹ️ Supabase non configuré (SUPABASE_URL / SUPABASE_SERVICE_ROLE manquants)');
    }

    // 📧 ENVOYER LES EMAILS (si Resend est configuré)
    try {
      await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/send-order-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderData })
      });
      console.log('✅ Emails envoyés');
    } catch (emailError) {
      console.warn('⚠️ Erreur envoi email (non bloquant):', emailError.message);
    }

    return res.status(200).json({
      success: true,
      orderId: orderData.orderId,
      totalAmount: orderData.amountEUR,
      amountEUR: orderData.amountEUR,
      currency: 'EUR',
      message: 'Commande validée avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur traitement commande:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur',
      message: 'Impossible de traiter la commande. Veuillez réessayer.'
    });
  }
}
