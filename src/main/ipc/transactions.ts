import { ipcMain } from 'electron'
import { getPrismaClient } from '../database/client'

export function registerTransactionHandlers(): void {
  // ==================== TRANSACTIONS ====================

  ipcMain.handle('transaction:getAll', async () => {
    try {
      const prisma = await getPrismaClient()
      return await prisma.transaction.findMany({
        include: {
          asset: {
            include: {
              category: true
            }
          }
        },
        orderBy: { date: 'desc' }
      })
    } catch (error) {
      console.error('[IPC] Error fetching transactions:', error)
      throw error
    }
  })

  ipcMain.handle(
    'transaction:create',
    async (
      _,
      data: {
        assetId: number
        type: 'BUY' | 'SELL'
        quantity: number
        pricePerUnit: number
        fee: number
        date: Date
      }
    ) => {
      try {
        const prisma = await getPrismaClient()
        return await prisma.transaction.create({
          data: {
            assetId: data.assetId,
            type: data.type,
            quantity: data.quantity,
            pricePerUnit: data.pricePerUnit,
            fee: data.fee || 0,
            date: new Date(data.date)
          },
          include: {
            asset: {
              include: {
                category: true
              }
            }
          }
        })
      } catch (error) {
        console.error('[IPC] Error creating transaction:', error)
        throw error
      }
    }
  )

  ipcMain.handle('transaction:delete', async (_, transactionId: number) => {
    try {
      const prisma = await getPrismaClient()
      await prisma.transaction.delete({
        where: { id: transactionId }
      })
      return { success: true }
    } catch (error) {
      console.error('[IPC] Error deleting transaction:', error)
      throw error
    }
  })
}
