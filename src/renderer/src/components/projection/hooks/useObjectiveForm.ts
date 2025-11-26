/**
 * Hook pour gérer la logique du formulaire d'objectif
 */

import { useState, useEffect } from 'react'

export type StartDateMode = 'first-transaction' | 'today' | 'custom'

interface Objective {
  id: number
  targetAmount: number
  targetYears: number
  interestRate: number
  startDate: Date | null
  createdAt: Date
  updatedAt: Date
}

interface UseObjectiveFormReturn {
  targetAmount: number
  setTargetAmount: (value: number) => void
  targetYears: number
  setTargetYears: (value: number) => void
  interestRate: number
  setInterestRate: (value: number) => void
  startDateMode: StartDateMode
  setStartDateMode: (mode: StartDateMode) => void
  customStartDate: string
  setCustomStartDate: (date: string) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  firstTransactionDate: Date | null
  handleSubmit: (e: React.FormEvent) => void
  handleCancel: () => void
  getStartDateDisplay: () => string
}

export function useObjectiveForm(
  objective: Objective,
  onUpdate: (data: {
    targetAmount: number
    targetYears: number
    interestRate: number
    startDate?: Date | null
  }) => void
): UseObjectiveFormReturn {
  const [targetAmount, setTargetAmount] = useState(objective.targetAmount)
  const [targetYears, setTargetYears] = useState(objective.targetYears)
  const [interestRate, setInterestRate] = useState(objective.interestRate)
  const [startDateMode, setStartDateMode] = useState<StartDateMode>('first-transaction')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [firstTransactionDate, setFirstTransactionDate] = useState<Date | null>(null)

  // Charger la première transaction
  useEffect(() => {
    const loadFirstTransaction = async (): Promise<void> => {
      try {
        const transactions = await window.api.getAllTransactions()
        if (transactions.length > 0) {
          const earliest = transactions.reduce(
            (earliest, t) => (new Date(t.date) < new Date(earliest.date) ? t : earliest),
            transactions[0]
          )
          setFirstTransactionDate(new Date(earliest.date))
        }
      } catch (error) {
        console.error('Error loading first transaction:', error)
      }
    }
    loadFirstTransaction()
  }, [])

  // Initialiser le mode selon startDate
  useEffect(() => {
    if (objective.startDate) {
      const startDate = new Date(objective.startDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      startDate.setHours(0, 0, 0, 0)

      if (startDate.getTime() === today.getTime()) {
        setStartDateMode('today')
      } else {
        setStartDateMode('custom')
        setCustomStartDate(startDate.toISOString().split('T')[0])
      }
    } else {
      setStartDateMode('first-transaction')
    }
  }, [objective.startDate])

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    let startDate: Date | null = null
    if (startDateMode === 'today') {
      startDate = new Date()
    } else if (startDateMode === 'custom' && customStartDate) {
      startDate = new Date(customStartDate)
    }

    onUpdate({ targetAmount, targetYears, interestRate, startDate })
    setIsEditing(false)
  }

  const handleCancel = (): void => {
    setTargetAmount(objective.targetAmount)
    setTargetYears(objective.targetYears)
    setInterestRate(objective.interestRate)
    setIsEditing(false)
  }

  const getStartDateDisplay = (): string => {
    if (objective.startDate) {
      const date = new Date(objective.startDate)
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }
    if (firstTransactionDate) {
      return firstTransactionDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
    return 'Première transaction'
  }

  return {
    targetAmount,
    setTargetAmount,
    targetYears,
    setTargetYears,
    interestRate,
    setInterestRate,
    startDateMode,
    setStartDateMode,
    customStartDate,
    setCustomStartDate,
    isEditing,
    setIsEditing,
    firstTransactionDate,
    handleSubmit,
    handleCancel,
    getStartDateDisplay
  }
}
