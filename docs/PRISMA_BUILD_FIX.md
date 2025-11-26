# Fix : DATABASE_URL not found pendant le build

## 🐛 Problème

Lors du build de l'application avec `npm run build:win`, l'erreur suivante apparaît :

```
error: Environment variable not found: DATABASE_URL.
```

Cette erreur se produit car **Prisma Client a besoin de `DATABASE_URL` pendant la compilation** du projet, même si en production le chemin de la base de données est défini dynamiquement.

## 🔍 Pourquoi cela arrive ?

1. **Pendant le build** : Prisma Client génère du code TypeScript qui inclut des références à `DATABASE_URL`
2. **Electron-vite compile** le projet et Prisma essaie de lire `DATABASE_URL` depuis l'environnement
3. **Si `DATABASE_URL` n'est pas définie** : Prisma échoue et le build s'arrête

## ✅ Solution (3 niveaux)

### 1. Fichier `.env` (Développement + Build)

**Fichier : `.env`**

```properties
# DATABASE_URL pour le développement et la génération du client Prisma
# Ce chemin est utilisé UNIQUEMENT pendant le build et le développement
# En production, le chemin réel est défini dynamiquement dans src/main/database/client.ts
DATABASE_URL="file:./prisma/dev.db"
```

⚠️ **Important** : Ce fichier doit être à la racine du projet et doit contenir `DATABASE_URL` pointant vers le fichier de développement.

### 2. Charger `.env` dans la config Electron-Vite

**Fichier : `electron.vite.config.ts`**

```typescript
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Charger les variables d'environnement depuis .env
dotenv.config()

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
```

### 3. Scripts npm avec variable d'environnement (Backup)

**Fichier : `package.json`**

```json
{
  "scripts": {
    "build:win": "set DATABASE_URL=file:./prisma/dev.db&& npm run build && electron-builder --win --x64",
    "build:win:portable": "set DATABASE_URL=file:./prisma/dev.db&& npm run build && electron-builder --win --x64 portable",
    "build:win:installer": "set DATABASE_URL=file:./prisma/dev.db&& npm run build && electron-builder --win --x64 nsis"
  }
}
```

## 🎯 Flux complet

### Pendant le développement
```
.env (DATABASE_URL=file:./prisma/dev.db)
  ↓
electron.vite.config.ts (charge .env via dotenv.config())
  ↓
npm run dev
  ↓
Prisma utilise ./prisma/dev.db
```

### Pendant le build
```
.env (DATABASE_URL=file:./prisma/dev.db)
  ↓
electron.vite.config.ts (charge .env)
  ↓
npm run build:win (+ set DATABASE_URL=... en backup)
  ↓
Prisma génère le client avec succès
  ↓
Electron Builder package l'application
```

### En production (exécutable)
```
L'application démarre
  ↓
src/main/database/client.ts
  ↓
initDatabaseUrl() définit DATABASE_URL dynamiquement
  ↓
const dbPath = app.getPath('userData') + '/database.db'
process.env.DATABASE_URL = `file:${dbPath}`
  ↓
Import dynamique de PrismaClient
  ↓
Prisma utilise la base dans %APPDATA%/wealthtracker/database.db
```

## 📋 Checklist de vérification

- [x] `.env` existe à la racine avec `DATABASE_URL="file:./prisma/dev.db"`
- [x] `electron.vite.config.ts` importe et appelle `dotenv.config()`
- [x] `package.json` a `dotenv` dans les `devDependencies`
- [x] Scripts de build ont `set DATABASE_URL=...` en préfixe (backup)
- [x] `src/main/database/client.ts` définit `DATABASE_URL` dynamiquement en production

## 🧪 Test

```powershell
# Vérifier que .env est bien chargé
npm run build:win
```

Vous ne devriez **plus voir** l'erreur `Environment variable not found: DATABASE_URL`.

## 📝 Notes importantes

1. **`.env` est pour le BUILD** : Utilisé uniquement pendant la compilation
2. **`client.ts` est pour la PRODUCTION** : Définit le vrai chemin en runtime
3. **Ne PAS commit** le vrai chemin de production dans `.env` (il doit rester `./prisma/dev.db`)
4. **Trois couches de sécurité** :
   - `.env` (principal)
   - `dotenv.config()` dans electron.vite.config.ts
   - `set DATABASE_URL=...` dans les scripts npm (backup)

## 🔗 Fichiers modifiés

- `.env` - Ajout de `DATABASE_URL`
- `electron.vite.config.ts` - Import et appel de `dotenv.config()`
- `package.json` - Scripts de build avec `set DATABASE_URL=...`

## ✅ Résultat attendu

```powershell
PS> npm run build:win

> wealthtracker@1.0.0 build:win
> set DATABASE_URL=file:./prisma/dev.db&& npm run build && electron-builder --win --x64

✓ Built in XXXms
✓ Built successfully
  • electron-builder  version=25.1.8
  • loaded configuration  file=electron-builder.yml
  • packaging       platform=win32 arch=x64
  • default Electron icon is used
  • building        target=nsis file=dist\wealthtracker Setup 1.0.0.exe
  • building block map  blockMapFile=dist\wealthtracker Setup 1.0.0.exe.blockmap
```

**Aucune erreur Prisma** 🎉
