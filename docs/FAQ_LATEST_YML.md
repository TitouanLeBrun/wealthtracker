# ❓ FAQ : Pourquoi `latest.yml` n'est PAS dans Git ?

## 🎯 Réponse courte

**C'est NORMAL et VOULU** ! Le fichier `latest.yml` (et ses variantes) ne doit **JAMAIS** être versionné dans Git.

---

## 📚 Explication détaillée

### Qu'est-ce que `latest.yml` ?

`latest.yml` est un fichier de **métadonnées** généré automatiquement par `electron-builder` lors du processus de build. Il contient :

```yaml
version: 1.3.1
files:
  - url: WealthTracker-1.3.1-Setup.exe
    sha512: 9DUrC6JDgSJMssfiqc1pnal0OfDRdCX4SrL3AqCfnkRXlGdFg2DVpnYzIL4oGcGVuJ1x8zUFtCJW6DzZXnUojg==
    size: 148754261
path: WealthTracker-1.3.1-Setup.exe
sha512: 9DUrC6JDgSJMssfiqc1pnal0OfDRdCX4SrL3AqCfnkRXlGdFg2DVpnYzIL4oGcGVuJ1x8zUFtCJW6DzZXnUojg==
releaseDate: '2025-11-28T14:14:09.873Z'
```

### Où est généré `latest.yml` ?

**Localement** :
- ✅ Lors du build local avec `npm run build:win`, `latest.yml` est créé dans `dist/`
- ❌ **Ce fichier NE DOIT PAS** être commité dans Git

**Sur GitHub Actions** :
- ✅ Lors du workflow de release, `latest.yml` est généré dans `dist/`
- ✅ Il est ensuite uploadé comme **artifact** GitHub Actions
- ✅ Puis publié dans la **GitHub Release** avec les installateurs

### Où doit se trouver `latest.yml` ?

Le fichier `latest.yml` doit **UNIQUEMENT** être dans :

1. ✅ **GitHub Releases** (assets de la release)
   ```
   https://github.com/TitouanLeBrun/wealthtracker/releases/download/v1.3.1/latest.yml
   ```

2. ✅ **Répertoire local `dist/`** (temporaire, ignoré par Git)

3. ❌ **PAS dans le repository Git**

---

## 🔍 Pourquoi NE PAS versionner `latest.yml` ?

### 1️⃣ Fichier généré automatiquement

`latest.yml` est **régénéré à chaque build** avec :
- Un nouveau hash SHA512 (différent à chaque build)
- Une nouvelle date de release
- Une nouvelle taille de fichier (qui peut varier légèrement)

**Le versionner créerait des conflits constants !**

### 2️⃣ Spécifique à chaque version

Chaque version de WealthTracker a son propre `latest.yml` :
- v1.3.0 → `latest.yml` avec SHA512 de v1.3.0
- v1.3.1 → `latest.yml` avec SHA512 de v1.3.1
- v1.4.0 → `latest.yml` avec SHA512 de v1.4.0

**Le versionner signifierait qu'on aurait un seul fichier pour toutes les versions, ce qui n'a aucun sens.**

### 3️⃣ Source de vérité : GitHub Releases

La **vraie source de vérité** pour `latest.yml` est **GitHub Releases**, pas Git :

```
electron-updater → Vérifie GitHub Releases → Télécharge latest.yml → Compare les versions
```

Si on versionnait `latest.yml` dans Git, on aurait **deux sources de vérité** contradictoires :
- Celle dans Git (obsolète, incorrecte)
- Celle dans GitHub Releases (à jour, correcte)

### 4️⃣ Sécurité

Le hash SHA512 dans `latest.yml` est calculé sur le fichier **réellement généré** lors du build CI/CD :

```yaml
sha512: 9DUrC6JDgSJMssfiqc1pnal0OfDRdCX4SrL3AqCfnkRXlGdFg2DVpnYzIL4oGcGVuJ1x8zUFtCJW6DzZXnUojg==
```

Si on modifiait `latest.yml` manuellement dans Git, le hash ne correspondrait plus au fichier réel, cassant la **vérification d'intégrité**.

---

## ✅ Configuration `.gitignore`

