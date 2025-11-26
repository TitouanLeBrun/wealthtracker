import { ipcMain } from 'electron'
import { getPrismaClient } from '../database/client'

export function registerCategoryHandlers(): void {
  // ==================== CATEGORIES ====================

  ipcMain.handle('category:getAll', async () => {
    try {
      const prisma = await getPrismaClient()
      return await prisma.category.findMany({
        orderBy: { name: 'asc' }
      })
    } catch (error) {
      console.error('[IPC] Error fetching categories:', error)
      throw error
    }
  })

  ipcMain.handle('category:create', async (_, data: { name: string; color: string }) => {
    try {
      const prisma = await getPrismaClient()
      return await prisma.category.create({
        data: {
          name: data.name,
          color: data.color
        }
      })
    } catch (error) {
      console.error('[IPC] Error creating category:', error)
      throw error
    }
  })
}
