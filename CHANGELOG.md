# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.2.1] - 2024-11-28

### Corrigé

- **Système de migration en production**
  - Suppression de l'option `--no-seed` invalide pour `prisma generate`
  - Le seed n'est plus exécuté en production (section `prisma.seed` supprimée)
  - Création automatique de toutes les tables au premier lancement
  - Résolution de l'erreur de build dans GitHub Actions

## [1.2.0] - 2024-11-28

### Ajouté

- **Import de transactions Trade Republic** : Fonctionnalité complète d'import CSV
  - Modal d'import avec fond blanc et interface moderne
  - Parser CSV Trade Republic avec détection automatique des colonnes
  - Support de multiples formats de CSV (timestamp, colonnes françaises/allemandes)
  - Gestion des erreurs et warnings détaillés
- **Gestion automatique des actifs PEA**
  - Création automatique de la catégorie "PEA" lors de l'import
  - Détection et catégorisation des actifs PEA
  - Association automatique des actifs importés à la catégorie PEA

- **Résolution automatique ISIN → Ticker**
  - Intégration Yahoo Finance pour résoudre les ISIN
  - Récupération automatique des prix actuels
  - Gestion des actifs non résolus avec modal dédié

- **Interface de gestion des actifs (Settings)**
  - Section complète de gestion des actifs dans les paramètres
  - Modal d'édition avec fond blanc
  - Gestion du drag & drop pour réorganiser les actifs
  - Modification en ligne du nom, ticker, ISIN et prix

- **Modal pour actifs non résolus**
  - Interface pour gérer les actifs dont l'ISIN n'a pas été résolu
  - Possibilité de rechercher manuellement les informations
  - Intégration avec le formulaire de recherche Yahoo Finance

### Amélioré

- **Formulaire de recherche d'actifs**
  - Échappement correct des caractères spéciaux (guillemets, apostrophes)
  - Correction du gradient CSS (`bg-gradient-to-br` → `bg-linear-to-br`)
  - Meilleure gestion des erreurs de validation

- **Parser Trade Republic**
  - Support du format CSV avec colonnes `timestamp`, `title`, `subtitle`
  - Extraction automatique de l'ISIN depuis le champ subtitle
  - Détection du type de transaction (BUY/SELL) depuis plusieurs sources
  - Calcul automatique du prix par unité si manquant
  - Gestion des lignes vides et des transactions non-boursières

### Corrigé

- Erreurs de linting dans `AssetSearchForm.tsx`
- Problème de formatage CRLF dans plusieurs fichiers
- Gestion correcte des warnings sans champ `data`
- Utilisation cohérente de `finalPricePerUnit` dans le parser

### Technique

- Ajout de l'API `importTransactions` dans le preload
- Création du handler IPC `import.ts`
- Création du fichier `tradeRepublicParser.ts`
- Ajout de l'API `updateAsset` pour la gestion des actifs
- Amélioration de la gestion des erreurs TypeScript

## [1.1.0] - 2024-11-27

### Ajouté

- Pagination professionnelle des transactions
- Gestion des données avancée
- Support ISIN pour les actifs

### Amélioré

- Interface utilisateur modernisée
- Performance de l'application

## [1.0.0] - 2024-11-25

### Ajouté

- Version initiale stable
- Gestion de portefeuille
- Suivi des transactions
- Catégorisation des actifs
- Projections financières

---

[1.2.0]: https://github.com/votre-username/wealthtracker/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/votre-username/wealthtracker/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/votre-username/wealthtracker/releases/tag/v1.0.0
