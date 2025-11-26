/**
 * Types partagés pour les composants de projection
 */

export interface Objective {
  id: number
  targetAmount: number
  targetYears: number
  interestRate: number
  startDate: Date | null // Date de début de l'objectif (null = première transaction)
  createdAt: Date
  updatedAt: Date
}

export interface Asset {
  id: number
  categoryId: number
  currentPrice: number
  transactions: Transaction[]
}

export interface Transaction {
  id: number
  assetId: number
  type: 'BUY' | 'SELL'
  quantity: number
  pricePerUnit: number
  fee: number
  date: Date
}

export interface CategoryBreakdown {
  name: string
  amount: number
  color: string
}
