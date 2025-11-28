/**
 * Gestion manuelle des migrations pour la production
 * Prisma ne peut pas exécuter automatiquement les migrations depuis un .asar
 * Ce fichier crée toutes les tables nécessaires au premier démarrage
 */

import { getPrismaClient } from './client'

/**
 * Crée toutes les tables de la base de données si elles n'existent pas
 */
async function createAllTables(): Promise<void> {
  const prisma = await getPrismaClient()

  console.log('[Migration] Création des tables de la base de données...')

  // Table Category
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Category" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "name" TEXT NOT NULL UNIQUE,
      "color" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Table Asset
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Asset" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "name" TEXT NOT NULL,
      "ticker" TEXT NOT NULL UNIQUE,
      "isin" TEXT,
      "currentPrice" REAL NOT NULL,
      "categoryId" INTEGER NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Asset_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )
  `)

  // Table Transaction
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Transaction" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "assetId" INTEGER NOT NULL,
      "type" TEXT NOT NULL,
      "quantity" REAL NOT NULL,
      "pricePerUnit" REAL NOT NULL,
      "fee" REAL NOT NULL DEFAULT 0,
      "date" DATETIME NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Transaction_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `)

  // Table Objective
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Objective" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "targetAmount" REAL NOT NULL,
      "targetYears" INTEGER NOT NULL,
      "interestRate" REAL NOT NULL,
      "startDate" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )
  `)

  // Index pour améliorer les performances
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "Transaction_assetId_idx" ON "Transaction"("assetId")
  `)

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "Transaction_date_idx" ON "Transaction"("date")
  `)

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "Asset_categoryId_idx" ON "Asset"("categoryId")
  `)

  console.log('[Migration] ✓ Toutes les tables ont été créées/vérifiées')
}

/**
 * Ajoute la colonne ISIN à la table Asset si elle n'existe pas (pour les anciennes installations)
 */
async function addIsinColumnIfNeeded(): Promise<void> {
  const prisma = await getPrismaClient()

  try {
    // Vérifier si la colonne existe en tentant de la sélectionner
    await prisma.$queryRaw`SELECT isin FROM Asset LIMIT 1`
    console.log('[Migration] ℹ La colonne ISIN existe déjà')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    // Si la colonne n'existe pas, l'ajouter
    if (errorMessage.includes('no such column') || errorMessage.includes('does not exist')) {
      console.log('[Migration] Ajout de la colonne ISIN à la table Asset...')

      await prisma.$executeRawUnsafe(`
        ALTER TABLE Asset ADD COLUMN isin TEXT;
      `)

      console.log('[Migration] ✓ Colonne ISIN ajoutée avec succès')
    } else {
      // Autre type d'erreur, on la propage
      throw error
    }
  }
}

/**
 * Applique toutes les migrations nécessaires au démarrage
 */
export async function applyProductionMigrations(): Promise<void> {
  try {
    console.log('[Migration] Vérification et application des migrations...')

    // Étape 1 : Créer toutes les tables si elles n'existent pas
    await createAllTables()

    // Étape 2 : Ajouter la colonne ISIN si elle manque (pour les anciennes installations)
    await addIsinColumnIfNeeded()

    console.log('[Migration] ✓ Toutes les migrations sont à jour')
  } catch (error) {
    console.error("[Migration] ❌ Erreur lors de l'application des migrations:", error)
    throw error
  }
}
