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

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
