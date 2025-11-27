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
  isin?: string // Code ISIN international (ex: FR0000120271)
  currentPrice: number
  categoryId: number
  category?: Category
  createdAt: Date
}

// Yahoo Finance search result
export interface YahooAssetSearchResult {
  symbol: string // PLEM.PA
  name: string // Amundi PEA Emergent EMEA
  quoteType: string // ETF, EQUITY, CRYPTO
  exchange: string // PAR, NYSEArca
  isin?: string // FR0013412020
  currency?: string // EUR, USD
  price: number | null // Prix actuel (peut être null si API échoue)
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

// Objective type (financial goal)
export interface Objective {
  id: number
  targetAmount: number // Montant cible en € (ex: 300000)
  targetYears: number // Durée en années (ex: 25)
  interestRate: number // Taux d'intérêt annuel en % (ex: 8.0)
  startDate: Date | null // Date de début de l'objectif (null = première transaction)
  createdAt: Date
  updatedAt: Date
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
  updateTransaction: (params: {
    id: number
    data: {
      type?: 'BUY' | 'SELL'
      quantity?: number
      pricePerUnit?: number
      fee?: number
      date?: Date
    }
  }) => Promise<Transaction>
  deleteTransaction: (id: number) => Promise<{ success: boolean }>

  // Categories
  getAllCategories: () => Promise<Category[]>
  createCategory: (data: { name: string; color: string }) => Promise<Category>
  deleteCategory: (id: number) => Promise<{ success: boolean }>
  getOrCreateCategory: (name: string) => Promise<Category>

  // Assets
  getAllAssets: () => Promise<Asset[]>
  createAsset: (data: {
    name: string
    ticker: string
    isin: string
    currentPrice: number
    categoryId: number
  }) => Promise<Asset>
  updateAssetPrice: (data: { assetId: number; newPrice: number }) => Promise<Asset>
  deleteAsset: (assetId: number) => Promise<Asset>
  searchAsset: (query: string) => Promise<YahooAssetSearchResult | null>
  refreshAllAssetPrices: () => Promise<{
    success: boolean
    updated: number
    failed: number
    total: number
  }>

  // Objectives
  getCurrentObjective: () => Promise<Objective | null>
  createObjective: (data: {
    targetAmount: number
    targetYears: number
    interestRate: number
    startDate?: Date | null
  }) => Promise<Objective>
  updateObjective: (
    id: number,
    data: {
      targetAmount: number
      targetYears: number
      interestRate: number
      startDate?: Date | null
    }
  ) => Promise<Objective>

  // Import
  importTransactions: (params: {
    fileContent: string
    source: 'TradeRepublic' | 'Kraken' | 'Other'
  }) => Promise<{
    validTransactions: ParsedTransaction[]
    errors: ImportError[]
    warnings: ImportWarning[]
    summary: {
      total: number
      valid: number
      errors: number
      warnings: number
    }
    createdAssets: string[]
    createdCategory: boolean
  }>
}

export interface ParsedTransaction {
  date: string
  assetName: string
  isin: string | null
  type: 'BUY' | 'SELL'
  quantity: number
  pricePerUnit: number
  fee: number
  total: number
}

export interface ImportError {
  line: number
  reason: string
  data?: Record<string, unknown>
}

export interface ImportWarning {
  line: number
  reason: string
  data?: Record<string, unknown>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
