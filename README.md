<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BeniLink – Vitrine & commande e-commerce

Vitrine premium (React + Vite) pour produits béninois (cosmétiques, huiles, matières premières) avec paiements Stripe/PayPal, sauvegarde commandes, emails, et dashboard admin.

## Fonctionnalités clés
- Catalogue produits avec panier et frais de livraison calculés selon le poids (0,5kg→5€ jusqu'à >10kg→30€).
- **Pricing EUR-first :** Prix en Euros TTC avec TVA 20% incluse, markup 3.0x sur prix de base.
- Checkout sécurisé : validation des prix côté serveur (`/api/validate-order`) avec recalcul EUR et poids.
- Sauvegarde commandes en fichiers (`orders.txt` + `orders.json`) et (optionnel) Supabase.
- Emails transactionnels via Resend (client + admin) avec montants EUR.
- Chat produit via Gemini sécurisé côté serveur (`/api/chat`).
- Dashboard admin protégé par token (`/admin`) listant les commandes.
- **Options de livraison :** Retrait Tence/Saint-Étienne (gratuit), Colissimo, Point Relais.
- SEO complet (meta tags, Open Graph, sitemap, robots).
- Rate limiting des routes API (dev server).

## Prérequis
- Node.js 18+
- Compte Stripe et PayPal (clés test ou live)
- Clé Gemini (Google) pour le chat
- Clé Resend pour les emails (optionnel mais recommandé)
- Supabase (optionnel) si vous voulez persister en base

## Installation rapide
1) Installer les dépendances :
```bash
npm install
```
2) Copier `.env.example` vers `.env.local` et renseigner les clés (voir section Variables).
3) Lancer en dev (app + API sur un serveur unique) :
```bash
npm run dev
```
4) Build et prévisualisation prod-like :
```bash
npm run build
npm run preview
```

## Variables d'environnement
Public (exposées au client, préfixe `VITE_`):
- VITE_STRIPE_PUBLISHABLE_KEY

Privées (serveur uniquement) :
- STRIPE_SECRET_KEY
- PAYPAL_CLIENT_ID
- GEMINI_API_KEY
- RESEND_API_KEY (emails)
- ADMIN_DASH_TOKEN (accès dashboard admin)
- SUPABASE_URL, SUPABASE_SERVICE_ROLE (optionnel, base de données)
- APP_BASE_URL, STRIPE_SUCCESS_PATH, STRIPE_CANCEL_PATH (URLs de retour Stripe)

Voir `.env.example` pour la liste complète et les notes.

## Pricing et Livraison

### Modèle de prix EUR-first
- **Devise :** Tous les prix en Euros (€) TTC (TVA 20% incluse)
- **Calcul :** Prix de base (FCFA) × 3.0 (markup) ÷ 655 (taux FCFA/EUR) × 1.20 (TVA)
- **Markup :** Facteur 3.0x appliqué aux prix bruts (configurable dans `constants.ts`)
- **TVA :** 20% incluse dans tous les prix affichés (France)
- **Source de vérité :** Prix recalculés côté serveur depuis `constants.ts` > `PRODUCTS`

### Frais de livraison (calcul par poids)
- **Retrait gratuit :** Tence (Haute-Loire) ou Saint-Étienne (Loire)
- **Livraison par poids :**
  - Jusqu'à 0,5 kg : 5€
  - Jusqu'à 1 kg : 7€
  - Jusqu'à 2 kg : 9€
  - Jusqu'à 5 kg : 14€
  - Jusqu'à 10 kg : 20€
  - Plus de 10 kg : 30€
- **Options :** Colissimo, Point Relais, retrait sur place
- **Estimation poids :** Parsée depuis unité (g/ml) + heuristiques kilo/litre

## API principales
- POST /api/validate-order : Valide le panier côté serveur, recalcule les prix en EUR depuis PRODUCTS, applique livraison basée sur le poids, calcule TVA incluse, sauvegarde fichiers, envoie emails, push Supabase si configuré.
- POST /api/send-order-email : Envoi emails (client + admin) via Resend avec montants EUR (non bloquant si clé absente).
- POST /api/chat : Chat produit avec Gemini (clé côté serveur).
- GET /api/orders-admin : Liste des commandes (fichier orders.json), protégé par token ADMIN_DASH_TOKEN (en-tête x-admin-token ou Authorization: Bearer).
- POST /api : Création de session Stripe (checkout) avec montants EUR et shipping.

## Dashboard admin
- Route : /admin
- Protection : saisir le token ADMIN_DASH_TOKEN (non exposé au client) ; stocké localement pour les rafraîchissements.
- Affiche commandes, CA, moyenne panier, détails des articles.

## Sauvegarde des commandes
- Fichiers : orders/orders.txt (lisible, EUR-first avec poids/mode livraison) et orders/orders.json (structuré).
- Base (optionnel) : Supabase table orders (voir migration ci-dessous). En cas d'erreur Supabase, la commande reste sauvegardée en fichiers.

## Migration Supabase (optionnel)
Un script est fourni : supabase/migrations/2026-01-07-init-orders.sql
- Table orders avec montants EUR (subtotal_eur, shipping_eur, tax_eur, total_eur), poids (total_weight_kg), mode livraison (delivery_method), items JSONB, delivery_info JSONB, metadata JSONB, status.
- Index sur date, pays, méthode de paiement.
- Ajoutez RLS si vous ouvrez l'accès côté client (service_role recommandé pour le backend seulement).

## Sécurité
- Rate limiting appliqué sur /api (dev server).
- Clés sensibles non préfixées VITE_ pour éviter l'exposition côté client.
- Validation stricte des produits/prix côté serveur.
- Token admin requis pour l'endpoint et le dashboard.

## Scripts utiles
- npm run dev : serveur unique (Vite en middleware + API)
- npm run build : build Vite
- npm run preview : sert le build avec le serveur Node

## Emailing (Resend)
- Installer déjà fait : npm install resend
- Configurer RESEND_API_KEY
- Domaines d'envoi recommandés pour éviter le spam

## Notes SEO
- Meta tags, Open Graph, Twitter Cards, schema.org Store, sitemap et robots déjà en place.

## Support
- WhatsApp: +33 7 68 58 58 90
- Email: germaine.elitenetworker@gmail.com
