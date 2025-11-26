import React, { useState, useEffect } from 'react'
import TradingViewChart from './TradingViewChart'
import TimeRangeSelector from './TimeRangeSelector'
import { useInvestmentBreakdownData } from './hooks/useInvestmentBreakdownData'
import type { TimeRange } from '@renderer/types/projection'

interface Objective {
  id: number
  targetAmount: number
  targetYears: number
  interestRate: number
  createdAt: Date
  updatedAt: Date
}

interface Asset {
  id: number
  currentPrice: number
}

interface Transaction {
  assetId: number
  type: 'BUY' | 'SELL'
  quantity: number
  pricePerUnit: number
  fee: number
  date: Date
}

interface InvestmentBreakdownChartProps {
  objective: Objective | null
}

/**
 * Graphique de répartition Capital Investi vs Intérêts Reçus
 */
function InvestmentBreakdownChart({ objective }: InvestmentBreakdownChartProps): React.JSX.Element {
  const [timeRange, setTimeRange] = useState<TimeRange>('MAX')
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

        const transactionsWithDates = transactionsData.map((t) => ({
          ...t,
          date: new Date(t.date)
        }))

        setAssets(assetsData)
        setTransactions(transactionsWithDates)
      } catch (error) {
        console.error('Erreur chargement données:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculer les données du graphique
  const chartData = useInvestmentBreakdownData({
    timeRange,
    objective: objective || { targetAmount: 0, targetYears: 1, interestRate: 0 },
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
      {/* Titre */}
      <div className="border-b border-gray-200 bg-linear-to-r from-orange-50 to-green-50 px-4 py-3">
        <h3 className="text-lg font-semibold text-gray-800">
          📊 Répartition Capital Investi vs Intérêts
        </h3>
      </div>

      {/* Graphique */}
      <div className="p-4">
        <TradingViewChart
          data={chartData}
          height={400}
          realityColor="#f97316"
          realityTitle="Capital Investi"
          objectiveColor="#10b981"
          objectiveTitle="Intérêts Reçus"
          objectiveStyle="solid"
        />
      </div>

      {/* Info */}
      <div className="border-t border-gray-200 bg-orange-50 px-4 py-3">
        <p className="text-xs text-orange-800">
          💡 <span className="font-semibold">Formule :</span> Capital Investi (orange) + Intérêts
          Reçus (vert) = Objectif Théorique (courbe bleue du graphique principal). Les intérêts
          calculés avec un taux de {objective.interestRate}% par an en capitalisation mensuelle.
        </p>
      </div>

      {/* Sélecteur de période */}
      <TimeRangeSelector selectedRange={timeRange} onRangeChange={setTimeRange} />
    </div>
  )
}

export default InvestmentBreakdownChart
