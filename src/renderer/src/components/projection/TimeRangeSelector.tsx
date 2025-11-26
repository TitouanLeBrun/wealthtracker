import React from 'react'
import type { TimeRange } from '@renderer/types/projection'

interface TimeRangeSelectorProps {
  selectedRange: TimeRange
  onRangeChange: (range: TimeRange) => void
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1A', label: '1A' },
  { value: '3A', label: '3A' },
  { value: 'MAX', label: 'MAX' }
]

/**
 * Sélecteur de période pour le graphique
 */
function TimeRangeSelector({
  selectedRange,
  onRangeChange
}: TimeRangeSelectorProps): React.JSX.Element {
  return (
    <>
      {/* Version Desktop : Boutons */}
      <div className="hidden items-center justify-center gap-2 border-t border-gray-200 bg-gray-50 p-4 sm:flex">
        {TIME_RANGES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onRangeChange(value)}
            className={`
              rounded-lg px-6 py-2 text-sm font-medium transition-all
              ${
                selectedRange === value
                  ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:bg-gray-50 hover:text-blue-600'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Version Mobile : Dropdown */}
      <div className="flex items-center justify-center border-t border-gray-200 bg-gray-50 p-4 sm:hidden">
        <select
          value={selectedRange}
          onChange={(e) => onRangeChange(e.target.value as TimeRange)}
          className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {TIME_RANGES.map(({ value, label }) => (
            <option key={value} value={value}>
              Période : {label}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export default TimeRangeSelector
