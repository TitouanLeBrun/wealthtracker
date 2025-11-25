# 📊 Feature: Camembert Catégories + Vue Détaillée

## 🎯 Objectif

Améliorer l'UX de la page Configuration avec :

- Un camembert affichant la répartition des catégories par valeur
- Une vue détaillée par catégorie (modale) au clic sur une tranche
- Possibilité d'ajouter un actif depuis la vue catégorie

---

## 📋 Spécifications Validées

### 1. Calcul du montant par catégorie

**Option A sélectionnée** : `currentPrice × quantité totale possédée`

- Formule : Pour chaque actif de la catégorie, calculer la quantité nette (achats - ventes)
- Puis : `somme(asset.currentPrice × quantitéNette)`
- Reflète la **valeur actuelle du portefeuille**

### 2. Navigation

**Option B sélectionnée** : Nouvelle route `/category/:id`

- URL dédiée : `/category/actions`, `/category/crypto`, etc.
- Bouton "← Retour à la configuration" dans le header
- Permet le partage d'URL et l'historique de navigation

### 3. Contenu de la vue catégorie

- ✅ **Liste des actifs** de la catégorie
- ✅ **Camembert secondaire** : répartition des actifs au sein de la catégorie
- ✅ **Statistiques** : nombre d'actifs, valeur totale
- ✅ **Historique des transactions** liées à cette catégorie
- ✅ **Bouton "+ Ajouter un actif"** pré-rempli avec la catégorie

### 4. Bibliothèque graphiques

**Option A sélectionnée** : `recharts`

```bash
npm install recharts
```

### 5. Design du camembert

- **Taille** : 400px × 400px (responsive sur mobile → 300px)
- **Couleurs** : Utiliser `category.color` depuis la DB
- **Labels** : Afficher le % directement sur les tranches
- **Animation** : Effet hover pour highlight
- **Responsive** : Oui, adaptation mobile

### 6. Catégories vides

**Masquer** les catégories sans actifs (montant = 0) du camembert

---

## 🗺️ Plan de Développement

### **Phase 1 : Installation & Préparation** ✅

- [x] Installer `recharts`
- [x] Créer `src/renderer/src/utils/categoryCalculations.ts`
- [x] Créer `src/renderer/src/components/CategoryPieChart.tsx`
- [x] Créer `src/renderer/src/pages/CategoryDetailPage.tsx`
- [x] Mettre à jour `App.tsx` pour la navigation

### **Phase 2 : Logique de Calcul** 📊

Fichier : `src/renderer/src/utils/categoryCalculations.ts`

Fonctions à créer :

1. `calculateNetQuantities(transactions: Transaction[]): Map<assetId, quantityNet>`
   - Pour chaque actif, calculer : `SUM(quantity) WHERE type='BUY'` - `SUM(quantity) WHERE type='SELL'`

2. `calculateCategoryValues(categories, assets, transactions): CategoryValue[]`

   ```typescript
   interface CategoryValue {
     categoryId: number
     categoryName: string
     color: string
     totalValue: number // Somme des (currentPrice × quantitéNette)
     percentage: number // % du total global
     assetCount: number // Nombre d'actifs avec quantité > 0
     assets: AssetValue[] // Détails par actif
   }

   interface AssetValue {
     assetId: number
     ticker: string
     name: string
     currentPrice: number
     netQuantity: number
     totalValue: number
     percentage: number // % au sein de la catégorie
   }
   ```

### **Phase 3 : Composant Camembert Principal** 🥧

Fichier : `src/renderer/src/components/CategoryPieChart.tsx`

- Composant React avec `recharts`
- Props : `categoryValues: CategoryValue[]`, `onCategoryClick: (categoryId) => void`
- Features :
  - `<PieChart>` avec `<Pie>` et `<Cell>` personnalisés
  - Labels avec pourcentages
  - Hover effect (opacité + tooltip)
  - Click handler → navigation vers `/category/:id`
  - Animation d'entrée
  - Responsive (useWindowSize hook)

### **Phase 4 : Page Détails Catégorie** 📄

Fichier : `src/renderer/src/pages/CategoryDetailPage.tsx`

Structure :

```
┌─────────────────────────────────────────────┐
│ ← Retour | 📊 Catégorie: Actions          │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌──────────────────┐   │
│  │  Camembert   │  │  Stats           │   │
│  │  des actifs  │  │  - 5 actifs      │   │
│  │  (400px)     │  │  - 12,450.00 €   │   │
│  └──────────────┘  │  - +12.5%        │   │
│                     └──────────────────┘   │
│                                             │
│  [+ Ajouter un actif]                      │
│                                             │
│  📋 Liste des Actifs (cards)               │
│  ┌─────────────────────────────────────┐  │
│  │ AAPL - Apple Inc.                   │  │
│  │ 10 unités × 195.50€ = 1,955.00€    │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  📊 Historique des Transactions            │
│  (réutiliser TransactionManagerCards       │
│   avec filtre sur categoryId)              │
└─────────────────────────────────────────────┘
```

Props :

- `categoryId` (depuis URL params)

State :

