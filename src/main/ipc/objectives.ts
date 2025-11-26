import { ipcMain } from 'electron'
import { getPrismaClient } from '../database/client'

export function registerObjectiveHandlers(): void {
  // ==================== OBJECTIVES ====================

  ipcMain.handle('objective:getCurrent', async () => {
    try {
      const prisma = await getPrismaClient()
      // Récupérer le dernier objectif créé
      return await prisma.objective.findFirst({
        orderBy: { createdAt: 'desc' }
      })
    } catch (error) {
      console.error('[IPC] Error fetching current objective:', error)
      throw error
    }
  })

  ipcMain.handle(
    'objective:create',
    async (
      _,
      data: {
        targetAmount: number
        targetYears: number
        interestRate: number
        startDate?: Date | null
      }
    ) => {
      try {
        const prisma = await getPrismaClient()
        return await prisma.objective.create({
          data: {
            targetAmount: data.targetAmount,
            targetYears: data.targetYears,
            interestRate: data.interestRate,
            startDate: data.startDate ? new Date(data.startDate) : null
          }
        })
      } catch (error) {
        console.error('[IPC] Error creating objective:', error)
        throw error
      }
    }
  )

  ipcMain.handle(
    'objective:update',
    async (
      _,
      id: number,
      data: {
        targetAmount: number
        targetYears: number
        interestRate: number
        startDate?: Date | null
      }
    ) => {
      try {
        const prisma = await getPrismaClient()
        return await prisma.objective.update({
          where: { id },
          data: {
            targetAmount: data.targetAmount,
            targetYears: data.targetYears,
            interestRate: data.interestRate,
            startDate: data.startDate ? new Date(data.startDate) : null
          }
        })
      } catch (error) {
        console.error('[IPC] Error updating objective:', error)
        throw error
      }
    }
  )
}
