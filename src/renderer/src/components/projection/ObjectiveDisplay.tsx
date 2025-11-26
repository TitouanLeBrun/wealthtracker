/**
 * Affichage de l'objectif en mode lecture (non-édition)
 */

import { Target, TrendingUp, Calendar, Edit2 } from 'lucide-react'

interface ObjectiveDisplayProps {
  targetAmount: number
  targetYears: number
  interestRate: number
  startDateDisplay: string
  onEdit: () => void
}

export function ObjectiveDisplay({
  targetAmount,
  targetYears,
  interestRate,
  startDateDisplay,
  onEdit
}: ObjectiveDisplayProps): React.JSX.Element {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-800">
          <Target className="h-5 w-5 text-blue-600" />
          Objectif Financier
        </h3>
        <button
          onClick={onEdit}
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
          <p className="text-lg font-bold text-gray-900">{targetAmount.toLocaleString('fr-FR')}€</p>
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
          <span className="text-sm font-bold text-blue-700">{startDateDisplay}</span>
        </div>
      </div>
    </div>
  )
}