- Categories, assets, transactions (fetch au mount)
- Modal state pour ajout d'actif

### **Phase 5 : Intégration dans SettingsPage** 🔧

Fichier : `src/renderer/src/pages/SettingsPage.tsx`

Modifications :

1. Charger les transactions (en plus de categories/assets)
2. Calculer `categoryValues` avec la fonction utilitaire
3. Ajouter `<CategoryPieChart>` en haut de page
4. Handler `onCategoryClick` → navigate to `/category/:id`
5. Conserver l'affichage `<AssetManagerCards>` en dessous

Layout :

```
┌────────────────────────────────────┐
│  ⚙️ Configuration                 │
├────────────────────────────────────┤
│                                    │
│  📊 Répartition par Catégorie     │
│  ┌──────────────────────────┐    │
│  │   Camembert Interactif   │    │
│  │      (click → detail)    │    │
│  └──────────────────────────┘    │
│                                    │
│  📂 Catégories & Actifs           │
│  [Existing AssetManagerCards]     │
└────────────────────────────────────┘
```

### **Phase 6 : Routing** 🛣️

Fichier : `src/renderer/src/App.tsx`

Modifications :

1. Passer de state simple à routing avec `activePage`
2. Ajouter gestion de `categoryId` dans l'état
3. Méthode `navigateToCategory(categoryId)`
4. Render conditionnel :
   ```tsx
   {activePage === 'category' && categoryId && (
     <CategoryDetailPage categoryId={categoryId} onBack={...} />
   )}
   ```

---

## 📦 Fichiers à Créer/Modifier

### Nouveaux fichiers

1. `src/renderer/src/utils/categoryCalculations.ts` (logique calcul)
2. `src/renderer/src/components/CategoryPieChart.tsx` (camembert principal)
3. `src/renderer/src/pages/CategoryDetailPage.tsx` (page détail)

### Fichiers à modifier

4. `src/renderer/src/App.tsx` (routing)
5. `src/renderer/src/pages/SettingsPage.tsx` (intégration camembert)
6. `src/renderer/src/types/index.ts` (nouveaux types)
7. `package.json` (dépendance recharts)

---

## 🧪 Tests à Effectuer

### Camembert Principal

- [ ] Affichage correct des % par catégorie
- [ ] Couleurs selon DB
- [ ] Hover effect fonctionne
- [ ] Click redirige vers bonne catégorie
- [ ] Catégories vides masquées
- [ ] Responsive (tester sur mobile)

### Page Détail Catégorie

- [ ] URL correcte (`/category/:id`)
- [ ] Bouton retour fonctionne
- [ ] Camembert secondaire affiche actifs
- [ ] Stats correctes (nb actifs, valeur)
- [ ] Liste actifs filtrée
- [ ] Bouton "+ Ajouter actif" pré-remplit catégorie
- [ ] Transactions filtrées par catégorie

### Edge Cases

- [ ] Catégorie sans actifs (masquée du camembert principal)
- [ ] Catégorie avec actifs mais quantité nette = 0
- [ ] Actif avec transactions BUY = SELL (quantité nette = 0)
- [ ] Pas de transactions du tout

---

## 🚀 Ordre d'Implémentation

1. **Installation** : `npm install recharts`
2. **Types** : Ajouter interfaces dans `types/index.ts`
3. **Calculs** : Coder `categoryCalculations.ts`
4. **Camembert** : Créer `CategoryPieChart.tsx`
5. **Routing** : Modifier `App.tsx`
6. **Page Détail** : Créer `CategoryDetailPage.tsx`
7. **Intégration** : Modifier `SettingsPage.tsx`
8. **Tests** : Vérifier tous les scénarios
9. **Polish** : Animations, responsive, UX

---

## 📝 Notes Techniques

### Calcul Quantité Nette

```typescript
const netQuantities = transactions.reduce((acc, t) => {
  const sign = t.type === 'BUY' ? 1 : -1
  acc.set(t.assetId, (acc.get(t.assetId) || 0) + t.quantity * sign)
  return acc
}, new Map<number, number>())
```

### Recharts Configuration

```tsx
<PieChart width={400} height={400}>
  <Pie
    data={categoryValues}
    dataKey="totalValue"
    nameKey="categoryName"
    cx="50%"
    cy="50%"
    outerRadius={150}
    label={(entry) => `${entry.percentage.toFixed(1)}%`}
  >
    {categoryValues.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>
```

---

## ⏱️ Estimation Temps

- Phase 1-2 : 30 min (setup + calculs)
- Phase 3 : 45 min (camembert)
- Phase 4 : 1h (page détail)
- Phase 5-6 : 30 min (intégration + routing)
- Tests : 30 min

**Total estimé** : 3h15min

---

## ✅ Checklist Finale

- [ ] Code TypeScript sans erreurs
- [ ] ESLint passed
- [ ] Prettier formaté
- [ ] Commits atomiques
- [ ] Documentation mise à jour
- [ ] CHANGELOG.md mis à jour
- [ ] Tests manuels réussis
- [ ] Responsive vérifié
- [ ] Tag version (v0.4.0)
