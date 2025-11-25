# 💰 WealthTracker

[![Lint Check](https://github.com/YOUR_USERNAME/wealthtracker/actions/workflows/lint.yml/badge.svg)](https://github.com/YOUR_USERNAME/wealthtracker/actions/workflows/lint.yml)
![Version](https://img.shields.io/badge/version-0.4.0-blue)
![Status](https://img.shields.io/badge/status-production--ready-green)

> **Application desktop moderne de gestion de portefeuille financier**

## 📋 Description

WealthTracker est une application desktop élégante pour gérer vos investissements financiers avec une interface utilisateur révolutionnaire et un dashboard professionnel.

### ✨ Nouveautés v0.4.0 - Dashboard Feature

- 📈 **Dashboard Complet** : Vue d'ensemble de votre portefeuille avec métriques en temps réel
- 📊 **KPI Cards Animées** : Valeur totale, Montant investi, Plus/Moins-value latente
- 💹 **Calcul PMA Automatique** : Prix Moyen d'Achat avec frais inclus
- 📑 **Analyse Détaillée** : Performance par actif avec accordion collapsible
- 🎨 **Design Bloomberg** : Gradients professionnels et animations fluides
- 🔄 **Price Ticker Centralisé** : Déplacé sur Dashboard pour un accès rapide

### Fonctionnalités v0.3 - UX Revolution

- 🎨 **Price Ticker Bloomberg-style** : Barre de prix en temps réel avec édition inline
- 🪟 **Modales élégantes** : Formulaires contextuels au lieu de zones fixes
- 🎴 **AssetManagerCards** : Affichage moderne en cards avec icônes lucide-react
- ⚡ **Édition prix instantanée** : Clic → Enter → Sauvegardé en 1 seconde
- 💎 **Glassmorphism** : Effets de flou et transparence avancés
- 🎭 **Animations fluides** : Hover lift, scale-in, fade-in

### Fonctionnalités Complètes

- ✅ **Dashboard** : Vue d'ensemble avec calculs de performance automatiques
- ✅ **Catégories** : Créer et organiser par couleur (Actions, Crypto, Immobilier, etc.)
- ✅ **Actifs** : Gérer vos investissements avec ticker, prix, catégorie
- ✅ **Transactions** : Historique BUY/SELL avec statistiques en temps réel
- ✅ **Price Ticker** : Mise à jour rapide des prix depuis le Dashboard
- ✅ **Métriques Avancées** : PMA, PnL, Performance %, Valeur totale
- ✅ **Design moderne** : Dark theme, glassmorphism, animations
- ✅ **Stockage local** : Base SQLite avec Prisma ORM

## 🚀 Stack Technique

- **Framework**: Electron 33+
- **UI**: React 18 + TypeScript
- **Build Tool**: Vite + electron-vite
- **Database**: SQLite + Prisma ORM
- **Styling**: CSS Variables + Design System custom
- **Icons**: lucide-react (v0.3+)
- **Code Quality**: ESLint + Prettier

## 📦 Installation

### Prérequis

- Node.js 18+ ([télécharger](https://nodejs.org/))
- npm 9+

### Setup

```bash
# Cloner le repository
git clone https://github.com/YOUR_USERNAME/wealthtracker.git
cd wealthtracker

# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Créer la base de données
npx prisma migrate dev

# (Optionnel) Charger des données de test
npx prisma db seed
```

## 🎯 Guide d'Utilisation Rapide

### 1️⃣ Créer des Catégories

1. Aller dans **Configuration** (icône engrenage)
2. Cliquer sur **+ Ajouter une catégorie**
3. Remplir le nom et choisir une couleur
4. **Créer** → La catégorie apparaît en card

### 2️⃣ Ajouter des Actifs

1. Dans **Configuration**, cliquer sur **+ Ajouter un actif**
2. Remplir : Nom, Ticker (ex: BTC), Prix, Catégorie
3. **Créer** → L'actif est ajouté

### 3️⃣ Mettre à Jour les Prix (Price Ticker)

1. Dans **Transactions**, voir le **Price Ticker** en haut
2. **Cliquer** sur l'actif à modifier
3. **Entrer** le nouveau prix
4. **Enter** ou ✅ → Prix mis à jour instantanément

### 4️⃣ Enregistrer une Transaction

1. Dans **Transactions**, remplir le formulaire
2. Type : BUY ou SELL
3. Sélectionner l'actif, quantité, prix
4. **Créer** → Transaction enregistrée + stats mises à jour

## 🛠️ Développement

```bash
# Lancer l'app en mode développement
npm run dev

# Linter le code
npm run lint

# Vérifier les types TypeScript
npm run typecheck

# Formater le code
npm run format
```

## 🗄️ Base de données

```bash
# Ouvrir Prisma Studio (interface visuelle)
npx prisma studio

# Créer une migration
npx prisma migrate dev --name nom_migration

# Peupler avec des données de test
npm run db:seed
```

## 📦 Build

```bash
# Build pour production
npm run build

# Build sans empaquetage
npm run build:unpack

# Build pour Windows
npm run build:win

# Build pour macOS
npm run build:mac

# Build pour Linux
npm run build:linux
```

## 📁 Structure du projet

```
wealthtracker/
├── .github/
│   └── workflows/           # GitHub Actions (lint)
├── docs/                    # Documentation complète
│   ├── V0.3_UX_REVOLUTION.md       # Guide v0.3 🆕
│   ├── FINAL_SUMMARY.md            # Résumé complet
│   ├── V0.2_IMPLEMENTATION_GUIDE.md
│   ├── V0.2_MIGRATION.md
│   └── GITHUB_SETUP.md
├── prisma/
│   ├── schema.prisma        # Modèles de données
│   ├── seed.ts              # Données de test
│   └── dev.db               # Base SQLite
├── src/
│   ├── main/                # Process Electron principal
│   │   ├── index.ts         # 7 handlers IPC
│   │   └── database/
│   ├── preload/             # Bridge IPC sécurisé
│   │   ├── index.ts
│   │   └── index.d.ts
│   └── renderer/            # Interface React
│       ├── components/      # Composants réutilisables
│       │   ├── PriceTicker.tsx        # 🆕 v0.3
│       │   ├── Modal.tsx              # 🆕 v0.3
│       │   ├── AssetManagerCards.tsx  # 🆕 v0.3
│       │   ├── CategoryForm.tsx
│       │   ├── AssetForm.tsx
│       │   ├── TransactionForm.tsx
│       │   ├── TransactionList.tsx
│       │   └── Notification.tsx
│       ├── pages/
│       │   ├── TransactionsPage.tsx   # 🔄 v0.3 refonte
│       │   └── SettingsPage.tsx       # 🔄 v0.3 refonte
│       └── assets/
│           └── main.css     # Design system complet
└── resources/               # Ressources app
```

## 📖 Documentation

- **[V0.3_UX_REVOLUTION.md](docs/V0.3_UX_REVOLUTION.md)** : Guide complet v0.3 avec screenshots
- **[FINAL_SUMMARY.md](docs/FINAL_SUMMARY.md)** : Résumé technique complet
- **[V0.2_IMPLEMENTATION_GUIDE.md](docs/V0.2_IMPLEMENTATION_GUIDE.md)** : Guide step-by-step v0.2
- **[V0.2_MIGRATION.md](docs/V0.2_MIGRATION.md)** : Changelog détaillé v0.2

## 🐛 Dépannage

### L'app ne démarre pas

```bash
npx prisma generate
rm -rf node_modules package-lock.json
npm install
```

### Erreurs de build

```bash
npm run lint
npm run format
```

### Base corrompue

```bash
rm prisma/dev.db
npx prisma migrate reset
npx prisma db seed
```

## 🗺️ Roadmap v0.4

- [ ] Édition/Suppression catégories et actifs
- [ ] Dark mode toggle
- [ ] Recherche & Filtres avancés
- [ ] Graphiques historique prix
- [ ] Export PDF/CSV
- [ ] Multi-devises (USD, GBP, etc.)
- [ ] Keyboard shortcuts globaux

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 🎯 Roadmap

- [x] v0.1 - Walking Skeleton (CRUD transactions)
- [ ] v0.2 - Modification et suppression
- [ ] v0.3 - Statistiques et graphiques
- [ ] v0.4 - Catégorisation des investissements
- [ ] v0.5 - Import/Export de données

## 📚 Documentation

Voir le dossier [docs/](./docs/) pour plus de détails :

- [Guide d'installation](./docs/INSTALL_GUIDE.md)
- [Spécifications v0.1](./docs/SPECS_V0.1.md)
- [Progression](./docs/PROGRESS.md)

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
