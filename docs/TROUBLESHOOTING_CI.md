# 🔧 Troubleshooting CI/CD - Prisma Client

## ❌ Problème rencontré

### Erreur 1 : Module PrismaClient introuvable

```
Run ESLint
Error: src/main/database/client.ts(1,10): error TS2305:
Module '"@prisma/client"' has no exported member 'PrismaClient'.
Process completed with exit code 2.
```

### Erreur 2 : Variable d'environnement manquante

```
Run npx prisma generate
Failed to load config file as a TypeScript/JavaScript module.
Error: PrismaConfigEnvError: Missing required environment variable: DATABASE_URL
Process completed with exit code 1.
```

## 🔍 Analyse

### Cause - Erreur 1

Le client Prisma n'est **pas généré automatiquement** lors de `npm ci` dans la CI.

**Pourquoi ?**

- `npm ci` installe uniquement les dépendances depuis `package-lock.json`
- Il **n'exécute pas** le script `postinstall` par défaut dans certaines configurations
- Le client Prisma doit être généré via `npx prisma generate` pour créer les types TypeScript

### Cause - Erreur 2

Prisma 7 nécessite la variable d'environnement `DATABASE_URL` pour charger `prisma.config.ts`, même lors de la génération du client.

**Pourquoi ?**

- `prisma.config.ts` utilise `env('DATABASE_URL')`
- Le fichier `.env` est dans `.gitignore` et n'est pas disponible en CI
- Sans cette variable, Prisma ne peut pas charger sa configuration

### En local vs CI

**En local** :

- Lors de `npm install`, le script `postinstall` peut être exécuté
- Ou vous avez déjà exécuté manuellement `npx prisma generate`
- Le client existe dans `node_modules/@prisma/client`

**En CI** :

- `npm ci` est utilisé (plus rapide, reproductible)
- Le client Prisma n'est pas généré automatiquement
- Les types TypeScript ne sont pas disponibles
- → Erreur lors du typecheck/ESLint

## ✅ Solution

### Modifier le workflow GitHub Actions

**Fichier** : `.github/workflows/lint.yml`

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4

  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'
  - name: Install dependencies
    run: npm ci

  # ✅ Ajouter cette étape CRUCIALE avec la variable d'environnement
  - name: Generate Prisma Client
    run: npx prisma generate
    env:
      DATABASE_URL: 'file:./dev.db' # Requis pour Prisma 7

  - name: Run ESLint
    run: npm run lint

  - name: Check TypeScript types
    run: npm run typecheck
```

### Ordre des étapes (important !)

1. **Checkout** - Récupérer le code
2. **Setup Node.js** - Installer Node et npm
3. **Install dependencies** - `npm ci`
4. **Generate Prisma Client** - `npx prisma generate` avec `DATABASE_URL` ⚠️ **REQUIS pour Prisma 7**
5. **Run ESLint** - Vérification du code
6. **Check TypeScript types** - Vérification des types

### ⚠️ Point clé pour Prisma 7

La variable d'environnement `DATABASE_URL` **DOIT** être définie lors de la génération :

```yaml
env:
  DATABASE_URL: 'file:./dev.db'
```

**Pourquoi ?**

- Prisma 7 charge `prisma.config.ts` qui utilise `env('DATABASE_URL')`
- Sans cette variable, la génération échoue même si la DB n'est pas utilisée
- La valeur peut être n'importe quel chemin valide (on ne l'utilise pas en CI)

## 🎯 Bonnes pratiques

### Option 1 : Étape explicite (Recommandé)

✅ Ajouter `npx prisma generate` comme étape séparée dans la CI

- **Avantages** : Clair, explicite, facile à déboguer
- **Inconvénient** : Une étape de plus

### Option 2 : Script postinstall

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

- **Avantages** : Automatique
- **Inconvénients** :
  - Peut ralentir `npm install` en local
  - Moins de contrôle

### Option 3 : Script personnalisé

```json
{
  "scripts": {
    "ci:setup": "npm ci && npx prisma generate",
    "ci:lint": "npm run lint && npm run typecheck"
  }
}
```

Dans le workflow :

```yaml
- name: Setup and Generate
  run: npm run ci:setup

- name: Run Checks
  run: npm run ci:lint
```

## 📝 Checklist pour d'autres projets Prisma

Lors de la configuration d'une CI avec Prisma, vérifiez :

- [ ] `npx prisma generate` est appelé après `npm ci`
- [ ] La variable `DATABASE_URL` est définie (si nécessaire pour la génération)
- [ ] Le fichier `prisma/schema.prisma` existe dans le repo
- [ ] Les migrations sont dans le repo (si vous utilisez `prisma migrate`)
- [ ] Le `.gitignore` n'exclut pas les fichiers Prisma nécessaires

## 🚀 Autres workflows possibles

### Build workflow

```yaml
- name: Install dependencies
  run: npm ci

- name: Generate Prisma Client
  run: npx prisma generate

- name: Build
  run: npm run build
```

### Test workflow

```yaml
- name: Install dependencies
  run: npm ci

- name: Generate Prisma Client
  run: npx prisma generate

- name: Run migrations (pour tests)
  run: npx prisma migrate deploy
  env:
    DATABASE_URL: file:./test.db

- name: Run tests
  run: npm test
```

## 📚 Ressources

- [Prisma in CI/CD](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel#generate-the-prisma-client)
- [GitHub Actions with Prisma](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [npm ci vs npm install](https://docs.npmjs.com/cli/v8/commands/npm-ci)

---

**Date de résolution** : 25 novembre 2025  
**Commit** : `ed76e2d - ci: Add Prisma Client generation step to workflow`
