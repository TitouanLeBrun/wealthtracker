# 📦 Guide de Build - WealthTracker

Ce guide explique comment créer un exécutable Windows de WealthTracker.

## 🚀 Méthode rapide (Script PowerShell)

### Option 1 : Double-clic sur le script

1. Double-cliquez sur `build-windows.ps1`
2. Choisissez le type de build souhaité
3. Attendez la fin du build
4. L'exécutable sera dans le dossier `dist/`

### Option 2 : Depuis PowerShell

```powershell
# Exécuter le script de build
.\build-windows.ps1
```

**Note**: Si vous avez une erreur de politique d'exécution, exécutez :

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\build-windows.ps1
```

---

## 🛠️ Méthode manuelle (NPM)

### Prérequis

- Node.js v18+ installé
- npm installé
- Windows 10/11

### Étapes de build

#### 1️⃣ Installation des dépendances

```bash
npm install
```

#### 2️⃣ Génération du client Prisma

```bash
npm run db:generate
```

#### 3️⃣ Build de l'application

**Option A : Installeur NSIS (recommandé)**

```bash
npm run build:win:installer
```

Crée un installeur classique avec assistant d'installation.

**Option B : Version portable**

```bash
npm run build:win:portable
```

Crée un exécutable portable (sans installation).

**Option C : Les deux**

```bash
npm run build:win
```

Crée l'installeur ET la version portable.

#### 4️⃣ Récupération de l'exécutable

Les fichiers se trouvent dans `dist/` :

- `WealthTracker-1.0.0-Setup.exe` - Installeur
- `WealthTracker-1.0.0-Portable.exe` - Version portable

---

## 📋 Scripts disponibles

| Script                        | Description                           |
| ----------------------------- | ------------------------------------- |
| `npm run build:win`           | Build complet (installeur + portable) |
| `npm run build:win:installer` | Installeur NSIS uniquement            |
| `npm run build:win:portable`  | Version portable uniquement           |
| `npm run build:unpack`        | Build sans compression (debug)        |
| `npm run build`               | Compile l'app (sans créer l'exe)      |

---

## 🔧 Configuration du build

### Modifier le nom de l'application

Fichier : `electron-builder.yml`

```yaml
productName: WealthTracker # Nom affiché
appId: com.wealthtracker.app # ID unique
```

### Modifier l'icône

Remplacez `build/icon.ico` par votre icône (format .ico, 256x256px).

### Modifier la version

Fichier : `package.json`

```json
{
  "version": "1.0.0" // Version de l'app
}
```

---

## 📁 Structure du build

```
dist/
├── WealthTracker-1.0.0-Setup.exe      # Installeur NSIS
├── WealthTracker-1.0.0-Portable.exe   # Version portable
├── win-unpacked/                      # Build décompressé
└── builder-debug.yml                  # Logs de build
```

---

## 🐛 Résolution de problèmes

### Erreur : "prisma not found"

```bash
npm run db:generate
```

### Erreur : "electron-builder not found"

```bash
npm install
```

### Build très lent

Désactivez votre antivirus temporairement ou ajoutez une exception pour :

- `node_modules/`
- `dist/`
- `out/`

### Erreur : "ENOENT: no such file or directory"

Nettoyez les dossiers et recommencez :

```bash
Remove-Item -Recurse -Force dist, out
npm run build:win
```

---

## 📊 Taille des fichiers

- **Installeur NSIS** : ~150-200 MB
- **Version portable** : ~150-200 MB
- **Installé** : ~250-300 MB

La taille importante est due à :

- Electron (~100 MB)
- Node.js intégré
- Chromium intégré
- Base de données SQLite
- Bibliothèques React + charts

---

## ✅ Checklist avant release

- [ ] Version mise à jour dans `package.json`
- [ ] CHANGELOG.md à jour
- [ ] Tests passés avec succès
- [ ] Base de données migrée
- [ ] Icône personnalisée (si besoin)
- [ ] Certificat de signature (optionnel)
- [ ] Build testé sur machine propre

---

## 🚀 Distribution

### Installation NSIS

1. L'utilisateur télécharge `WealthTracker-1.0.0-Setup.exe`
2. Double-clic sur l'installeur
3. Suivi de l'assistant d'installation
4. Raccourci créé sur le bureau
5. Lancement depuis le menu Démarrer

### Version Portable

1. L'utilisateur télécharge `WealthTracker-1.0.0-Portable.exe`
2. Place l'exe où il veut (clé USB, dossier perso...)
3. Double-clic pour lancer
4. Aucune installation requise

---

## 📝 Notes importantes

1. **Base de données** : Chaque utilisateur aura sa propre base SQLite dans `%APPDATA%\WealthTracker\`
2. **Mises à jour** : Pour activer les auto-updates, configurez `electron-updater`
3. **Signature** : Pour distribuer publiquement, il est recommandé de signer l'exe (certificat code signing)

---

## 🔗 Liens utiles

- [Documentation Electron Builder](https://www.electron.build/)
- [Documentation Electron](https://www.electronjs.org/)
- [Documentation Prisma](https://www.prisma.io/docs/)

---

**Dernière mise à jour** : 26 novembre 2024
