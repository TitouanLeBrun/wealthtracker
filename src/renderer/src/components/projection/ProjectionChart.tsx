import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { formatEuros } from '../../utils/calculations/projectionUtils'

interface ChartDataPoint {
  date: string
  reality: number | null
  objective: number
  timestamp: number
}

interface ProjectionChartProps {
  realityData: Array<{ date: Date; value: number }>
  objectiveData: Array<{ date: Date; value: number }>
  height?: number
}

/**
 * Composant de graphique avec Recharts
 * Affiche les courbes de patrimoine réel vs objectif
 */
function ProjectionChart({
  realityData,
  objectiveData,
  height = 400
}: ProjectionChartProps): React.JSX.Element {
  // Fusionner les données des deux courbes
  const chartData: ChartDataPoint[] = React.useMemo(() => {
    const dataMap = new Map<number, ChartDataPoint>()

    // Ajouter les points de réalité
    realityData.forEach((point) => {
      const timestamp = point.date.getTime()
      const dateStr = point.date.toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric'
      })

      dataMap.set(timestamp, {
        date: dateStr,
        reality: point.value,
        objective: 0,
        timestamp
      })
    })

    // Ajouter les points d'objectif
    objectiveData.forEach((point) => {
      const timestamp = point.date.getTime()
      const dateStr = point.date.toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric'
      })

      const existing = dataMap.get(timestamp)
      if (existing) {
        existing.objective = point.value
      } else {
        // Point futur (après aujourd'hui)
        dataMap.set(timestamp, {
          date: dateStr,
          reality: null,
          objective: point.value,
          timestamp
        })
      }
    })

    // Convertir en tableau et trier par date
    return Array.from(dataMap.values()).sort((a, b) => a.timestamp - b.timestamp)
  }, [realityData, objectiveData])

  // Tooltip personnalisé
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any): React.JSX.Element | null => {
    if (!active || !payload || payload.length === 0) return null

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <p className="mb-2 text-sm font-semibold text-gray-700">{label}</p>
        {payload.map((entry, index) => {
          if (entry.value === null || entry.value === undefined) return null

          const isReality = entry.dataKey === 'reality'
          const color = isReality ? '#10b981' : '#3b82f6'
          const label = isReality ? 'Patrimoine réel' : 'Objectif théorique'

          return (
            <div key={index} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-sm text-gray-600">{label}:</span>
              <span className="text-sm font-bold" style={{ color }}>
                {formatEuros(entry.value)}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  // Formateur d'axe Y (valeurs en K€)
  const formatYAxis = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M €`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k €`
    }
    return `${value} €`
  }

  // Calculer l'intervalle de dates optimal pour l'axe X
  const tickInterval = Math.ceil(chartData.length / 8)

  return (
    <div className="rounded-lg bg-white p-4" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            interval={tickInterval}
          />

          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            tickFormatter={formatYAxis}
            width={80}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{
              paddingTop: '20px'
            }}
            iconType="line"
          />

          {/* Courbe réalité (verte) */}
          <Line
            type="monotone"
            dataKey="reality"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            name="Patrimoine réel"
            connectNulls={false}
          />

          {/* Courbe objectif (bleue) */}
          <Line
            type="monotone"
            dataKey="objective"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#3b82f6', r: 3 }}
            activeDot={{ r: 5 }}
            name="Objectif théorique"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ProjectionChart
