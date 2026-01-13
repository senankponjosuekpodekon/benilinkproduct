# ✅ CHECKLIST DE DÉPLOIEMENT - PAIEMENTS BENILINK

## Avant de commencer
- [ ] Lire `SETUP_PAIEMENTS.md`
- [ ] Comprendre les 3 méthodes de paiement
- [ ] Avoir accès à Stripe, PayPal, et Vercel dashboards

---

## Phase 1: Configuration Locale (10 min)

### Stripe Setup
- [ ] Créer un compte Stripe: https://stripe.com/
- [ ] Aller à: https://dashboard.stripe.com/apikeys
- [ ] Copier **Publishable key** (pk_test_...)
  - [ ] Coller dans `.env.local`: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] Copier **Secret key** (sk_test_...)
  - [ ] Note pour Vercel (phase 2)

### PayPal Setup (Optionnel)
- [ ] Créer un compte PayPal: https://developer.paypal.com/
- [ ] Créer une Sandbox Application
- [ ] Copier **Client ID**
  - [ ] Coller dans `.env.local`: `VITE_PAYPAL_CLIENT_ID=...`

### `.env.local` - Vérifier
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_PAYPAL_CLIENT_ID=... (optionnel)
```

### Tester en Local
```bash
npm run dev
# Doit marcher sur http://localhost:3000
```

---

## Phase 2: Webhook Stripe (5 min)

### Créer le Webhook
- [ ] Aller à: https://dashboard.stripe.com/webhooks
- [ ] Cliquer **Add endpoint**
- [ ] URL: `https://votre-site.vercel.app/api/stripe-webhook`
  - Remplacer `votre-site` par votre domaine Vercel
- [ ] Sélectionner les événements:
  - [ ] `checkout.session.completed`
  - [ ] `charge.refunded`
- [ ] Cliquer **Add endpoint**
- [ ] Copier **Signing secret** (whsec_...)
  - [ ] Note pour phase 3

---

## Phase 3: Configuration Vercel (5 min)

### Ajouter les Variables d'Environnement
1. Allez sur: https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Settings > Environment Variables
4. Ajouter **3 variables**:

| Variable | Valeur | Secret |
|----------|--------|--------|
| `STRIPE_SECRET_KEY` | sk_test_... | ✅ OUI |
| `STRIPE_WEBHOOK_SECRET` | whsec_... | ✅ OUI |
| `PAYPAL_CLIENT_ID` | (optionnel) | ❌ Non |

- [ ] Cliquez **Save**
- [ ] Attendez que Vercel redéploie (1-2 min)

### Vérifier le déploiement
- [ ] Voir le statut dans Deployments
- [ ] Attendre que le déploiement soit ✅ Completed

---

## Phase 4: Test en Production (10 min)

### Tests à faire
Allez sur: `https://votre-site.vercel.app`

#### Test WhatsApp
- [ ] Ajouter des produits au panier (5kg+)
- [ ] Cliquer "Commander via WhatsApp"
  - [ ] Devrait afficher alerte avec numéro de commande
  - [ ] Devrait ouvrir WhatsApp
  - [ ] Panier doit être vidé

#### Test Stripe
- [ ] Ajouter des produits au panier (5kg+)
- [ ] Sélectionner paiement "Stripe"
- [ ] Cliquer "Continuer vers Stripe Checkout"
  - [ ] Devrait rediriger vers Stripe
- [ ] Utiliser une **carte de test** (4242 4242 4242 4242)
  - Date: 12/26 (futur)
  - CVC: 123
  - ZIP: 12345
- [ ] Cliquer "Pay"
  - [ ] Devrait revenir sur `/checkout/success`
  - [ ] Doit afficher le VRAI numéro (BNL-...)
  - [ ] Devrait avoir un fichier `./orders/orders.json` créé

#### Test PayPal (Si configuré)
- [ ] Ajouter des produits au panier (5kg+)
- [ ] Sélectionner paiement "PayPal"
- [ ] Boutons PayPal doivent s'afficher
- [ ] Cliquer sur PayPal
  - [ ] Devrait ouvrir PayPal Sandbox
- [ ] Utiliser compte de test PayPal
- [ ] Après paiement:
  - [ ] Devrait afficher confirmation
  - [ ] Numéro de commande doit s'afficher

---

## Phase 5: Vérifications Finales

### Fichiers et Données
- [ ] Vérifier que `./orders/orders.json` existe
- [ ] Contient au moins une commande (de test)
- [ ] Chaque commande a:
  - [ ] `orderId` (BNL-...)
  - [ ] `items` (tableau)
  - [ ] `totalAmount` (montant)
  - [ ] `paymentMethod` (whatsapp/stripe/paypal)

### Webhook Stripe
- [ ] Dans Stripe Dashboard > Webhooks
- [ ] Vérifier les événements reçus (logs)
- [ ] Devrait voir les appels vers votre endpoint

