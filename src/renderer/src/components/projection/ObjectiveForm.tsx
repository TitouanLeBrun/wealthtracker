import React, { useState } from 'react'

interface Objective {
  id: number
  targetAmount: number
  targetYears: number
  interestRate: number
  createdAt: Date
  updatedAt: Date
}

interface ObjectiveFormProps {
  objective: Objective
  onUpdate: (data: { targetAmount: number; targetYears: number; interestRate: number }) => void
}

/**
 * Formulaire de configuration de l'objectif financier
 */
function ObjectiveForm({ objective, onUpdate }: ObjectiveFormProps): React.JSX.Element {
  const [targetAmount, setTargetAmount] = useState(objective.targetAmount)
  const [targetYears, setTargetYears] = useState(objective.targetYears)
  const [interestRate, setInterestRate] = useState(objective.interestRate)

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    onUpdate({ targetAmount, targetYears, interestRate })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Montant cible */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Montant cible (€)</label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="1000"
            step="1000"
          />
        </div>

        {/* Durée */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Durée (années)</label>
          <input
            type="number"
            value={targetYears}
            onChange={(e) => setTargetYears(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="1"
            max="70"
          />
        </div>

        {/* Taux d'intérêt */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Taux d&apos;intérêt (%)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="1"
            max="50"
            step="0.1"
          />
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Mettre à jour l&apos;objectif
      </button>
    </form>
  )
}

export default ObjectiveForm
