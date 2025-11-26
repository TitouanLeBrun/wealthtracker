# 🚀 WealthTracker - Aide-mémoire Build

---

## ⚡ Création rapide de l'exécutable

### Option 1 : Double-clic

```
📂 Dossier racine
   └── 📄 build-windows.ps1  👈 Double-cliquez ici !
```

### Option 2 : PowerShell

```powershell
.\build-windows.ps1
```

---

## 📦 Résultat

```
dist/
├── ✅ WealthTracker-1.0.0-Setup.exe      (Installeur)
└── ✅ WealthTracker-1.0.0-Portable.exe   (Portable)
```

---

## 🎯 Commandes essentielles

| Commande                      | Description               |
| ----------------------------- | ------------------------- |
| `npm run build:win`           | 🔥 Crée les 2 exécutables |
| `npm run build:win:installer` | 📦 Installeur uniquement  |
| `npm run build:win:portable`  | 🎒 Portable uniquement    |
| `npm run dev`                 | 🔧 Mode développement     |
| `npm run db:generate`         | 🗄️ Génère Prisma Client   |

---

## ⚠️ En cas de problème

```powershell
# Nettoyer et recommencer
Remove-Item -Recurse -Force dist, out
npm install
npm run db:generate
npm run build:win
```

---

## 📖 Documentation

- **Guide complet** : `docs/BUILD_GUIDE.md`
- **Config technique** : `docs/BUILD_CONFIG_SUMMARY.md`
- **Résumé final** : `docs/BUILD_WINDOWS_FINAL.md`

---

✅ **C'est tout !** Votre app est prête à être distribuée.
