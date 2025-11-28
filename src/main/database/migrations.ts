/**
 * Gestion manuelle des migrations pour la production
 * Prisma ne peut pas exécuter automatiquement les migrations depuis un .asar
 */

import { getPrismaClient } from './client'

/**
 * Vérifie si la colonne ISIN existe dans la table Asset
 */
async function checkIsinColumnExists(): Promise<boolean> {
  const prisma = await getPrismaClient()

  try {
    // Tenter de sélectionner la colonne ISIN
    await prisma.$queryRaw`SELECT isin FROM Asset LIMIT 1`
    return true
  } catch (error) {
    // Si l'erreur contient "no such column", la colonne n'existe pas
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('no such column') || errorMessage.includes('does not exist')) {
      return false
    }
    // Autre type d'erreur, on la propage
    throw error
  }
}

/**
 * Ajoute la colonne ISIN à la table Asset si elle n'existe pas
 */
async function addIsinColumn(): Promise<void> {
  const prisma = await getPrismaClient()

  try {
    console.log('[Migration] Ajout de la colonne ISIN à la table Asset...')

    // Ajouter la colonne ISIN (nullable)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE Asset ADD COLUMN isin TEXT;
    `)

    console.log('[Migration] ✓ Colonne ISIN ajoutée avec succès')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    // Si la colonne existe déjà, ce n'est pas une erreur
    if (errorMessage.includes('duplicate column')) {
      console.log('[Migration] ℹ La colonne ISIN existe déjà')
      return
    }

    throw error
  }
}

/**
 * Applique toutes les migrations nécessaires au démarrage
 */
export async function applyProductionMigrations(): Promise<void> {
  try {
    console.log('[Migration] Vérification des migrations...')

    // Vérifier et ajouter la colonne ISIN si nécessaire
    const isinExists = await checkIsinColumnExists()

    if (!isinExists) {
      console.log('[Migration] La colonne ISIN est manquante, application de la migration...')
      await addIsinColumn()
    } else {
      console.log('[Migration] ✓ La colonne ISIN existe déjà')
    }

    console.log('[Migration] ✓ Toutes les migrations sont à jour')
  } catch (error) {
    console.error("[Migration] ❌ Erreur lors de l'application des migrations:", error)
    throw error
  }
}
