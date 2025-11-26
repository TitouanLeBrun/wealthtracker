# Fonctionnalité : Gestion des actifs sans position

**Date** : 26 novembre 2024  
**Version** : v0.6.0  
**Status** : ✅ Implémenté et testé

## 📋 Description

Cette fonctionnalité permet de gérer intelligemment les actifs qui n'ont plus de position active dans le portefeuille (quantité = 0), en permettant leur suppression uniquement s'ils n'ont aucun historique de transactions.

## 🎯 Objectifs

1. **Visibilité améliorée** : Distinguer clairement les actifs actifs des actifs soldés
2. **Nettoyage du portefeuille** : Permettre la suppression des actifs créés par erreur
3. **Préservation de l'historique** : Empêcher la suppression d'actifs avec transactions
4. **UX optimisée** : Interface intuitive avec confirmations et feedback clairs

## ✨ Fonctionnalités implémentées

### 1. Page Settings - Accordion des actifs sans position

#### Interface utilisateur

- **Accordion repliable** avec icône 🗑️ et compteur d'actifs
- **Message positif** si tous les actifs ont une position active
- **Liste des actifs** avec :
  - Nom et ticker de l'actif
  - Badge coloré de catégorie
  - Statut détaillé :
    - ✅ "Aucune transaction" (vert) → Supprimable
    - ⚠️ "Position soldée (X transactions)" (orange) → Non supprimable
  - Bouton "Supprimer" :
    - Rouge et actif si supprimable
    - Grisé et désactivé si historique existe

#### Confirmation de suppression

- **Modal de confirmation** avant suppression
- Message clair avec nom de l'actif en surbrillance
- Avertissement "irréversible"
- Bouton rouge "Supprimer" / "Annuler"
- Protection : désactivation pendant la suppression

### 2. Page CategoryDetail - Filtrage automatique

- **Affichage uniquement des actifs avec position** (quantité > 0)
- **Compteur mis à jour** dans le titre de section
- **Message informatif** si aucun actif actif dans la catégorie

## 🏗️ Architecture technique

### Fichiers créés

#### 1. `src/renderer/src/utils/calculations/assetPositionUtils.ts`

Utilitaires de calcul des positions :

```typescript
// Calcul de la position actuelle (BUY - SELL)
export function getAssetPosition(assetId: number, transactions: Transaction[]): number

// Vérifie si l'actif n'a aucune transaction
export function hasNoTransactions(assetId: number, transactions: Transaction[]): boolean

// Compte le nombre de transactions
export function getTransactionCount(assetId: number, transactions: Transaction[]): number

// Filtre les actifs sans position (quantité = 0)
export function getAssetsWithoutPosition(assets: Asset[], transactions: Transaction[]): Asset[]

// Filtre les actifs avec position (quantité > 0)
export function getAssetsWithPosition(assets: Asset[], transactions: Transaction[]): Asset[]

// Vérifie si un actif peut être supprimé (0 transaction)
export function canDeleteAsset(assetId: number, transactions: Transaction[]): boolean
```

#### 2. `src/renderer/src/components/asset/AssetWithoutPositionAccordion.tsx`

Composant React pour l'accordion dans Settings :

**Props** :

- `assets: Asset[]` - Liste complète des actifs
- `transactions: Transaction[]` - Liste complète des transactions
- `onAssetDeleted: () => void` - Callback après suppression réussie
- `onError: (message: string) => void` - Callback en cas d'erreur

**État interne** :

- `isOpen` - État ouvert/fermé de l'accordion
- `deleteDialogOpen` - État du modal de confirmation
- `assetToDelete` - Actif en cours de suppression
- `isDeleting` - État de chargement pendant suppression

### Fichiers modifiés

#### 3. `src/main/index.ts`

Ajout du handler IPC pour la suppression :

```typescript
ipcMain.handle('asset:delete', async (_, assetId: number) => {
  const transactionCount = await prisma.transaction.count({
    where: { assetId }
  })

  if (transactionCount > 0) {
    throw new Error(
      `Impossible de supprimer cet actif : ${transactionCount} transaction(s) associée(s)`
    )
  }

  return await prisma.asset.delete({
    where: { id: assetId }
  })
})
```

**Sécurité** :

- ✅ Validation backend : vérification du nombre de transactions
- ✅ Erreur explicite si transactions existantes
- ✅ Suppression uniquement si 0 transaction

#### 4. `src/preload/index.ts` & `src/preload/index.d.ts`

Ajout de la méthode `deleteAsset` :

```typescript
deleteAsset: (assetId: number) => ipcRenderer.invoke('asset:delete', assetId)
```

#### 5. `src/renderer/src/components/common/ConfirmDialog.tsx`

Améliorations pour supporter les actions destructives :

**Nouvelles props** :

- `message: string | React.ReactNode` - Support du JSX dans le message
- `isDestructive?: boolean` - Bouton rouge si action destructive
- `disabled?: boolean` - Désactivation du bouton de confirmation

**Styling adaptatif** :

