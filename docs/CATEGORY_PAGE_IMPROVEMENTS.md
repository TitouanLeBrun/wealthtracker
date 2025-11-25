# 📊 Améliorations de la Page Catégorie

**Date** : 25 novembre 2025  
**Version** : 0.5.0

---

## 🎯 Objectifs

Améliorer l'UX de la page de détail d'une catégorie en réorganisant le layout, en améliorant la gestion des erreurs, et en facilitant l'ajout de transactions.

---

## ✅ Modifications Implémentées

### 1. **Amélioration du Formulaire AssetForm**

#### Nouvelles Fonctionnalités

- ✨ **Prop `initialCategoryId`** : Préremplissage automatique de la catégorie
- 🔒 **Prop `lockCategory`** : Désactivation du sélecteur de catégorie avec indicateur visuel
- 🎯 **Gestion d'erreur améliorée** : Détection spécifique de l'erreur "ticker déjà existant"
- 💬 **Message d'erreur explicite** :
  ```
  Le ticker "AAPL" existe déjà. Veuillez en choisir un autre.
  ```

#### Code

```typescript
interface AssetFormProps {
  onSubmit: (data: AssetFormData) => Promise<void>
  onError: (message: string) => void
  initialCategoryId?: number // Catégorie par défaut
  lockCategory?: boolean // Si true, désactive la sélection de catégorie
}
```

**Gestion d'erreur** :

```typescript
const errorMessage = error instanceof Error ? error.message : String(error)
if (errorMessage.includes('Unique constraint failed') || errorMessage.includes('ticker')) {
  onError(`Le ticker "${formData.ticker.toUpperCase()}" existe déjà. Veuillez en choisir un autre.`)
}
```

---

### 2. **Réorganisation de CategoryDetailPage**

#### Nouveau Layout

