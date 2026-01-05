# 🚀 Configuration des moyens de paiement sur Vercel

## ⚠️ Problème identifié

Les moyens de paiement (Stripe et PayPal) ne fonctionnaient pas car :
1. Les variables d'environnement n'étaient pas configurées sur Vercel
2. Les variables étaient accédées avec `process.env` au lieu de `import.meta.env.VITE_*`
3. L'API serverless n'était pas configurée correctement

## ✅ Corrections apportées

### 1. Structure du projet mise à jour
```
/api/index.js          <- API serverless pour Stripe
/vercel.json           <- Configuration Vercel
/.env.example          <- Template des variables d'environnement
```

### 2. Variables d'environnement modifiées dans App.tsx
- ✅ `process.env.PAYPAL_CLIENT_ID` → `import.meta.env.VITE_PAYPAL_CLIENT_ID`
- ✅ `process.env.STRIPE_PUBLISHABLE_KEY` → `import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY`
- ✅ `process.env.GEMINI_API_KEY` → `import.meta.env.VITE_GEMINI_API_KEY`

## 📝 Instructions pour déployer sur Vercel

### Étape 1 : Configurer les variables d'environnement sur Vercel

1. Allez sur votre projet Vercel : https://vercel.com/dashboard
2. Sélectionnez votre projet : **benilinkproduct**
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables suivantes :

#### Variables pour le CLIENT (préfixe VITE_)
```bash
# PayPal (côté client)
VITE_PAYPAL_CLIENT_ID=votre_paypal_client_id_production

# Stripe (côté client)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_votre_cle_publique_stripe

# Gemini AI (côté client)
VITE_GEMINI_API_KEY=votre_cle_api_gemini

# Configuration du site
VITE_APP_BASE_URL=https://benilinkproduct.vercel.app
VITE_STRIPE_SUCCESS_PATH=/?checkout=success
VITE_STRIPE_CANCEL_PATH=/?checkout=cancel
```

#### Variables pour le SERVEUR (sans préfixe VITE_)
```bash
# Stripe (côté serveur - IMPORTANT : clé secrète)
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete_stripe

# Configuration serveur
APP_BASE_URL=https://benilinkproduct.vercel.app
STRIPE_SUCCESS_PATH=/?checkout=success
STRIPE_CANCEL_PATH=/?checkout=cancel
```

### Étape 2 : Obtenir vos clés API

#### 🔹 Pour Stripe :
1. Créez un compte sur https://stripe.com
2. Allez dans **Developers** → **API keys**
3. Copiez :
   - **Publishable key** (pk_test_... ou pk_live_...) → `VITE_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (sk_test_... ou sk_live_...) → `STRIPE_SECRET_KEY`

⚠️ **IMPORTANT** : Ne jamais exposer la clé secrète (`sk_...`) dans le code client !

#### 🔹 Pour PayPal :
1. Créez un compte sur https://developer.paypal.com
2. Allez dans **My Apps & Credentials**
3. Créez une nouvelle app ou utilisez une existante
4. Copiez le **Client ID** → `VITE_PAYPAL_CLIENT_ID`

#### 🔹 Pour Gemini AI (optionnel - chatbot) :
1. Allez sur https://aistudio.google.com/app/apikey
2. Créez une clé API
3. Copiez la clé → `VITE_GEMINI_API_KEY`

### Étape 3 : Redéployer sur Vercel

Après avoir ajouté toutes les variables d'environnement :

1. **Option A** : Depuis le dashboard Vercel
   - Allez dans **Deployments**
   - Cliquez sur les trois points du dernier déploiement
   - Cliquez sur **Redeploy**

2. **Option B** : En poussant un nouveau commit
   ```bash
   git add .
   git commit -m "fix: Configure payment methods for Vercel"
   git push
   ```

### Étape 4 : Tester les paiements

1. Allez sur https://benilinkproduct.vercel.app
2. Ajoutez un produit au panier
3. Testez chaque moyen de paiement :
   - **WhatsApp** : devrait fonctionner immédiatement
   - **PayPal** : devrait afficher les boutons PayPal
   - **Stripe** : devrait rediriger vers Stripe Checkout

## 🧪 Mode Test vs Production

### Mode Test (recommandé pour commencer)
Utilisez les clés de test :
- Stripe : `pk_test_...` et `sk_test_...`
- PayPal : Sandbox Client ID

### Mode Production
Quand tout fonctionne en test, passez aux clés de production :
- Stripe : `pk_live_...` et `sk_live_...`
- PayPal : Live Client ID

## 🔍 Dépannage

### Les boutons PayPal n'apparaissent pas
- Vérifiez que `VITE_PAYPAL_CLIENT_ID` est bien configuré sur Vercel
- Ouvrez la console du navigateur (F12) pour voir les erreurs

### Stripe ne redirige pas
- Vérifiez que `VITE_STRIPE_PUBLISHABLE_KEY` et `STRIPE_SECRET_KEY` sont bien configurés
- Vérifiez que l'URL de base est correcte : `https://benilinkproduct.vercel.app`

### Erreur "CORS" ou "Network error"
- Vérifiez que l'API serverless fonctionne : https://benilinkproduct.vercel.app/api
- Consultez les logs dans Vercel Dashboard → Functions → Logs

## 📦 Fichiers modifiés

1. ✅ `/api/index.js` - API serverless pour Stripe
2. ✅ `/vercel.json` - Configuration Vercel
3. ✅ `/App.tsx` - Variables d'environnement corrigées
4. ✅ `/server.js` - Routes API retirées (maintenant dans /api)
5. ✅ `/.env.example` - Template pour les variables

## 🎯 Checklist finale

- [ ] Variables d'environnement ajoutées sur Vercel (avec préfixe VITE_ pour le client)
- [ ] `STRIPE_SECRET_KEY` ajoutée (SANS préfixe VITE_)
- [ ] Projet redéployé sur Vercel
- [ ] Test du paiement PayPal
- [ ] Test du paiement Stripe
- [ ] WhatsApp fonctionne

## 💡 Notes importantes

1. **Préfixe VITE_** : Seules les variables avec ce préfixe sont accessibles côté client
2. **Clés secrètes** : Ne jamais ajouter de clé secrète avec le préfixe VITE_
3. **Variables serveur** : Les variables sans préfixe VITE_ sont uniquement pour l'API serverless
4. **Redéploiement** : Après avoir modifié les variables d'environnement, il FAUT redéployer

## 📞 Support

Si vous rencontrez des problèmes :
1. Consultez les logs Vercel : Dashboard → Project → Deployments → View Function Logs
2. Vérifiez la console du navigateur (F12)
3. Testez l'API directement : `curl https://benilinkproduct.vercel.app/api`
