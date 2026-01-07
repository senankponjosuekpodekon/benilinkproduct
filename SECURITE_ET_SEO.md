# Configuration SEO et Sécurité - BENILINK

## 🔍 SEO (Search Engine Optimization)

### ❌ Problèmes actuels :
1. **Pas de meta tags** dans index.html
2. **Pas de sitemap.xml**
3. **Pas de robots.txt**
4. **Pas de structured data (JSON-LD)**
5. **Pas de meta Open Graph** pour réseaux sociaux

### ✅ Solutions à implémenter :

#### 1. Ajouter dans `index.html` :
```html
<head>
  <!-- Meta tags de base -->
  <title>BeniLink - Produits Béninois & Expédition Bénin-France | Beurre de Karité, Huiles Naturelles</title>
  <meta name="description" content="BeniLink : commandez 70+ produits béninois authentiques (beurre de karité, huiles précieuses, vivres) ou expédiez vos colis du Bénin vers la France. Livraison fiable avec suivi.">
  <meta name="keywords" content="beurre de karité, huile de coco, produits béninois, expédition Bénin France, colis international, huiles naturelles, cosmétiques africains">
  
  <!-- Open Graph (Facebook, LinkedIn) -->
  <meta property="og:title" content="BeniLink - Produits Béninois & Expédition Bénin-France">
  <meta property="og:description" content="Commandez des produits 100% béninois ou expédiez vos colis. Livraison fiable avec suivi.">
  <meta property="og:image" content="https://votre-domaine.com/og-image.jpg">
  <meta property="og:url" content="https://votre-domaine.com">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="BeniLink - Produits Béninois & Expédition">
  <meta name="twitter:description" content="70+ produits béninois + service d'expédition fiable">
  <meta name="twitter:image" content="https://votre-domaine.com/twitter-image.jpg">
  
  <!-- Autres -->
  <meta name="author" content="BeniLink">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://votre-domaine.com">
</head>
```

#### 2. Créer `public/robots.txt` :
```txt
User-agent: *
Allow: /
Sitemap: https://votre-domaine.com/sitemap.xml
```

#### 3. Créer `public/sitemap.xml` :
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://votre-domaine.com/</loc>
    <lastmod>2026-01-07</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://votre-domaine.com/#boutique</loc>
    <lastmod>2026-01-07</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://votre-domaine.com/#expedition</loc>
    <lastmod>2026-01-07</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## 📧 EMAILS (Notifications)

### ❌ Actuellement : Aucun email envoyé

### ✅ À implémenter avec **Resend** (gratuit) :

#### 1. Installer :
```bash
npm install resend
```

#### 2. Créer `api/send-order-email.js` :
```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderData } = req.body;

  try {
    // Email au client
    await resend.emails.send({
      from: 'noreply@votre-domaine.com',
      to: orderData.deliveryInfo.email,
      subject: `✅ Commande BeniLink confirmée - ${orderData.orderId}`,
      html: `
        <h1>Merci pour votre commande !</h1>
        <p>Numéro de commande : <strong>${orderData.orderId}</strong></p>
        <p>Total : ${orderData.totalAmount} FCFA</p>
        <p>Nous vous contacterons bientôt pour la confirmation.</p>
      `
    });

    // Email à l'admin
    await resend.emails.send({
      from: 'notifications@votre-domaine.com',
      to: 'germaine.elitenetworker@gmail.com',
      subject: `🛍️ NOUVELLE COMMANDE - ${orderData.orderId}`,
      html: `
        <h2>Nouvelle commande reçue</h2>
        <p><strong>Client:</strong> ${orderData.deliveryInfo.fullName}</p>
        <p><strong>Total:</strong> ${orderData.totalAmount} FCFA</p>
        <p><strong>Email:</strong> ${orderData.deliveryInfo.email}</p>
        <p><strong>Téléphone:</strong> ${orderData.deliveryInfo.phone}</p>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

#### 3. Ajouter dans `.env` :
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

---

