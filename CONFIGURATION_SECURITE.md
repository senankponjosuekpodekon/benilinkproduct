# 🔒 Configuration Sécurité & Emails - BENILINK

## 📧 Configuration des Emails avec Resend

### Étape 1 : Créer un compte Resend
1. Aller sur [resend.com](https://resend.com)
2. Créer un compte gratuit (100 emails/jour)
3. Vérifier votre domaine (ou utiliser `onboarding@resend.dev` pour les tests)
4. Générer une clé API

### Étape 2 : Installer Resend
```bash
npm install resend
```

### Étape 3 : Ajouter la clé dans Vercel
Dans le dashboard Vercel :
- Settings > Environment Variables
- Ajouter : `RESEND_API_KEY` = `re_xxxxxxxxx`

### Étape 4 : Créer l'API email
Fichier déjà créé : `/api/send-order-email.js` (voir SECURITE_ET_SEO.md)

### Étape 5 : Appeler l'API après chaque commande
```javascript
// Dans handleCheckout, handleStripeCheckout, etc.
await fetch('/api/send-order-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderData })
});
```

---

## 🔐 Variables d'Environnement (Vercel)

### Variables PUBLIQUES (frontend) :
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
VITE_PAYPAL_CLIENT_ID=xxxxx
VITE_APP_BASE_URL=https://votre-domaine.com
```

### Variables PRIVÉES (backend uniquement) :
```
STRIPE_SECRET_KEY=sk_live_xxxxx
RESEND_API_KEY=re_xxxxx
GEMINI_API_KEY=xxxxx (RETIRER le VITE_ du nom)
```

⚠️ **Important** : Les variables avec `VITE_` sont exposées publiquement !

---

## 🛡️ Sécuriser l'API Gemini

### Actuellement (❌ DANGEREUX) :
```javascript
// Dans Home.tsx - LA CLÉ EST VISIBLE !
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

### Solution (✅ SÉCURISÉ) :
1. Créer `/api/chat.js` :
```javascript
import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY; // Sans VITE_
  const { message, products } = req.body;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Catalogue : ${JSON.stringify(products)}.
                Réponds à : ${message}. Tu es un expert en cosmétique naturelle.`
    });

    return res.status(200).json({ text: response.text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

2. Dans `Home.tsx`, remplacer par :
```javascript
const handleSendMessage = async () => {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: userInput,
      products: PRODUCTS.map(p => ({ n: p.name, p: p.price, u: p.unit }))
    })
  });
  const data = await res.json();
  setChatMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
};
```

---

## 📊 Visualiser les Commandes

### Option 1 : Fichier texte (actuel)
```bash
# Voir les commandes
cat orders/orders.txt

# Compter les commandes
grep "NOUVELLE COMMANDE" orders/orders.txt | wc -l

# Dernière commande
tail -50 orders/orders.txt
```

### Option 2 : JSON avec jq
```bash
# Installer jq (Linux/Mac)
sudo apt install jq  # ou brew install jq

# Voir toutes les commandes
cat orders/orders.json | jq '.'

# Compter
cat orders/orders.json | jq 'length'

# Total des ventes
cat orders/orders.json | jq '[.[].totalAmount] | add'
```

### Option 3 : Dashboard Admin Simple
Créer `/pages/Admin.tsx` avec authentification :
```typescript
// Mot de passe simple (temporaire)
const [password, setPassword] = useState('');
const [authenticated, setAuthenticated] = useState(false);

if (password === 'BeniLink2026!') {
  setAuthenticated(true);
  // Charger orders.json et afficher
}
```

---

## 🚨 Checklist Sécurité

### ✅ À faire IMMÉDIATEMENT :
- [ ] Déplacer `GEMINI_API_KEY` côté serveur (retirer `VITE_`)
- [ ] Valider les prix côté serveur dans `/api/create-checkout-session.js`
- [ ] Ajouter `/orders/` dans `.gitignore` ✅ (déjà fait)
- [ ] Configurer Resend pour les emails

### ✅ À faire RAPIDEMENT :
- [ ] Ajouter rate limiting (express-rate-limit)
- [ ] Créer dashboard admin avec mot de passe
- [ ] Sauvegarder les commandes dans une vraie DB (PostgreSQL/Supabase)

### ✅ À faire PLUS TARD :
- [ ] Authentification admin (NextAuth.js)
- [ ] Chiffrement des données sensibles
- [ ] Logs d'activité
- [ ] Backup automatique des commandes

---

## 📈 Dashboard Admin Recommandé

### Stack suggérée :
1. **Auth** : Simple mot de passe ou NextAuth.js
2. **DB** : Supabase (PostgreSQL gratuit)
3. **UI** : shadcn/ui + Recharts pour les graphiques
4. **Routes** :
   - `/admin` - Login
   - `/admin/orders` - Liste des commandes
   - `/admin/stats` - Statistiques
   - `/admin/products` - Gestion produits

### Exemple de stats à afficher :
- Nombre de commandes (jour/semaine/mois)
- Chiffre d'affaires total
- Produits les plus vendus
- Pays de livraison (répartition)
- Méthodes de paiement utilisées

---

## 🔗 Ressources

- [Resend Documentation](https://resend.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Supabase](https://supabase.com) - Base de données gratuite
- [shadcn/ui](https://ui.shadcn.com) - Composants UI

---

**⚠️ IMPORTANT** : Ne jamais committer le dossier `/orders/` sur GitHub !
