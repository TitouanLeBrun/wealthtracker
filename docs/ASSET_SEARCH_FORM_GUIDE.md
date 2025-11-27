# 🔍 Guide du Formulaire de Recherche d'Actifs

## Vue d'ensemble

Le nouveau formulaire **AssetSearchForm** permet de créer des actifs financiers de manière intelligente en utilisant l'API Yahoo Finance pour récupérer automatiquement les informations.

## ✨ Fonctionnalités

### 1. **Recherche Automatique par ISIN/Ticker**
- Recherche en temps réel avec **debounce de 500ms**
- Support des codes **ISIN** (ex: `FR0000120271`) et **Tickers** (ex: `AAPL`)
- **Loading spinner** pendant la recherche
- Affichage des résultats dans une **carte visuelle animée**

### 2. **Création Automatique de Catégorie**
- Mapping intelligent basé sur le type d'actif Yahoo :
  - `ETF` → Catégorie "ETF"
  - `EQUITY` → Catégorie "Actions"
  - `CRYPTOCURRENCY` → Catégorie "Crypto"
  - `MUTUALFUND` → Catégorie "Fonds"
  - `INDEX` → Catégorie "Indices"
  - `CURRENCY` → Catégorie "Devises"
  - Autres → Catégorie "Autres"

### 3. **Mode Manuel (Fallback)**
- Accessible si aucun résultat n'est trouvé
- Pré-remplit les données si un résultat partiel existe
- Formulaire complet avec validation

### 4. **Notifications Toast**
- Intégration de **react-hot-toast** pour les notifications
- Feedback immédiat sur les actions (succès/erreur)
- Style cohérent avec le thème de l'application

## 📋 Utilisation

### Recherche d'un Actif

1. **Saisir un ISIN ou Ticker** dans le champ de recherche
   ```
   Exemples :
   - ISIN français : FR0000120271 (TotalEnergies)
   - ISIN US : US0378331005 (Apple)
   - Ticker : AAPL, MSFT, BTC-USD
   ```

2. **Attendre 500ms** (debounce automatique)
   - Un spinner s'affiche pendant la recherche
   - Toast de confirmation si un actif est trouvé

3. **Résultat trouvé**
   - Carte verte affichant :
     - Nom complet de l'actif
     - Symbole et bourse (ex: AAPL.PA • NYSE)
     - Type d'actif (ETF, EQUITY, CRYPTO)
     - Prix actuel + devise
     - Code ISIN (si disponible)
   
4. **Actions disponibles**
   - **✓ Utiliser cet actif** : Crée l'actif automatiquement
   - **✏️ Modifier manuellement** : Passe en mode manuel pour ajuster

### Mode Manuel

1. **Accès au mode manuel**
   - Clic sur "Créer manuellement" si aucun résultat
   - Clic sur "✏️ Modifier manuellement" depuis un résultat

2. **Formulaire manuel**
   - **Nom** : Requis
   - **Ticker** : Requis (converti en majuscules automatiquement)
   - **ISIN** : Optionnel (converti en majuscules)
   - **Prix actuel (€)** : Requis (nombre positif)
   - **Catégorie** : Requis (liste déroulante)

3. **Bouton "← Retour à la recherche"** pour revenir au mode automatique

## 🔧 Intégration Technique

### Props du Composant

```typescript
interface AssetSearchFormProps {
  categories: Category[]           // Liste des catégories existantes
  onSubmit: (data: {               // Callback de soumission
    name: string
    ticker: string
    isin: string
    currentPrice: number
    categoryId: number
  }) => void
  onCancel: () => void             // Callback d'annulation
  isLoading?: boolean              // État de chargement externe
}
```

### Exemple d'Utilisation

```tsx
import AssetSearchForm from '@renderer/components/forms/asset/AssetSearchForm'

function MyPage() {
  const [categories, setCategories] = useState<Category[]>([])
  
  const handleSubmit = async (data) => {
    try {
      await window.api.createAsset(data)
      toast.success('Actif créé avec succès')
    } catch (error) {
      toast.error('Erreur lors de la création')
    }
  }
  
  return (
    <AssetSearchForm
      categories={categories}
      onSubmit={handleSubmit}
      onCancel={() => console.log('Annulé')}
    />
  )
}
```

## 🎨 Styles et Animations

### Animations CSS
- **`animate-fadeIn`** : Animation d'apparition des résultats
- **Spinner de chargement** : Animation de rotation CSS
- **Hover effects** : Transitions fluides sur les boutons

### Classes Tailwind Utilisées
- Gradients : `bg-gradient-to-br from-green-50 to-emerald-50`
- Dark mode : `dark:bg-gray-700`, `dark:text-white`
- Responsive : Adapté mobile/desktop automatiquement

## 🧪 Tests

### Scénarios à Tester

1. **✅ Recherche ISIN français**
   - Saisir : `FR0000120271`
   - Résultat attendu : TotalEnergies (TTE.PA)

2. **✅ Recherche Ticker US**
   - Saisir : `AAPL`
   - Résultat attendu : Apple Inc. (AAPL)

3. **✅ Recherche ETF**
   - Saisir : `FR0013412020`
   - Résultat attendu : Amundi MSCI World ETF (PLEM.PA)
   - Catégorie créée : "ETF"

4. **✅ Recherche Crypto**
   - Saisir : `BTC-USD`
   - Résultat attendu : Bitcoin USD
   - Catégorie créée : "Crypto"

5. **✅ ISIN invalide → Mode manuel**
   - Saisir : `XXXXXXXX`
   - Résultat attendu : Message "Aucun résultat"
   - Action : Clic sur "Créer manuellement"

6. **✅ Création manuelle complète**
   - Remplir tous les champs
   - Valider
   - Résultat : Actif créé sans ISIN

## 🔗 APIs Utilisées

### Backend (IPC Handlers)

```typescript
// Recherche d'actif
window.api.searchAsset(query: string)
// → Promise<YahooAssetSearchResult | null>

// Création/récupération de catégorie
window.api.getOrCreateCategory(name: string)
// → Promise<Category>

// Création d'actif
window.api.createAsset(data: AssetFormData)
// → Promise<Asset>
```

### Yahoo Finance API

```typescript
// Recherche
GET https://query1.finance.yahoo.com/v1/finance/search?q={query}

// Prix actuel
GET https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=3mo
```

## 📦 Dépendances

- **react-hot-toast** : `^2.4.1` - Notifications toast
- **Yahoo Finance API** : Gratuit, sans clé API requise

## 🚀 Prochaines Améliorations

- [ ] Cache des résultats de recherche (éviter appels API répétés)
- [ ] Support multi-devises (conversion automatique EUR/USD)
- [ ] Historique des recherches récentes
- [ ] Suggestions de ticker basées sur le nom
- [ ] Import CSV avec résolution ISIN automatique
- [ ] Batch creation (créer plusieurs actifs d'un coup)

## 📝 Notes Importantes

1. **Connexion Internet requise** pour la recherche automatique
2. **ISIN/Ticker optionnel** : Possibilité de créer des actifs sans code
3. **Throttling API** : Batch updates utilisent un délai de 500ms entre requêtes
4. **Dark mode** : Tous les composants supportent le thème sombre
5. **Accessibilité** : Navigation au clavier supportée

---

**Date de création** : 27 novembre 2024  
**Version** : 1.2.0  
**Auteur** : WealthTracker Team