- Bouton rouge (#ef4444) si `isDestructive={true}`
- Bouton bleu (--color-primary) par défaut
- État désactivé avec opacité réduite

#### 6. `src/renderer/src/pages/SettingsPage.tsx`

Intégration de l'accordion après le camembert :

```tsx
<AssetWithoutPositionAccordion
  assets={assets}
  transactions={transactions}
  onAssetDeleted={() => {
    loadAssets()
    onSuccess('Actif supprimé avec succès !')
  }}
  onError={onError}
/>
```

**Gestion du rafraîchissement** :

- Rechargement automatique après suppression
- Toast de succès "Actif supprimé avec succès !"

#### 7. `src/renderer/src/components/category/CategoryAssetsList.tsx`

Filtrage des actifs affichés :

```tsx
const assetsWithPosition = sortedAssets.filter((asset) => asset.netQuantity > 0)
```

**Message si vide** :

```
ℹ️ Aucun actif en position dans cette catégorie.
Toutes les positions ont été soldées ou aucun actif créé.
```

## 📊 Définitions validées

| Terme                 | Définition                                              |
| --------------------- | ------------------------------------------------------- |
| **Position en cours** | Quantité totale possédée > 0 (achats - ventes)          |
| **Sans position**     | Quantité totale = 0 (position soldée ou jamais achetée) |
| **Supprimable**       | Actif avec 0 transaction (aucun historique)             |
| **Non supprimable**   | Actif avec ≥1 transaction (historique à préserver)      |

## 🎨 UX/UI Design

### Couleurs sémantiques

- 🟢 **Vert (#10b981)** : Actif supprimable (aucune transaction)
- 🟠 **Orange (#f59e0b)** : Position soldée (transactions existantes)
- 🔴 **Rouge (#ef4444)** : Action destructive (suppression)
- 🔵 **Bleu (--color-primary)** : Actions normales

### Feedback utilisateur

- ✅ **Toast de succès** après suppression
- ❌ **Toast d'erreur** en cas d'échec
- ⏳ **État de chargement** pendant suppression
- 💬 **Tooltips** sur boutons désactivés
- ⚠️ **Modal de confirmation** pour actions irréversibles

## 🔒 Sécurité et validations

### Validation frontend

- Vérification locale du nombre de transactions
- Désactivation UI si historique existe
- Confirmation utilisateur requise

### Validation backend

- Double vérification du nombre de transactions
- Erreur explicite si tentative de suppression invalide
- Protection contre les suppressions accidentelles

## 📱 Responsive Design

- ✅ Accordion adaptatif sur mobile
- ✅ Cards d'actifs empilées verticalement
- ✅ Modal centré et responsive
- ✅ Boutons tactiles (taille minimale)

## 🧪 Tests suggérés

### Scénarios à tester

1. **Actif sans transaction**
   - ✅ Doit apparaître dans l'accordion
   - ✅ Badge vert "Aucune transaction"
   - ✅ Bouton "Supprimer" actif
   - ✅ Modal de confirmation fonctionne
   - ✅ Suppression réussie avec toast

2. **Actif avec position soldée**
   - ✅ Doit apparaître dans l'accordion
   - ✅ Badge orange "Position soldée (X transactions)"
   - ✅ Bouton "Supprimer" grisé et désactivé
   - ✅ Tooltip explicatif au survol

3. **Actif avec position en cours**
   - ✅ NE doit PAS apparaître dans l'accordion
   - ✅ Doit apparaître dans CategoryAssetsList

4. **Tous actifs avec position**
   - ✅ Message positif dans Settings
   - ✅ "✅ Tous vos actifs ont une position active !"

5. **Aucun actif en position dans catégorie**
   - ✅ Message informatif dans CategoryDetail
   - ✅ Compteur à jour (0 actifs)

## 🚀 Prochaines améliorations possibles

1. **Statistiques avancées**
   - Afficher le P&L total de la position soldée
   - Historique des prix moyens

2. **Export/Archive**
   - Exporter l'historique avant suppression
   - Archive des actifs soldés

3. **Filtres avancés**
   - Filtrer par catégorie dans l'accordion
   - Tri par date de dernière transaction

4. **Batch operations**
   - Suppression multiple d'actifs sans transaction
   - Confirmation groupée

## 📝 Notes de développement

- Les fins de ligne ont été normalisées en LF (Unix)
- Prettier a formaté automatiquement tous les fichiers
- Aucune erreur de compilation ou de linting
- Testé en mode développement avec succès

## 🔗 Fichiers liés

- Backend : `src/main/index.ts`
- Preload : `src/preload/index.ts`, `src/preload/index.d.ts`
- Utilitaires : `src/renderer/src/utils/calculations/assetPositionUtils.ts`
- Composants :
  - `src/renderer/src/components/asset/AssetWithoutPositionAccordion.tsx`
  - `src/renderer/src/components/common/ConfirmDialog.tsx`
  - `src/renderer/src/components/category/CategoryAssetsList.tsx`
- Pages : `src/renderer/src/pages/SettingsPage.tsx`

---

**Dernière mise à jour** : 26 novembre 2024  
**Développeur** : Assistant GitHub Copilot
