# 🚀 Plan de Déploiement - Système de Mise à Jour Automatique

**Projet** : WealthTracker  
**Feature** : Auto-Update avec electron-updater  
**Date** : 28 novembre 2024  
**Version cible** : 1.3.0

---

## 📋 Configuration Validée

- ✅ **Repository** : Public (TitouanLeBrun/wealthtracker)
- ✅ **GitHub Actions** : Activées avec permissions "Read and write"
- ✅ **Releases** : Automatiques à chaque tag
- ✅ **Certificat Windows** : Non (warning "Éditeur inconnu" acceptable)
- ✅ **Vérification** : Au démarrage uniquement (après 10 secondes)
- ✅ **Téléchargement** : Manuel (l'utilisateur confirme)
- ✅ **Installation** : Choix "Maintenant" ou "À la fermeture"

---

## 🎯 Objectifs

1. **Notification automatique** des nouvelles versions au démarrage
2. **Téléchargement manuel** après confirmation utilisateur
3. **Installation flexible** : maintenant ou à la fermeture
4. **Expérience non intrusive** avec modals professionnelles
5. **Logs complets** pour le débogage

---

## 📦 Phase 1 : Backend (Main Process)

### ✅ 1.1 Installation des dépendances

```bash
npm install electron-log --save
```

### ✅ 1.2 Création du module AutoUpdater

**Fichier** : `src/main/updater/autoUpdater.ts`

- Configuration d'electron-updater
- Gestion des événements (available, progress, downloaded, error)
- Méthodes publiques : checkForUpdates(), downloadUpdate(), quitAndInstall()
- Logs avec electron-log

### ✅ 1.3 Handlers IPC

**Fichier** : `src/main/ipc/updater.ts`

- `updater:check` - Vérifier les mises à jour
- `updater:download` - Télécharger la mise à jour
- `updater:install` - Installer et redémarrer
- `updater:getVersion` - Récupérer la version actuelle

### ✅ 1.4 Intégration dans le main process

**Fichier** : `src/main/index.ts`

- Import et initialisation d'AppUpdater
- Vérification au démarrage (après 10 secondes)
- Enregistrement des handlers IPC
- **Uniquement en production** (pas en dev)

---

## 🔌 Phase 2 : Preload (Bridge IPC)

### ✅ 2.1 Types TypeScript

**Fichier** : `src/preload/index.d.ts`

```typescript
interface UpdateInfo {
  version: string
  releaseDate?: string
  releaseNotes?: string
}

interface DownloadProgress {
  percent: number
  transferred: number
  total: number
  bytesPerSecond: number
}

interface UpdaterAPI {
  check: () => Promise<void>
  download: () => Promise<void>
  install: () => Promise<void>
  getVersion: () => Promise<string>
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => void
  onUpdateNotAvailable: (callback: () => void) => void
  onDownloadProgress: (callback: (progress: DownloadProgress) => void) => void
  onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => void
  onUpdateError: (callback: (error: { message: string }) => void) => void
}
```

### ✅ 2.2 Exposition de l'API

**Fichier** : `src/preload/index.ts`

- Exposition via contextBridge
- Mapping des événements IPC
- Typage complet

---

## 🎨 Phase 3 : Frontend (Renderer)

### ✅ 3.1 Hook de gestion

**Fichier** : `src/renderer/src/hooks/useUpdater.ts`

- États : updateAvailable, downloading, downloadProgress, updateReady
- Listeners pour tous les événements
- Méthodes : checkForUpdates, downloadUpdate, installUpdate, dismiss

### ✅ 3.2 Composant Modal de Notification

**Fichier** : `src/renderer/src/components/updater/UpdateModal.tsx`

- Affichage de la nouvelle version
- Notes de version (si disponibles)
- Boutons : "Plus tard" et "Télécharger"
- Design moderne avec Tailwind

### ✅ 3.3 Composant Barre de Progression

**Fichier** : `src/renderer/src/components/updater/DownloadProgress.tsx`

- Affichage du pourcentage
- Vitesse de téléchargement (MB/s)
- Barre de progression animée
- Position : bottom-right, non intrusive

### ✅ 3.4 Composant Notification d'Installation

**Fichier** : `src/renderer/src/components/updater/InstallNotification.tsx`

- Indication "Mise à jour prête"
- Boutons : "À la fermeture" et "Installer maintenant"
- Design avec icône de succès

### ✅ 3.5 Intégration dans App.tsx

**Fichier** : `src/renderer/src/App.tsx`

- Import du hook useUpdater
- Rendu conditionnel des modals
- Gestion des états

---

## ⚙️ Phase 4 : Configuration

### ✅ 4.1 electron-builder.yml

```yaml
appId: com.wealthtracker.app
productName: WealthTracker

publish:
  provider: github
  owner: TitouanLeBrun
  repo: wealthtracker
  releaseType: release

win:
  target:
    - target: nsis
      arch:
        - x64

nsis:
  oneClick: false
  perMachine: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  createStartMenuShortcut: true
```

### ✅ 4.2 GitHub Actions Workflow

**Fichier** : `.github/workflows/release.yml`

```yaml
name: Build & Release

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write

jobs:
  release:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build:win
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🧪 Phase 5 : Tests

### ✅ 5.1 Tests en développement

- [ ] Vérifier que l'updater ne se lance PAS en mode dev
- [ ] Tester les composants React isolément
- [ ] Vérifier le typage TypeScript

### ✅ 5.2 Tests en production (après release)

- [ ] Installer la version N
- [ ] Créer et publier la version N+1
- [ ] Vérifier la notification au démarrage
- [ ] Tester le téléchargement complet
- [ ] Tester "Installer maintenant"
- [ ] Tester "À la fermeture"
- [ ] Vérifier les logs (electron-log)

---

## 📝 Phase 6 : Documentation

### ✅ 6.1 CHANGELOG.md

Documenter les nouvelles fonctionnalités :

- Système de mise à jour automatique
- Notifications au démarrage
- Téléchargement en arrière-plan

### ✅ 6.2 README.md

Ajouter une section "Mises à jour" :

- Comment fonctionne le système
- Où trouver les logs
- FAQ

---

## 🚀 Procédure de Release

### Étape 1 : Mettre à jour la version

```bash
# Dans package.json
"version": "1.3.0"
```

### Étape 2 : Mettre à jour le CHANGELOG.md

```markdown
## [1.3.0] - 2024-11-28

### Ajouté

- Système de mise à jour automatique
- Notification des nouvelles versions au démarrage
- Téléchargement en arrière-plan avec progression
```

### Étape 3 : Commit et Tag

```bash
git add .
git commit -m "feat: système de mise à jour automatique (v1.3.0)"
git push origin main

git tag v1.3.0
git push origin v1.3.0
```

### Étape 4 : GitHub Actions

Le workflow va automatiquement :

1. ✅ Builder l'application
2. ✅ Créer la release GitHub
3. ✅ Upload le fichier `WealthTracker-Setup-1.3.0.exe`
4. ✅ Publier la release

### Étape 5 : Vérification

1. Installer la version précédente (1.2.1)
2. Démarrer l'application
3. Attendre 10 secondes → Modal doit apparaître
4. Cliquer "Télécharger"
5. Attendre la fin → Notification "Mise à jour prête"
6. Tester les deux options d'installation

---

## 🔍 Débogage

### Logs electron-updater

**Windows** : `%APPDATA%\WealthTracker\logs\main.log`

```log
[AutoUpdater] Vérification des mises à jour...
[AutoUpdater] Mise à jour disponible: 1.3.0
[AutoUpdater] Téléchargement: 45%
[AutoUpdater] Mise à jour téléchargée: 1.3.0
```

### Console DevTools

```typescript
// Vérifier la version actuelle
window.api.updater.getVersion().then(console.log)

// Forcer une vérification
window.api.updater.check()
```

### Erreurs courantes

**"No releases found"**

- Vérifier que le tag existe sur GitHub
- Vérifier `electron-builder.yml` (owner/repo)

**"ENOENT: no such file"**

- Vérifier que le fichier .exe est bien dans la release
- Vérifier le nom du fichier (doit correspondre à `artifactName`)

**"Update download failed"**

- Problème de connexion Internet
- Proxy/firewall bloque GitHub Releases

---

## ✅ Checklist Finale

### Configuration

- [x] electron-updater installé
- [x] electron-log installé
- [x] electron-builder.yml configuré
- [x] GitHub Actions workflow créé
- [x] Permissions GitHub correctes

### Code Backend

- [ ] autoUpdater.ts créé
- [ ] Handlers IPC créés
- [ ] Intégration dans main process
- [ ] Uniquement en production (if !is.dev)

### Code Frontend

- [ ] Types preload définis
- [ ] API exposée via contextBridge
- [ ] Hook useUpdater créé
- [ ] UpdateModal créé
- [ ] DownloadProgress créé
- [ ] InstallNotification créé
- [ ] Intégration dans App.tsx

### Tests

- [ ] Test en dev (updater désactivé)
- [ ] Test modal UpdateModal
- [ ] Test barre de progression
- [ ] Test notification installation

### Production

- [ ] Release 1.3.0 créée
- [ ] .exe téléchargeable
- [ ] Installer version N
- [ ] Vérifier notification version N+1
- [ ] Test téléchargement complet
- [ ] Test installation "Maintenant"
- [ ] Test installation "À la fermeture"

---

## 📊 Métriques de Succès

- ✅ **Notification** : Apparaît au démarrage (après 10s)
- ✅ **Téléchargement** : Progression visible et fluide
- ✅ **Installation** : Fonctionne sans erreur
- ✅ **Logs** : Événements tracés dans main.log
- ✅ **UX** : Non intrusif, professionnel, fluide

---

**Prochaine étape** : Implémentation du backend (Phase 1)
