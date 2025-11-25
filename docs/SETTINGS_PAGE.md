# 📖 Page Configuration - Guide Utilisateur

## 🎯 Vue d'ensemble

La **Page Configuration** permet de gérer vos **catégories** et **actifs** financiers directement depuis l'interface utilisateur, sans passer par la base de données ou le seed.

## 🚀 Accès

1. Lancez l'application : `npm run dev`
2. Cliquez sur l'onglet **⚙️ Configuration** dans la barre de navigation

## 📁 Gestion des Catégories

### Créer une Catégorie

1. **Saisir le nom** de la catégorie (ex: "Actions", "Cryptomonnaies", "Immobilier")
2. **Choisir une couleur** :
   - Cliquez sur une des 6 couleurs présets (Vert, Bleu, Orange, Rouge, Violet, Cyan)
   - OU utilisez le sélecteur de couleur personnalisé
3. **Aperçu** : Le bouton "Créer" affiche la couleur sélectionnée
4. Cliquez sur **✅ Créer la catégorie**

### Caractéristiques

- ✅ **Nom unique** : Chaque catégorie doit avoir un nom différent
- 🎨 **Couleur personnalisable** : Utilisée dans les badges et les cartes
- 📊 **Affichage grille** : Les catégories s'affichent dans une grille responsive
- 🔢 **Compteur** : Le nombre de catégories s'affiche dans l'onglet

### Exemple de Catégories

```
📁 Actions       (Vert)
📁 Crypto        (Orange)
📁 ETF           (Bleu)
📁 Immobilier    (Rouge)
📁 Obligations   (Violet)
📁 Matières      (Cyan)
```

## 💼 Gestion des Actifs

### Créer un Actif

1. **Nom complet** : Nom complet de l'entreprise ou de l'actif (ex: "Apple Inc.", "Bitcoin")
2. **Ticker** : Symbole boursier en majuscules (ex: "AAPL", "BTC", "SPY")
   - Converti automatiquement en majuscules
3. **Prix actuel** : Prix en euros (peut être mis à jour plus tard)
4. **Catégorie** : Sélectionnez la catégorie parente

### Prérequis

⚠️ **Vous devez avoir au moins une catégorie** avant de créer un actif.

Si aucune catégorie n'existe, un message jaune s'affiche :

> ⚠️ Aucune catégorie disponible  
> Vous devez d'abord créer au moins une catégorie avant de pouvoir ajouter des actifs.

### Caractéristiques

- ✅ **Ticker unique** : Auto-conversion en majuscules (aapl → AAPL)
- 💰 **Prix actuel** : Formaté avec 2 décimales (195.50 €)
- 🏷️ **Badge catégorie** : Affiche la catégorie avec sa couleur
- 📅 **Date de création** : Enregistrée automatiquement
- 🔢 **Compteur** : Le nombre d'actifs s'affiche dans l'onglet

### Exemple d'Actifs

| Ticker | Nom                   | Catégorie       | Prix actuel |
| ------ | --------------------- | --------------- | ----------- |
| AAPL   | Apple Inc.            | Actions (vert)  | 195.50 €    |
| BTC    | Bitcoin               | Crypto (orange) | 98,500.00 € |
| SPY    | S&P 500 ETF           | ETF (bleu)      | 580.00 €    |
| MSFT   | Microsoft Corporation | Actions (vert)  | 420.00 €    |

## 🎨 Interface Utilisateur

### Navigation

```
┌─────────────────────────────────────────┐
│ 💰 WealthTracker v0.2                   │
│                                         │
│  📊 Transactions  |  ⚙️ Configuration   │
└─────────────────────────────────────────┘
```

