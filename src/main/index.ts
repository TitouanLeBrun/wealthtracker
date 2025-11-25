import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { getPrismaClient, closePrismaClient } from './database/client'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // 🐛 DEBUG - Ouvrir automatiquement les DevTools
    mainWindow.webContents.openDevTools()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Handlers IPC pour les transactions
  // ==================== TRANSACTIONS ====================
  ipcMain.handle('transaction:getAll', async () => {
    try {
      const prisma = getPrismaClient()
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
        const prisma = getPrismaClient()
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

  // ==================== CATEGORIES ====================
  ipcMain.handle('category:getAll', async () => {
    try {
      const prisma = getPrismaClient()
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
      const prisma = getPrismaClient()
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

  // ==================== ASSETS ====================
  ipcMain.handle('asset:getAll', async () => {
    try {
      const prisma = getPrismaClient()
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
        const prisma = getPrismaClient()
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

  // ✨ NOUVEAU : Mise à jour du prix d'un actif
  ipcMain.handle('asset:updatePrice', async (_, data: { assetId: number; newPrice: number }) => {
    try {
      const prisma = getPrismaClient()
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

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  closePrismaClient()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', async () => {
  await closePrismaClient()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
