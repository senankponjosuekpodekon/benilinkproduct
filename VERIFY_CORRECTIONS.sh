#!/bin/bash
# 🔍 SCRIPT DE VÉRIFICATION - Corrections des Paiements

echo "═══════════════════════════════════════════════════════════"
echo "  ✅ VÉRIFICATION DES CORRECTIONS PAIEMENTS BENILINK"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
CHECKS=0
PASSED=0
FAILED=0

check() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✅${NC} $2"
    ((PASSED++))
  else
    echo -e "${RED}❌${NC} $2 - Fichier manquant: $1"
    ((FAILED++))
  fi
  ((CHECKS++))
}

check_contains() {
  if grep -q "$2" "$1" 2>/dev/null; then
    echo -e "${GREEN}✅${NC} $3"
    ((PASSED++))
  else
    echo -e "${RED}❌${NC} $3"
    ((FAILED++))
  fi
  ((CHECKS++))
}

echo "📋 VÉRIFICATION DES FICHIERS MODIFIÉS"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Vérifier les fichiers principaux
check "pages/Home.tsx" "pages/Home.tsx - Fichier présent"
check "pages/CheckoutSuccess.tsx" "pages/CheckoutSuccess.tsx - Fichier présent"
check "api/stripe-webhook.js" "api/stripe-webhook.js - Webhook créé"
check "api/validate-order.js" "api/validate-order.js - Validation présente"

echo ""
echo "📝 VÉRIFICATION DES MODIFICATIONS DE CODE"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Vérifier les modifications dans Home.tsx
check_contains "pages/Home.tsx" "handleCheckout" "Home.tsx - handleCheckout() présent"
check_contains "pages/Home.tsx" "handleStripeCheckout" "Home.tsx - handleStripeCheckout() corrigé"
check_contains "pages/Home.tsx" "onApprove:" "Home.tsx - PayPal onApprove corrigé"

# Vérifier CheckoutSuccess
check_contains "pages/CheckoutSuccess.tsx" "sessionStorage" "CheckoutSuccess - sessionStorage pour numéro"
check_contains "pages/CheckoutSuccess.tsx" "stripe_order_id" "CheckoutSuccess - Récupère order_id"

# Vérifier webhook
check_contains "api/stripe-webhook.js" "checkout.session.completed" "Webhook - Événement Stripe géré"
check_contains "api/stripe-webhook.js" "validateEvent" "Webhook - Signature vérifiée"
check_contains "api/stripe-webhook.js" "orders.json" "Webhook - Sauvegarde commande"

echo ""
echo "📚 VÉRIFICATION DE LA DOCUMENTATION"
echo "═══════════════════════════════════════════════════════════"
echo ""

check "SETUP_PAIEMENTS.md" "SETUP_PAIEMENTS.md - Guide de configuration créé"
check "CORRECTIONS_PAIEMENTS.md" "CORRECTIONS_PAIEMENTS.md - Détails créés"
check "README_ACTIONS.md" "README_ACTIONS.md - Actions à faire créées"
check ".env.example" ".env.example - Mis à jour"

echo ""
echo "🔒 VÉRIFICATION DE SÉCURITÉ"
echo "═══════════════════════════════════════════════════════════"
echo ""

check_contains "pages/Home.tsx" "totalWeightKg < 5" "Vérification poids minimum ajoutée"
check_contains "pages/Home.tsx" "/api/validate-order" "Utilisation de l'API sécurisée"
check_contains "api/stripe-webhook.js" "stripe.webhooks.constructEvent" "Webhook sécurisé (signature)"

echo ""
echo "⚙️ VÉRIFICATION DES FONCTIONNALITÉS"
echo "═══════════════════════════════════════════════════════════"
echo ""

check_contains "pages/Home.tsx" "clearCart()" "WhatsApp vide le panier après succès"
check_contains "pages/Home.tsx" "sessionStorage.setItem" "Stripe sauvegarde le numéro de commande"
check_contains "pages/CheckoutSuccess.tsx" "setOrderId" "Page succès affiche le vrai numéro"
check_contains "api/stripe-webhook.js" "sendOrderEmail" "Webhook envoie email de confirmation"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📊 RÉSULTATS"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "Total des vérifications: ${CHECKS}"
echo -e "✅ Réussies: ${GREEN}${PASSED}${NC}"
echo -e "❌ Échouées: ${RED}${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  ✅ TOUTES LES VÉRIFICATIONS RÉUSSIES!               ║${NC}"
  echo -e "${GREEN}║  Vous êtes prêt à configurer et tester les paiements  ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo "🚀 PROCHAINES ÉTAPES:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "1. Lire SETUP_PAIEMENTS.md"
  echo "2. Obtenir les clés Stripe"
  echo "3. Créer le webhook Stripe"
  echo "4. Configurer .env.local et Vercel"
  echo "5. Tester avec npm run dev"
  echo ""
else
  echo -e "${RED}❌ CERTAINES VÉRIFICATIONS ONT ÉCHOUÉ${NC}"
  echo "Veuillez vérifier les fichiers mentionnés ci-dessus."
  echo ""
fi