Pour éviter toute confusion, ces fichiers sont explicitement ignorés :

```gitignore
# Electron builder metadata (auto-generated)
latest*.yml
builder-debug.yml
*.blockmap
```

**Fichiers ignorés** :
- `latest.yml` (Windows)
- `latest-mac.yml` (macOS)
- `latest-linux.yml` (Linux)
- `builder-debug.yml` (debug electron-builder)
- `*.blockmap` (fichiers de delta update)

---

## 🔄 Workflow complet

### Développement local

```bash
# Build local
npm run build:win

# Génère dist/latest.yml (ignoré par Git)
# ❌ NE PAS faire : git add dist/latest.yml
```

### Workflow GitHub Actions

```yaml
# 1. Build
- name: Build Windows
  run: npx electron-builder --win --x64 --publish never
  # → Génère dist/latest.yml

# 2. Upload artifact
- name: Upload Windows Installers
  uses: actions/upload-artifact@v4
  with:
    path: |
      dist/*.exe
      dist/*.yml  # ✅ latest.yml uploadé comme artifact

# 3. Publish release
- name: Créer GitHub Release
  uses: softprops/action-gh-release@v1
  with:
    files: |
      release-assets/windows/*  # ✅ latest.yml publié dans la release
```

### Client utilisateur

```typescript
// electron-updater télécharge latest.yml depuis GitHub Releases
autoUpdater.checkForUpdates()
  → GET https://github.com/TitouanLeBrun/wealthtracker/releases/download/v1.3.1/latest.yml
  → Compare version actuelle vs version dans latest.yml
  → Télécharge la mise à jour si nécessaire
```

---

## 🧪 Vérification

### Comment vérifier que `latest.yml` est sur GitHub Releases ?

```powershell
# Méthode 1 : CLI GitHub
gh release view v1.3.1 --json assets --jq '.assets[].name' | Select-String "latest"

# Résultat attendu :
# latest.yml
# latest-mac.yml
# latest-linux.yml
```

```powershell
# Méthode 2 : Télécharger et vérifier
gh release download v1.3.1 --pattern "latest.yml"
cat latest.yml
```

```powershell
# Méthode 3 : URL directe
curl https://github.com/TitouanLeBrun/wealthtracker/releases/download/v1.3.1/latest.yml
```

---

## 🚨 Erreurs courantes

### ❌ Erreur : Commiter `latest.yml`

```bash
git add latest.yml
git commit -m "Add latest.yml"
```

**Pourquoi c'est une erreur** :
- Le fichier change à chaque build
- Crée des conflits Git inutiles
- La version dans Git sera obsolète dès le prochain build
- Viole le principe de séparation entre code source et artefacts de build

### ✅ Solution : Ignorer `latest.yml`

```gitignore
# .gitignore
latest*.yml
```

---

## 📊 Comparaison

| Aspect | Code source (versionné) | Artefacts de build (non versionnés) |
|--------|-------------------------|-------------------------------------|
| **Exemples** | `src/`, `package.json`, `README.md` | `dist/`, `latest.yml`, `*.exe` |
| **Versionné dans Git** | ✅ Oui | ❌ Non |
| **Généré automatiquement** | ❌ Non (écrit à la main) | ✅ Oui (par build tools) |
| **Change à chaque build** | ❌ Non | ✅ Oui |
| **Publié sur GitHub Releases** | ❌ Non | ✅ Oui |
| **Utilisé par electron-updater** | ❌ Non | ✅ Oui |

---

## 🎓 Conclusion

**`latest.yml` est un artefact de build, pas du code source.**

✅ **À FAIRE** :
- Générer `latest.yml` automatiquement via GitHub Actions
- Le publier dans GitHub Releases
- L'ignorer dans `.gitignore`

❌ **À NE PAS FAIRE** :
- Versionner `latest.yml` dans Git
- Modifier `latest.yml` manuellement
- Commiter les fichiers `dist/`

---

## 🔗 Ressources

- [Electron Builder - Auto Update](https://www.electron.build/auto-update)
- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [.gitignore Best Practices](https://github.com/github/gitignore)

---

**Date de création** : 28 novembre 2024  
**Dernière mise à jour** : 28 novembre 2024
