#!/bin/bash

# Script de réparation rapide pour le site BeniLink

echo "🔧 Réparation du site BeniLink..."

# 1. Supprimer les imports Tailwind qui causent problème
echo "1️⃣ Nettoyage des fichiers Tailwind..."
rm -f tailwind.config.js postcss.config.js

# 2. Créer un fichier CSS vide pour éviter les erreurs d'import
echo "2️⃣ Création d'un fichier CSS minimal..."
cat > index.css << 'EOF'
/* Styles de base - Tailwind est chargé via CDN dans index.html */
EOF

# 3. Remettre le CDN Tailwind dans index.html
echo "3️⃣ Ajout du CDN Tailwind dans index.html..."
sed -i '/<\/script>/a\    <script src="https://cdn.tailwindcss.com"></script>' index.html

echo "✅ Réparation terminée!"
echo "🚀 Relancez le serveur avec: npm run dev"
