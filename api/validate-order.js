import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Prix des produits (source de vérité côté serveur)
const PRODUCT_PRICES = {
  'Beurre de Karité Bio': { fcfa: 8500, eur: 12.95 },
  'Huile de Coco Vierge': { fcfa: 6000, eur: 9.15 },
  'Savon Noir Africain': { fcfa: 3000, eur: 4.57 },
  'Huile de Baobab': { fcfa: 9500, eur: 14.48 },
  'Poudre de Moringa': { fcfa: 7500, eur: 11.43 },
  'Huile de Ricin Noire': { fcfa: 5500, eur: 8.38 }
};

// Frais de livraison (source de vérité côté serveur)
const SHIPPING_RATES = {
  'France': 950,
  'Benin': 500,
  'Bénin': 500
};

// Taux TVA
const TVA_RATE = 0.20; // 20% pour la France

export default async function handler(req, res) {
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
    const { items, deliveryInfo, paymentMethod } = req.body;

    // ✅ VALIDATION DES DONNÉES
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Panier vide ou invalide' });
    }

    if (!deliveryInfo || !deliveryInfo.country || !deliveryInfo.fullName) {
      return res.status(400).json({ error: 'Informations de livraison incomplètes' });
    }

    // ✅ CALCUL SÉCURISÉ DES PRIX CÔTÉ SERVEUR
    let calculatedSubtotal = 0;
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

      // Recalculer le prix avec les données serveur (ignorer les prix envoyés par le client)
      const itemTotal = productPrice.fcfa * item.quantity;
      calculatedSubtotal += itemTotal;

      validatedItems.push({
        name: item.name,
        quantity: item.quantity,
        priceFCFA: productPrice.fcfa,
        priceEUR: productPrice.eur,
        totalFCFA: itemTotal,
        totalEUR: productPrice.eur * item.quantity
      });
    }

    // ✅ CALCUL SÉCURISÉ DES FRAIS DE LIVRAISON
    const shippingCost = SHIPPING_RATES[deliveryInfo.country] || 2000; // International par défaut

    // ✅ CALCUL SÉCURISÉ DE LA TVA
    const taxAmount = deliveryInfo.country === 'France' ? Math.round(calculatedSubtotal * TVA_RATE) : 0;

    // ✅ TOTAL FINAL VÉRIFIÉ
    const totalAmount = calculatedSubtotal + shippingCost + taxAmount;
    const totalEUR = totalAmount / 655.957; // Conversion FCFA → EUR

    // 📊 DONNÉES DE LA COMMANDE VALIDÉES
    const orderData = {
      orderId: `BNL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      items: validatedItems,
      subtotal: calculatedSubtotal,
      shippingCost: shippingCost,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      amountEUR: totalEUR,
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

    // Format TXT (lisible)
    const orderText = `
═══════════════════════════════════════════════════════════════
📦 COMMANDE: ${orderData.orderId}
📅 DATE: ${new Date(orderData.timestamp).toLocaleString('fr-FR')}
═══════════════════════════════════════════════════════════════

🛍️ PRODUITS:
${orderData.items.map(item => 
  `  • ${item.name} × ${item.quantity} = ${item.totalFCFA.toLocaleString()} FCFA (${item.totalEUR.toFixed(2)} EUR)`
).join('\n')}

💰 FINANCIER:
  Sous-total:    ${orderData.subtotal.toLocaleString()} FCFA
  Livraison:     ${orderData.shippingCost.toLocaleString()} FCFA
  TVA (20%):     ${orderData.taxAmount.toLocaleString()} FCFA
  ────────────────────────────────────
  TOTAL:         ${orderData.totalAmount.toLocaleString()} FCFA (≈ ${orderData.amountEUR.toFixed(2)} EUR)

👤 CLIENT:
  Nom:       ${orderData.deliveryInfo.fullName}
  Email:     ${orderData.deliveryInfo.email || 'Non fourni'}
  Téléphone: ${orderData.deliveryInfo.phone}

📍 LIVRAISON:
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
          subtotal_fcfa: orderData.subtotal,
          shipping_fcfa: orderData.shippingCost,
          tax_fcfa: orderData.taxAmount,
          total_fcfa: orderData.totalAmount,
          amount_eur: orderData.amountEUR,
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
      totalAmount: orderData.totalAmount,
      amountEUR: orderData.amountEUR,
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
