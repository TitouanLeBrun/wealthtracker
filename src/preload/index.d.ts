import { ElectronAPI } from '@electron-toolkit/preload'

// Category type
export interface Category {
  id: number
  name: string
  color: string
}

// Asset type
export interface Asset {
  id: number
  name: string
  ticker: string
  currentPrice: number
  categoryId: number
  category?: Category
  createdAt: Date
}

// Transaction type (v0.2)
export interface Transaction {
  id: number
  assetId: number
  asset?: Asset
  type: 'BUY' | 'SELL'
  quantity: number
  pricePerUnit: number
  fee: number
  date: Date
  createdAt: Date
}

// API type
export interface API {
  // Transactions
  getAllTransactions: () => Promise<Transaction[]>
  createTransaction: (data: {
    assetId: number
    type: 'BUY' | 'SELL'
    quantity: number
    pricePerUnit: number
    fee: number
    date: Date
  }) => Promise<Transaction>

  // Categories
  getAllCategories: () => Promise<Category[]>
  createCategory: (data: { name: string; color: string }) => Promise<Category>

  // Assets
  getAllAssets: () => Promise<Asset[]>
  createAsset: (data: {
    name: string
    ticker: string
    currentPrice: number
    categoryId: number
  }) => Promise<Asset>
  updateAssetPrice: (data: { assetId: number; newPrice: number }) => Promise<Asset>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
