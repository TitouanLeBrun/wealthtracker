# 🚀 Guide de Release - WealthTracker

Ce guide explique comment créer et publier une nouvelle version de WealthTracker.

## 📦 Processus de Release

### 1. Préparer la release

Avant de créer une release, assurez-vous que :
- ✅ Tous les tests passent : `npm run test`
- ✅ Le code compile sans erreur : `npm run typecheck`
- ✅ Le linting est propre : `npm run lint`
- ✅ L'application build localement : `npm run build`

### 2. Créer un tag de version

```bash
# Format: v<MAJOR>.<MINOR>.<PATCH>
# Exemples: v1.0.0, v1.2.3, v2.0.0-beta.1

git tag v1.0.0
git push origin v1.0.0
```

### 3. Processus automatique

Une fois le tag poussé, GitHub Actions va automatiquement :

1. **Tests** (Ubuntu)
   - Exécuter les tests unitaires
   - Vérifier le linting
   - Vérifier le TypeScript

2. **Build multi-plateforme**
   - 🪟 **Windows** : NSIS Installer + Portable
   - 🍎 **macOS** : DMG + ZIP
   - 🐧 **Linux** : AppImage + DEB

3. **Publication**
   - Créer une GitHub Release
   - Uploader tous les installers
   - Générer le changelog automatiquement

### 4. Vérifier la release

Après quelques minutes, votre release sera disponible sur :
```
https://github.com/TitouanLeBrun/wealthtracker/releases
```

## 📁 Fichiers générés

### Windows (`.exe`)
- `WealthTracker-X.X.X-Setup.exe` - Installateur NSIS (recommandé)
- `WealthTracker-X.X.X-Portable.exe` - Version portable

### macOS (`.dmg`, `.zip`)
- `WealthTracker-X.X.X-macOS.dmg` - Image disque (recommandé)
- `WealthTracker-X.X.X-mac.zip` - Archive ZIP

### Linux (`.AppImage`, `.deb`)
- `WealthTracker-X.X.X-Linux.AppImage` - Application portable
- `WealthTracker-X.X.X-Linux.deb` - Package Debian/Ubuntu

## 🔧 Configuration

### Versioning (package.json)

Mettez à jour la version dans `package.json` avant de créer le tag :

```json
{
  "version": "1.0.0"
}
```

### Semantic Versioning

Suivez les règles de [Semantic Versioning](https://semver.org/lang/fr/) :

- **MAJOR** (v2.0.0) : Changements incompatibles avec les versions précédentes
- **MINOR** (v1.1.0) : Nouvelles fonctionnalités rétrocompatibles
- **PATCH** (v1.0.1) : Corrections de bugs rétrocompatibles

Exemples :
- `v1.0.0` - Version initiale
- `v1.1.0` - Ajout de nouvelles fonctionnalités
- `v1.1.1` - Correction de bugs
- `v2.0.0` - Refonte majeure avec breaking changes
- `v2.0.0-beta.1` - Version beta de v2.0.0

## 🛠️ Release manuelle (si besoin)

Si vous devez builder manuellement :

### Windows
```bash
npm run build:win
```

### macOS
```bash
npm run build:mac
```

### Linux
```bash
npm run build:linux
```

Les fichiers seront générés dans le dossier `dist/`.

## 📝 Workflow GitHub Actions

Le workflow de release se trouve dans `.github/workflows/release.yml`.

### Déclencher une release

```bash
# 1. Commit vos changements
git add .
git commit -m "feat: nouvelle fonctionnalité"

# 2. Mettre à jour la version dans package.json
npm version patch  # ou minor, ou major

# 3. Créer le tag (npm version le fait automatiquement)
git push origin main --tags
```

### Suivre le build

1. Aller sur : `https://github.com/TitouanLeBrun/wealthtracker/actions`
2. Cliquer sur le workflow "Release - Build & Publish"
3. Attendre la fin du build (~10-15 minutes)
4. Vérifier la release : `https://github.com/TitouanLeBrun/wealthtracker/releases`

## 🔒 Permissions requises

Le workflow nécessite les permissions suivantes (déjà configurées) :
- `contents: write` - Pour créer la release et uploader les assets

## 📊 Changelog automatique

Le changelog est généré automatiquement à partir des commits entre deux tags.

Pour un changelog propre, utilisez [Conventional Commits](https://www.conventionalcommits.org/fr/) :

```bash
feat: ajout de la gestion des objectifs
fix: correction du calcul de projection
docs: mise à jour du README
refactor: restructuration du code
test: ajout de tests unitaires
chore: mise à jour des dépendances
```

## ❓ Troubleshooting

### La release n'est pas déclenchée
- Vérifiez que le tag commence par `v` (ex: `v1.0.0`)
- Vérifiez que le tag a été poussé : `git push origin --tags`

### Le build échoue
- Vérifiez les logs dans GitHub Actions
- Assurez-vous que les tests passent localement
- Vérifiez que `electron-builder.yml` est correct

### Les fichiers sont manquants
- Vérifiez que `extraResources` dans `electron-builder.yml` inclut tous les fichiers nécessaires
- Vérifiez que Prisma est bien généré : `npx prisma generate`

## 🎯 Exemple complet

```bash
# 1. Développer votre fonctionnalité
git checkout -b feature/nouvelle-fonctionnalite
# ... développement ...
git add .
git commit -m "feat: ajout de la gestion des objectifs"

# 2. Merger sur main
git checkout main
git merge feature/nouvelle-fonctionnalite

# 3. Mettre à jour la version
# Ouvrir package.json et changer "version": "1.0.0" -> "1.1.0"

# 4. Créer et pousser le tag
git add package.json
git commit -m "chore: bump version to 1.1.0"
git tag v1.1.0
git push origin main
git push origin v1.1.0

# 5. Attendre le build automatique (~10-15 min)
# 6. Vérifier la release sur GitHub
```

## 📧 Support

Pour toute question sur le processus de release, ouvrez une issue sur GitHub.
