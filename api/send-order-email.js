// NOTE: Installer d'abord : npm install resend
// Puis configurer RESEND_API_KEY dans les variables d'environnement Vercel

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
    const { orderData } = req.body;
    const eurMode = (typeof orderData?.amountEUR === 'number' && typeof orderData?.totalAmount === 'number'
      && Math.abs(orderData.amountEUR - orderData.totalAmount) < 0.01) || orderData?.currency === 'EUR';
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn('⚠️ RESEND_API_KEY non configurée - emails désactivés');
      return res.status(200).json({ 
        success: false, 
        message: 'Service email non configuré (normal en développement)'
      });
    }

    // Import dynamique de Resend
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    // Email de confirmation au client
    if (orderData.deliveryInfo?.email) {
      await resend.emails.send({
        from: 'BeniLink <noreply@votre-domaine.com>',
        to: orderData.deliveryInfo.email,
        subject: `✅ Commande BeniLink confirmée - ${orderData.orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">🛍️ BeniLink</h1>
              <p style="color: #d1fae5; margin: 10px 0 0 0;">Bénin • France</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
              <h2 style="color: #059669; margin-top: 0;">Merci pour votre commande !</h2>
              
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #065f46;"><strong>Numéro de commande :</strong> ${orderData.orderId}</p>
                <p style="margin: 10px 0 0 0; color: #065f46;"><strong>Total :</strong> ${(orderData.amountEUR ?? 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR</p>
              </div>

              <h3 style="color: #1f2937; margin-top: 30px;">📦 Vos articles</h3>
              <ul style="list-style: none; padding: 0;">
                ${orderData.items?.map(item => `
                  <li style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                    <strong>${item.name}</strong><br>
                    <span style="color: #6b7280;">Quantité: ${item.quantity} • ${(item.priceEUR ? (item.priceEUR * item.quantity).toFixed(2) + ' EUR' : (item.priceFCFA * item.quantity).toLocaleString() + ' FCFA')}</span>
                  </li>
                `).join('')}
              </ul>

              <h3 style="color: #1f2937; margin-top: 30px;">📍 Adresse de livraison</h3>
              <p style="color: #6b7280; line-height: 1.6;">
                ${orderData.deliveryInfo?.fullName}<br>
                ${orderData.deliveryInfo?.address}<br>
                ${orderData.deliveryInfo?.postalCode} ${orderData.deliveryInfo?.city}<br>
                ${orderData.deliveryInfo?.country}<br>
                📞 ${orderData.deliveryInfo?.phone}
              </p>

              <div style="background: #fffbeb; padding: 15px; border-radius: 8px; margin-top: 30px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;">
                  <strong>📱 Prochaines étapes :</strong><br>
                  Nous vous contacterons bientôt sur WhatsApp pour confirmer votre commande et organiser la livraison.
                </p>
              </div>

              <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px;">
                  Des questions ? Contactez-nous sur WhatsApp : +33768585890
                </p>
              </div>
            </div>

            <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2026 BeniLink - Produits béninois authentiques<br>
                Du Bénin à la France avec amour 💚
              </p>
            </div>
          </div>
        `
      });
    }

    // Email de notification à l'admin
    await resend.emails.send({
      from: 'BeniLink Notifications <notifications@votre-domaine.com>',
      to: 'germaine.elitenetworker@gmail.com',
      subject: `🛍️ NOUVELLE COMMANDE - ${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #f9fafb; padding: 20px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h1 style="color: #059669; margin-top: 0;">🎉 Nouvelle commande reçue !</h1>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <h2 style="margin: 0 0 10px 0; color: #065f46;">Commande ${orderData.orderId}</h2>
              <p style="margin: 5px 0; color: #047857;"><strong>Total:</strong> ${(orderData.amountEUR ?? 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} EUR</p>
              <p style="margin: 5px 0; color: #047857;"><strong>Paiement:</strong> ${orderData.paymentMethod?.toUpperCase()}</p>
            </div>

            <h3 style="color: #1f2937;">👤 Client</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Nom:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderData.deliveryInfo?.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${orderData.deliveryInfo?.email}">${orderData.deliveryInfo?.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Téléphone:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="tel:${orderData.deliveryInfo?.phone}">${orderData.deliveryInfo?.phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Adresse:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
                  ${orderData.deliveryInfo?.address}<br>
                  ${orderData.deliveryInfo?.postalCode} ${orderData.deliveryInfo?.city}<br>
                  ${orderData.deliveryInfo?.country}
                </td>
              </tr>
            </table>

            <h3 style="color: #1f2937; margin-top: 30px;">📦 Produits commandés</h3>
            <table style="width: 100%; border-collapse: collapse; background: #f9fafb; border-radius: 8px;">
              <thead>
                <tr style="background: #059669; color: white;">
                  <th style="padding: 12px; text-align: left;">Produit</th>
                  <th style="padding: 12px; text-align: center;">Qté</th>
                  <th style="padding: 12px; text-align: right;">Prix unit.</th>
                  <th style="padding: 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.items?.map(item => `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                    <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
                    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">${item.priceEUR ? item.priceEUR.toFixed(2) + ' €' : (item.priceFCFA?.toLocaleString() + ' F')}</td>
                    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: bold;">${item.priceEUR ? (item.priceEUR * item.quantity).toFixed(2) + ' €' : ((item.priceFCFA * item.quantity).toLocaleString() + ' F')}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                ${eurMode ? `
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;"><strong>Sous-total produits HT:</strong></td>
                  <td style="padding: 12px; text-align: right; font-weight: bold;">${(orderData.subtotalHT ?? 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;">Frais de port HT:</td>
                  <td style="padding: 12px; text-align: right;">${(orderData.shippingCostHT ?? 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;">TVA (20%):</td>
                  <td style="padding: 12px; text-align: right;">${(orderData.totalVAT ?? orderData.taxAmount ?? 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                </tr>
                <tr style="background: #ecfdf5;">
                  <td colspan="3" style="padding: 12px; text-align: right; font-size: 18px;"><strong>TOTAL TTC:</strong></td>
                  <td style="padding: 12px; text-align: right; font-size: 18px; font-weight: bold; color: #059669;">${(orderData.amountEUR ?? orderData.totalAmount ?? 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                </tr>
                ` : `
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;"><strong>Sous-total:</strong></td>
                  <td style="padding: 12px; text-align: right; font-weight: bold;">${(orderData.subtotal ?? 0).toLocaleString()} F</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;">Livraison:</td>
                  <td style="padding: 12px; text-align: right;">${(orderData.shippingCost ?? 0).toLocaleString()} F</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 12px; text-align: right;">TVA (20%):</td>
                  <td style="padding: 12px; text-align: right;">${(orderData.taxAmount ?? 0).toLocaleString()} F</td>
                </tr>
                <tr style="background: #ecfdf5;">
                  <td colspan="3" style="padding: 12px; text-align: right; font-size: 18px;"><strong>TOTAL:</strong></td>
                  <td style="padding: 12px; text-align: right; font-size: 18px; font-weight: bold; color: #059669;">${(orderData.totalAmount ?? 0).toLocaleString()} F (${(orderData.amountEUR ?? 0).toFixed(2)} €)</td>
                </tr>
                `}
              </tfoot>
            </table>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 30px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;">
                <strong>⚡ Action requise :</strong><br>
                Contactez le client sur WhatsApp pour confirmer la commande et organiser la livraison.
              </p>
            </div>
          </div>
        </div>
      `
    });

    return res.status(200).json({
      success: true,
      message: 'Emails envoyés avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    
    // Ne pas bloquer la commande si l'email échoue
    return res.status(200).json({
      success: false,
      message: 'Commande enregistrée mais email non envoyé',
      error: error.message
    });
  }
}
