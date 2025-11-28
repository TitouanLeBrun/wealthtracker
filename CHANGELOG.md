# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.3.0] - 2024-11-28

### Ajouté

- **Système de mise à jour automatique** 🔄
  - Intégration complète de `electron-updater` pour les mises à jour automatiques
  - Vérification automatique au démarrage (après 10 secondes en production)
  - Modal élégante pour notifier les nouvelles versions disponibles
  - Barre de progression animée pendant le téléchargement
  - Notification de mise à jour prête avec choix d'installation
  - Options "Installer maintenant" ou "À la fermeture de l'application"
  - Gestion complète des erreurs avec messages clairs
  - Téléchargement en arrière-plan sans bloquer l'application
  - Configuration GitHub Releases pour distribution automatique

- **Infrastructure backend (Main Process)**
  - Classe `AppUpdater` pour gérer le cycle de vie des mises à jour
  - Handlers IPC dédiés pour les actions utilisateur
  - Logging détaillé avec electron-log
  - Désactivation automatique en mode développement

- **Composants UI frontend (Renderer)**
  - `UpdateModal` : Modal d'annonce de nouvelle version
  - `DownloadProgressComponent` : Barre de progression avec statistiques
  - `InstallNotification` : Notification flottante de mise à jour prête
  - Hook `useUpdater` : Gestion centralisée de l'état des mises à jour
  - Styles CSS modernes avec animations fluides

- **Configuration de publication**
  - Configuration GitHub dans `electron-builder.yml`
  - Workflow GitHub Actions pour releases automatiques
  - Support multi-plateformes (Windows, macOS, Linux)
  - Génération automatique de fichiers `.blockmap` pour delta updates

### Amélioré

- **Architecture IPC**
  - Support optionnel de `AppUpdater` dans `registerAllIpcHandlers()`
  - Bridge Preload étendu avec API `window.updater`
  - Types TypeScript complets pour UpdateInfo et DownloadProgress

- **Expérience utilisateur**
  - Notifications non intrusives
  - Choix utilisateur pour l'installation
  - Téléchargement en arrière-plan
  - Messages d'erreur clairs et actionnables

### Technique

- **Sécurité**
  - Configuration `autoDownload: false` pour contrôle manuel
  - Vérification des signatures désactivée (pas de certificat Windows)
  - Installation automatique à la fermeture si sélectionné

- **Performance**
  - Vérification différée de 10 secondes au démarrage
  - Téléchargement asynchrone non bloquant
  - Cleanup automatique des ressources

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

[1.3.0]: https://github.com/votre-username/wealthtracker/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/votre-username/wealthtracker/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/votre-username/wealthtracker/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/votre-username/wealthtracker/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/votre-username/wealthtracker/releases/tag/v1.0.0
