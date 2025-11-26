import { useState, useEffect, useMemo } from 'react'
import {
  generateTimeRangeDates,
  calculateRealityChartData,
  calculateObjectiveChartData,
  formatDateForChart
} from '@renderer/utils/calculations/projectionUtils'
import { TIME_RANGE_CONFIGS } from '@renderer/types/projection'
import type { TimeRange, ProjectionChartData } from '@renderer/types/projection'

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

interface Objective {
  targetAmount: number
  targetYears: number
  interestRate: number
}

interface UseProjectionChartDataProps {
  timeRange: TimeRange
  objective: Objective
  assets: Asset[]
  transactions: Transaction[]
}

/**
 * Hook pour calculer les données du graphique selon la période sélectionnée
 */
export function useProjectionChartData({
  timeRange,
  objective,
  assets,
  transactions
}: UseProjectionChartDataProps): ProjectionChartData | null {
  const [chartData, setChartData] = useState<ProjectionChartData | null>(null)
  const [loading, setLoading] = useState(true)

  // Calculer le patrimoine actuel
  const currentWealth = useMemo(() => {
    const wealth = assets.reduce((sum, asset) => {
      const assetTransactions = transactions.filter((t) => t.assetId === asset.id)
      const netQuantity = assetTransactions.reduce((qty, t) => {
        return t.type === 'BUY' ? qty + t.quantity : qty - t.quantity
      }, 0)
      const assetValue = netQuantity * asset.currentPrice

      return sum + assetValue
    }, 0)

    return wealth
  }, [assets, transactions])

  useEffect(() => {
    const calculateData = async (): Promise<void> => {
      setLoading(true)
      try {
        const config = TIME_RANGE_CONFIGS[timeRange]
        const today = new Date()

        // Pour MAX, calculer les dates depuis la première transaction jusqu'à la fin de l'objectif
        let dates: Date[]

        if (config.isFullRange) {
          // Trouver la première transaction
          const firstTransactionDate =
            transactions.length > 0
              ? transactions.reduce(
                  (earliest, t) => (t.date < earliest ? t.date : earliest),
                  transactions[0].date
                )
              : today

          // Date de fin = première transaction + années de l'objectif
          const endDate = new Date(firstTransactionDate)
          endDate.setFullYear(endDate.getFullYear() + objective.targetYears)

          // Générer les dates mensuelles
          dates = []
          const current = new Date(
            firstTransactionDate.getFullYear(),
            firstTransactionDate.getMonth(),
            1
          )

          while (current <= endDate) {
            const lastDayOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0)

            if (
              lastDayOfMonth.getMonth() === today.getMonth() &&
              lastDayOfMonth.getFullYear() === today.getFullYear()
            ) {
              dates.push(new Date(today))
            } else {
              dates.push(lastDayOfMonth)
            }

            current.setMonth(current.getMonth() + 1)
          }
        } else {
          // Générer les dates normalement
          dates = generateTimeRangeDates(config, today)
        }

        // Trouver la première transaction pour commencer la courbe objectif
        const firstTransactionDate =
          transactions.length > 0
            ? transactions.reduce(
                (earliest, t) => (t.date < earliest ? t.date : earliest),
                transactions[0].date
              )
            : today

        // Calculer les 2 courbes
        const realityData = calculateRealityChartData(dates, assets, transactions, today)
        const objectiveData = calculateObjectiveChartData(
          dates,
          currentWealth,
          objective,
          today,
          firstTransactionDate
        )

        // Formater la date du jour
        const todayMarker = formatDateForChart(today)

        setChartData({
          realityData,
          objectiveData,
          todayMarker
        })
      } catch (error) {
        console.error('Erreur calcul données graphique:', error)
        setChartData(null)
      } finally {
        setLoading(false)
      }
    }

    calculateData()
  }, [timeRange, objective, assets, transactions, currentWealth])

  return loading ? null : chartData
}
