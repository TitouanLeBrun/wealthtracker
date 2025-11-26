import { ipcMain } from 'electron'
import { getPrismaClient } from '../database/client'

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
        return await prisma.asset.create({
          data: {
            name: data.name,
            ticker: data.ticker,
            currentPrice: data.currentPrice,
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