## 🔒 SÉCURITÉ

### ❌ Vulnérabilités actuelles :

1. **Clés API exposées côté client**
   - `VITE_GEMINI_API_KEY` visible dans le code source
   - `VITE_STRIPE_PUBLISHABLE_KEY` OK (publique)
   - `VITE_PAYPAL_CLIENT_ID` OK (public)

2. **Pas de validation backend des prix**
   - Un utilisateur peut modifier les prix dans le navigateur

3. **Pas de rate limiting**
   - Risque de spam/DDoS

4. **Données sensibles non chiffrées**

### ✅ Solutions :

#### 1. Déplacer les clés API sensibles côté serveur :
```javascript
// ❌ MAUVAIS (frontend)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// ✅ BON (backend)
// Dans api/chat.js
const apiKey = process.env.GEMINI_API_KEY; // Sans VITE_
```

#### 2. Valider les prix côté serveur :
```javascript
// Dans api/create-checkout-session.js
export default async function handler(req, res) {
  const { items } = req.body;
  
  // ✅ Recalculer les prix depuis la base de données
  const validatedItems = items.map(item => {
    const productFromDB = PRODUCTS.find(p => p.id === item.id);
    
    if (!productFromDB) {
      throw new Error('Produit invalide');
    }
    
    // Utiliser le prix du serveur, PAS celui envoyé par le client
    return {
      ...item,
      price: productFromDB.price // Prix sûr depuis le serveur
    };
  });
}
```

#### 3. Ajouter rate limiting :
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requêtes
});

app.use('/api/', limiter);
```

#### 4. Variables d'environnement sécurisées sur Vercel :
```
# Dans Vercel Dashboard > Settings > Environment Variables

GEMINI_API_KEY=xxx (Server-side uniquement)
STRIPE_SECRET_KEY=sk_live_xxx (Secret)
RESEND_API_KEY=re_xxx (Secret)
```

---

## 📊 DASHBOARD ADMIN

### ❌ Actuellement : Aucun dashboard

### ✅ Nécessaire pour :
- Voir toutes les commandes
- Statistiques (CA, nombre de ventes)
- Gérer les produits (ajouter/modifier/supprimer)
- Gérer les clients
- Voir les emails envoyés

### Options :

#### Option 1 : Dashboard simple avec fichiers JSON
- Lire `orders/orders.json`
- Interface React basique
- Authentification simple (mot de passe)

#### Option 2 : CMS (Strapi, Sanity)
- Gestion complète
- Base de données
- Multi-utilisateurs

#### Option 3 : Notion/Airtable
- Pas de code
- Webhook depuis l'API pour enregistrer les commandes

---

## 💾 SAUVEGARDE DES COMMANDES (CRÉÉ)

### ✅ Fichier créé : `api/save-order.js`

**Fonctionnalités :**
- ✅ Sauvegarde dans `orders/orders.txt` (format lisible)
- ✅ Sauvegarde dans `orders/orders.json` (format structuré)
- ✅ ID unique pour chaque commande
- ✅ Timestamp
- ✅ Toutes les infos (produits, client, paiement, IP)

**Utilisation :**
Appeler cette API après chaque paiement réussi.

---

## 🚀 PROCHAINES ÉTAPES RECOMMANDÉES

### Priorité 1 (Urgent) :
1. ✅ Déplacer `GEMINI_API_KEY` côté serveur
2. ✅ Valider les prix côté serveur
3. ✅ Ajouter meta tags SEO
4. ✅ Intégrer système d'email (Resend)

### Priorité 2 (Important) :
5. Dashboard admin basique
6. Rate limiting
7. Robots.txt + Sitemap.xml

### Priorité 3 (Améliorations) :
8. Base de données (PostgreSQL/Supabase)
9. Système d'authentification admin
10. Analytics (Google Analytics/Plausible)

---

**Note :** Tous les fichiers de commandes seront créés dans `/orders/` (à ajouter au `.gitignore` pour ne pas les exposer sur GitHub).
