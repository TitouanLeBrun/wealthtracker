# 🧪 Guide de test du système de mise à jour

Ce document explique comment tester le système d'auto-update en développement.

## 📋 Méthodes de test disponibles

### ✅ Méthode 1 : MockUpdater (Simulation UI) - **RECOMMANDÉ pour tester l'interface**

Cette méthode simule toute la séquence de mise à jour sans vérifier de vraies releases.

**Commandes PowerShell :**

```powershell
# Démarrer avec le MockUpdater
$env:MOCK_AUTO_UPDATE="true"
npm run dev
```

**Ce qui se passe :**

1. ⏱️ Attend 2 secondes
2. 🔍 Affiche "Vérification..."
3. 📣 Modal de mise à jour v99.99.99 (fictive)
4. ⬇️ Si vous cliquez "Télécharger", barre de progression animée
5. ✅ Notification "Prêt à installer"
6. ⚠️ "Installer maintenant" affiche juste un log (ne ferme pas l'app)

**Avantages :**

- ✅ Teste toute l'interface utilisateur
- ✅ Pas besoin de vraie release GitHub
- ✅ Progression rapide (20 secondes pour 100%)
- ✅ Ne ferme pas l'application

**Inconvénients :**

- ❌ Ne teste pas la vraie communication avec GitHub
- ❌ Ne teste pas le téléchargement réel

---

### ⚙️ Méthode 2 : AppUpdater avec vraie release

Cette méthode teste le vrai système avec une release GitHub.

**Prérequis :**

1. Avoir créé une release v1.3.0 sur GitHub
2. Que l'application soit en v1.2.1 (ou inférieure)

**Commandes PowerShell :**

```powershell
# Option A : Activer en dev (teste contre vraies releases)
$env:ENABLE_AUTO_UPDATE="true"
npm run dev

# Option B : Tester le build de production
npm run build:win
cd dist
.\WealthTracker-Setup.exe  # Installer la version
```

**Ce qui se passe :**

1. ⏱️ Attend 2 secondes (dev) ou 10 secondes (production)
2. 🌐 Vérifie `https://github.com/TitouanLeBrun/wealthtracker/releases/latest`
3. 📥 Télécharge `latest-windows.yml`
4. 🔍 Compare les versions
5. Si nouvelle version : affiche la modal
6. Téléchargement réel du `.exe`
7. Installation réelle (ferme l'app !)

**Avantages :**

- ✅ Teste le vrai système de bout en bout
- ✅ Teste la communication GitHub
- ✅ Teste le téléchargement réel

**Inconvénients :**

- ❌ Nécessite une vraie release sur GitHub
- ❌ Télécharge vraiment le fichier (~120 MB)
- ❌ Ferme l'application lors de l'installation

---

### 🔧 Méthode 3 : Tester avec dev.yml local

Pour tester sans release publique, vous pouvez utiliser un serveur local.

**1. Créer un fichier `dev.yml` :**

```yaml
# dev-update-server/latest-windows.yml
version: 1.3.1
files:
  - url: WealthTracker-Setup-1.3.1.exe
    sha512: ABC123...
    size: 125829120
path: WealthTracker-Setup-1.3.1.exe
sha512: ABC123...
releaseDate: '2024-11-28T12:00:00.000Z'
releaseNotes: |
  ## Version 1.3.1 TEST

  Ceci est une version de test.
```

**2. Modifier `autoUpdater.ts` temporairement :**

```typescript
// Dans startUpdateCheck(), ajouter avant checkForUpdates():
if (process.env.NODE_ENV === 'development') {
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'http://localhost:8000' // Serveur local
  })
}
```

**3. Lancer un serveur HTTP :**

```powershell
cd dev-update-server
python -m http.server 8000
```

**4. Lancer l'app :**

```powershell
$env:ENABLE_AUTO_UPDATE="true"
npm run dev
```

---

## 🎯 Scénarios de test recommandés

### Scénario 1 : Test complet de l'UI (MockUpdater)

```powershell
$env:MOCK_AUTO_UPDATE="true"
npm run dev
```

**Checklist :**

- [ ] Modal apparaît après 5 secondes
- [ ] Affiche "v99.99.99"
- [ ] Affiche les notes de release
- [ ] Bouton "Plus tard" ferme la modal
- [ ] Bouton "Télécharger" lance la progression
- [ ] Barre de progression s'anime correctement
- [ ] Affiche la vitesse (MB/s)
- [ ] Affiche le pourcentage
- [ ] Notification "Prêt à installer" apparaît
- [ ] Bouton "À la fermeture" ferme la notification
- [ ] Bouton "Installer maintenant" affiche un log

---

### Scénario 2 : Test avec vraie release (Production)

```powershell
# 1. Builder l'app en v1.2.1
# Modifier package.json: version: 1.2.1
npm run build:win

# 2. Installer v1.2.1
cd dist
.\WealthTracker-Setup.exe

# 3. Créer release v1.3.0 sur GitHub
# (via GitHub Actions ou manuellement)

# 4. Lancer l'app v1.2.1
# Attendre 10 secondes → devrait détecter v1.3.0
```

**Checklist :**

- [ ] Détecte la nouvelle version
- [ ] Affiche les vraies release notes
- [ ] Télécharge le vrai fichier
- [ ] Installation fonctionne
- [ ] L'app v1.3.0 démarre correctement

---

## 📊 Logs utiles

### Où trouver les logs ?

**Windows :**

```
%USERPROFILE%\AppData\Roaming\WealthTracker\logs\main.log
```

**Logs à surveiller :**

```
[AutoUpdater] Démarrage de la vérification des mises à jour
[AutoUpdater] Vérification des mises à jour...
[AutoUpdater] Mise à jour disponible: 1.3.0
[AutoUpdater] Téléchargement: 45.23% (54321000/120000000)
[AutoUpdater] Mise à jour téléchargée: 1.3.0
[AutoUpdater] Installation de la mise à jour
```

---

## ⚠️ Problèmes courants

### 1. "updater is not defined"

**Cause :** MockUpdater ou AppUpdater pas initialisé

**Solution :**

```powershell
# Vérifier que la variable d'environnement est définie
$env:MOCK_AUTO_UPDATE="true"
npm run dev
```

### 2. "Cannot find module 'electron-log'"

**Solution :**

```powershell
npm install electron-log
```

### 3. Modal ne s'affiche jamais

**Vérifier :**

- [ ] La variable d'environnement est bien définie
- [ ] Les logs montrent "[AutoUpdater] Démarrage..."
- [ ] Pas d'erreur dans la console

---

## 🚀 Commandes rapides

```powershell
# Test UI seulement (simulation)
$env:MOCK_AUTO_UPDATE="true"; npm run dev

# Test avec vraies releases (dev)
$env:ENABLE_AUTO_UPDATE="true"; npm run dev

# Reset des variables d'environnement
Remove-Item Env:\MOCK_AUTO_UPDATE
Remove-Item Env:\ENABLE_AUTO_UPDATE

# Build production
npm run build:win
```

---

## ✅ Validation finale

Avant de merger, vérifier :

- [ ] MockUpdater fonctionne en dev
- [ ] AppUpdater désactivé par défaut en dev
- [ ] Production détecte les mises à jour
- [ ] Téléchargement fonctionne
- [ ] Installation fonctionne
- [ ] Delta updates (.blockmap) générés
- [ ] Logs informatifs
- [ ] Pas d'erreurs TypeScript
- [ ] Pas d'erreurs ESLint
