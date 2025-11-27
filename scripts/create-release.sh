#!/bin/bash

# Script pour créer une nouvelle release de WealthTracker
# Usage: ./scripts/create-release.sh <version>
# Exemple: ./scripts/create-release.sh 1.1.0

set -e

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier qu'une version est fournie
if [ -z "$1" ]; then
    echo -e "${RED}❌ Erreur: Veuillez fournir un numéro de version${NC}"
    echo "Usage: $0 <version>"
    echo "Exemple: $0 1.1.0"
    exit 1
fi

VERSION=$1
TAG="v${VERSION}"

echo -e "${YELLOW}🚀 Création de la release ${TAG}${NC}"
echo ""

# Vérifier que nous sommes sur main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}❌ Erreur: Vous devez être sur la branche 'main'${NC}"
    echo "Branche actuelle: $CURRENT_BRANCH"
    exit 1
fi

# Vérifier qu'il n'y a pas de modifications non commitées
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Erreur: Il y a des modifications non commitées${NC}"
    git status --short
    exit 1
fi

# Mettre à jour depuis origin
echo -e "${YELLOW}📥 Mise à jour depuis origin...${NC}"
git pull origin main

# Vérifier que le tag n'existe pas déjà
if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo -e "${RED}❌ Erreur: Le tag ${TAG} existe déjà${NC}"
    exit 1
fi

# Mettre à jour la version dans package.json
echo -e "${YELLOW}📝 Mise à jour de package.json...${NC}"
sed -i "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" package.json

# Vérifier que les tests passent
echo -e "${YELLOW}✅ Exécution des tests...${NC}"
npm run test

# Vérifier le linting
echo -e "${YELLOW}🔍 Vérification du linting...${NC}"
npm run lint

# Vérifier le typecheck
echo -e "${YELLOW}🔷 Vérification TypeScript...${NC}"
npm run typecheck

# Commit de la version
echo -e "${YELLOW}💾 Commit de la version ${VERSION}...${NC}"
git add package.json
git commit -m "chore: bump version to ${VERSION}"

# Créer le tag
echo -e "${YELLOW}🏷️  Création du tag ${TAG}...${NC}"
git tag -a "$TAG" -m "Release ${TAG}"

# Pousser les changements
echo -e "${YELLOW}📤 Push vers origin...${NC}"
git push origin main
git push origin "$TAG"

echo ""
echo -e "${GREEN}✅ Release ${TAG} créée avec succès!${NC}"
echo ""
echo "🔗 Suivre le build sur:"
echo "   https://github.com/TitouanLeBrun/wealthtracker/actions"
echo ""
echo "📦 La release sera disponible dans ~10-15 minutes sur:"
echo "   https://github.com/TitouanLeBrun/wealthtracker/releases/tag/${TAG}"
echo ""
