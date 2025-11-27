# 📊 Guide des Métriques de Projection - WealthTracker

## Vue d'Ensemble

Ce document explique toutes les métriques affichées dans l'analyse de trajectoire de projection, comment elles sont calculées, et ce qu'elles signifient.

---

## 🎯 Statut de Trajectoire

### Niveaux de Statut

| Niveau        | Icône | Titre                        | Condition                            |
| ------------- | ----- | ---------------------------- | ------------------------------------ |
| **Excellent** | 🎉    | Largement en avance          | Patrimoine ≥ 150% du théorique       |
| **Excellent** | 🚀    | En avance sur la trajectoire | Delta ≥ +10%                         |
| **Good**      | 📈    | Sur la bonne trajectoire     | Delta entre 0% et +10%               |
| **Good**      | 💪    | Bon départ avec patrimoine   | Cas spécial : rythme compatible      |
| **Warning**   | ⚠️    | Légèrement en retard         | Delta entre -10% et 0%               |
| **Warning**   | ⚡    | Rythme insuffisant           | Cas spécial : rythme < 80% du requis |
| **Critical**  | 🔴    | Retard significatif          | Delta entre -25% et -10%             |
| **Behind**    | ❌    | Très en retard               | Delta < -25%                         |

### Cas Spécial : Objectif Récent avec Patrimoine Existant

**Détection :**

