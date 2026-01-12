import fs from 'fs';
import path from 'path';

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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const orderData = req.body;
    
    // Générer un ID de commande unique
    const orderId = `BNL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

    // Formater les données de la commande (EUR-first)
    const orderText = `
═══════════════════════════════════════════════════════════════
🛍️ NOUVELLE COMMANDE BENILINK - ${orderId}
📅 Date: ${timestamp}
═══════════════════════════════════════════════════════════════

📦 PRODUITS:
${orderData.items.map((item, index) => `
  ${index + 1}. ${item.name}
     - Quantité: ${item.quantity}
     - Prix unitaire: ${item.priceEUR ? item.priceEUR.toFixed(2) + ' EUR' : (item.priceFCFA?.toLocaleString() + ' FCFA')}
     - Sous-total: ${item.priceEUR ? (item.priceEUR * item.quantity).toFixed(2) + ' EUR' : ((item.priceFCFA * item.quantity).toLocaleString() + ' FCFA')}
`).join('')}

💰 RÉCAPITULATIF FINANCIER:
  • Sous-total produits HT: ${orderData.subtotalHT !== undefined ? orderData.subtotalHT.toFixed(2) + ' EUR' : (orderData.subtotal?.toFixed(2) + ' EUR')}
  • Frais de port HT: ${(orderData.shippingCostHT ?? orderData.shippingCost ?? 0).toFixed(2)} EUR
  • TVA (20%): ${(orderData.taxAmount ?? orderData.totalVAT ?? 0).toFixed(2)} EUR
  • TOTAL TTC: ${(orderData.amountEUR ?? orderData.totalAmount ?? 0).toFixed(2)} EUR
${orderData.totalWeightKg ? `   • Poids total: ${orderData.totalWeightKg} kg` : ''}
${orderData.deliveryMethod ? `   • Mode livraison: ${orderData.deliveryMethod}` : ''}

📍 INFORMATIONS DE LIVRAISON:
   • Nom complet: ${orderData.deliveryInfo?.fullName || 'N/A'}
   • Téléphone: ${orderData.deliveryInfo?.phone || 'N/A'}
   • Email: ${orderData.deliveryInfo?.email || 'N/A'}
   • Adresse: ${orderData.deliveryInfo?.address || 'N/A'}
   • Ville: ${orderData.deliveryInfo?.city || 'N/A'}
   • Code postal: ${orderData.deliveryInfo?.postalCode || 'N/A'}
   • Pays: ${orderData.deliveryInfo?.country || 'N/A'}

💳 MÉTHODE DE PAIEMENT: ${orderData.paymentMethod?.toUpperCase() || 'N/A'}

🌐 INFORMATIONS TECHNIQUES:
   • IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'N/A'}
   • User-Agent: ${req.headers['user-agent'] || 'N/A'}

═══════════════════════════════════════════════════════════════

`;

    // Sauvegarder dans un fichier texte
    const ordersDir = path.join(process.cwd(), 'orders');
    const ordersFile = path.join(ordersDir, 'orders.txt');
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir, { recursive: true });
    }

    // Ajouter la commande au fichier
    fs.appendFileSync(ordersFile, orderText);

    // Sauvegarder aussi en JSON pour faciliter le traitement
    const ordersJsonFile = path.join(ordersDir, 'orders.json');
    let orders = [];
    
    if (fs.existsSync(ordersJsonFile)) {
      const data = fs.readFileSync(ordersJsonFile, 'utf8');
      orders = JSON.parse(data);
    }

    orders.push({
      id: orderId,
      timestamp: new Date().toISOString(),
      ...orderData
    });

    fs.writeFileSync(ordersJsonFile, JSON.stringify(orders, null, 2));

    console.log(`✅ Commande ${orderId} sauvegardée avec succès`);

    return res.status(200).json({
      success: true,
      orderId: orderId,
      message: 'Commande enregistrée avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde de la commande:', error);
    return res.status(500).json({
      error: 'Erreur lors de la sauvegarde',
      details: error.message
    });
  }
}
