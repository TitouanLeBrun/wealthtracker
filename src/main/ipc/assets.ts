import { ipcMain } from 'electron'
import { getPrismaClient } from '../database/client'
import { resolveSymbol, getLatestPrice } from '../utils/yahoo'

export function registerAssetHandlers(): void {
  // ==================== ASSETS ====================

  ipcMain.handle('asset:getAll', async () => {
    try {
      const prisma = await getPrismaClient()
      return await prisma.asset.findMany({
        include: {
          category: true
        },
        orderBy: { ticker: 'asc' }
      })
    } catch (error) {
      console.error('[IPC] Error fetching assets:', error)
      throw error
    }
  })

  ipcMain.handle(
    'asset:create',
    async (_, data: { name: string; ticker: string; currentPrice: number; categoryId: number }) => {
      try {
        const prisma = await getPrismaClient()

        // Résolution automatique du ticker/ISIN via Yahoo Finance
        console.log(`[Asset:Create] Tentative de résolution de: ${data.ticker}`)
        const resolved = await resolveSymbol(data.ticker)

        let finalTicker = data.ticker
        let finalPrice = data.currentPrice
        let isinCode: string | undefined = undefined

        if (resolved) {
          // Symbole trouvé sur Yahoo Finance
          console.log(`[Asset:Create] Résolu: ${data.ticker} → ${resolved.symbol}`)
          finalTicker = resolved.symbol
          isinCode = resolved.isin

          // Récupérer le prix actuel si non fourni ou égal à 0
          if (finalPrice === 0 || !finalPrice) {
            const price = await getLatestPrice(resolved.symbol)
            if (price !== null) {
              finalPrice = price
              console.log(`[Asset:Create] Prix récupéré: ${finalPrice}`)
            }
          }
        } else {
          console.warn(
            `[Asset:Create] Impossible de résoudre ${data.ticker}, utilisation des valeurs brutes`
          )
        }

        // Créer l'actif avec les données résolues
        return await prisma.asset.create({
          data: {
            name: data.name,
            ticker: finalTicker,
            isin: isinCode,
            currentPrice: finalPrice,
            categoryId: data.categoryId
          },
          include: {
            category: true
          }
        })
      } catch (error) {
        console.error('[IPC] Error creating asset:', error)
        throw error
      }
    }
  )

  ipcMain.handle('asset:updatePrice', async (_, data: { assetId: number; newPrice: number }) => {
    try {
      const prisma = await getPrismaClient()
      return await prisma.asset.update({
        where: { id: data.assetId },
        data: { currentPrice: data.newPrice },
        include: { category: true }
      })
    } catch (error) {
      console.error('[IPC] Error updating asset price:', error)
      throw error
    }
  })

  ipcMain.handle('asset:delete', async (_, assetId: number) => {
    try {
      const prisma = await getPrismaClient()

      // Vérifier qu'il n'y a aucune transaction pour cet actif
      const transactionCount = await prisma.transaction.count({
        where: { assetId }
      })

      if (transactionCount > 0) {
        throw new Error(
          `Impossible de supprimer cet actif : ${transactionCount} transaction(s) associée(s)`
        )
      }

      // Supprimer l'actif
      return await prisma.asset.delete({
        where: { id: assetId }
      })
    } catch (error) {
      console.error('[IPC] Error deleting asset:', error)
      throw error
    }
  })
}
