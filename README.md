<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Set the `PAYPAL_CLIENT_ID` in [.env.local](.env.local) (live or sandbox client ID)
4. For Stripe, set:
   - `STRIPE_PUBLISHABLE_KEY` (test or live)
   - `STRIPE_SECRET_KEY` (server, test or live)
5. Env URLs (optionnel, pour personnaliser dynamiquement):
   - `API_BASE_URL` (ex: http://localhost:3001) pour proxy `/api` côté Vite et appels client
   - `APP_BASE_URL` (ex: https://votre-domaine.com) pour URLs de retour Stripe
   - `STRIPE_SUCCESS_PATH` (ex: /paiement/succes)
   - `STRIPE_CANCEL_PATH` (ex: /paiement/annule)
6. Run in single-server mode:
    - Dev (one server for app + API):
       `npm run dev`
    - Build + run (production-like):
       `npm run build`
       `npm run preview`

Le serveur unique sert l'app (Vite en middleware en dev, fichiers statiques en prod) et les routes API sous `/api`.
