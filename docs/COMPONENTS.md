# 🧩 Composants React - WealthTracker

## Structure

```
src/renderer/src/
├── App.tsx                       # Composant principal (orchestration)
├── types/
│   └── index.ts                 # Types TypeScript partagés
└── components/
    ├── Notification.tsx         # Système de notifications
    ├── TransactionForm.tsx      # Formulaire d'ajout
    └── TransactionList.tsx      # Liste des transactions
```

## 📦 Composants

### `App.tsx` - Composant Principal

**Responsabilités** :
- Gestion de l'état global (transactions, loading, notifications)
- Communication avec l'API Electron (IPC)
- Orchestration des composants enfants

**État** :
```typescript
const [transactions, setTransactions] = useState<Transaction[]>([])
const [loading, setLoading] = useState(true)
const [message, setMessage] = useState<NotificationMessage | null>(null)
```

**Méthodes** :
- `loadTransactions()` - Charge les transactions depuis la DB
- `showMessage(type, text)` - Affiche une notification temporaire
- `handleTransactionSubmit(data)` - Callback pour création de transaction

---

### `Notification.tsx` - Notifications

**Props** :
```typescript
interface NotificationProps {
  type: 'success' | 'error'
  message: string
}
```

**Utilisation** :
```tsx
{message && <Notification type={message.type} message={message.text} />}
```

**Comportement** :
- Affichage conditionnel (seulement si `message` existe)
- Animation d'apparition (`slideIn`)
- Couleurs selon le type (vert=succès, rouge=erreur)
- Disparition automatique après 3s (géré par le parent)

---

### `TransactionForm.tsx` - Formulaire d'Ajout

**Props** :
```typescript
interface TransactionFormProps {
  onSubmit: (data: { label: string; amount: number; date: Date }) => Promise<void>
  onError: (message: string) => void
}
```

**État interne** :
```typescript
const [formData, setFormData] = useState({
  label: '',
  amount: '',
  date: new Date().toISOString().split('T')[0]
})
```

**Fonctionnalités** :
- ✅ Validation des champs (label + amount requis)
- ✅ Réinitialisation auto après soumission
- ✅ Gestion d'erreurs (callback `onError`)
- ✅ Date par défaut = aujourd'hui

**Champs** :
1. **Label** (text) - Description de la transaction
2. **Montant** (number, step=0.01) - Montant en €
3. **Date** (date) - Date de la transaction

---

### `TransactionList.tsx` - Liste des Transactions

**Props** :
```typescript
interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
}
```

**Comportement** :
- **Si `loading=true`** → Affiche "Chargement..."
- **Si `transactions.length === 0`** → Affiche message vide
- **Sinon** → Affiche la liste avec :
  - Label en gras
  - Montant coloré (+vert / -rouge)
  - Date formatée en français (`toLocaleDateString('fr-FR')`)
  - Compteur total

---

## 📝 Types Partagés (`types/index.ts`)

### `Transaction`
```typescript
export interface Transaction {
  id: number
  label: string
  amount: number
  date: Date
  createdAt: Date
}
```

### `TransactionFormData`
```typescript
export interface TransactionFormData {
  label: string
  amount: number
  date: Date
}
```

### `NotificationMessage`
```typescript
export interface NotificationMessage {
  type: 'success' | 'error'
  text: string
}
```

---

## 🔄 Flux de Données

### Ajout d'une Transaction

```
┌─────────────────────┐
│ TransactionForm     │
│ - Utilisateur      │
│   remplit le form  │
└──────────┬──────────┘
           │
           │ onSubmit(data)
           ▼
┌─────────────────────┐
│ App.tsx             │
│ - handleSubmit()    │
│ - createTransaction │
│ - loadTransactions  │
└──────────┬──────────┘
           │
           │ window.api.createTransaction()
           ▼
┌─────────────────────┐
│ Main Process (IPC)  │
│ - Prisma create()   │
│ - DB SQLite         │
└─────────────────────┘
```

### Affichage des Notifications

```
App.tsx (parent)
  │
  ├─ setMessage({ type, text })
  │
  └─ setTimeout(() => setMessage(null), 3000)
     │
     └─ Notification component
        └─ Affichage conditionnel
```

---

## 🎨 Avantages de cette Architecture

### ✅ Séparation des Responsabilités
- **App.tsx** : Logique métier + état global
- **TransactionForm** : Formulaire + validation
- **TransactionList** : Affichage pur
- **Notification** : UI de feedback

### ✅ Réutilisabilité
- `Notification` peut être utilisé ailleurs (erreurs globales, etc.)
- `TransactionForm` et `TransactionList` sont découplés

### ✅ Testabilité
- Chaque composant peut être testé unitairement
- Props claires et typées

### ✅ Maintenabilité
- Code plus court et lisible
- Modifications isolées (ex: changer le style du form)
- Types partagés évitent la duplication

---

## 📊 Comparaison Avant/Après

| Métrique | Avant (App.tsx monolithique) | Après (Composants) |
|----------|------------------------------|-------------------|
| **Lignes de code App.tsx** | ~230 lignes | ~50 lignes |
| **Nombre de composants** | 1 | 4 |
| **Responsabilités par fichier** | Multiples | Une seule |
| **Réutilisabilité** | ❌ Faible | ✅ Élevée |
| **Testabilité** | ❌ Difficile | ✅ Facile |

---

## 🚀 Prochaines Améliorations (v0.2)

### Composants à Ajouter
- **`TransactionItem.tsx`** - Item individuel de transaction (avec boutons Edit/Delete)
- **`FilterBar.tsx`** - Barre de filtres (date range, montant, recherche)
- **`StatsSummary.tsx`** - Résumé statistique (total, moyenne, etc.)
- **`ConfirmDialog.tsx`** - Dialogue de confirmation pour suppression

### Hooks Personnalisés
- **`useTransactions()`** - Hook pour gérer les transactions
- **`useNotification()`** - Hook pour gérer les notifications
- **`useForm()`** - Hook générique pour formulaires

### Exemple : `useTransactions.ts`
```typescript
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const loadTransactions = async () => { /* ... */ }
  const createTransaction = async (data) => { /* ... */ }
  const deleteTransaction = async (id) => { /* ... */ }

  useEffect(() => {
    loadTransactions()
  }, [])

  return { transactions, loading, createTransaction, deleteTransaction }
}
```

---

## 📚 Ressources

- [React Component Composition](https://react.dev/learn/passing-props-to-a-component)
- [TypeScript with React](https://react.dev/learn/typescript)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
