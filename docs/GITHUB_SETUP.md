# 📦 Guide de déploiement GitHub

## 🚀 Créer le repository sur GitHub

### Option 1 : Via l'interface web GitHub

1. Aller sur https://github.com/new
2. Nom du repository : `wealthtracker`
3. Description : `Application Electron de suivi d'investissement`
4. Visibilité : Public ou Private (au choix)
5. **NE PAS** initialiser avec README, .gitignore ou license (nous les avons déjà)
6. Cliquer sur "Create repository"

### Option 2 : Via GitHub CLI

```powershell
# Installer GitHub CLI si nécessaire
# https://cli.github.com/

# Créer le repository
gh repo create wealthtracker --public --source=. --remote=origin --push
```

## 🔗 Lier le repository local à GitHub

Si vous avez créé le repo via l'interface web, exécutez :

```powershell
# Remplacer YOUR_USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/YOUR_USERNAME/wealthtracker.git

# Vérifier que le remote est configuré
git remote -v

# Pousser le code
git branch -M main
git push -u origin main
```

## ✅ Vérifier le workflow GitHub Actions

1. Aller sur votre repository GitHub
2. Cliquer sur l'onglet "Actions"
3. Vous devriez voir le workflow "Lint Check"
4. À chaque push, le workflow vérifiera automatiquement :
   - ✅ ESLint (qualité du code)
   - ✅ TypeScript types (vérification des types)

## 🔄 Workflow de développement

### Créer une nouvelle branche pour une fonctionnalité

```powershell
# Créer et basculer sur une nouvelle branche
git checkout -b feature/nom-de-la-feature

# Faire vos modifications...

# Ajouter les changements
git add .

# Commiter
git commit -m "✨ Ajout de la fonctionnalité X"

# Pousser la branche
git push origin feature/nom-de-la-feature
```

### Créer une Pull Request

1. Aller sur GitHub
2. Cliquer sur "Pull requests" > "New pull request"
3. Sélectionner votre branche
4. Le workflow ESLint se lancera automatiquement
5. Si tout est vert ✅, merger la PR

## 🏷️ Versioning et Releases

### Créer un tag de version

```powershell
# Créer un tag annoté
git tag -a v0.1.0 -m "Version 0.1.0 - Walking Skeleton"

# Pousser le tag
git push origin v0.1.0
```

### Créer une release sur GitHub

```powershell
# Via GitHub CLI
gh release create v0.1.0 --title "v0.1.0 - Walking Skeleton" --notes "Première version fonctionnelle avec CRUD basique de transactions"

# Ou via l'interface web:
# GitHub > Releases > Draft a new release
```

## 📊 Badge de statut

Le README.md contient déjà un badge pour le workflow ESLint :

```markdown
[![Lint Check](https://github.com/YOUR_USERNAME/wealthtracker/actions/workflows/lint.yml/badge.svg)](https://github.com/YOUR_USERNAME/wealthtracker/actions/workflows/lint.yml)
```

⚠️ **N'oubliez pas de remplacer `YOUR_USERNAME` par votre nom d'utilisateur GitHub !**

## 🔒 Secrets GitHub (pour plus tard)

Si vous avez besoin de secrets pour les builds ou le déploiement :

1. GitHub > Settings > Secrets and variables > Actions
2. "New repository secret"
3. Ajouter vos secrets (ex: tokens, clés API)

## 📝 Commits conventionnels

Utilisez des préfixes pour vos commits :

- ✨ `feat:` - Nouvelle fonctionnalité
- 🐛 `fix:` - Correction de bug
- 📝 `docs:` - Documentation
- 💄 `style:` - Changements de style (CSS, formatage)
- ♻️ `refactor:` - Refactoring du code
- ⚡ `perf:` - Amélioration des performances
- ✅ `test:` - Ajout ou modification de tests
- 🔧 `chore:` - Tâches de maintenance
- 🚀 `ci:` - Changements CI/CD

Exemple :

```powershell
git commit -m "✨ feat: Ajout du composant TransactionList"
```

## 🎯 Prochaines étapes

Une fois le repository sur GitHub :

1. ✅ Mettre à jour le README.md avec votre username
2. ✅ Configurer les branch protection rules (optionnel)
3. ✅ Inviter des collaborateurs (si projet en équipe)
4. 🚀 Continuer le développement !

---

**Repository actuel** : `main` branch avec 1 commit
**Workflow** : `.github/workflows/lint.yml` configuré
**Prêt pour** : Push vers GitHub ! 🚀
