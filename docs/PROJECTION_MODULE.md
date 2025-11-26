# 🎯 Module Projection - Documentation Technique

**Date de création** : 26 novembre 2025  
**Statut** : En développement

---

## 📝 **Objectif du Module**

Permettre à l'utilisateur de :

1. Définir un objectif financier (montant cible, durée, taux de rendement)
2. Visualiser sa progression vs l'objectif sur un graphique dual-courbe
3. Calculer les versements mensuels nécessaires pour atteindre l'objectif

---

## 🎨 **Spécifications UX**

### **Section 1 : Configuration de l'Objectif**

- **Montant cible** : Illimité, séparateur de milliers (ex: 300 000 €)
- **Durée** : 1 à 70 ans
- **Taux d'intérêt** : 1 à 50% (intérêt composé)
- **Valeurs par défaut** : 300 000€, 25 ans, 8%

### **Section 2 : Graphique Dual-Courbe**

- **Courbe Bleue** : Projection de l'objectif (formule avec versements mensuels)
- **Courbe Verte** : Patrimoine réel (points de transaction)
- **Période** : De la première transaction à la date de l'objectif
- **Granularité** : Mensuelle
- **Panneau Insights** :
  - Delta en euros et %
  - Messages contextuels (avance/retard)
  - Taux de croissance réel vs ciblé

### **Section 3 : Simulation Versements**

- Calcul du versement mensuel nécessaire
- Répartition proportionnelle par catégorie (poids actuel)
- Affichage en tableau

---

## 🗄️ **Architecture Base de Données**

### **Nouvelle Table : `Objective`**

```prisma
model Objective {
  id            Int      @id @default(autoincrement())
  targetAmount  Float    // Montant cible (ex: 300000)
  targetYears   Int      // Durée en années (ex: 25)
  interestRate  Float    // Taux annuel en % (ex: 8.0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## 🧮 **Formules Financières**

### **1. Valeur Future avec Versements Mensuels**

```typescript
FV = PV × (1 + r)^n + PMT × [(1 + r/12)^(12×n) - 1] / (r/12)
```

Où :

- `FV` = Valeur future (objectif)
- `PV` = Valeur présente (patrimoine actuel)
- `PMT` = Versement mensuel
- `r` = Taux d'intérêt annuel (décimal)
- `n` = Nombre d'années

### **2. Versement Mensuel Nécessaire**

```typescript
PMT = (FV - PV × (1 + r)^n) × (r/12) / [(1 + r/12)^(12×n) - 1]
```

### **3. Taux de Croissance Réel**

```typescript
CAGR = [(Valeur Finale / Valeur Initiale)^(1/n) - 1] × 100
```

---

## 📁 **Structure des Fichiers**

### **Backend**

```
src/main/
├── index.ts (handlers IPC)
prisma/
├── schema.prisma (modèle Objective)
└── migrations/
```

### **Frontend**

```
src/renderer/src/
├── pages/
│   └── ProjectionPage.tsx (page principale)
├── components/
│   └── projection/
│       ├── ObjectiveForm.tsx
│       ├── DualCurveChart.tsx
│       ├── ProjectionInsights.tsx
│       └── MonthlyInvestmentSimulator.tsx
└── utils/
    └── calculations/
        └── projectionUtils.ts
```

---

## 🔄 **Flux de Données**

1. **Chargement initial** :
   - Récupérer l'objectif actif (dernier créé)
   - Récupérer toutes les transactions (historique)
   - Calculer le patrimoine actuel

2. **Modification de l'objectif** :
   - Sauvegarder en DB
   - Recalculer les projections
   - Mettre à jour le graphique

3. **Calcul des courbes** :
   - **Courbe Objectif** : Points mensuels de t0 à tN
   - **Courbe Réelle** : Points aux dates de transactions

---

## ✅ **État d'Avancement**

- [ ] Phase 1 : Préparation
- [ ] Phase 2 : Backend
- [ ] Phase 3 : Structure Frontend
- [ ] Phase 4 : Section 1
- [ ] Phase 5 : Section 2
- [ ] Phase 6 : Section 3
- [ ] Phase 7 : Intégration

---

## 🚀 **Évolutions Futures (v2)**

- [ ] Stockage de multiples objectifs
- [ ] Historique réel du patrimoine (recalcul rétroactif)
- [ ] Simulation interactive (ajustement manuel des montants)
- [ ] Scénarios multiples (optimiste/neutre/pessimiste)
- [ ] Répartition cible personnalisée (Option C)
- [ ] Export PDF du rapport de projection
