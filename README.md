# 💰 WealthTracker

[![Lint Check](https://github.com/TitouanLeBrun/wealthtracker/actions/workflows/lint.yml/badge.svg)](https://github.com/TitouanLeBrun/wealthtracker/actions/workflows/lint.yml)
![Version](https://img.shields.io/badge/version-0.5.0-blue)
![Status](https://img.shields.io/badge/status-active--development-orange)

> **Application desktop de suivi et analyse de patrimoine boursier**

---

## 📋 Table des matières

- [Contexte et Description](#-contexte-et-description)
- [Use Cases](#-use-cases)
- [Modèle de Domaine](#-modèle-de-domaine-mdd)
- [Architecture](#-architecture)
- [Installation et Lancement](#-installation-et-lancement)
- [Guide d'Utilisation](#-guide-dutilisation)
- [Stack Technique](#-stack-technique)
- [Développement](#️-développement)
- [Roadmap](#️-roadmap)

---

## 🎯 Contexte et Description

### Contexte

Dans un monde où les investissements boursiers sont de plus en plus accessibles, il devient crucial de pouvoir **suivre efficacement son patrimoine financier** pour prendre des décisions éclairées. Les solutions existantes sont souvent :

- Limitées aux plateformes de courtage (vision silotée)
- Complexes et payantes
- Non adaptées aux investisseurs particuliers français

### Description du Projet

**WealthTracker** est une application desktop moderne permettant de **tracer et analyser son patrimoine boursier** de manière centralisée et intuitive. L'application offre :

#### ✅ Fonctionnalités Actuelles (v0.5.0)

1. **📊 Dashboard Complet**
   - Vue d'ensemble du portefeuille avec métriques en temps réel
   - KPI Cards : Valeur totale, Montant investi, Plus/Moins-value latente
   - Calcul automatique du Prix Moyen d'Achat (PMA) avec frais
   - Performance détaillée par actif avec tableau enrichi

2. **🏷️ Gestion par Catégories**
   - Création de catégories personnalisées (Actions, Crypto, Immobilier, etc.)
   - Attribution de couleurs pour identification visuelle
   - Statistiques et graphiques (camembert) par catégorie
   - Vue détaillée avec liste d'actifs et historique de transactions

3. **💎 Gestion d'Actifs**
   - Création d'actifs avec ticker, nom, prix et catégorie
   - Mise à jour rapide des prix via Price Ticker
   - Suivi de la quantité possédée et valeur totale
   - Visualisation du graphique d'évolution des prix

4. **📈 Transactions Complètes**
   - Enregistrement d'achats (BUY) et ventes (SELL)
   - Calcul automatique des frais et totaux
   - Historique filtrable par catégorie, actif et date
   - Statistiques en temps réel (PnL, performance %)

5. **🎨 Interface Moderne**
   - Design Bloomberg-style avec gradients professionnels
   - Dark theme élégant
   - Animations fluides et effets glassmorphism
   - Modales contextuelles pour les formulaires

#### 🚀 Objectif : Module Conseils (v1.0 - À venir)

Le prochain module majeur permettra de **planifier l'avenir de son patrimoine** grâce à :

- **📈 Projection de Patrimoine** :
  - Visualisation graphique de l'évolution prévisionnelle sur X années
  - Calcul du capital nécessaire pour atteindre un objectif Y €
- **💡 Recommandations Personnalisées** :
  - "Pour atteindre **100 000 €** dans **10 ans**, investissez **450 €/mois**"
  - Ajustement dynamique selon le rendement espéré (5%, 7%, 10%)
- **📊 Graphiques Long Terme** :
  - Courbe de croissance du capital avec intérêts composés
  - Comparaison de plusieurs scénarios (pessimiste, réaliste, optimiste)
  - Impact de l'inflation sur le pouvoir d'achat

- **🎯 Suivi d'Objectifs** :
  - Définir des objectifs financiers (retraite, achat immobilier, etc.)
  - Progression en temps réel vers l'objectif
  - Alertes si le rythme d'investissement est insuffisant

---

## 🎬 Use Cases

### 1️⃣ Gestion de Portefeuille

**Acteur** : Investisseur particulier

**Description** : L'utilisateur souhaite centraliser tous ses investissements pour avoir une vue d'ensemble.

**Flux Principal** :

1. L'utilisateur crée des catégories (Actions, Crypto, ETF, Immobilier)
2. Il ajoute ses actifs dans chaque catégorie
3. Il enregistre ses transactions d'achat/vente
4. Il consulte le dashboard pour voir sa performance globale

**Résultat** : Vue consolidée de tout le patrimoine boursier

---

### 2️⃣ Suivi de Performance

**Acteur** : Investisseur

**Description** : L'utilisateur veut connaître sa plus/moins-value latente et réalisée.

**Flux Principal** :

1. L'utilisateur accède au Dashboard
2. Il consulte les KPI : Valeur totale, Montant investi, PnL latente
3. Il voit la performance détaillée par actif (%, €, PMA)
4. Il peut cliquer sur un actif pour voir l'historique détaillé

**Résultat** : Connaissance précise de sa performance

---

### 3️⃣ Mise à Jour Rapide des Prix

**Acteur** : Investisseur

**Description** : L'utilisateur veut mettre à jour les prix de marché rapidement.

**Flux Principal** :

1. L'utilisateur accède au Price Ticker (Dashboard)
2. Il clique sur l'actif à mettre à jour
3. Il saisit le nouveau prix
4. Il valide → Le prix est mis à jour partout instantanément

**Résultat** : Données toujours à jour sans effort

---

### 4️⃣ Analyse par Catégorie

**Acteur** : Investisseur

**Description** : L'utilisateur veut voir la répartition de son patrimoine par type d'actif.

**Flux Principal** :

1. L'utilisateur accède à la page Catégories
2. Il voit le graphique camembert de répartition
3. Il clique sur une catégorie pour voir le détail
4. Il consulte les actifs et transactions de cette catégorie

**Résultat** : Compréhension de la diversification du portefeuille

---

### 5️⃣ Planification Financière (Futur - v1.0)

**Acteur** : Investisseur

**Description** : L'utilisateur veut savoir combien investir pour atteindre un objectif.

**Flux Principal** :

1. L'utilisateur accède au module Conseils
2. Il définit son objectif : 100 000 € dans 10 ans
3. Il sélectionne un rendement espéré : 7%/an
4. L'application calcule : "Investissez 580 €/mois"
5. Il voit le graphique de projection sur 10 ans

**Résultat** : Plan d'investissement clair et actionnable

---

## 🗂️ Modèle de Domaine (MDD)

### Entités Principales

```
┌─────────────────┐
│    Category     │
├─────────────────┤
│ id: number      │
│ name: string    │
│ color: string   │
│ createdAt: Date │
└────────┬────────┘
         │ 1
         │
         │ *
┌────────▼────────┐
│      Asset      │
├─────────────────┤
│ id: number      │
│ name: string    │
│ ticker: string  │
│ currentPrice: $ │
│ categoryId: FK  │
│ createdAt: Date │
└────────┬────────┘
         │ 1
         │
         │ *
┌────────▼────────────┐
│    Transaction      │
├─────────────────────┤
│ id: number          │
│ assetId: FK         │
│ type: BUY|SELL      │
│ quantity: number    │
│ pricePerUnit: $     │
│ fee: $              │
│ date: Date          │
│ createdAt: Date     │
└─────────────────────┘
```

### Relations

- **Category** (1) ──< (\*) **Asset** : Une catégorie contient plusieurs actifs
- **Asset** (1) ──< (\*) **Transaction** : Un actif a plusieurs transactions

### Règles Métier

1. **Cohérence des prix** : Le prix d'une transaction est fixe (historique), le prix actuel de l'Asset est mis à jour indépendamment
2. **Calcul du PMA** : `PMA = Σ(quantité × prix + frais) / Σ(quantité)` (uniquement achats)
3. **Quantité possédée** : `Quantité nette = Σ(BUY) - Σ(SELL)`
4. **PnL latente** : `(Prix actuel - PMA) × Quantité possédée`
5. **Valeur totale** : `Prix actuel × Quantité possédée`

---

## 🏗️ Architecture

### Architecture Globale (Electron)

```
┌─────────────────────────────────────────────────┐
│              ELECTRON APP                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐         ┌─────────────────┐  │
│  │    MAIN      │         │    RENDERER     │  │
│  │   Process    │◄───IPC──┤   Process       │  │
│  │  (Node.js)   │         │   (React)       │  │
│  └──────┬───────┘         └─────────────────┘  │
│         │                                       │
│         │                                       │
│  ┌──────▼───────┐                              │
│  │   Prisma     │                               │
│  │   Client     │                               │
│  └──────┬───────┘                              │
│         │                                       │
│  ┌──────▼───────┐                              │
│  │   SQLite     │                               │
│  │  (dev.db)    │                               │
│  └──────────────┘                              │
└─────────────────────────────────────────────────┘
```

### Architecture Frontend (Renderer)

```
src/renderer/
├── App.tsx                    # Point d'entrée, routing
├── main.tsx                   # Bootstrap React
│
├── pages/                     # Pages principales
│   ├── DashboardPage.tsx      # 📊 Dashboard avec KPI
│   ├── TransactionsPage.tsx   # 📈 Gestion transactions
│   ├── CategoryDetailPage.tsx # 🏷️ Détail catégorie
│   └── SettingsPage.tsx       # ⚙️ Catégories + Assets
│
├── components/
│   ├── asset/                 # Composants Asset
│   │   ├── AssetInfoPanel.tsx
│   │   └── AssetPriceChart.tsx
│   │
│   ├── category/              # Composants Category
│   │   ├── CategoryHeader.tsx
│   │   ├── CategoryStats.tsx
│   │   ├── CategoryPieChart.tsx
│   │   ├── CategoryAssetsList.tsx
│   │   └── CategoryTransactionsSection.tsx
│   │
│   ├── transaction/           # Composants Transaction
│   │   ├── TransactionCard.tsx
│   │   ├── TransactionList.tsx
│   │   ├── TransactionFilters.tsx
│   │   ├── TransactionPagination.tsx
│   │   └── TransactionManagerCards.tsx
│   │
│   ├── dashboard/             # Composants Dashboard
│   │   ├── PriceTicker.tsx
│   │   ├── EnhancedPortfolioKPI.tsx
│   │   ├── KPICard.tsx
│   │   └── AssetDetailsTable.tsx
│   │
│   ├── common/                # Composants réutilisables
│   │   ├── Modal.tsx
│   │   ├── Notification.tsx
│   │   └── ConfirmDialog.tsx
│   │
│   └── forms/                 # ⭐ Architecture par domaine
│       ├── asset/             # Formulaires Asset
│       │   ├── AssetForm.tsx
│       │   ├── AssetNameField.tsx
│       │   ├── AssetTickerField.tsx
│       │   ├── AssetPriceField.tsx
│       │   ├── AssetCategorySelector.tsx
│       │   ├── AssetSubmitButton.tsx
│       │   ├── TickerExistsAlert.tsx
│       │   └── NoCategoriesWarning.tsx
│       │
│       ├── transaction/       # Formulaires Transaction
│       │   ├── TransactionForm.tsx
│       │   ├── CategoryAssetSelector.tsx
│       │   ├── TransactionTypeSelector.tsx
│       │   ├── QuantityPriceFields.tsx
│       │   ├── FeeTotalFields.tsx
│       │   ├── SellPercentageSelector.tsx
│       │   ├── TransactionSummary.tsx
│       │   ├── DateField.tsx
│       │   └── SubmitButton.tsx
│       │
│       └── category/          # Formulaires Category
│           └── CategoryForm.tsx
│
├── hooks/                     # Custom Hooks
│   ├── useAssetForm.ts
│   ├── useTransactionForm.ts
│   ├── useFormValidation.ts
│   ├── useFormHandlers.ts
│   ├── useFormSubmit.ts
│   └── useTableSort.ts
│
├── utils/                     # Utilitaires
│   ├── mockPriceData.ts
│   └── calculations/
│       ├── quantityUtils.ts
│       ├── categoryUtils.ts
│       ├── pmaUtils.ts
│       └── enhancedPortfolioCalculations.ts
│
└── types/
    └── index.ts               # Types TypeScript
```

### Architecture Backend (Main Process)

```
src/main/
├── index.ts                   # IPC Handlers (7 endpoints)
│   ├── get-all-categories
│   ├── create-category
│   ├── get-all-assets
│   ├── create-asset
│   ├── update-asset-price
│   ├── get-all-transactions
│   ├── create-transaction
│   └── delete-transaction
│
└── database/
    └── client.ts              # Prisma Client singleton
```

### Pattern de Communication IPC

```typescript
// RENDERER → MAIN (via preload)
window.api.getAllAssets()

// PRELOAD (Bridge sécurisé)
ipcRenderer.invoke('get-all-assets')

// MAIN (Handler)
ipcMain.handle('get-all-assets', async () => {
  return await prisma.asset.findMany({ include: { category: true } })
})
```

### Principe d'Architecture par Domaine (forms/)

Les formulaires sont organisés par **domaine métier** pour :

- ✅ Améliorer la **maintenabilité** (changement isolé)
- ✅ Faciliter la **réutilisation** (import clair)
- ✅ Respecter le **principe de responsabilité unique**
- ✅ Simplifier la **navigation** dans le code

**Exemple** :

```typescript
// ❌ AVANT (tout dans forms/)
import AssetForm from '../components/forms/AssetForm'

// ✅ APRÈS (organisé par domaine)
import AssetForm from '../components/forms/asset/AssetForm'
```

---

## 🚀 Installation et Lancement

### Prérequis

- **Node.js** 18+ ([télécharger](https://nodejs.org/))
- **npm** 9+
- **Git** (optionnel)

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/TitouanLeBrun/wealthtracker.git
cd wealthtracker

# 2. Créer le fichier .env (requis pour Prisma)
# Copier le fichier .env.example vers .env
cp .env.example .env
# Ou créer manuellement le fichier .env avec :
# DATABASE_URL="file:./dev.db"

# 3. Installer les dépendances
npm install

# 4. Générer le client Prisma
npx prisma generate

# 5. Créer la base de données
npx prisma migrate dev

# 6. (Optionnel) Charger des données de test
npx prisma db seed
```

### Lancement en Développement

```bash
# Démarrer l'application en mode développement
npm run dev
```

L'application se lance avec :

- ⚡ **Hot Reload** : Les modifications sont appliquées instantanément
- 🔍 **DevTools** : Outils de développement intégrés
- 📊 **Prisma Studio** : Interface de gestion de la base (port 5555)

### Build pour Production

```bash
# Build complet (toutes plateformes)
npm run build

# Build spécifique
npm run build:win      # Windows (.exe)
npm run build:mac      # macOS (.dmg)
npm run build:linux    # Linux (.AppImage)

# Build sans empaquetage (pour debug)
npm run build:unpack
```

Les fichiers générés sont dans le dossier `dist/`.

---

## 📖 Guide d'Utilisation

### 1️⃣ Créer des Catégories

1. Cliquer sur **⚙️ Configuration** (barre latérale)
2. Dans la section "Catégories", cliquer sur **+ Ajouter une catégorie**
3. Remplir :
   - **Nom** : Ex. "Actions Tech", "Crypto", "Immobilier"
   - **Couleur** : Choisir une couleur d'identification
4. Cliquer sur **Créer**

**Résultat** : La catégorie apparaît en card avec sa couleur

---

### 2️⃣ Ajouter des Actifs

1. Dans **Configuration**, cliquer sur **+ Ajouter un actif**
2. Remplir :
   - **Nom** : Ex. "Bitcoin", "Apple Inc."
   - **Ticker** : Ex. "BTC", "AAPL"
   - **Prix actuel** : Prix de marché (€)
   - **Catégorie** : Sélectionner une catégorie
3. Cliquer sur **Créer**

**Résultat** : L'actif est ajouté et visible dans sa catégorie

---

### 3️⃣ Enregistrer une Transaction

1. Aller sur **📈 Transactions**
2. Cliquer sur **+ Ajouter une Transaction**
3. Remplir :
   - **Type** : BUY (Achat) ou SELL (Vente)
   - **Catégorie** : Sélectionner la catégorie
   - **Actif** : Sélectionner l'actif
   - **Quantité** : Nombre d'unités
   - **Prix unitaire** : Prix d'achat/vente (€)
   - **Frais** : Frais de transaction (€)
   - **Date** : Date de la transaction
4. Vérifier le **Récapitulatif** (total calculé automatiquement)
5. Cliquer sur **Créer**

**Résultat** : Transaction enregistrée, statistiques mises à jour

---

### 4️⃣ Mettre à Jour les Prix (Price Ticker)

1. Aller sur **📊 Dashboard**
2. Dans le **Price Ticker** (haut de page), voir tous les actifs
3. **Cliquer** sur l'actif à mettre à jour
4. **Saisir** le nouveau prix
5. **Enter** ou cliquer sur ✅

**Résultat** : Prix mis à jour partout dans l'application instantanément

---

### 5️⃣ Consulter le Dashboard

1. Aller sur **📊 Dashboard** (page d'accueil)
2. Voir les **3 KPI Cards** :
   - 💰 **Valeur Totale** : Valeur actuelle du portefeuille
   - 💵 **Montant Investi** : Capital investi net (achats - ventes)
   - 📈 **Plus/Moins-value Latente** : Gain ou perte non réalisé (%, €)
3. Consulter le **Tableau Détaillé** :
   - Performance par actif (%, €)
   - Prix Moyen d'Achat (PMA)
   - Quantité possédée
   - Valeur actuelle

**Résultat** : Vue d'ensemble complète de la performance

---

### 6️⃣ Analyser par Catégorie

1. Cliquer sur **🏷️ Catégories** (barre latérale)
2. Voir le **graphique camembert** de répartition
3. Voir les **statistiques** par catégorie (valeur, %, nombre d'actifs)
4. **Cliquer** sur une catégorie pour voir le détail :
   - Liste des actifs
   - Graphique de la catégorie
   - Historique des transactions (filtrées automatiquement)

**Résultat** : Compréhension de la diversification du portefeuille

---

## 🛠️ Stack Technique

### Core

- **Framework** : [Electron](https://www.electronjs.org/) 33.2+
- **UI Framework** : [React](https://react.dev/) 18.3
- **Language** : [TypeScript](https://www.typescriptlang.org/) 5.6
- **Build Tool** : [Vite](https://vitejs.dev/) 5.4 + [electron-vite](https://electron-vite.org/) 2.3

### Backend

- **Database** : [SQLite](https://www.sqlite.org/) (local)
- **ORM** : [Prisma](https://www.prisma.io/) 6.1
- **IPC** : Electron IPC (contextBridge + preload)

### Frontend

- **Styling** : CSS Variables + Design System custom
- **Icons** : [lucide-react](https://lucide.dev/) (modern icons)
- **Charts** : Custom Canvas (pie chart)
- **State Management** : React useState + useEffect (pas de Redux)

### Code Quality

- **Linter** : [ESLint](https://eslint.org/) 9+
- **Formatter** : [Prettier](https://prettier.io/) 3+
- **Type Checking** : TypeScript Compiler (tsc)

### DevOps

- **CI/CD** : GitHub Actions (lint check)
- **Versioning** : Git + Semantic Versioning
- **Package Manager** : npm

---

## 🛠️ Développement

### Commandes Principales

```bash
# Développement
npm run dev              # Lancer l'app en mode dev (Hot Reload)

# Code Quality
npm run lint             # Vérifier le code avec ESLint
npm run format           # Formater le code avec Prettier
npm run typecheck        # Vérifier les types TypeScript

# Database
npx prisma studio        # Ouvrir Prisma Studio (UI de la DB)
npx prisma migrate dev   # Créer une migration
npx prisma db seed       # Peupler avec des données de test
npx prisma generate      # Régénérer le client Prisma

# Build
npm run build            # Build pour production
npm run build:unpack     # Build sans empaquetage
```

### Structure de Développement

```bash
# Créer une nouvelle fonctionnalité
git checkout -b feature/nom-fonctionnalite

# Faire des commits atomiques
git add .
git commit -m "feat: description de la fonctionnalité"

# Vérifier la qualité du code
npm run lint
npm run typecheck

# Créer une Pull Request
git push origin feature/nom-fonctionnalite
```

### Conventions de Code

- **Nommage** : camelCase pour les variables, PascalCase pour les composants
- **Imports** : Regrouper par type (React, types, composants, utils)
- **Types** : Toujours typer les props et les returns
- **Commentaires** : Documenter les calculs complexes et la logique métier

### Debug

```bash
# Ouvrir les DevTools Electron
Ctrl + Shift + I (Windows/Linux)
Cmd + Option + I (macOS)

# Voir les logs du Main Process
Dans le terminal où vous avez lancé `npm run dev`

# Inspecter la base de données
npx prisma studio
```

---

## 🗺️ Roadmap

### ✅ v0.5.0 - Architecture et UX (Actuel)

- ✅ Réorganisation de l'architecture des formulaires par domaine
- ✅ Correction du bug de mise à jour dynamique (CategoryDetailPage)
- ✅ Masquage du filtre catégorie sur CategoryDetailPage
- ✅ Dashboard complet avec KPI et tableau de performance
- ✅ Price Ticker pour mise à jour rapide des prix
- ✅ Gestion complète des catégories avec graphique camembert

---

### 🚀 v1.0 - Module Conseils (Prochain Objectif)

**Objectif** : Aider l'utilisateur à planifier l'avenir de son patrimoine

#### Fonctionnalités Prévues

1. **📈 Calculateur d'Objectif Financier**
   - Saisir un objectif : "Je veux 100 000 € dans 10 ans"
   - Sélectionner un rendement espéré : 5%, 7%, 10%/an
   - Calculer : "Investissez 580 €/mois"
   - Formule : Intérêts composés avec versements mensuels

2. **📊 Graphique de Projection**
   - Courbe de croissance du capital sur X années
   - Visualisation des intérêts composés
   - Comparaison de scénarios (pessimiste, réaliste, optimiste)

3. **🎯 Suivi d'Objectifs**
   - Créer des objectifs nommés ("Retraite", "Achat immobilier")
   - Barre de progression vers l'objectif
   - Alertes si le rythme est insuffisant

4. **💡 Recommandations Personnalisées**
   - "Augmentez de 50 €/mois pour atteindre votre objectif"
   - "Vous êtes en avance de 6 mois sur votre plan"
   - Impact de l'inflation sur le pouvoir d'achat

#### Formules Utilisées

**Valeur Future avec Versements Mensuels** :

```
VF = VM × [((1 + r)^n - 1) / r]

Où :
- VF = Valeur Future (objectif)
- VM = Versement Mensuel (à calculer)
- r = Taux de rendement mensuel (annuel / 12)
- n = Nombre de mois (années × 12)
```

**Exemple** :

- Objectif : 100 000 €
- Durée : 10 ans (120 mois)
- Rendement : 7%/an (0.583%/mois)
- **Résultat** : Versement mensuel = 580 €

---

### 📅 v1.1 - Améliorations UX

- [ ] Édition/Suppression des catégories
- [ ] Édition des actifs
- [ ] Dark mode toggle (switch thème)
- [ ] Recherche globale (actifs, transactions)
- [ ] Filtres avancés (plage de dates, montants)
- [ ] Export PDF du dashboard
- [ ] Export CSV des transactions

---

### 📅 v1.2 - Graphiques Avancés

- [ ] Graphique d'évolution du portefeuille (historique)
- [ ] Graphique de performance par catégorie
- [ ] Heatmap des meilleurs/pires actifs
- [ ] Graphique de répartition géographique

---

### 📅 v2.0 - Features Avancées

- [ ] Multi-devises (USD, GBP, CHF, etc.)
- [ ] API d'import de prix (Yahoo Finance, CoinGecko)
- [ ] Synchronisation cloud (optionnelle)
- [ ] Application mobile (React Native)
- [ ] Dividendes et revenus passifs
- [ ] Fiscalité (calcul automatique des impôts)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créer une branche : `git checkout -b feature/AmazingFeature`
3. Commit les changements : `git commit -m 'feat: Add AmazingFeature'`
4. Push vers la branche : `git push origin feature/AmazingFeature`
5. Ouvrir une **Pull Request**

### Règles de Contribution

- Respecter les conventions de code (ESLint + Prettier)
- Ajouter des tests si nécessaire
- Documenter les nouvelles fonctionnalités
- Créer des commits atomiques et descriptifs

---

## 📦 Build et Distribution

### Créer un exécutable Windows

**Méthode rapide** (Script PowerShell) :

```powershell
.\build-windows.ps1
```

**Méthode manuelle** :

```bash
# Installeur NSIS (recommandé)
npm run build:win:installer

# Version portable
npm run build:win:portable

# Les deux
npm run build:win
```

**Résultat** : Les exécutables seront dans le dossier `dist/` :

- `WealthTracker-1.0.0-Setup.exe` - Installeur
- `WealthTracker-1.0.0-Portable.exe` - Version portable

📖 **Documentation complète** : Voir [BUILD_GUIDE.md](./docs/BUILD_GUIDE.md)

---

## 📝 License

Ce projet est sous licence **MIT**.

---

## 📚 Documentation Complémentaire

Voir le dossier [docs/](./docs/) pour plus de détails :

- **[BUILD_GUIDE.md](./docs/BUILD_GUIDE.md)** : Guide complet pour créer l'exécutable Windows
- **[BUILD_CONFIG_SUMMARY.md](./docs/BUILD_CONFIG_SUMMARY.md)** : Résumé de la configuration de build
- **[ASSET_WITHOUT_POSITION_FEATURE.md](./docs/ASSET_WITHOUT_POSITION_FEATURE.md)** : Gestion des actifs sans position
- **[CATEGORY_PAGE_IMPROVEMENTS.md](./docs/CATEGORY_PAGE_IMPROVEMENTS.md)** : Améliorations de la page Catégories
- **[CATEGORY_PAGE_REFACTORING.md](./docs/CATEGORY_PAGE_REFACTORING.md)** : Refactoring de CategoryDetailPage
- **[FEATURE_CATEGORY_PIE_CHART.md](./docs/FEATURE_CATEGORY_PIE_CHART.md)** : Implémentation du graphique camembert
- **[TRANSACTION_COMPONENTS.md](./docs/TRANSACTION_COMPONENTS.md)** : Architecture des composants Transaction
- **[V0.4_DASHBOARD.md](./docs/V0.4_DASHBOARD.md)** : Guide complet du Dashboard

---

## 🙏 Remerciements

- **Electron** pour le framework desktop
- **Prisma** pour l'ORM moderne
- **Lucide** pour les icônes élégantes
- **React** pour l'interface utilisateur
- **Recharts** pour les graphiques interactifs

---

**Développé avec ❤️ pour les investisseurs particuliers**
