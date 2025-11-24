# 💰 WealthTracker

[![Lint Check](https://github.com/YOUR_USERNAME/wealthtracker/actions/workflows/lint.yml/badge.svg)](https://github.com/YOUR_USERNAME/wealthtracker/actions/workflows/lint.yml)

Une application Electron de suivi d'investissement construite avec React, TypeScript, Prisma et TailwindCSS.

## 📋 Description

WealthTracker est une application desktop pour suivre vos transactions d'investissement. Cette v0.1 est un "Walking Skeleton" - une application fonctionnelle de bout en bout avec les fonctionnalités de base.

### Fonctionnalités v0.1

- ✅ Afficher la liste des transactions
- ✅ Ajouter une nouvelle transaction
- ✅ Stockage local avec SQLite
- ✅ Interface moderne avec TailwindCSS

## 🚀 Stack Technique

- **Framework**: Electron 38.x
- **UI**: React 19.x + TypeScript
- **Build Tool**: Vite 7.x + electron-vite
- **Database**: SQLite + Prisma 7.x (ORM)
- **Styling**: TailwindCSS 4.x
- **Code Quality**: ESLint + Prettier

## 📦 Installation

### Prérequis

- Node.js 18+ ([télécharger](https://nodejs.org/))
- npm 9+

### Setup

```bash
# Cloner le repository
git clone https://github.com/YOUR_USERNAME/wealthtracker.git
cd wealthtracker

# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Créer la base de données
npx prisma migrate dev
```

## 🛠️ Développement

```bash
# Lancer l'app en mode développement
npm run dev

# Linter le code
npm run lint

# Vérifier les types TypeScript
npm run typecheck

# Formater le code
npm run format
```

## 🗄️ Base de données

```bash
# Ouvrir Prisma Studio (interface visuelle)
npx prisma studio

# Créer une migration
npx prisma migrate dev --name nom_migration

# Peupler avec des données de test
npm run db:seed
```

## 📦 Build

```bash
# Build pour production
npm run build

# Build sans empaquetage
npm run build:unpack

# Build pour Windows
npm run build:win

# Build pour macOS
npm run build:mac

# Build pour Linux
npm run build:linux
```

## 📁 Structure du projet

```
wealthtracker/
├── .github/
│   └── workflows/       # GitHub Actions
├── docs/               # Documentation
│   ├── SPECS_V0.1.md
│   ├── INSTALL_GUIDE.md
│   └── PROGRESS.md
├── prisma/             # Schéma et migrations
├── src/
│   ├── main/          # Processus principal Electron
│   ├── preload/       # Scripts de préchargement
│   └── renderer/      # Interface React
└── resources/         # Ressources de l'app
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 🎯 Roadmap

- [x] v0.1 - Walking Skeleton (CRUD transactions)
- [ ] v0.2 - Modification et suppression
- [ ] v0.3 - Statistiques et graphiques
- [ ] v0.4 - Catégorisation des investissements
- [ ] v0.5 - Import/Export de données

## 📚 Documentation

Voir le dossier [docs/](./docs/) pour plus de détails :
- [Guide d'installation](./docs/INSTALL_GUIDE.md)
- [Spécifications v0.1](./docs/SPECS_V0.1.md)
- [Progression](./docs/PROGRESS.md)

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
