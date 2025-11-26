# Script de build pour WealthTracker
# Auteur: WealthTracker Team
# Date: 26 novembre 2024

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WEALTHTRACKER - Build Windows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Node.js est installé
Write-Host "[1/6] Vérification de l'environnement..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERREUR: Node.js n'est pas installé!" -ForegroundColor Red
    exit 1
}
$nodeVersion = node --version
Write-Host "  ✓ Node.js $nodeVersion" -ForegroundColor Green

# Nettoyer les builds précédents
Write-Host ""
Write-Host "[2/6] Nettoyage des builds précédents..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "  ✓ Dossier dist supprimé" -ForegroundColor Green
}
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
    Write-Host "  ✓ Dossier out supprimé" -ForegroundColor Green
}

# Installer les dépendances
Write-Host ""
Write-Host "[3/6] Installation des dépendances..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Installation des dépendances échouée!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Dépendances installées" -ForegroundColor Green

# Générer Prisma Client
Write-Host ""
Write-Host "[4/6] Génération du client Prisma..." -ForegroundColor Yellow
npm run db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Génération Prisma échouée!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Client Prisma généré" -ForegroundColor Green

# Build de l'application
Write-Host ""
Write-Host "[5/6] Build de l'application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR: Build échoué!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Application compilée" -ForegroundColor Green

# Créer l'exécutable Windows
Write-Host ""
Write-Host "[6/6] Création de l'exécutable Windows..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Choisissez le type de build:" -ForegroundColor Cyan
Write-Host "  1. Installeur NSIS (recommandé)" -ForegroundColor White
Write-Host "  2. Version portable" -ForegroundColor White
Write-Host "  3. Les deux" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Votre choix (1-3)"

switch ($choice) {
    "1" {
        Write-Host "  → Création de l'installeur NSIS..." -ForegroundColor Yellow
        npm run build:win:installer
    }
    "2" {
        Write-Host "  → Création de la version portable..." -ForegroundColor Yellow
        npm run build:win:portable
    }
    "3" {
        Write-Host "  → Création de l'installeur et de la version portable..." -ForegroundColor Yellow
        npm run build:win
    }
    default {
        Write-Host "  → Choix invalide, création de l'installeur par défaut..." -ForegroundColor Yellow
        npm run build:win:installer
    }
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERREUR: Création de l'exécutable échouée!" -ForegroundColor Red
    exit 1
}

# Succès
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✓ BUILD RÉUSSI!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Les exécutables se trouvent dans le dossier: dist\" -ForegroundColor Cyan
Write-Host ""

# Afficher les fichiers créés
if (Test-Path "dist") {
    Write-Host "Fichiers créés:" -ForegroundColor Yellow
    Get-ChildItem "dist" -Filter "*.exe" | ForEach-Object {
        $size = [math]::Round($_.Length / 1MB, 2)
        Write-Host "  - $($_.Name) ($size MB)" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "Appuyez sur une touche pour quitter..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
