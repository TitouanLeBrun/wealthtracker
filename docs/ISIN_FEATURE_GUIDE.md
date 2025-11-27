# 🌍 Guide : Résolution ISIN vers Ticker Yahoo

## 📋 Vue d'ensemble

Cette fonctionnalité permet aux utilisateurs de créer des actifs en utilisant directement leur **code ISIN** (International Securities Identification Number) au lieu du ticker Yahoo Finance. C'est particulièrement utile pour les investisseurs européens qui connaissent principalement les codes ISIN.

## 🎯 Fonctionnement

### Flux utilisateur

1. **Interface** : L'utilisateur saisit un ISIN (ex: `FR0000120271`) ou un ticker (ex: `AAPL`) dans le champ "Ticker ou ISIN"
2. **Backend** : Le serveur interroge l'API Yahoo Finance pour résoudre le symbole
3. **Résolution** : Yahoo retourne le ticker correspondant (ex: `TTE.PA` pour TotalEnergies)
4. **Prix** : Le prix actuel est automatiquement récupéré
5. **Stockage** : L'actif est sauvegardé avec :
   - `ticker` : Le symbole Yahoo (utilisé pour les requêtes futures)
   - `isin` : Le code ISIN original (pour référence)
   - `currentPrice` : Le prix du marché

### Exemple concret

```
Entrée utilisateur : LU1681043599
                ↓
      Yahoo Finance API
                ↓
    Résolution : CW8.PA (Amundi MSCI World)
                ↓
      Prix actuel : 485.30 €
                ↓
         Base de données :
         - ticker: "CW8.PA"
         - isin: "LU1681043599"
         - currentPrice: 485.30
```

## 🔧 Architecture technique

### 1. Base de données (`prisma/schema.prisma`)

```prisma
model Asset {
  id           Int      @id @default(autoincrement())
  name         String
  ticker       String   @unique
  isin         String?  // ✨ Nouveau champ
  currentPrice Float
  // ...
}
```

### 2. Service Yahoo (`src/main/utils/yahoo.ts`)

#### `resolveSymbol(query: string)`

- Interroge `https://query1.finance.yahoo.com/v1/finance/search`
- Filtre les résultats pour ne garder que les `EQUITY` et `ETF`
- Retourne : `{ symbol, isin?, name? }`

#### `getLatestPrice(symbol: string)`

- Interroge `https://query1.finance.yahoo.com/v8/finance/chart`
- Extrait le `regularMarketPrice`
- Retourne le prix ou `null`

### 3. Handler IPC (`src/main/ipc/assets.ts`)

```typescript
ipcMain.handle('asset:create', async (_, data) => {
  // 1. Résolution
  const resolved = await resolveSymbol(data.ticker)

  // 2. Extraction
  const finalTicker = resolved?.symbol || data.ticker
  const isinCode = resolved?.isin

  // 3. Prix
  const finalPrice = await getLatestPrice(finalTicker) || data.currentPrice

  // 4. Création
  return prisma.asset.create({
    data: { ticker: finalTicker, isin: isinCode, currentPrice: finalPrice, ... }
  })
})
```

### 4. Frontend (`AssetTickerField.tsx`)

```tsx
<label>Ticker ou ISIN</label>
<input placeholder="Ex: AAPL ou FR0000120271" />
<small>Accepte un ticker Yahoo (AAPL) ou un code ISIN européen</small>
```

## 🧪 Tests

### Cas de test recommandés

| Type                | Entrée         | Résultat attendu                                      |
| ------------------- | -------------- | ----------------------------------------------------- |
| **Ticker US**       | `AAPL`         | Symbol: `AAPL`, Prix: ~$180                           |
| **Ticker Euronext** | `MC.PA`        | Symbol: `MC.PA` (LVMH), Prix: ~€700                   |
| **ISIN FR**         | `FR0000120271` | Symbol: `TTE.PA` (TotalEnergies), ISIN sauvegardé     |
| **ISIN LU (ETF)**   | `LU1681043599` | Symbol: `CW8.PA` (Amundi MSCI World), ISIN sauvegardé |
| **ISIN US**         | `US0378331005` | Symbol: `AAPL`, ISIN sauvegardé                       |
| **Invalide**        | `ZZZZZZ`       | Utilise valeur brute (fallback)                       |

### Procédure de test manuelle

1. **Lancer l'app** : `npm run dev`
2. **Aller dans Settings** → Créer une catégorie si nécessaire
3. **Dashboard** → "Nouvel Actif"
4. **Tester avec ISIN** :
   - Nom : `Amundi MSCI World`
   - Ticker : `LU1681043599`
   - Prix : `0` (laissé vide)
   - Catégorie : Actions
5. **Soumettre**
6. **Vérifier** :
   - ✅ L'actif apparaît avec le ticker `CW8.PA`
   - ✅ Le prix est récupéré automatiquement
   - ✅ (En DB) Le champ `isin` contient `LU1681043599`

## 📊 Avantages

| Avant                                        | Après                                           |
| -------------------------------------------- | ----------------------------------------------- |
| ❌ Utilisateur doit chercher le ticker Yahoo | ✅ Utilisateur utilise l'ISIN qu'il connaît     |
| ❌ Confusion entre marchés (TTE vs TTE.PA)   | ✅ Yahoo retourne automatiquement le bon marché |
| ❌ Prix manuel à saisir                      | ✅ Prix récupéré automatiquement                |
| ❌ Pas de traçabilité ISIN                   | ✅ ISIN stocké pour référence                   |

## 🚨 Gestion des erreurs

### API Yahoo indisponible

```typescript
if (!resolved) {
  console.warn('Impossible de résoudre, utilisation valeurs brutes')
  // Fallback : utilise ticker et prix fournis par l'utilisateur
}
```

### Prix non disponible

```typescript
if (price === null) {
  // Utilise le prix fourni par l'utilisateur (peut être 0)
}
```

### Symbole déjà existant

- Le système vérifie toujours l'unicité du ticker
- Si `CW8.PA` existe déjà, l'erreur standard s'affiche

## 🔮 Évolutions futures

- [ ] **Cache de résolution** : Stocker les résolutions ISIN → Ticker pour éviter requêtes répétées
- [ ] **Suggestions** : Afficher plusieurs résultats si ambiguïté
- [ ] **Validation ISIN** : Vérifier format ISIN (12 caractères, checksum)
- [ ] **Affichage ISIN** : Montrer l'ISIN dans les détails d'actif
- [ ] **Import CSV** : Supporter colonne ISIN dans l'import Trade Republic
- [ ] **API alternative** : Fallback sur Alpha Vantage si Yahoo échoue

## 📚 Ressources

- [Yahoo Finance API (non-officielle)](https://github.com/ranaroussi/yfinance)
- [Format ISIN](https://www.isin.org/isin-format/)
- [Liste ISIN français](https://www.boursorama.com/)

---

✨ **Cette feature rend WealthTracker 10x plus user-friendly pour les investisseurs européens !**
