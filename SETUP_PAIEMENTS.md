# 🔐 GUIDE DE CONFIGURATION PAIEMENTS BENILINK

## Configuration Locale (.env.local)

Créez un fichier `.env.local` à la racine du projet avec les clés publiques:

```env
# ⚠️ PUBLIQUES - Exposées dans le bundle frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_stripe
VITE_PAYPAL_CLIENT_ID=votre_client_id_paypal

# APP_BASE_URL (optionnel, par défaut: https://benilinkproduct.vercel.app)
VITE_APP_BASE_URL=https://benilinkproduct.vercel.app
```

---

## Configuration Vercel (Variables Privées)

Les variables suivantes doivent être configurées dans le dashboard Vercel:
**Settings > Environment Variables**

### Stripe (Obligatoire pour Stripe)
```env
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook_stripe
```

### PayPal (Optionnel pour PayPal)
```env
PAYPAL_CLIENT_ID=votre_client_id_paypal
PAYPAL_CLIENT_SECRET=votre_client_secret_paypal
```

### Supabase (Optionnel - base de données)
```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE=your_service_role_key
```

### Resend (Optionnel - emails)
```env
RESEND_API_KEY=re_votre_cle_api_resend
```

---

## 🔵 STRIPE - Configuration Complète

### 1. Créer des clés Stripe

