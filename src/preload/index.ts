import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Transactions API
  getAllTransactions: () => ipcRenderer.invoke('transaction:getAll'),
  createTransaction: (data: {
    assetId: number
    type: 'BUY' | 'SELL'
    quantity: number
    pricePerUnit: number
    fee: number
    date: Date
  }) => ipcRenderer.invoke('transaction:create', data),
  updateTransaction: (params: {
    id: number
    data: {
      type?: 'BUY' | 'SELL'
      quantity?: number
      pricePerUnit?: number
      fee?: number
      date?: string
    }
  }) => ipcRenderer.invoke('transaction:update', params),
  deleteTransaction: (id: number) => ipcRenderer.invoke('transaction:delete', id),

  // Categories API
  getAllCategories: () => ipcRenderer.invoke('category:getAll'),
  createCategory: (data: { name: string; color: string }) =>
    ipcRenderer.invoke('category:create', data),
  deleteCategory: (id: number) => ipcRenderer.invoke('category:delete', id),
  getOrCreateCategory: (name: string) => ipcRenderer.invoke('category:getOrCreate', name),

  // Assets API
  getAllAssets: () => ipcRenderer.invoke('asset:getAll'),
  createAsset: (data: {
    name: string
    ticker: string
    isin: string
    currentPrice: number
    categoryId: number
  }) => ipcRenderer.invoke('asset:create', data),
  updateAssetPrice: (data: { assetId: number; newPrice: number }) =>
    ipcRenderer.invoke('asset:updatePrice', data),
  updateAsset: (data: {
    id: number
    name?: string
    ticker?: string
    isin?: string
    currentPrice?: number
    categoryId?: number
  }) => ipcRenderer.invoke('asset:update', data),
  deleteAsset: (assetId: number) => ipcRenderer.invoke('asset:delete', assetId),
  refreshAllAssetPrices: () => ipcRenderer.invoke('asset:refreshAllPrices'),
  searchAsset: (query: string) => ipcRenderer.invoke('asset:search', query),

  // Objectives API
  getCurrentObjective: () => ipcRenderer.invoke('objective:getCurrent'),
  createObjective: (data: { targetAmount: number; targetYears: number; interestRate: number }) =>
    ipcRenderer.invoke('objective:create', data),
  updateObjective: (
    id: number,
    data: { targetAmount: number; targetYears: number; interestRate: number }
  ) => ipcRenderer.invoke('objective:update', id, data),

  // Import API
  importTransactions: (params: {
    fileContent: string
    source: 'TradeRepublic' | 'Kraken' | 'Other'
  }) => ipcRenderer.invoke('importTransactions', params)
}

// Updater API
const updater = {
  // Méthodes pour contrôler les mises à jour
  checkForUpdates: () => ipcRenderer.invoke('updater:check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('updater:download-update'),
  quitAndInstall: () => ipcRenderer.invoke('updater:quit-and-install'),

  // Listeners pour les événements
  onUpdateChecking: (callback: () => void): (() => void) => {
    const listener = (): void => callback()
    ipcRenderer.on('updater:update-checking', listener)
    return () => ipcRenderer.removeListener('updater:update-checking', listener)
  },
  onUpdateAvailable: (callback: (info: unknown) => void): (() => void) => {
    const listener = (_event: unknown, info: unknown): void => callback(info)
    ipcRenderer.on('updater:update-available', listener)
    return () => ipcRenderer.removeListener('updater:update-available', listener)
  },
  onUpdateNotAvailable: (callback: (info: unknown) => void): (() => void) => {
    const listener = (_event: unknown, info: unknown): void => callback(info)
    ipcRenderer.on('updater:update-not-available', listener)
    return () => ipcRenderer.removeListener('updater:update-not-available', listener)
  },
  onUpdateError: (callback: (error: unknown) => void): (() => void) => {
    const listener = (_event: unknown, error: unknown): void => callback(error)
    ipcRenderer.on('updater:update-error', listener)
    return () => ipcRenderer.removeListener('updater:update-error', listener)
  },
  onDownloadProgress: (callback: (progress: unknown) => void): (() => void) => {
    const listener = (_event: unknown, progress: unknown): void => callback(progress)
    ipcRenderer.on('updater:download-progress', listener)
    return () => ipcRenderer.removeListener('updater:download-progress', listener)
  },
  onUpdateDownloaded: (callback: (info: unknown) => void): (() => void) => {
    const listener = (_event: unknown, info: unknown): void => callback(info)
    ipcRenderer.on('updater:update-downloaded', listener)
    return () => ipcRenderer.removeListener('updater:update-downloaded', listener)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('updater', updater)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.updater = updater
}
