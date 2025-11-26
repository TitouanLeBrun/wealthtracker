import React, { useState, useEffect } from 'react'
import { Target, TrendingUp, Calendar, Edit2, Check, X } from 'lucide-react'

interface Objective {
  id: number
  targetAmount: number
  targetYears: number
  interestRate: number
  startDate: Date | null
  createdAt: Date
  updatedAt: Date
}

interface ObjectiveFormProps {
  objective: Objective
  onUpdate: (data: {
    targetAmount: number
    targetYears: number
    interestRate: number
    startDate?: Date | null
  }) => void
}

type StartDateMode = 'first-transaction' | 'today' | 'custom'

/**
 * Formulaire de configuration de l'objectif financier - Design moderne et compact
 */
function ObjectiveForm({ objective, onUpdate }: ObjectiveFormProps): React.JSX.Element {
  const [targetAmount, setTargetAmount] = useState(objective.targetAmount)
  const [targetYears, setTargetYears] = useState(objective.targetYears)
  const [interestRate, setInterestRate] = useState(objective.interestRate)
  const [startDateMode, setStartDateMode] = useState<StartDateMode>('first-transaction')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)

  // Charger les transactions pour afficher la date de première transaction
  const [firstTransactionDate, setFirstTransactionDate] = useState<Date | null>(null)

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

  // Initialiser le mode en fonction de startDate existant
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
    // Si 'first-transaction', on laisse null

    onUpdate({ targetAmount, targetYears, interestRate, startDate })
    setIsEditing(false)
  }

  const handleCancel = (): void => {
    setTargetAmount(objective.targetAmount)
    setTargetYears(objective.targetYears)
    setInterestRate(objective.interestRate)
    setIsEditing(false)
  }

  // Formater la date de début pour l'affichage
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

  // Mode affichage compact (non-édition)
  if (!isEditing) {
    return (
      <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <Target className="h-5 w-5 text-blue-600" />
            Objectif Financier
          </h3>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-all hover:bg-blue-100"
          >
            <Edit2 className="h-4 w-4" />
            Modifier
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Montant cible */}
          <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3 shadow-sm">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
              Objectif
            </p>
            <p className="text-lg font-bold text-gray-900">
              {targetAmount.toLocaleString('fr-FR')}€
            </p>
          </div>

          {/* Durée */}
          <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3 shadow-sm">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
              Durée
            </p>
            <p className="text-lg font-bold text-gray-900">{targetYears} ans</p>
          </div>

          {/* Taux d'intérêt */}
          <div className="flex flex-col items-center rounded-lg bg-gray-50 p-3 shadow-sm">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
              Rendement
            </p>
            <p className="text-lg font-bold text-gray-900">{interestRate}%</p>
          </div>
        </div>

        {/* Date de début */}
        <div className="mt-3 rounded-lg bg-blue-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Début de l&apos;objectif :</span>
            <span className="text-sm font-bold text-blue-700">{getStartDateDisplay()}</span>
          </div>
        </div>
      </div>
    )
  }

  // Mode édition
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="flex items-center justify-between bg-linear-to-r from-blue-50 to-indigo-50 px-5 py-3">
        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
          <Target className="h-5 w-5 text-blue-600" />
          Modifier l&apos;Objectif
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Montant cible */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-700">
              <Target className="h-3.5 w-3.5 text-green-600" />
              Montant cible
            </label>
            <div className="relative">
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                min="1000"
                step="1000"
                placeholder="300000"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                €
              </span>
            </div>
          </div>

          {/* Durée */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-700">
              <Calendar className="h-3.5 w-3.5 text-blue-600" />
              Durée
            </label>
            <div className="relative">
              <input
                type="number"
                value={targetYears}
                onChange={(e) => setTargetYears(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                min="1"
                max="70"
                placeholder="25"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                ans
              </span>
            </div>
          </div>

          {/* Taux d'intérêt */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-700">
              <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
              Rendement annuel
            </label>
            <div className="relative">
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                min="1"
                max="50"
                step="0.1"
                placeholder="8.0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Sélecteur de date de début */}
        <div className="mt-4">
          <label className="mb-2 block text-xs font-medium text-gray-700">
            📅 Date de début de l&apos;objectif
          </label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* Option 1 : Première transaction */}
            <button
              type="button"
              onClick={() => setStartDateMode('first-transaction')}
              className={`flex flex-col items-start rounded-lg border-2 p-3 text-left transition-all ${
                startDateMode === 'first-transaction'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    startDateMode === 'first-transaction'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {startDateMode === 'first-transaction' && (
                    <div
                      className="h-full w-full rounded-full bg-white"
                      style={{ transform: 'scale(0.5)' }}
                    ></div>
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-700">Première transaction</span>
              </div>
              <span className="ml-6 text-[10px] text-gray-500">
                {firstTransactionDate
                  ? firstTransactionDate.toLocaleDateString('fr-FR')
                  : 'Aucune transaction'}
              </span>
            </button>

            {/* Option 2 : Aujourd'hui */}
            <button
              type="button"
              onClick={() => setStartDateMode('today')}
              className={`flex flex-col items-start rounded-lg border-2 p-3 text-left transition-all ${
                startDateMode === 'today'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    startDateMode === 'today' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}
                >
                  {startDateMode === 'today' && (
                    <div
                      className="h-full w-full rounded-full bg-white"
                      style={{ transform: 'scale(0.5)' }}
                    ></div>
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-700">Aujourd&apos;hui</span>
              </div>
              <span className="ml-6 text-[10px] text-gray-500">
                {new Date().toLocaleDateString('fr-FR')}
              </span>
            </button>

            {/* Option 3 : Date personnalisée */}
            <button
              type="button"
              onClick={() => setStartDateMode('custom')}
              className={`flex flex-col items-start rounded-lg border-2 p-3 text-left transition-all ${
                startDateMode === 'custom'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <div
                  className={`h-4 w-4 rounded-full border-2 ${
                    startDateMode === 'custom' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}
                >
                  {startDateMode === 'custom' && (
                    <div
                      className="h-full w-full rounded-full bg-white"
                      style={{ transform: 'scale(0.5)' }}
                    ></div>
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-700">Date personnalisée</span>
              </div>
            </button>
          </div>

          {/* Champ de date personnalisé */}
          {startDateMode === 'custom' && (
            <div className="mt-3">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
          >
            <Check className="h-4 w-4" />
            Valider
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

export default ObjectiveForm