```
┌─────────────────────────────────────────────────────┐
│ [← Retour] ACTIONS            [➕ Ajouter un Actif] │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌──────────┐  ┌──────────────────────────────────┐ │
│ │Camembert │  │   Statistiques                   │ │
│ │Répartition│  │ • Valeur Totale: 5000€          │ │
│ │des Actifs│  │ • % Portefeuille: 45%           │ │
│ │          │  │ • Nombre d'actifs: 5            │ │
│ │          │  │ • Transactions: 12              │ │
│ └──────────┘  └──────────────────────────────────┘ │
│                                                     │
├─────────────────────────────────────────────────────┤
│ 📋 Actifs (5)              [➕ Ajouter un Actif]    │
│                                                     │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│ │ AAPL        │ │ TSLA        │ │ GOOGL       │   │
│ │ Apple Inc.  │ │ Tesla Inc.  │ │ Alphabet    │   │
│ │ Prix: 180€  │ │ Prix: 250€  │ │ Prix: 140€  │   │
│ │ Qté: 10     │ │ Qté: 5      │ │ Qté: 8      │   │
│ │ Total: 1800€│ │ Total: 1250€│ │ Total: 1120€│   │
│ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────┐    │
│ │ BTC          📊 Sans position               │ ← Grisé
│ │ Bitcoin                                     │    │
│ │ Prix: 42000€ | Qté: 0 | Total: 0€          │    │
│ └─────────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│ 📊 Historique      [➕ Ajouter une Transaction]    │
│                                                     │
│ [Liste des transactions filtrées par catégorie]    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Fonctionnalités Ajoutées

**Liste des Actifs** :

- ✅ Titre avec compteur d'actifs
- ✅ Bouton "Ajouter un Actif" à droite du titre
- ✅ Tri automatique : actifs avec quantité > 0 en premier
- ✅ Badge "📊 Sans position" pour les actifs à quantité = 0
- ✅ Opacité réduite (0.6) pour les actifs inactifs
- ✅ Position relative pour afficher le badge en haut à droite

**Historique des Transactions** :

- ✅ Bouton "Ajouter une Transaction" à droite du titre
- ✅ Modal avec formulaire pré-filtré (uniquement actifs de la catégorie)

---

### 3. **Amélioration du TransactionForm**

#### Nouvelle Prop `assets`

```typescript
interface TransactionFormProps {
  onSubmit: (...) => Promise<void>
  onError: (message: string) => void
  assets?: Asset[] // 👈 NOUVEAU : Liste optionnelle d'actifs pré-filtrés
}
```

**Utilisation** :

```typescript
// Si des actifs sont passés en props, les utiliser
const data = propsAssets || (await window.api.getAllAssets())
```

**Cas d'usage** :

- Page Catégorie → Uniquement actifs de cette catégorie
- Page Transactions → Tous les actifs
- Page Settings → Tous les actifs

---

## 🎨 Améliorations Visuelles

### Badge "Sans Position"

```typescript
{isInactive && (
  <div
    style={{
      position: 'absolute',
      top: 'var(--spacing-sm)',
      right: 'var(--spacing-sm)',
      padding: '4px 8px',
      background: '#f59e0b',  // Orange
      color: 'white',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '600'
    }}
  >
    📊 Sans position
  </div>
)}
```

### Carte Actif Inactive

```typescript
style={{
  opacity: isInactive ? 0.6 : 1,
  position: 'relative'
}}
```

---

## 📝 Fichiers Modifiés

### 1. **AssetForm.tsx**

- Ajout de `initialCategoryId` et `lockCategory`
- Gestion d'erreur "ticker déjà existant"
- Désactivation visuelle du sélecteur de catégorie

### 2. **CategoryDetailPage.tsx**

- Ajout de `sortedAssets` (tri par quantité)
- Bouton "Ajouter un Actif" déplacé à droite du titre
- Bouton "Ajouter une Transaction" ajouté
- Modal Transaction avec actifs filtrés
- Badge et opacité pour actifs inactifs

### 3. **TransactionForm.tsx**

- Ajout de la prop optionnelle `assets`
- Utilisation des actifs props si fournis
- Mise à jour des dépendances du useEffect

---

## 🧪 Tests Recommandés

### Scénario 1 : Création d'Actif

1. Ouvrir une catégorie
2. Cliquer sur "Ajouter un Actif"
3. Vérifier que la catégorie est pré-sélectionnée et verrouillée
4. Essayer de créer un ticker existant → Message d'erreur explicite
5. Créer un nouvel actif → Succès

### Scénario 2 : Affichage des Actifs

1. Ouvrir une catégorie avec plusieurs actifs
2. Vérifier le tri : actifs avec quantité > 0 en premier
3. Vérifier le badge "📊 Sans position" sur les actifs à quantité 0
4. Vérifier l'opacité réduite des actifs inactifs

### Scénario 3 : Ajout de Transaction

1. Ouvrir une catégorie
2. Cliquer sur "Ajouter une Transaction"
3. Vérifier que seuls les actifs de cette catégorie sont disponibles
4. Créer une transaction → Succès

---

## 🚀 Prochaines Étapes Possibles

### Court Terme

- [ ] Ajouter un bouton "Ajouter une transaction" sur chaque carte d'actif
- [ ] Permettre de modifier le prix d'un actif depuis la carte
- [ ] Ajouter des filtres sur la liste des actifs (actifs/inactifs)

### Moyen Terme

- [ ] Graphique d'évolution de la valeur de la catégorie
- [ ] Export CSV des transactions par catégorie
- [ ] Statistiques avancées (PMA, PV réalisée/latente par catégorie)

### Long Terme

- [ ] Permettre de déplacer un actif d'une catégorie à une autre
- [ ] Archiver les actifs à quantité 0
- [ ] Fusion d'actifs en doublon

---

## 📊 Impact

### Avant

- Bouton "Ajouter un Actif" dans le header (loin de la liste)
- Pas de distinction visuelle pour les actifs inactifs
- Erreur générique lors de la création d'un actif existant
- Impossible d'ajouter une transaction depuis la page catégorie

### Après

- Bouton "Ajouter un Actif" à côté du titre de la liste
- Badge et opacité pour identifier les actifs sans position
- Message d'erreur explicite avec le ticker en conflit
- Bouton "Ajouter une Transaction" avec actifs pré-filtrés
- Meilleure organisation visuelle (camembert + stats | actifs | transactions)

---

## 🎯 Résultat

Une page de catégorie plus intuitive, avec une meilleure gestion des erreurs et des raccourcis pour les actions fréquentes (ajout d'actif/transaction).
