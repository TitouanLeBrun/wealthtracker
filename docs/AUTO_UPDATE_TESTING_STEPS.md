# 🧪 Guide de test de l'auto-update - v1.3.1

## ✅ État actuel

- ✅ Version v1.3.0 publiée (sans fichiers YML → auto-update non fonctionnel)
- 🔄 Version v1.3.1 en cours de build (avec fichiers YML → auto-update opérationnel)
- ⏳ GitHub Actions en cours : https://github.com/TitouanLeBrun/wealthtracker/actions/runs/19766176653

## 📋 Étapes de test (une fois v1.3.1 publiée)

### 1️⃣ Installer la version v1.3.0

```powershell
# Télécharger depuis GitHub Releases
gh release download v1.3.0 --pattern "WealthTracker-1.3.0-Setup.exe"

# Installer normalement
.\WealthTracker-1.3.0-Setup.exe
```

**Résultat attendu** : Application v1.3.0 installée et fonctionnelle

---

### 2️⃣ Démarrer l'application v1.3.0

```powershell
# L'application devrait se lancer normalement
# Logs attendus :
```

```log
🚀 Starting WealthTracker v1.3.0...
✅ AppUpdater initialized successfully
⏰ Auto-update check scheduled in 10 seconds
```

**Après 10 secondes** :

```log
🔍 Checking for updates...
📦 New version available: v1.3.1
📋 Release notes: [...]
```

**Interface attendue** :
- ✅ Modal **"Nouvelle version disponible"** s'affiche
- ✅ Bouton **"Télécharger la mise à jour"**
- ✅ Bouton **"Plus tard"**

---

### 3️⃣ Télécharger la mise à jour

Cliquez sur **"Télécharger la mise à jour"**

**Résultat attendu** :
- ✅ Barre de progression apparaît avec animation shimmer
- ✅ Affichage du pourcentage (0% → 100%)
- ✅ Affichage de la vitesse de téléchargement (ex: 5.2 MB/s)
- ✅ Affichage du temps restant (ex: 12 secondes restantes)
- ✅ Taille téléchargée / Taille totale (ex: 45 MB / 148 MB)

**Logs attendus** :

```log
⬇️ Downloading update v1.3.1...
📊 Progress: 25% (37 MB / 148 MB) - 5.2 MB/s
📊 Progress: 50% (74 MB / 148 MB) - 5.8 MB/s
📊 Progress: 75% (111 MB / 148 MB) - 6.1 MB/s
✅ Update downloaded successfully!
```

---

### 4️⃣ Notification d'installation

**Résultat attendu** :
- ✅ Notification flottante en bas à droite : **"Mise à jour prête à installer"**
- ✅ Deux boutons :
  - **"Installer maintenant"** → Ferme l'app et installe immédiatement
  - **"À la fermeture"** → Installe automatiquement quand vous fermez l'app

---

### 5️⃣ Installer la mise à jour

**Option A : Installation immédiate**
```
Cliquez sur "Installer maintenant"
→ L'application se ferme
→ L'installateur se lance automatiquement
→ La v1.3.1 s'installe
→ L'application redémarre sur v1.3.1
```

**Option B : Installation à la fermeture**
```
Cliquez sur "À la fermeture"
→ La notification disparaît
→ Continuez à utiliser l'application normalement
→ Fermez l'application quand vous voulez
→ L'installateur se lance automatiquement
→ La v1.3.1 s'installe
```

---

### 6️⃣ Vérifier la nouvelle version

Après redémarrage :

```powershell
# Vérifier la version dans le menu "À propos" ou dans les logs
```

**Logs attendus** :

```log
🚀 Starting WealthTracker v1.3.1...
✅ AppUpdater initialized successfully
⏰ Auto-update check scheduled in 10 seconds
🔍 Checking for updates...
ℹ️ No update available. You are using the latest version.
```

**Interface** :
- ✅ Version affichée : **v1.3.1**
- ✅ Aucune notification de mise à jour

---

## 🐛 Tests de cas d'erreur

### Test 1 : Pas de connexion internet

**Résultat attendu** :
```log
🔍 Checking for updates...
❌ Error checking for updates: net::ERR_INTERNET_DISCONNECTED
```
- ✅ Notification d'erreur discrète
- ✅ Possibilité de réessayer manuellement

---

### Test 2 : Annuler le téléchargement

1. Commencer à télécharger une mise à jour
2. Fermer la barre de progression (si possible)

**Résultat attendu** :
- ✅ Téléchargement annulé proprement
- ✅ Aucun fichier corrompu
- ✅ Possibilité de relancer le téléchargement

---

## 📊 Fichiers critiques à vérifier sur GitHub Releases

Une fois v1.3.1 publiée, vérifiez que ces fichiers sont présents :

```
✅ WealthTracker-1.3.1-Setup.exe
✅ WealthTracker-1.3.1-Setup.exe.blockmap
✅ WealthTracker-1.3.1-Portable.exe
✅ latest.yml ⬅️ CRITIQUE pour Windows
✅ latest-mac.yml ⬅️ CRITIQUE pour macOS
✅ latest-linux.yml ⬅️ CRITIQUE pour Linux
```

**Vérification** :

```powershell
gh release view v1.3.1 --json assets --jq '.assets[].name' | Sort-Object
```

---

## 🎯 Critères de succès

- ✅ Modal de mise à jour s'affiche automatiquement après 10 secondes
- ✅ Téléchargement fonctionne avec progression fluide
- ✅ Installation réussit sans erreur
- ✅ Version v1.3.1 démarre correctement
- ✅ Aucun crash ou comportement anormal
- ✅ Les données utilisateur sont préservées (projections, transactions, etc.)

---

## 📝 Notes importantes

### Différences entre v1.3.0 et v1.3.1

**v1.3.0** :
- ❌ Fichiers `latest*.yml` NON publiés → Auto-update NE FONCTIONNE PAS
- ⚠️ Erreur attendue : `Error: Cannot find latest.yml`

**v1.3.1** :
- ✅ Fichiers `latest*.yml` publiés correctement
- ✅ Auto-update OPÉRATIONNEL

### Pourquoi v1.3.1 est nécessaire

La v1.3.0 a été publiée sans les fichiers de métadonnées (`latest.yml`, etc.) qui sont essentiels pour `electron-updater`. Ces fichiers contiennent :
- La version la plus récente disponible
- L'URL de téléchargement de l'installateur
- Le hash SHA512 pour vérification d'intégrité
- Les informations de signature (si applicable)

Sans ces fichiers, `electron-updater` ne peut pas détecter qu'une nouvelle version existe.

---

## 🚀 Prochaines étapes après validation

1. ✅ Valider que l'auto-update fonctionne de v1.3.0 → v1.3.1
2. 📢 Annoncer aux utilisateurs actuels de télécharger **v1.3.1** (dernière installation manuelle)
3. 🔄 Toutes les versions futures (v1.4.0+) se mettront à jour automatiquement
4. 📚 Documenter le processus pour les futures releases

---

## 📞 En cas de problème

Si l'auto-update ne fonctionne pas :

1. **Vérifier les logs** : Chercher les messages d'erreur dans la console
2. **Vérifier les fichiers YML** : S'assurer qu'ils sont sur GitHub Releases
3. **Vérifier la configuration** : Confirmer que `electron-builder.yml` pointe vers le bon repo
4. **Tester avec MockUpdater** : Utiliser `MOCK_AUTO_UPDATE=true` pour tester l'UI

---

**Date de création** : 28 novembre 2024  
**Version de test** : v1.3.1  
**Statut** : ⏳ En attente de publication de v1.3.1
