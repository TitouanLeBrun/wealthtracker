import { ipcMain } from 'electron'
import { getPrismaClient } from '../database/client'
import { parseTradeRepublicCSV, type ImportResult } from '../utils/importers/tradeRepublicParser'

interface ImportTransactionsParams {
  fileContent: string
  source: 'TradeRepublic' | 'Kraken' | 'Other'
}

interface ImportTransactionsResult extends ImportResult {
  createdAssets: string[]
  createdCategory: boolean
}

/**
 * Trouve ou crée la catégorie "A TRIER"
 */
async function getOrCreateSortingCategory(): Promise<number> {
  const db = await getPrismaClient()
  const categoryName = 'A TRIER'

  // Chercher si elle existe déjà
  const existing = await db.category.findFirst({
    where: { name: categoryName }
  })

  if (existing) {
    return existing.id
  }

  // Créer la catégorie
  const newCategory = await db.category.create({
    data: {
      name: categoryName,
      color: '#9CA3AF' // Gris neutre
    }
  })

  return newCategory.id
}

/**
 * Trouve ou crée un actif par ISIN ou nom
 */
async function getOrCreateAsset(
  assetName: string,
  isin: string | null,
  sortingCategoryId: number
): Promise<{ id: number; created: boolean }> {
  const db = await getPrismaClient()

  // Pour l'instant, chercher uniquement par nom (ISIN n'existe pas encore dans le schéma)
  const existingByName = await db.asset.findFirst({
    where: { name: assetName }
  })

  if (existingByName) {
    return { id: existingByName.id, created: false }
  }

  // Créer le nouvel actif avec un ticker généré depuis l'ISIN ou le nom
  const ticker = isin || assetName.substring(0, 10).toUpperCase().replace(/\s/g, '')

  const newAsset = await db.asset.create({
    data: {
      name: assetName,
      ticker: ticker,
      categoryId: sortingCategoryId,
      currentPrice: 0 // À mettre à jour manuellement
    }
  })

  return { id: newAsset.id, created: true }
}

/**
 * Import des transactions depuis un fichier CSV/XLSX
 */
export function registerImportHandlers(): void {
  ipcMain.handle('importTransactions', async (_, params: ImportTransactionsParams) => {
    const { fileContent, source } = params

    try {
      // Parser selon la source
      let parseResult: ImportResult

      if (source === 'TradeRepublic') {
        parseResult = parseTradeRepublicCSV(fileContent)
      } else {
        throw new Error(`Source non supportée: ${source}`)
      }

      // Préparer le résultat
      const result: ImportTransactionsResult = {
        ...parseResult,
        createdAssets: [],
        createdCategory: false
      }

      // Si aucune transaction valide, retourner
      if (parseResult.validTransactions.length === 0) {
        return result
      }

      // Obtenir ou créer la catégorie "A TRIER"
      const db = await getPrismaClient()
      const sortingCategoryId = await getOrCreateSortingCategory()
      const categoryExisted = await db.category.findFirst({
        where: { name: 'A TRIER' }
      })
      result.createdCategory = !categoryExisted

      // Créer les transactions
      for (const parsedTx of parseResult.validTransactions) {
        // Obtenir ou créer l'actif
        const { id: assetId, created } = await getOrCreateAsset(
          parsedTx.assetName,
          parsedTx.isin,
          sortingCategoryId
        )

        if (created) {
          result.createdAssets.push(parsedTx.assetName)
        }

        // Créer la transaction
        await db.transaction.create({
          data: {
            assetId,
            type: parsedTx.type,
            quantity: parsedTx.quantity,
            pricePerUnit: parsedTx.pricePerUnit,
            fee: parsedTx.fee,
            date: new Date(parsedTx.date)
          }
        })
      }

      return result
    } catch (error) {
      console.error("Erreur lors de l'import:", error)
      throw error
    }
  })
}
