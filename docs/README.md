# 📚 WealthTracker - Documentation Technique Complète

**Projet** : WealthTracker - Suivi de Portefeuille d'Actifs  
**Version** : 0.2.0  
**Dernière mise à jour** : 26 novembre 2024  
**Framework** : Electron.js + React + TypeScript + Prisma

---

## 📖 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du projet](#architecture-du-projet)
3. [Module Projection Financière](#module-projection-financière)
4. [Améliorations récentes](#améliorations-récentes)
5. [Commandes utiles](#commandes-utiles)

---

## 🎯 Vue d'ensemble

WealthTracker est une application de bureau (Electron) permettant de :

- Suivre un portefeuille multi-actifs (crypto, actions, ETF, etc.)
- Visualiser la répartition par catégorie
- Gérer les transactions (achats/ventes)
- Projeter son patrimoine vers un objectif financier
- Analyser ses performances

### Technologies Principales

```
Frontend:  React 18 + TypeScript + TailwindCSS + Recharts
Backend:   Electron + Prisma ORM + SQLite
Build:     Vite + electron-builder
```

---

## 🏗️ Architecture du Projet

### Structure des Dossiers

```
wealthtracker/
├── src/
│   ├── main/          # Processus principal Electron
│   │   ├── index.ts   # Point d'entrée
│   │   └── database/  # Client Prisma + migrations
│   ├── preload/       # Bridge IPC sécurisé
│   └── renderer/      # Application React
│       ├── pages/     # Pages principales
│       ├── components/
│       │   ├── projection/   # Module de projection (NOUVEAU)
│       │   ├── category/
│       │   ├── asset/
│       │   └── ...
│       └── utils/
│           └── calculations/
│               └── projectionUtils.ts  # Calculs financiers
├── prisma/
│   ├── schema.prisma  # Modèle de données
│   ├── dev.db         # Base SQLite
│   └── migrations/    # Historique des migrations
└── docs/              # Documentation (ce fichier)
```

### Modèle de Données

```prisma
Category  ──┬─→ Asset ──→ Transaction
            │
            └─→ Objective (pour projection)
```

---

## 📊 Module Projection Financière

### Vue d'ensemble

Le module de projection permet de visualiser la progression du patrimoine et de calculer les versements nécessaires pour atteindre un objectif financier.

### Composants Principaux

#### 1. **ProjectionPage.tsx**

Page principale (110 lignes - refactorisée depuis 760 lignes)

```typescript
<ProjectionPage>
  ├── <ObjectiveForm />           # Configuration de l'objectif
  ├── <DualCurveChart />          # Graphique dual-courbe
  ├── <ProjectionInsights />      # KPIs et analyse
  └── <MonthlyInvestmentSimulator /> # Simulation versements
</ProjectionPage>
```

#### 2. **DualCurveChart.tsx**

Graphique interactif avec Recharts

- **Courbe verte** : Patrimoine historique réel (mois par mois)
- **Courbe bleue pointillée** : Projection théorique exponentielle

**Fonctionnement** :

```typescript
useEffect(() => {
  // 1. Charger assets + transactions
  const assets = await getAllAssets()
  const transactions = await getAllTransactions()

  // 2. Calculer patrimoine historique
  const historicalWealth = calculateHistoricalWealth(
    assets,
    transactions,
    firstDate,
    today
  )

  // 3. Générer projection future
  const projection = calculateObjectiveProjection(
    currentWealth,
    objective,
    firstDate
  )

  // 4. Afficher avec Recharts
  <ProjectionChart
    realityData={historicalWealth}
    objectiveData={projection}
  />
}, [objective])
```

#### 3. **ProjectionChart.tsx**

Composant de graphique Recharts (170 lignes)

- Tooltip personnalisé avec valeurs formatées
- Axes X (dates) et Y (euros) automatiques
- Responsive
- Légende interactive

#### 4. **ProjectionInsights.tsx**

Panneau de KPIs (153 lignes)

- Patrimoine actuel
- Objectif cible
- Reste à atteindre (delta)
- CAGR (taux de croissance)
- Statut dynamique avec émojis

#### 5. **MonthlyInvestmentSimulator.tsx**

Simulateur de versements (240 lignes)

- Calcul du versement mensuel optimal
- Répartition par catégorie
- Barres de progression colorées

### Fonctions de Calcul (projectionUtils.ts)

#### **calculateHistoricalWealth()**

Calcule le patrimoine mois par mois depuis la première transaction.

```typescript
export function calculateHistoricalWealth(
  assets: Array<{ id: number; currentPrice: number }>,
  transactions: Array<{ assetId: number; type: 'BUY' | 'SELL'; quantity: number; date: Date }>,
  startDate: Date,
  endDate: Date = new Date()
): Array<{ date: Date; value: number }>
```

**Logique** :

1. Génère toutes les dates mensuelles
2. Pour chaque mois : filtre transactions jusqu'à cette date
3. Calcule quantité nette par actif
4. Valorise avec le prix actuel (simplification MVP)

#### **calculateObjectiveProjection()**

Génère la courbe de projection théorique.

```typescript
export function calculateObjectiveProjection(
  currentWealth: number,
  objective: { targetAmount: number; targetYears: number; interestRate: number },
  startDate: Date
): Array<{ date: Date; value: number }>
```

**Formule exponentielle** :

```
Valeur(M mois) = Capital × (1 + Taux/12)^M
                 + Versement × [((1 + Taux/12)^M - 1) / (Taux/12)]
```

**Versement mensuel** :

```
Versement = (Objectif - Capital × (1 + Taux)^Durée)
            × (Taux/12) / [(1 + Taux/12)^(12×Durée) - 1]
```

### Refactorisation Effectuée

**Avant** : 1 fichier de 760 lignes  
**Après** : 6 fichiers modulaires

| Composant                      | Lignes  | Responsabilité          |
| ------------------------------ | ------- | ----------------------- |
| ProjectionPage.tsx             | 110     | Orchestration           |
| ObjectiveForm.tsx              | 80      | Configuration           |
| DualCurveChart.tsx             | 120     | Orchestration graphique |
| ProjectionChart.tsx            | 170     | Rendu Recharts          |
| ProjectionInsights.tsx         | 153     | KPIs                    |
| MonthlyInvestmentSimulator.tsx | 240     | Simulation              |
| **Total**                      | **873** | **Modulaire**           |

**Avantages** :

- ✅ Maintenabilité ++
- ✅ Tests unitaires facilités
- ✅ Réutilisabilité des composants
- ✅ Développement en équipe possible

---

## 🆕 Améliorations Récentes

### 1. Page Paramètres (SettingsPage.tsx)

#### Boutons d'action (header)

```tsx
<div className="flex gap-2">
  <button className="rounded-tr-2xl">Nouvelle Catégorie</button>
  <button className="rounded-tr-2xl">Nouvel Actif</button>
</div>
```

- Coins arrondis en haut à droite
- Responsive : texte masqué sur mobile

#### Section "Catégories sans actifs"

Affiche les catégories vides avec navigation cliquable :

```tsx
{
  categoriesWithoutAssets.map((category) => (
    <div
      onClick={() => navigate(`/category/${category.id}`)}
      className="cursor-pointer hover:bg-opacity-80"
    >
      <FolderOpen /> {category.name}
    </div>
  ))
}
```

### 2. Page Détail Catégorie (CategoryDetailPage.tsx)

#### Fix : Chargement infini

**Problème** : `categoryValue` undefined pour catégories vides  
**Solution** : Fallback avec structure vide

```typescript
if (!found && category) {
  return {
    categoryId: category.id,
    categoryName: category.name,
    color: category.color,
    totalValue: 0,
    percentage: 0,
    assetCount: 0,
    assets: []
  }
}
```

### 3. Liste des Actifs (CategoryAssetsList.tsx)

#### Affichage des actifs sans position

Deux sections distinctes :

**Positions en cours** (quantité > 0)

- Bordure colorée (couleur catégorie)
- Opacité 100%
- Affiche : Prix, Quantité, Valeur totale

**Actifs sans position** (quantité = 0)

- Bordure grise
- Opacité 70%
- Affiche : Prix, Statut "Aucune position"

```tsx
const assetsWithPosition = sortedAssets.filter((a) => a.netQuantity > 0)
const assetsWithoutPosition = sortedAssets.filter((a) => a.netQuantity === 0)
```

### 4. Migration Database

#### Système de migration automatique

Détecte et applique automatiquement les migrations au démarrage.

**Fichier** : `src/main/database/client.ts`

```typescript
async function applyMigrationsIfNeeded(dbPath: string) {
  if (!fs.existsSync(dbPath)) {
    console.log('⚠️ Database missing, applying migrations...')
    await execAsync('npx prisma migrate deploy', {
      env: { DATABASE_URL: `file:${dbPath}` }
    })
    console.log('✅ Migrations applied')
  }
}
```

**Migrations existantes** :

1. `20251125082402_init_v0_2_assets_structure` - Structure initiale
2. `20251126130707_add_table_objective` - Table Objective

---

## 🚀 Commandes Utiles

### Développement

```bash
# Lancer en mode dev avec hot-reload
npm run dev

# Compiler TypeScript
npm run build

# Linter + formater
npm run lint
npm run format
```

### Base de Données

```bash
# Créer une nouvelle migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations
npx prisma migrate deploy

# Ouvrir Prisma Studio (GUI)
npx prisma studio

# Générer le client Prisma
npx prisma generate

# Réinitialiser la DB (ATTENTION: perte de données)
npx prisma migrate reset
```

### Build Production

```bash
# Build complet (Windows)
npm run build:win

# Build complet (toutes plateformes)
npm run build
```

### Tests

```bash
# Lancer les tests (quand configurés)
npm test
```

---

## 📝 Bonnes Pratiques

### 1. Ajout d'une Nouvelle Page

```typescript
// 1. Créer le fichier dans src/renderer/src/pages/
// 2. Définir le composant
export default function MyPage(): React.JSX.Element {
  return <div>...</div>
}

// 3. Ajouter la route dans App.tsx
<Route path="/my-page" element={<MyPage />} />
```

### 2. Ajout d'une Fonction de Calcul

```typescript
// Dans src/renderer/src/utils/calculations/projectionUtils.ts
export function myCalculation(params: MyParams): number {
  // Logique
  return result
}
```

### 3. Ajout d'un Composant Modulaire

```typescript
// Créer dossier src/renderer/src/components/mymodule/
// - MyComponent.tsx
// - index.ts (exports)
// - types.ts (si nécessaire)
```

### 4. Modification du Schéma DB

```bash
# 1. Modifier prisma/schema.prisma
model NewTable {
  id Int @id @default(autoincrement())
  // ...
}

# 2. Créer la migration
npx prisma migrate dev --name add_new_table

# 3. Régénérer le client
npx prisma generate
```

---

## 🐛 Résolution de Problèmes

### Erreur : "Table does not exist"

```bash
# Appliquer les migrations
npx prisma migrate deploy
```

### Erreur TypeScript dans les composants

```bash
# Vérifier les types
npm run build

# Régénérer le client Prisma
npx prisma generate
```

### Graphique ne s'affiche pas

1. Vérifier que Recharts est installé : `npm list recharts`
2. Vérifier la console navigateur (F12)
3. Vérifier que les données sont présentes :

```typescript
console.log('Reality data:', realityData)
console.log('Objective data:', objectiveData)
```

### Application ne démarre pas

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 Métriques du Projet

### Code

- **Lignes de code** : ~8 000 lignes
- **Composants React** : 35+
- **Pages** : 6
- **Fonctions de calcul** : 15+

### Performance

- **Build time** : ~30 secondes
- **Hot reload** : <2 secondes
- **Taille app** : ~120 MB (packagée)

### Base de Données

- **Tables** : 4 (Category, Asset, Transaction, Objective)
- **Migrations** : 2
- **Type** : SQLite (fichier local)

---

## 🔮 Roadmap

### Court terme

- [ ] Tests unitaires avec Vitest
- [ ] Historique des prix (API externe)
- [ ] Export PDF des rapports

### Moyen terme

- [ ] Multi-devises
- [ ] Synchronisation cloud
- [ ] Notifications push

### Long terme

- [ ] Application mobile (React Native)
- [ ] Machine Learning pour prédictions
- [ ] Multi-utilisateurs

---

## 📞 Support

### Ressources

- **Documentation Electron** : https://www.electronjs.org/docs
- **Documentation Prisma** : https://www.prisma.io/docs
- **Documentation Recharts** : https://recharts.org/en-US

### Logs de Debug

```typescript
// Activer les logs Electron
process.env.ELECTRON_ENABLE_LOGGING = 'true'

// Logs Prisma
process.env.DEBUG = 'prisma:*'
```

---

**Dernière révision** : 26 novembre 2024  
**Auteur** : GitHub Copilot  
**Version du document** : 1.0
