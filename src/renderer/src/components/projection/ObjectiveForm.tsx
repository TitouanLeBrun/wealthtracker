import React from 'react'
import { Target, Check, X } from 'lucide-react'
import { useObjectiveForm } from './hooks/useObjectiveForm'
import { ObjectiveDisplay } from './ObjectiveDisplay'
import { ObjectiveFormFields } from './ObjectiveFormFields'
import { StartDateSelector } from './StartDateSelector'

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

/**
 * Formulaire de configuration de l'objectif financier - Design moderne et compact
 */
function ObjectiveForm({ objective, onUpdate }: ObjectiveFormProps): React.JSX.Element {
  const {
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
  } = useObjectiveForm(objective, onUpdate)

  // Mode affichage compact (non-édition)
  if (!isEditing) {
    return (
      <ObjectiveDisplay
        targetAmount={targetAmount}
        targetYears={targetYears}
        interestRate={interestRate}
        startDateDisplay={getStartDateDisplay()}
        onEdit={() => setIsEditing(true)}
      />
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
        {/* Champs du formulaire */}
        <ObjectiveFormFields
          targetAmount={targetAmount}
          onTargetAmountChange={setTargetAmount}
          targetYears={targetYears}
          onTargetYearsChange={setTargetYears}
          interestRate={interestRate}
          onInterestRateChange={setInterestRate}
        />

        {/* Sélecteur de date de début */}
        <StartDateSelector
          mode={startDateMode}
          onModeChange={setStartDateMode}
          customDate={customStartDate}
          onCustomDateChange={setCustomStartDate}
          firstTransactionDate={firstTransactionDate}
        />

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
