# 🔢 Correction des numéros de version affichés

**Date** : 28 novembre 2024  
**Problème** : Versions codées en dur (v0.5.0 et v0.4.0) au lieu de la vraie version  
**Solution** : Version dynamique depuis `package.json`

---

## 🐛 Problème identifié

### Avant correction

- **Header** : Affichait `v0.5.0` (codé en dur)
- **Footer** : Affichait `v0.4.0` (codé en dur)
- **Version réelle** : `v1.3.2` (dans `package.json`)

### Conséquences

- ❌ Confusion pour les utilisateurs
- ❌ Versions obsolètes affichées
- ❌ Maintenance manuelle requise à chaque release

---

## ✅ Solution implémentée

### 1. Configuration Vite (`electron.vite.config.ts`)

Ajout d'une constante globale `__APP_VERSION__` qui récupère automatiquement la version depuis `package.json` :

```typescript
import pkg from './package.json'

export default defineConfig({
  // ...
  renderer: {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version)
    },
    // ...
  }
})
```

### 2. Déclaration TypeScript (`env.d.ts`)

Déclaration de la constante pour TypeScript :

```typescript
/// <reference types="vite/client" />

declare const __APP_VERSION__: string
```

### 3. Utilisation dans `App.tsx`

**Header** :
```tsx
// AVANT
<span>v0.5.0</span>

// APRÈS
<span>v{__APP_VERSION__}</span>
```

**Footer** :
```tsx
// AVANT
<strong>WealthTracker v0.4.0</strong>

// APRÈS
<strong>WealthTracker v{__APP_VERSION__}</strong>
```

---

## 🎯 Résultat

### Après correction

- ✅ **Header** : Affiche `v1.3.2` (version actuelle)
- ✅ **Footer** : Affiche `v1.3.2` (version actuelle)
- ✅ **Automatique** : Se met à jour automatiquement à chaque changement de version dans `package.json`
- ✅ **Cohérent** : Même version partout (header, footer, GitHub Releases, etc.)

### Workflow de release simplifié

```bash
# 1. Bump de version
npm version patch  # ou minor, ou major

# 2. La version est automatiquement mise à jour dans :
# - package.json ✅
# - Header de l'app ✅
# - Footer de l'app ✅
# - GitHub Releases ✅

# 3. Build et release
npm run build:win
```

---

## 📊 Fichiers modifiés

| Fichier | Modification |
|---------|--------------|
| `electron.vite.config.ts` | Ajout de `__APP_VERSION__` dans `define` |
| `src/renderer/src/env.d.ts` | Déclaration TypeScript de `__APP_VERSION__` |
| `src/renderer/src/App.tsx` | Remplacement `v0.5.0` → `v{__APP_VERSION__}` (ligne 142) |
| `src/renderer/src/App.tsx` | Remplacement `v0.4.0` → `v{__APP_VERSION__}` (ligne 358) |

---

## 🧪 Tests

### Vérification TypeScript

```bash
npm run typecheck
```

**Résultat** : ✅ Aucune erreur

### Vérification visuelle

```bash
npm run dev
```

**Résultat attendu** :
- Header affiche : `v1.3.2`
- Footer affiche : `WealthTracker v1.3.2`

---

## 🔄 Historique des versions affichées

| Version app | Header (avant) | Footer (avant) | Header (après) | Footer (après) |
|-------------|----------------|----------------|----------------|----------------|
| v1.0.0 | v0.5.0 ❌ | v0.4.0 ❌ | v1.0.0 ✅ | v1.0.0 ✅ |
| v1.1.0 | v0.5.0 ❌ | v0.4.0 ❌ | v1.1.0 ✅ | v1.1.0 ✅ |
| v1.2.0 | v0.5.0 ❌ | v0.4.0 ❌ | v1.2.0 ✅ | v1.2.0 ✅ |
| v1.3.0 | v0.5.0 ❌ | v0.4.0 ❌ | v1.3.0 ✅ | v1.3.0 ✅ |
| v1.3.1 | v0.5.0 ❌ | v0.4.0 ❌ | v1.3.1 ✅ | v1.3.1 ✅ |
| v1.3.2 | v0.5.0 ❌ | v0.4.0 ❌ | v1.3.2 ✅ | v1.3.2 ✅ |

---

## 💡 Bonnes pratiques

### ✅ À faire

- Utiliser `__APP_VERSION__` dans tout le code pour afficher la version
- Mettre à jour `package.json` pour chaque release (`npm version`)
- Vérifier que la version affichée correspond à la release GitHub

### ❌ À éviter

- Coder en dur les numéros de version
- Dupliquer les informations de version
- Oublier de mettre à jour la version dans `package.json`

---

## 🔗 Variables globales disponibles

Vite permet de définir d'autres constantes globales si nécessaire :

```typescript
// electron.vite.config.ts
export default defineConfig({
  renderer: {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __APP_NAME__: JSON.stringify(pkg.name),
      __APP_DESCRIPTION__: JSON.stringify(pkg.description),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
      // etc.
    }
  }
})
```

**Usage dans le code** :

```tsx
<div>
  {__APP_NAME__} v{__APP_VERSION__}
  <br />
  Build: {__BUILD_DATE__}
</div>
```

---

## 📝 Prochaine version (v1.3.3)

Cette correction sera incluse dans la prochaine release. Les utilisateurs verront :

- Header : `v1.3.3` (au lieu de `v0.5.0`)
- Footer : `WealthTracker v1.3.3` (au lieu de `v0.4.0`)

---

## ✨ Conclusion

**Problème résolu** : Les versions affichées sont maintenant **cohérentes** et **automatiques**.

Plus besoin de modifier manuellement le code à chaque release ! 🎉

---

**Auteur** : GitHub Copilot  
**Date de création** : 28 novembre 2024  
**Version corrigée** : v1.3.2 → v1.3.3 (prochaine release)