- **Navbar sticky** : Reste visible lors du scroll
- **Onglets actifs** : Surlignés avec la couleur correspondante
  - Transactions → Bleu (#2196F3)
  - Configuration → Vert (#4CAF50)

### Onglets Configuration

```
┌────────────────────────────────────┐
│  📁 Catégories (3)  |  💼 Actifs (4) │
└────────────────────────────────────┘
```

- **Compteurs dynamiques** : Mis à jour en temps réel
- **Badge coloré** : Vert pour catégories, bleu pour actifs

### Formulaires

**Design moderne** :

- Fond gris clair (#f9f9f9)
- Bordure arrondie (8px)
- Labels en gras
- Placeholders informatifs
- Boutons colorés et animés

### Listes

**Catégories** : Grille responsive

- Colonnes auto-fill (min 200px)
- Cartes avec bordure colorée
- Pastille de couleur circulaire

**Actifs** : Tableau professionnel

- 5 colonnes (Ticker, Nom, Catégorie, Prix, Date)
- Effet hover sur les lignes
- Badge catégorie coloré

## 📋 Workflow Recommandé

### 1️⃣ Première Utilisation

```
1. Créer les catégories principales
   ✅ Actions (Vert)
   ✅ Cryptomonnaies (Orange)
   ✅ ETF (Bleu)

2. Ajouter vos actifs
   ✅ AAPL - Apple Inc. (Actions, 195.50 €)
   ✅ BTC - Bitcoin (Crypto, 98,500 €)
   ✅ SPY - S&P 500 ETF (ETF, 580 €)

3. Passer à l'onglet Transactions
   ✅ Créer vos premières transactions
```

### 2️⃣ Utilisation Quotidienne

```
1. Configuration → Actifs
   → Vérifier/Mettre à jour les prix (futur)

2. Transactions
   → Enregistrer achats/ventes du jour

3. Dashboard (futur)
   → Consulter statistiques et graphiques
```

## 🔔 Notifications

### Messages de Succès (Vert)

- ✅ Catégorie "Actions" créée avec succès !
- ✅ Actif "AAPL" créé avec succès !
- ✅ Transaction ajoutée avec succès !

### Messages d'Erreur (Rouge)

- ❌ Veuillez saisir un nom de catégorie
- ❌ Veuillez sélectionner une catégorie
- ❌ Le prix ne peut pas être négatif

## 🎯 Bonnes Pratiques

### Noms de Catégories

✅ **Recommandé** :

- Actions
- Cryptomonnaies
- ETF
- Immobilier

❌ **À éviter** :

- cat1, cat2 (pas descriptif)
- Actions Françaises Actions US (trop spécifique)

### Tickers

✅ **Recommandé** :

- AAPL (actions Apple)
- BTC (Bitcoin)
- SPY (ETF S&P 500)
- EUR/USD (forex)

❌ **À éviter** :

- Apple (utilisez AAPL)
- btc (sera converti en BTC)

### Couleurs

💡 **Suggestion** :

- Vert → Actions / ETF traditionnels
- Orange/Rouge → Cryptomonnaies
- Bleu → ETF / Fonds
- Violet → Produits dérivés
- Cyan → Matières premières

## 🐛 Dépannage

### "Aucune catégorie disponible"

**Problème** : Impossible de créer un actif  
**Solution** :

1. Cliquez sur l'onglet **📁 Catégories**
2. Créez au moins une catégorie
3. Revenez à l'onglet **💼 Actifs**

### "Erreur lors de la création"

**Problème** : Impossible de créer une catégorie/actif  
**Causes possibles** :

- Nom de catégorie déjà utilisé
- Ticker déjà utilisé
- Problème de connexion à la base de données

**Solution** :

1. Vérifiez que le nom/ticker est unique
2. Redémarrez l'application
3. Consultez les logs console (F12)

### Compteurs incorrects

**Problème** : Le nombre affiché ne correspond pas  
**Solution** : Changez d'onglet puis revenez (rechargement auto)

## 📊 Statistiques

### Compteurs en Temps Réel

- **Onglet Catégories** : `📁 Catégories (3)`
- **Onglet Actifs** : `💼 Actifs (4)`
- **Onglet Transactions** : Statistiques achats/ventes

### Rechargement Automatique

✅ Après création d'une catégorie → Liste mise à jour  
✅ Après création d'un actif → Liste + sélect transaction mis à jour  
✅ Compteurs mis à jour dans les onglets

## 🚀 Fonctionnalités Futures (v0.3+)

### Édition

- [ ] Modifier une catégorie (nom, couleur)
- [ ] Modifier un actif (nom, ticker, prix)
- [ ] Modifier une transaction

### Suppression

- [ ] Supprimer une catégorie (avec confirmation)
- [ ] Supprimer un actif (vérifier les transactions liées)
- [ ] Supprimer une transaction

### Autres

- [ ] Tri des actifs (par ticker, prix, date)
- [ ] Recherche d'actifs
- [ ] Import/Export CSV
- [ ] Mise à jour automatique des prix (API)
- [ ] Historique des prix

## 📚 Ressources

- [Documentation complète](./V0.2_MIGRATION.md)
- [Guide d'implémentation](./V0.2_IMPLEMENTATION_GUIDE.md)
- [GitHub Repository](https://github.com/yourusername/wealthtracker)

---

**WealthTracker v0.2** - Gestion professionnelle de portefeuille financier 💰
