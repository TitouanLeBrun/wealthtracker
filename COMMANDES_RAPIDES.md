# 🚀 Commandes Rapides - WealthTracker

## 📋 COMMANDES DE VÉRIFICATION

### Vérifier les erreurs TypeScript

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npx tsc --noEmit
```

### Vérifier les erreurs ESLint

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm run lint
```

### Vérifier tout en une fois

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npx tsc --noEmit; npm run lint
```

---

## 🔧 COMMANDES DE CORRECTION

### Corriger automatiquement ESLint

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm run lint -- --fix
```

### Corriger automatiquement Prettier

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npx prettier --write "src/**/*.{ts,tsx}"
```

### Corriger un fichier spécifique

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npx prettier --write "src/renderer/src/pages/ProjectionPage.tsx"
```

---

## 🚀 COMMANDES DE LANCEMENT

### Lancer en mode développement

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm run dev
```

### Build pour production

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm run build
```

### Lancer après build

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm start
```

---

## 🗃️ COMMANDES DATABASE

### Générer le client Prisma

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npx prisma generate
```

### Appliquer les migrations

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npx prisma migrate dev
```

### Seed la base de données

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npx prisma db seed
```

### Ouvrir Prisma Studio

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npx prisma studio
```

---

## 🧹 COMMANDES DE NETTOYAGE

### Nettoyer node_modules et réinstaller

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
Remove-Item -Recurse -Force node_modules
npm install
```

### Nettoyer le cache ESLint

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
Remove-Item -Force .eslintcache
```

### Nettoyer les builds

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
Remove-Item -Recurse -Force dist, out
```

---

## 🔍 COMMANDES DE DEBUG

### Voir les logs détaillés

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm run dev --verbose
```

### Analyser le bundle

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm run build -- --analyze
```

---

## 📦 COMMANDES NPM

### Installer une nouvelle dépendance

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm install <package-name>
```

### Installer une dépendance de développement

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm install --save-dev <package-name>
```

### Mettre à jour les dépendances

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm update
```

### Vérifier les vulnérabilités

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm audit
```

---

## ⚡ WORKFLOW COMPLET DE DÉVELOPPEMENT

### 1. Démarrer une session de dev

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npx tsc --noEmit          # Vérifier TypeScript
npm run lint              # Vérifier ESLint
npm run dev               # Lancer l'app
```

### 2. Avant de commit

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm run lint -- --fix                           # Corriger ESLint
npx prettier --write "src/**/*.{ts,tsx}"        # Formater le code
npx tsc --noEmit                                # Vérifier TypeScript
npm run lint                                     # Vérifier final
```

### 3. Build et test

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm run build             # Build
npm start                 # Tester le build
```

---

## 🎯 CORRECTIONS SPÉCIFIQUES ACTUELLES

### Corriger les apostrophes dans ProjectionPage.tsx

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
# Ouvrir le fichier et remplacer manuellement :
# Ligne 112 : l'Objectif → l&apos;Objectif
# Ligne 204 : d'intérêt → d&apos;intérêt
# Ligne 221 : l'objectif → l&apos;objectif
```

### Corriger le type any dans main/index.ts

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
# Ouvrir src/main/index.ts
# Ligne 280 : Spécifier un type explicite au lieu de 'any'
```

### Tout corriger automatiquement

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm run lint -- --fix
npx prettier --write "src/**/*.{ts,tsx}"
```

---

## 📚 AIDE RAPIDE

### Voir les scripts disponibles

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
Get-Content package.json | Select-String '"scripts"' -Context 0,15
```

### Voir la version de Node

```powershell
node --version
npm --version
```

### Voir les dépendances installées

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npm list --depth=0
```

---

## 🆘 EN CAS DE PROBLÈME

### Si l'app ne se lance pas

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
Remove-Item -Recurse -Force node_modules
npm install
npx prisma generate
npm run dev
```

### Si erreurs TypeScript persistent

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
npx tsc --noEmit --listFiles  # Voir les fichiers vérifiés
```

### Si erreurs de build

```powershell
cd d:\sdv\cours\electronjs\wealthtracker
Remove-Item -Recurse -Force dist, out, .vite
npm run build
```

---

**Dernier update** : 26 novembre 2024  
**Fichier** : Commandes de référence rapide pour WealthTracker
