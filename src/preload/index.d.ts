import { ElectronAPI } from '@electron-toolkit/preload'

// Transaction type
export interface Transaction {
  id: number
  label: string
  amount: number
  date: Date
  createdAt: Date
}

// API type
export interface API {
  getAllTransactions: () => Promise<Transaction[]>
  createTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => Promise<Transaction>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
