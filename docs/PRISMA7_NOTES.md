# ⚠️ Notes importantes - Prisma 7

## 🔄 Changements de Prisma 6 → Prisma 7

### 1. Configuration du datasource

**❌ Prisma 6 (ne fonctionne plus) :**
```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`
    }
  }
})
```

**✅ Prisma 7 (nouvelle syntaxe) :**
```typescript
// La configuration se fait via prisma.config.ts et variables d'environnement
const prisma = new PrismaClient({
  log: isDev ? ['query', 'error', 'warn'] : ['error']
})
```

### 2. Configuration centralisée

Prisma 7 utilise le fichier `prisma.config.ts` pour la configuration :

```typescript
// prisma.config.ts
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations'
  },
  datasource: {
    url: env('DATABASE_URL') // Prend l'URL depuis .env
  }
})
```

### 3. Gestion dynamique du chemin DB dans Electron

**Problème** : Nous avons besoin de changer le chemin de la DB selon l'environnement (dev/prod).

**Solution temporaire actuelle** :
- En développement : utiliser `DATABASE_URL="file:./dev.db"` dans `.env`
- En production : créer/copier le fichier `.db` dans `app.getPath('userData')`

**Note** : Pour Prisma 7, la gestion dynamique du chemin en production nécessite :
1. Soit modifier la variable d'environnement `DATABASE_URL` avant de créer le client
2. Soit utiliser un adaptateur custom (feature avancée)

### 4. Import du PrismaClient

Le `PrismaClient` s'importe toujours de la même manière :

```typescript
import { PrismaClient } from '@prisma/client'
```

Mais assurez-vous d'avoir généré le client :
```powershell
npx prisma generate
```

### 5. Problèmes connus

#### Seed script
Le script `prisma/seed.ts` peut avoir des problèmes avec Prisma 7 lors de l'exécution via `npx prisma db seed`.

**Workaround** : Utiliser directement `npm run db:seed` qui utilise `tsx`.

#### TypeScript errors
Si vous voyez l'erreur :
```
Module '"@prisma/client"' has no exported member 'PrismaClient'
```

**Solution** :
1. Regénérer le client : `npx prisma generate`
2. Redémarrer le serveur TypeScript (VS Code : Cmd/Ctrl + Shift + P → "Restart TS Server")

## 📚 Ressources

- [Prisma 7 Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Prisma Config Documentation](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#datasource)
- [Electron + Prisma Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/electron)

## 🔧 Configuration actuelle du projet

### Fichiers de configuration Prisma
- `prisma/schema.prisma` - Schéma de la base de données
- `prisma.config.ts` - Configuration Prisma 7
- `.env` - Variables d'environnement (DATABASE_URL)

### Workflow
1. Modifier le schéma → `prisma/schema.prisma`
2. Créer la migration → `npx prisma migrate dev --name nom_migration`
3. Générer le client → `npx prisma generate` (fait automatiquement par migrate)
4. Utiliser dans le code → `import { PrismaClient } from '@prisma/client'`

## ✅ Status

- [x] Prisma 7 installé et configuré
- [x] Client généré correctement
- [x] Imports TypeScript fonctionnels
- [x] Configuration Electron compatible
- [ ] Gestion dynamique du chemin DB en production (à tester lors du build)

---

**Dernière mise à jour** : 25 novembre 2025
**Version Prisma** : 7.0.0