- L'objectif a démarré il y a moins d'un mois
- Mais un patrimoine existant est déjà présent (construit avant l'objectif)

**Analyse :**
Le système compare le **rythme d'investissement historique** avec le **rythme requis** pour l'objectif.

**Exemple :**

```
Historique d'investissement :
- Première transaction : janvier 2023
- Total investi : 2 000€
- Période : 24 mois
- Rythme moyen : 83€/mois

Nouvel objectif créé aujourd'hui :
- Cible : 10 000€
- Durée : 2 ans
- Rythme requis : 400€/mois

Analyse : Rythme historique (83€) << Rythme requis (400€)
Statut : ⚡ Patrimoine existant, rythme insuffisant
```

---

## 💰 Patrimoine Actuel vs Théorique

### Patrimoine Actuel

**Définition :** Valeur totale de votre portefeuille aujourd'hui.

**Formule :**

```
Patrimoine Actuel = Σ (Quantité détenue × Prix actuel)
```

**Exemple :**

```
Asset A : 10 unités × 50€ = 500€
Asset B : 5 unités × 100€ = 500€
Total : 1 000€
```

### Patrimoine Théorique Attendu

**Définition :** Valeur que vous devriez avoir à ce jour si vous aviez suivi le plan initial à la lettre.

**Formule :**

```
Patrimoine Théorique = FV(
  PV = 0,
  PMT = Investissement mensuel théorique,
  r = Taux d'intérêt / 12,
  n = Nombre de mois écoulés depuis le début
)
```

**Exemple :**

```
Plan initial :
- Investir 400€/mois
- Taux : 5% annuel
- Écoulé : 12 mois

Théorique attendu ≈ 4 923€
```

### Delta Patrimoine

**Définition :** Écart entre ce que vous avez réellement et ce que vous devriez avoir.

**Formule :**

```
Delta = Patrimoine Actuel - Patrimoine Théorique
Delta % = (Delta / Patrimoine Théorique) × 100
```

**Interprétation :**

- **Delta > 0** : 🟢 Vous êtes en avance
- **Delta = 0** : 🟡 Vous êtes pile sur la trajectoire
- **Delta < 0** : 🔴 Vous êtes en retard

---

## 📈 Investissements Mensuels

### 1. Investissement Historique Moyen

**Définition :** Montant moyen que vous avez réellement investi par mois depuis votre première transaction.

**Formule :**

```
Total Investi = Σ (Achats : Quantité × Prix + Frais)
Mois Écoulés = (Aujourd'hui - Première Transaction) / 30.44 jours
Historique Moyen = Total Investi / Mois Écoulés
```

**Exemple :**

```
Transactions :
- Jan 2023 : Acheté 10 unités à 50€ + 5€ frais = 505€
- Fév 2023 : Acheté 5 unités à 60€ + 3€ frais = 303€
- Mar 2023 : Acheté 8 unités à 55€ + 4€ frais = 444€
...
Total sur 24 mois : 2 000€

Investissement Historique Moyen = 2 000€ / 24 = 83€/mois
```

### 2. Investissement Théorique Initial

**Définition :** Montant mensuel calculé au début de l'objectif pour atteindre la cible.

**Formule :**

```
PMT Théorique = PMT(
  PV = 0,
  FV = Montant cible,
  r = Taux d'intérêt / 12,
  n = Durée en mois
)
```

**Exemple :**

```
Objectif :
- Cible : 10 000€
- Durée : 2 ans (24 mois)
- Taux : 5% annuel

PMT Théorique ≈ 400€/mois
```

### 3. Investissement Requis Maintenant

**Définition :** Montant mensuel que vous devez investir **maintenant** pour atteindre l'objectif, en tenant compte du patrimoine actuel et du temps restant.

**Formule :**

```
PMT Requis = PMT(
  PV = Patrimoine Actuel,
  FV = Montant cible,
  r = Taux d'intérêt / 12,
  n = Mois restants
)
```

**Exemple :**

```
Situation actuelle :
- Patrimoine : 1 000€
- Cible : 10 000€
- Temps restant : 12 mois
- Taux : 5% annuel

PMT Requis ≈ 738€/mois
(Plus élevé car il faut rattraper le retard)
```

---

## 🔄 Comparaisons d'Investissements

### Historique vs Requis

**Définition :** Différence entre votre rythme d'investissement historique et ce qui est requis maintenant.

**Formule :**

```
Delta Historique = PMT Requis - PMT Historique
Delta % = (Delta / PMT Historique) × 100
```

**Interprétation :**

- **Delta < 0** : 🟢 Votre rythme historique suffit
- **Delta > 0** : 🔴 Vous devez augmenter vos investissements

**Exemple :**

```
Historique : 83€/mois
Requis : 738€/mois
Delta : +655€/mois (+789%)

Message : ⚠️ Vous devez augmenter vos investissements de 655€/mois
```

### Théorique vs Requis

**Définition :** Différence entre le plan initial et ce qui est requis maintenant (ajustement nécessaire).

**Formule :**

```
Delta Théorique = PMT Requis - PMT Théorique
Delta % = (Delta / PMT Théorique) × 100
```

**Interprétation :**

- **Delta < 0** : 🟢 Vous pouvez réduire vos investissements
- **Delta = 0** : 🟡 Le plan initial reste valide
- **Delta > 0** : 🔴 Vous devez augmenter vos investissements

**Exemple :**

```
Théorique : 400€/mois
Requis : 738€/mois
Delta : +338€/mois (+85%)

Message : Vous devez investir 338€ de plus par mois par rapport au plan initial
```

---

## 🎓 Scénarios Typiques

### Scénario 1 : En Avance

```
✅ Statut : 🚀 En avance sur la trajectoire

Patrimoine Actuel : 6 000€
Patrimoine Théorique : 5 000€
Delta : +1 000€ (+20%)

Investissement Historique : 450€/mois
Investissement Théorique : 400€/mois
Investissement Requis : 320€/mois

Analyse : Excellent travail ! Vous pouvez même réduire
         vos investissements de 130€/mois et rester
         sur la bonne trajectoire.
```

### Scénario 2 : Sur la Trajectoire

```
✅ Statut : 📈 Sur la bonne trajectoire

Patrimoine Actuel : 5 100€
Patrimoine Théorique : 5 000€
Delta : +100€ (+2%)

Investissement Historique : 405€/mois
Investissement Théorique : 400€/mois
Investissement Requis : 398€/mois

Analyse : Parfait ! Continuez ainsi, vous êtes aligné
         avec votre objectif.
```

### Scénario 3 : Légèrement en Retard

```
⚠️ Statut : ⚠️ Légèrement en retard

Patrimoine Actuel : 4 500€
Patrimoine Théorique : 5 000€
Delta : -500€ (-10%)

Investissement Historique : 360€/mois
Investissement Théorique : 400€/mois
Investissement Requis : 440€/mois

Analyse : Petit ajustement nécessaire. Augmentez vos
         investissements de 40€/mois pour rattraper.
```

### Scénario 4 : Retard Significatif

```
🔴 Statut : 🔴 Retard significatif

Patrimoine Actuel : 3 500€
Patrimoine Théorique : 5 000€
Delta : -1 500€ (-30%)

Investissement Historique : 280€/mois
Investissement Théorique : 400€/mois
Investissement Requis : 550€/mois

Analyse : Ajustement important requis. Augmentez vos
         investissements de 150€/mois ou envisagez
         de prolonger l'échéance.
```

### Scénario 5 : Patrimoine Existant, Rythme Insuffisant

```
⚡ Statut : ⚡ Patrimoine existant, rythme insuffisant

Patrimoine Actuel : 1 965€ (construit sur 2 ans)
Patrimoine Théorique : 0€ (objectif démarre aujourd'hui)

Investissement Historique : 82€/mois
Investissement Théorique : 400€/mois
Investissement Requis : 400€/mois

Analyse : Vous avez déjà un bon capital de départ, MAIS
         votre rythme historique (82€/mois) est bien
         trop faible pour atteindre 10 000€ en 2 ans.
         Il faudra investir 400€/mois, soit 318€ de
         plus qu'actuellement.
```

---

## 🧮 Formules Mathématiques Détaillées

### Future Value (Valeur Future)

```
FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]

Où :
- PV = Present Value (valeur présente)
- r = taux d'intérêt par période
- n = nombre de périodes
- PMT = paiement par période
```

### Payment (Paiement Mensuel)

```
PMT = (FV - PV × (1 + r)^n) / [((1 + r)^n - 1) / r]

Où :
- FV = Future Value (valeur cible)
- PV = Present Value (valeur actuelle)
- r = taux d'intérêt mensuel
- n = nombre de mois
```

---

## 💡 Conseils d'Utilisation

### 1. Suivez Régulièrement

- Consultez vos métriques au moins une fois par mois
- Ajustez vos investissements selon les recommandations

### 2. Comprenez les Deltas

- Un delta positif ne signifie pas toujours que tout va bien
- Un delta négatif n'est pas toujours alarmant

### 3. Analysez le Rythme Historique

- C'est le meilleur indicateur de votre capacité d'investissement réelle
- Si le rythme requis est beaucoup plus élevé que votre historique, l'objectif est peut-être trop ambitieux

### 4. Soyez Réaliste

- Un objectif trop élevé avec un délai trop court sera difficile à atteindre
- Mieux vaut un objectif modéré et réussi qu'un objectif ambitieux et raté

---

## 🎯 FAQ

**Q : Pourquoi mon "Investissement Requis" est plus élevé que le "Théorique" ?**
R : Cela signifie que vous êtes en retard sur la trajectoire. Vous devez augmenter vos investissements pour rattraper.

**Q : J'ai un patrimoine existant mais le message dit "rythme insuffisant". Pourquoi ?**
R : Avoir un patrimoine est bien, mais si votre rythme d'investissement historique est trop faible pour atteindre l'objectif dans le délai imparti, vous devrez augmenter significativement vos investissements.

**Q : Le "Delta %" est très élevé, est-ce grave ?**
R : Cela dépend du contexte. Au début d'un objectif, les pourcentages peuvent être extrêmes. Concentrez-vous plutôt sur les montants absolus.

**Q : Comment interpréter "Historique vs Requis" ?**
R : C'est la différence entre ce que vous avez investi en moyenne par le passé et ce qu'il faudrait investir maintenant. Si le delta est très positif, votre objectif est probablement trop ambitieux par rapport à votre capacité actuelle.

---

**📅 Dernière mise à jour : 27 novembre 2025**
**📚 Version : 1.0**
**🏷️ Projet : WealthTracker**
