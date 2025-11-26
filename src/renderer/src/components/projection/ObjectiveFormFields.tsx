/**
 * Champs du formulaire d'édition de l'objectif
 */

import { Target, TrendingUp, Calendar } from 'lucide-react'

interface ObjectiveFormFieldsProps {
  targetAmount: number
  onTargetAmountChange: (value: number) => void
  targetYears: number
  onTargetYearsChange: (value: number) => void
  interestRate: number
  onInterestRateChange: (value: number) => void
}

export function ObjectiveFormFields({
  targetAmount,
  onTargetAmountChange,
  targetYears,
  onTargetYearsChange,
  interestRate,
  onInterestRateChange
}: ObjectiveFormFieldsProps): React.JSX.Element {
  return (
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
            onChange={(e) => onTargetAmountChange(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            min="1000"
            step="1000"
            placeholder="300000"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">€</span>
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
            onChange={(e) => onTargetYearsChange(Number(e.target.value))}
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
            onChange={(e) => onInterestRateChange(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            min="1"
            max="50"
            step="0.1"
            placeholder="8.0"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">%</span>
        </div>
      </div>
    </div>
  )
}
