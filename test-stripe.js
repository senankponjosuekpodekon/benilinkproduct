#!/usr/bin/env node

/**
 * Script de test Stripe - Vérifie la configuration locale
 * Usage: node test-stripe.js
 */

import dotenv from 'dotenv';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '.env.local') });
dotenv.config({ path: path.join(__dirname, '.env') });

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

async function testStripe() {
  log(colors.cyan, '\n🔵 TEST STRIPE - Configuration Locale\n');
  
  // 1️⃣ Vérifier les clés
  log(colors.blue, '1️⃣  Vérification des clés d\'environnement...');
  
  const publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let configValid = true;

  if (!publishableKey) {
    log(colors.red, '❌ VITE_STRIPE_PUBLISHABLE_KEY manquante');
    configValid = false;
  } else if (!publishableKey.startsWith('pk_')) {
    log(colors.red, '❌ VITE_STRIPE_PUBLISHABLE_KEY invalide (doit commencer par pk_)');
    configValid = false;
  } else {
    log(colors.green, `✅ VITE_STRIPE_PUBLISHABLE_KEY: ${publishableKey.substring(0, 20)}...`);
  }

  if (!secretKey) {
    log(colors.red, '❌ STRIPE_SECRET_KEY manquante');
    configValid = false;
  } else if (!secretKey.startsWith('sk_')) {
    log(colors.red, '❌ STRIPE_SECRET_KEY invalide (doit commencer par sk_)');
    configValid = false;
  } else {
    log(colors.green, `✅ STRIPE_SECRET_KEY: ${secretKey.substring(0, 20)}...`);
  }

  if (!webhookSecret) {
    log(colors.yellow, '⚠️  STRIPE_WEBHOOK_SECRET manquante (nécessaire pour tester les webhooks)');
  } else if (!webhookSecret.startsWith('whsec_')) {
    log(colors.red, '❌ STRIPE_WEBHOOK_SECRET invalide (doit commencer par whsec_)');
    configValid = false;
  } else {
    log(colors.green, `✅ STRIPE_WEBHOOK_SECRET: ${webhookSecret.substring(0, 20)}...`);
  }

  if (!configValid) {
    log(colors.red, '\n❌ Configuration invalide. Veuillez mettre à jour vos variables d\'environnement.');
    process.exit(1);
  }

  // 2️⃣ Tester la connexion Stripe
  log(colors.blue, '\n2️⃣  Test de connexion à Stripe...');

  try {
    const stripe = new Stripe(secretKey);

    // Tester une requête simple
    const account = await stripe.account.retrieve();
    log(colors.green, `✅ Connexion réussie à Stripe`);
    log(colors.green, `   Compte: ${account.email}`);
    log(colors.green, `   Statut: ${account.charges_enabled ? 'Actif' : 'Inactif'}`);

    // 3️⃣ Tester la création d'une session Stripe
    log(colors.blue, '\n3️⃣  Test de création d\'une session Stripe...');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: '🧪 TEST - Huile de ricin 1L',
              description: 'Session de test Stripe',
            },
            unit_amount: 1500, // 15 EUR en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/checkout/cancel',
      metadata: {
        test: 'true',
      },
    });

    log(colors.green, `✅ Session créée avec succès`);
    log(colors.green, `   Session ID: ${session.id}`);
    log(colors.green, `   URL: ${session.url}`);
    log(colors.cyan, `\n💡 Lien de test (copier-coller dans navigateur):`);
    log(colors.yellow, `   ${session.url}`);

    // 4️⃣ Tester la récupération de la session
    log(colors.blue, '\n4️⃣  Test de récupération de la session...');

    const retrievedSession = await stripe.checkout.sessions.retrieve(session.id);
    log(colors.green, `✅ Session récupérée`);
    log(colors.green, `   Montant: ${retrievedSession.amount_total / 100} EUR`);
    log(colors.green, `   Statut paiement: ${retrievedSession.payment_status}`);

    // 5️⃣ Lister les dernières sessions (pour vérifier la connexion)
    log(colors.blue, '\n5️⃣  Lister les dernières sessions...');

    const sessions = await stripe.checkout.sessions.list({ limit: 5 });
    log(colors.green, `✅ ${sessions.data.length} dernières sessions récupérées`);

    if (sessions.data.length > 0) {
      log(colors.green, `   Dernière session: ${sessions.data[0].id}`);
      log(colors.green, `   Montant: ${sessions.data[0].amount_total / 100} EUR`);
    }

    // ✅ Résumé
    log(colors.green, '\n✅ TOUS LES TESTS RÉUSSIS!\n');
    log(colors.cyan, '📋 Prochaines étapes pour tester les webhooks:');
    log(colors.yellow, '   1. Installez Stripe CLI: https://stripe.com/docs/stripe-cli');
    log(colors.yellow, '   2. Dans un terminal: stripe listen --forward-to localhost:3000/api/stripe-webhook');
    log(colors.yellow, '   3. Copiez la clé webhook secret et ajoutez-la à .env.local');
    log(colors.yellow, '   4. Visitez l\'URL de session pour tester un paiement fictif');
    log(colors.yellow, '   5. Les webhooks devraient être reçus dans votre terminal CLI\n');

  } catch (error) {
    log(colors.red, `\n❌ Erreur Stripe: ${error.message}`);
    
    if (error.message.includes('Invalid API Key provided')) {
      log(colors.red, '   La clé secrète Stripe est invalide ou expirée');
    } else if (error.message.includes('Unexpected token')) {
      log(colors.red, '   Erreur de parsing - Vérifiez le format des clés');
    }
    
    log(colors.red, `\nDétails: ${error.type}`);
    process.exit(1);
  }
}

// Lancer le test
testStripe().catch((error) => {
  log(colors.red, '\n❌ Erreur non gérée:', error);
  process.exit(1);
});
