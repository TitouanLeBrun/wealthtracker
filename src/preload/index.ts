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

  // Categories API
  getAllCategories: () => ipcRenderer.invoke('category:getAll'),
  createCategory: (data: { name: string; color: string }) =>
    ipcRenderer.invoke('category:create', data),

  // Assets API
  getAllAssets: () => ipcRenderer.invoke('asset:getAll'),
  createAsset: (data: { name: string; ticker: string; currentPrice: number; categoryId: number }) =>
    ipcRenderer.invoke('asset:create', data),
  updateAssetPrice: (data: { assetId: number; newPrice: number }) =>
    ipcRenderer.invoke('asset:updatePrice', data)
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
