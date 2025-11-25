# Transaction Components Architecture

## 📂 Structure

```
src/renderer/src/components/transaction/
├── TransactionManagerCards.tsx    # Composant principal (orchestration)
├── TransactionFilters.tsx         # Barre de filtres (catégorie + date)
├── TransactionList.tsx            # Liste des transactions
├── TransactionCard.tsx            # Card individuelle d'une transaction
├── TransactionPagination.tsx      # Pagination avec navigation
└── AssetManagerCards.tsx          # Gestion des assets (existant)
```

## 🧩 Composants

### TransactionManagerCards

**Rôle** : Composant principal qui orchestr e l'affichage des transactions

**Responsabilités** :

- Gestion de l'état (pagination, filtres, dialog de suppression)
- Filtrage des transactions (catégorie + date)
- Extraction des catégories uniques
- Coordination entre les sous-composants

**Props** :

```typescript
interface TransactionManagerCardsProps {
  transactions: Transaction[]
  loading?: boolean
  onDelete?: (transactionId: number) => Promise<void>
}
```

**États gérés** :

- `currentPage`: Page actuelle de la pagination
- `selectedCategory`: Catégorie filtrée
- `dateFilter`: Date filtrée
- `deleteConfirm`: Transaction à supprimer (pour le dialog)

---

### TransactionFilters

**Rôle** : Barre de filtrage avec catégorie, date et compteur de résultats

**Props** :

```typescript
interface TransactionFiltersProps {
  selectedCategory: string
  dateFilter: string
  categories: string[]
  resultCount: number
  onCategoryChange: (category: string) => void
  onDateChange: (date: string) => void
  onReset: () => void
}
```

**Fonctionnalités** :

- Filtre par catégorie (dropdown)
- Filtre par date (input date)
- Bouton "Réinitialiser" (visible si filtres actifs)
- Affichage du nombre de résultats

---

### TransactionList

**Rôle** : Affichage de la liste des transactions ou message vide

**Props** :

```typescript
interface TransactionListProps {
  transactions: Transaction[]
  onDeleteTransaction?: (transaction: Transaction) => void
}
```

**Comportement** :

- Si `transactions` est vide → Message "Aucune transaction..."
- Sinon → Affichage de `TransactionCard` pour chaque transaction

---

### TransactionCard

**Rôle** : Affichage d'une transaction individuelle en layout grille

**Props** :

```typescript
interface TransactionCardProps {
  transaction: Transaction
  onDelete?: () => void
}
```

**Layout (8 colonnes)** :

1. **Badge Type** : ACHAT (rouge) / VENTE (vert)
2. **Asset** : Ticker + Nom + Badge catégorie
3. **Quantité** : Nombre d'unités
4. **Prix/u** : Prix unitaire
5. **Frais** : Frais de transaction
6. **Total** : Montant total (coloré selon type)
7. **Date** : Date au format dd/MM/yyyy
8. **Bouton Supprimer** : Icône 🗑️ (si `onDelete` fourni)

**Effets visuels** :

- Hover : Translation +4px + shadow
- Bordure gauche colorée (rouge/vert)
- Bouton supprimer avec hover rouge

---

### TransactionPagination

**Rôle** : Navigation entre les pages + info d'affichage

**Props** :

```typescript
interface TransactionPaginationProps {
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  totalItems: number
  onPageChange: (page: number) => void
}
```

**Comportement** :

- Retourne `null` si `totalPages <= 1`
- Boutons : "Précédent" + pages numérotées + "Suivant"
- Info : "Affichage de X à Y sur Z transaction(s)"
- Boutons désactivés en début/fin de liste

---

## 🔄 Flux de données

```
TransactionManagerCards (état global)
    │
    ├──> TransactionFilters (filtres)
    │       └── onChange → handleFilterChange()
    │
    ├──> TransactionList (liste filtrée + paginée)
    │       └── TransactionCard (transaction individuelle)
    │               └── onDelete → setDeleteConfirm()
    │
    └──> TransactionPagination (navigation)
            └── onPageChange → setCurrentPage()
```

## 📊 Pagination & Filtrage

**Constante** :

- `ITEMS_PER_PAGE = 5` transactions par page

**Logique** :

1. **Filtrage** : `transactions` → `filteredTransactions` (catégorie + date)
2. **Pagination** : `filteredTransactions` → `currentTransactions` (slice)
3. **Affichage** : `currentTransactions` → `TransactionList`

**Reset automatique** :

- Changement de filtre → `setCurrentPage(1)`

---

## 🎨 Avantages de l'architecture

✅ **Séparation des responsabilités** : Chaque composant a un rôle unique  
✅ **Réutilisabilité** : `TransactionCard`, `TransactionFilters`, etc. peuvent être utilisés ailleurs  
✅ **Testabilité** : Composants isolés faciles à tester  
✅ **Maintenabilité** : Code modulaire, modifications localisées  
✅ **Lisibilité** : Fichiers courts (~50-200 lignes vs 600 lignes)  
✅ **Performance** : Rendu optimisé par composant

---

## 🛠️ Utilisation

```tsx
import TransactionManagerCards from '@/components/transaction/TransactionManagerCards'

function MyPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const handleDelete = async (id: number) => {
    await window.api.deleteTransaction(id)
    // Recharger les transactions...
  }

  return (
    <TransactionManagerCards transactions={transactions} loading={false} onDelete={handleDelete} />
  )
}
```

---

## 📝 Notes

- Les composants utilisent des **inline styles** (cohérence avec le reste du projet)
- Variables CSS : `--color-*`, `--spacing-*`, `--border-radius`
- Icons : `lucide-react` (Calendar, Filter, Trash2, ChevronLeft, ChevronRight)
- Effets hover gérés via `onMouseEnter` / `onMouseLeave`

---

**Créé le** : 25 novembre 2025  
**Version** : 1.0.0  
**Auteur** : Architecture refactorisée pour améliorer la maintenabilité