1. Allez sur [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Copiez **Publishable key** (pk_test_...) → `.env.local` `VITE_STRIPE_PUBLISHABLE_KEY`
3. Copiez **Secret key** (sk_test_...) → Vercel `STRIPE_SECRET_KEY`

### 2. Configurer le webhook

1. Allez sur [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Cliquez **Add endpoint**
3. Entrez: `https://votre-domaine.vercel.app/api/stripe-webhook`
4. Sélectionnez **Events:** `checkout.session.completed`, `charge.refunded`
5. Copiez **Signing secret** (whsec_...) → Vercel `STRIPE_WEBHOOK_SECRET`

### 3. Tester en local
```bash
npm run dev
# Votre app sera sur http://localhost:3000

# Dans un autre terminal, utilisez Stripe CLI pour tester les webhooks:
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

---

## 🔵 PAYPAL - Configuration Complète

### 1. Créer une application PayPal

1. Allez sur [https://developer.paypal.com/dashboard](https://developer.paypal.com/dashboard)
2. Créez une nouvelle **Sandbox Application**
3. Copiez le **Client ID** → `.env.local` `VITE_PAYPAL_CLIENT_ID`
4. Copiez le **Secret** → Vercel `PAYPAL_CLIENT_SECRET` (optionnel pour la démo)

### 2. Configurer les URLs de retour

1. Dans PayPal Dashboard > Settings:
2. **Success URL:** `https://votre-domaine.vercel.app/checkout/success`
3. **Cancel URL:** `https://votre-domaine.vercel.app/checkout/cancel`

### 3. Mode de test

- PayPal fonctionne automatiquement en mode **Sandbox** si vous utilisez `pk_test_` pour Stripe
- Pour tester: Utilisez les comptes de test fournis par PayPal

---

## 💾 BASE DE DONNÉES - Commandes Sauvegardées

### Fichiers locaux (par défaut)
Les commandes sont sauvegardées dans:
- `./orders/orders.json` (format JSON structuré)
- `./orders/orders.txt` (format lisible)

### Supabase (Optionnel)
Pour utiliser Supabase à la place des fichiers:

1. Créez une table `orders`:
```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id VARCHAR UNIQUE,
  created_at TIMESTAMP,
  currency VARCHAR(3),
  subtotal_eur DECIMAL,
  shipping_eur DECIMAL,
  tax_eur DECIMAL,
  total_eur DECIMAL,
  total_weight_kg DECIMAL,
  delivery_method VARCHAR,
  payment_method VARCHAR,
  delivery_info JSONB,
  items JSONB,
  metadata JSONB,
  inserted_at TIMESTAMP DEFAULT NOW()
);
```

2. Configurez dans Vercel:
```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE=your_service_role_key
```

---

## 📧 EMAILS - Configuration Resend

Pour envoyer des emails de confirmation:

1. Inscrivez-vous sur [https://resend.com](https://resend.com)
2. Obtenez une **API Key**
3. Configurez dans Vercel:
```env
RESEND_API_KEY=re_votre_cle
```

4. L'email sera automatiquement envoyé après chaque commande

---

## ✅ CHECKLIST - Avant de Lancer

- [ ] `.env.local` créé avec clés Stripe/PayPal publiques
- [ ] Vercel: Variables `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` configurées
- [ ] Stripe Webhook ajouté et testable
- [ ] PayPal Client ID configuré (si PayPal utilisé)
- [ ] Test WhatsApp: ✅ Fonctionne toujours (pas besoin de clé)
- [ ] Test local: `npm run dev` + ajouter au panier + tester checkout

---

## 🧪 TESTER LOCALEMENT

### WhatsApp
```bash
npm run dev
# Panier → WhatsApp → Devrait ouvrir wa.me/33768585890
```

### Stripe
```bash
npm run dev

# Dans un autre terminal:
stripe listen --forward-to localhost:3000/api/stripe-webhook

# Dans l'app:
# Panier → Stripe → Devrait rediriger vers Stripe Checkout
# Après "paiement": Devrait revenir sur /checkout/success avec le vrai numéro
```

### PayPal
```bash
# Besoin de VITE_PAYPAL_CLIENT_ID en local
# Panier → PayPal → Devrait afficher les boutons PayPal
# Après "paiement": Devrait sauvegarder et retourner à l'accueil
```

---

## 🚀 DÉPLOYER SUR VERCEL

### 1. Ajouter les variables d'environnement
```
Vercel Dashboard > Settings > Environment Variables
```

Ajouter:
- `STRIPE_SECRET_KEY` = sk_test_...
- `STRIPE_WEBHOOK_SECRET` = whsec_...
- `PAYPAL_CLIENT_ID` = (optionnel)
- Autres clés API au besoin

### 2. Redéployer
```bash
git add .env (NE PAS commiter de vraies clés!)
git commit -m "Configure payment system"
git push
```

Vercel redéploiera automatiquement.

### 3. Tester en production
- Allez sur votre URL Vercel
- Testez les trois méthodes de paiement
- Vérifiez que les commandes sont sauvegardées dans `./orders/`

---

## 🐛 TROUBLESHOOTING

### Stripe Checkout ne s'ouvre pas
- Vérifiez `VITE_STRIPE_PUBLISHABLE_KEY` dans `.env.local`
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous que le panier ≥ 5kg

### PayPal boutons ne s'affichent pas
- Vérifiez `VITE_PAYPAL_CLIENT_ID` dans `.env.local`
- Vérifiez que PayPal SDK charge (réseau > XHR)
- Assurez-vous que le panier ≥ 5kg

### Webhook Stripe ne fonctionne pas
- Vérifiez que vous avez configuré `STRIPE_WEBHOOK_SECRET` sur Vercel
- Testez avec Stripe CLI en local: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
- Vérifiez que l'URL du webhook est exacte: `https://votre-domaine.vercel.app/api/stripe-webhook`

### Les commandes ne sont pas sauvegardées
- Vérifiez que le répertoire `./orders/` existe et est accessible
- Sur Vercel, utilisez Supabase pour la persistance (les fichiers disparaissent après redéploiement)

---

## 📞 SUPPORT

Pour toute question:
- Stripe: [https://support.stripe.com](https://support.stripe.com)
- PayPal: [https://developer.paypal.com/support](https://developer.paypal.com/support)
- WhatsApp Business: Le numéro est dans `constants.js` (33768585890)