### Gestion des Erreurs
- [ ] Tester avec moins de 5kg
  - [ ] Devrait bloquer avec alerte
- [ ] Tester sans remplir livraison
  - [ ] Devrait bloquer avec alerte
- [ ] Tester une carte déclinée (Stripe)
  - [ ] Devrait afficher erreur appropriée

---

## Phase 6: Passer en Mode LIVE (Quand prêt)

### ⚠️ IMPORTANT: Stripe LIVE
Quand vous êtes prêt pour la production:

1. Dans Stripe Dashboard:
   - [ ] Basculer en mode **LIVE** (toggle en haut)
   - [ ] Copier les clés LIVE (pk_live_ et sk_live_)

2. Dans Vercel:
   - [ ] Remplacer:
     - `STRIPE_SECRET_KEY` = sk_live_...
     - `VITE_STRIPE_PUBLISHABLE_KEY` = pk_live_...
     - (Garder `STRIPE_WEBHOOK_SECRET` pareil)

3. Créer un nouveau webhook pour LIVE:
   - [ ] Aller à https://dashboard.stripe.com/webhooks
   - [ ] Ajouter endpoint pour LIVE
   - [ ] URL: `https://votre-site.vercel.app/api/stripe-webhook`

4. Mettre à jour `.env.local` (local):
   - [ ] `VITE_STRIPE_PUBLISHABLE_KEY` = pk_live_...

### ⚠️ IMPORTANT: PayPal LIVE
Si vous utilisez PayPal:

1. Dans PayPal Dashboard:
   - [ ] Basculer en mode **LIVE**
   - [ ] Copier le Client ID LIVE

2. Dans Vercel:
   - [ ] Remplacer `PAYPAL_CLIENT_ID` avec la clé LIVE

3. Mettre à jour `.env.local` (local):
   - [ ] `VITE_PAYPAL_CLIENT_ID` = Client ID LIVE

---

## Phase 7: Suivi et Maintenance

### Vérifications Régulières
- [ ] Vérifier les commandes dans `./orders/orders.json`
- [ ] Monitorer les erreurs dans Vercel logs
- [ ] Vérifier les webhooks Stripe dans le dashboard

### Sauvegardes
- [ ] Télécharger régulièrement `orders.json` (sauvegarde locale)
- [ ] Ou configurer Supabase pour persistance

### Support Client
- [ ] Avoir un email pour les demandes de support
- [ ] Répondre rapidement aux problèmes de paiement
- [ ] Garder le numéro WhatsApp actif (33768585890)

---

## 🚨 PROBLÈMES COURANTS

### Stripe Checkout ne s'ouvre pas
- [ ] Vérifier `VITE_STRIPE_PUBLISHABLE_KEY` dans `.env.local`
- [ ] Vérifier console du navigateur (F12) pour les erreurs
- [ ] Assurez-vous que le panier >= 5kg

### PayPal boutons ne s'affichent pas
- [ ] Vérifier `VITE_PAYPAL_CLIENT_ID` dans `.env.local`
- [ ] Vérifier réseau (F12 > Network) pour SDK loading
- [ ] Assurez-vous que le panier >= 5kg

### Webhook ne fonctionne pas
- [ ] Vérifier que `STRIPE_WEBHOOK_SECRET` est correct sur Vercel
- [ ] Vérifier l'URL du webhook: `https://votre-site.vercel.app/api/stripe-webhook`
- [ ] Attendre quelques secondes entre un test et le suivant
- [ ] Vérifier les logs Vercel (Deployments > Logs)

### Les commandes ne sont pas sauvegardées
- [ ] Vérifier que dossier `./orders/` existe et est accessible
- [ ] Sur Vercel, les fichiers disparaissent après redéploiement
  - Solution: Configurer Supabase pour persistance

---

## ✅ DÉPLOIEMENT RÉUSSI QUAND:

- ✅ WhatsApp fonctionne (panier → wa.me)
- ✅ Stripe fonctionne (panier → checkout → success page)
- ✅ Page succès affiche le vrai numéro de commande
- ✅ Commande sauvegardée dans `./orders/orders.json`
- ✅ Webhook Stripe crée les commandes automatiquement
- ✅ Toutes les erreurs sont gérées proprement
- ✅ PayPal fonctionne (si configuré)

---

## 📞 BESOIN D'AIDE?

Consulter:
1. `SETUP_PAIEMENTS.md` - Guide complet
2. `CORRECTIONS_PAIEMENTS.md` - Détails techniques
3. Stripe Support: https://support.stripe.com
4. PayPal Support: https://developer.paypal.com/support

---

**Status:** ✅ Prêt à déployer!

**Après avoir complété ce checklist, votre système de paiement sera entièrement fonctionnel et sécurisé.**
