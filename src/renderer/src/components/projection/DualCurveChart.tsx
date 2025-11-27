import React, { useState, useEffect } from 'react'
import TradingViewChart from './TradingViewChart'
import TimeRangeSelector from './TimeRangeSelector'
import { useProjectionChartData } from './hooks/useProjectionChartData'
import type { TimeRange } from '@renderer/types/projection'
import type { Objective } from './types'

interface Asset {
  id: number
  currentPrice: number
}

interface Transaction {
  assetId: number
  type: 'BUY' | 'SELL'
  quantity: number
  date: Date
}

interface DualCurveChartProps {
  objective: Objective | null
}

/**
 * Composant principal du graphique de projection avec TradingView
 */
function DualCurveChart({ objective }: DualCurveChartProps): React.JSX.Element {
  const [timeRange, setTimeRange] = useState<TimeRange>('MAX') // Vue par défaut : MAX
  const [assets, setAssets] = useState<Asset[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Charger les données
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const [assetsData, transactionsData] = await Promise.all([
          window.api.getAllAssets(),
          window.api.getAllTransactions()
        ])

        // Convertir les dates
        const transactionsWithDates = transactionsData.map((t) => ({
          ...t,
          date: new Date(t.date)
        }))

        setAssets(assetsData)
        setTransactions(transactionsWithDates)
        console.log('COUCOU', transactionsWithDates.length)
      } catch (error) {
        console.error('Erreur chargement données:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculer les données du graphique
  const fallbackObjective: Objective = {
    targetAmount: 0,
    targetYears: 1,
    interestRate: 0,
    id: 0,
    startDate: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const chartData = useProjectionChartData({
    timeRange,
    objective: objective || fallbackObjective,
    assets,
    transactions
  })

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">Chargement du graphique...</p>
      </div>
    )
  }

  if (!objective) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <p className="text-gray-500">Aucun objectif défini</p>
      </div>
    )
  }

  if (!chartData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">Calcul en cours...</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Graphique */}
      <div className="p-4">
        <TradingViewChart data={chartData} height={400} />
      </div>

      {/* Info */}
      <div className="border-t border-gray-200 bg-blue-50 px-4 py-3">
        <p className="text-xs text-blue-800">
          💡 <span className="font-semibold">Info :</span> La courbe verte représente votre
          patrimoine réel. La courbe bleue en pointillés montre la projection théorique nécessaire
          pour atteindre votre objectif de {objective.targetAmount.toLocaleString()} € en{' '}
          {objective.targetYears} ans.
        </p>
      </div>

      {/* Sélecteur de période */}
      <TimeRangeSelector selectedRange={timeRange} onRangeChange={setTimeRange} />
    </div>
  )
}

export default DualCurveChart
