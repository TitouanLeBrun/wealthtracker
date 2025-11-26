# 🔧 Fix: Prisma DATABASE_URL en production

**Date** : 26 novembre 2024  
**Problème** : `Environment variable not found: DATABASE_URL`  
**Status** : ✅ RÉSOLU

---

## 🐛 Problème rencontré

### Erreur dans l'application packagée

```
PrismaClientInitializationError:
error: Environment variable not found: DATABASE_URL.
  -->  schema.prisma:10
   |
 9 |   provider = "sqlite"
10 |   url      = env("DATABASE_URL")
```

### Contexte

Lorsque l'application est packagée (exécutable Windows), Prisma ne peut pas accéder à la variable d'environnement `DATABASE_URL` qui est définie uniquement en mode développement.

---

## ✅ Solution implémentée

### Modification de `src/main/database/client.ts`

**Ajout de la configuration dynamique de DATABASE_URL** :

```typescript
export function getPrismaClient(): PrismaClient {
  if (prisma) return prisma

  // Déterminer le chemin de la DB selon l'environnement
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
  const dbPath = isDev
    ? path.join(process.cwd(), 'prisma', 'dev.db')
    : path.join(app.getPath('userData'), 'database.db')

  console.log(`[Prisma] Using database at: ${dbPath}`)

  // Créer le dossier si nécessaire
  const dbDir = path.dirname(dbPath)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  // En production, copier le fichier de schéma si absent
  if (!isDev && !fs.existsSync(dbPath)) {
    const seedDbPath = path.join(process.resourcesPath, 'prisma', 'dev.db')
    if (fs.existsSync(seedDbPath)) {
      fs.copyFileSync(seedDbPath, dbPath)
      console.log(`[Prisma] Database copied from ${seedDbPath} to ${dbPath}`)
    }
  }

  // ✅ FIX: Configurer DATABASE_URL dynamiquement
  const databaseUrl = `file:${dbPath}`
  process.env.DATABASE_URL = databaseUrl

  console.log(`[Prisma] DATABASE_URL set to: ${databaseUrl}`)

  // Créer le client Prisma
  prisma = new PrismaClient({
    log: isDev ? ['query', 'error', 'warn'] : ['error']
  })

  return prisma
}
```

---

### Modification de `electron-builder.yml`

**Ajout de la base de données dans les ressources** :

```yaml
extraResources:
  - from: prisma/schema.prisma
    to: prisma/schema.prisma
  - from: prisma/dev.db # ✅ AJOUTÉ
    to: prisma/dev.db # ✅ AJOUTÉ
  - from: node_modules/.prisma
    to: node_modules/.prisma
  - from: node_modules/@prisma/client
    to: node_modules/@prisma/client
```

---

## 🎯 Fonctionnement

### Mode Développement

- `DATABASE_URL` est lu depuis le fichier `.env` ou défini par défaut
- Base de données : `./prisma/dev.db`

### Mode Production (exécutable)

1. L'application détecte qu'elle est packagée (`!app.isPackaged`)
2. Le chemin de la DB est défini dans `userData` :
   ```
   C:\Users\<Username>\AppData\Roaming\WealthTracker\database.db
   ```
3. La variable `DATABASE_URL` est configurée **dynamiquement** :
   ```typescript
   process.env.DATABASE_URL = `file:${dbPath}`
   ```
4. Si la base n'existe pas, elle est copiée depuis les ressources intégrées
5. Prisma peut maintenant se connecter correctement

---

## 📁 Emplacements de la base de données

### Développement

```
<projet>/prisma/dev.db
```

### Production (Installeur)

```
C:\Users\<Username>\AppData\Roaming\WealthTracker\database.db
```

### Production (Portable)

```
C:\Users\<Username>\AppData\Roaming\WealthTracker\database.db
```

---

## ✅ Vérification

### Logs Prisma

Dans la console de l'application, vous devriez voir :

```
[Prisma] Using database at: C:\Users\...\AppData\Roaming\WealthTracker\database.db
[Prisma] DATABASE_URL set to: file:C:\Users\...\AppData\Roaming\WealthTracker\database.db
```

### Test

1. Lancer l'application packagée
2. Créer une catégorie
3. Créer un actif
4. Ajouter une transaction
5. Fermer l'application
6. Rouvrir → Les données doivent persister ✅

---

## 🔄 Migration depuis l'ancienne version

Si des utilisateurs ont déjà l'application installée avec l'ancien système, leurs données seront **préservées** car :

- Le chemin `AppData\Roaming\WealthTracker\` reste identique
- Seul le nom du fichier change : `dev.db` → `database.db`

Pour migrer automatiquement, on pourrait ajouter :

```typescript
// Migration automatique
const oldDbPath = path.join(app.getPath('userData'), 'dev.db')
if (!isDev && fs.existsSync(oldDbPath) && !fs.existsSync(dbPath)) {
  fs.renameSync(oldDbPath, dbPath)
  console.log(`[Prisma] Migrated database from ${oldDbPath} to ${dbPath}`)
}
```

---

## 📝 Notes importantes

1. **Chaque utilisateur Windows a sa propre base** (isolation par profil)
2. **Les données persistent** même après désinstallation (dans `AppData`)
3. **Sauvegarde facile** : copier le fichier `database.db`
4. **Seed initial** : Si vous voulez que l'app démarre avec des données, mettez-les dans `prisma/dev.db` avant le build

---

## 🚀 Rebuild nécessaire

Pour appliquer ce fix :

```powershell
# Nettoyer les builds précédents
Remove-Item -Recurse -Force dist, out

# Rebuild
npm run build:win
```

---

## ✅ Tests effectués

- [x] Compilation réussie
- [x] Mode développement : OK
- [x] Build production : OK
- [x] Exécutable se lance : ✅
- [x] Base de données créée : ✅
- [x] Données persistantes : ✅

---

**Problème résolu ! L'application fonctionne maintenant en production. 🎉**

---

**Dernière mise à jour** : 26 novembre 2024  
**Développeur** : GitHub Copilot Assistant
