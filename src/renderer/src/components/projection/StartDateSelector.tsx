/**
 * Sélecteur de date de début pour l'objectif
 */

import type { StartDateMode } from './hooks/useObjectiveForm'

interface StartDateSelectorProps {
  mode: StartDateMode
  onModeChange: (mode: StartDateMode) => void
  customDate: string
  onCustomDateChange: (date: string) => void
  firstTransactionDate: Date | null
}

export function StartDateSelector({
  mode,
  onModeChange,
  customDate,
  onCustomDateChange,
  firstTransactionDate
}: StartDateSelectorProps): React.JSX.Element {
  return (
    <div className="mt-4">
      <label className="mb-2 block text-xs font-medium text-gray-700">
        📅 Date de début de l&apos;objectif
      </label>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Option 1 : Première transaction */}
        <button
          type="button"
          onClick={() => onModeChange('first-transaction')}
          className={`flex flex-col items-start rounded-lg border-2 p-3 text-left transition-all ${
            mode === 'first-transaction'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="mb-1 flex items-center gap-2">
            <div
              className={`h-4 w-4 rounded-full border-2 ${
                mode === 'first-transaction' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}
            >
              {mode === 'first-transaction' && (
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
          onClick={() => onModeChange('today')}
          className={`flex flex-col items-start rounded-lg border-2 p-3 text-left transition-all ${
            mode === 'today'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="mb-1 flex items-center gap-2">
            <div
              className={`h-4 w-4 rounded-full border-2 ${
                mode === 'today' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}
            >
              {mode === 'today' && (
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
          onClick={() => onModeChange('custom')}
          className={`flex flex-col items-start rounded-lg border-2 p-3 text-left transition-all ${
            mode === 'custom'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="mb-1 flex items-center gap-2">
            <div
              className={`h-4 w-4 rounded-full border-2 ${
                mode === 'custom' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}
            >
              {mode === 'custom' && (
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
      {mode === 'custom' && (
        <div className="mt-3">
          <input
            type="date"
            value={customDate}
            onChange={(e) => onCustomDateChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      )}
    </div>
  )
}
