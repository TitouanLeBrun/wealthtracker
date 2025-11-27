import { useState } from 'react'
import type { Transaction } from '../types'

interface UpdateTransactionData {
  type?: 'BUY' | 'SELL'
  quantity?: number
  pricePerUnit?: number
  fee?: number
  date?: Date
}

export function useTransactionUpdate(): {
  updateTransaction: (id: number, data: UpdateTransactionData) => Promise<Transaction | null>
  isUpdating: boolean
  error: string | null
} {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateTransaction = async (
    id: number,
    data: UpdateTransactionData
  ): Promise<Transaction | null> => {
    setIsUpdating(true)
    setError(null)

    try {
      const updated = await window.api.updateTransaction({ id, data })
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      setError(errorMessage)
      console.error('Erreur updateTransaction:', err)
      return null
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updateTransaction,
    isUpdating,
    error
  }
}
