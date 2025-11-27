import { useState, useEffect, useMemo } from 'react'
import {
  generateTimeRangeDates,
  calculateRealityChartData,
  calculateObjectiveChartData,
  formatDateForChart
} from '@renderer/utils/calculations/projectionUtils'
import { TIME_RANGE_CONFIGS } from '@renderer/types/projection'
import type { TimeRange, ProjectionChartData } from '@renderer/types/projection'
import type { Objective } from '../types'

// Types partiels pour les calculs de projection
interface ProjectionAsset {
  id: number
  currentPrice: number
}

interface ProjectionTransaction {
  assetId: number
  type: 'BUY' | 'SELL'
  quantity: number
  date: Date
}

interface UseProjectionChartDataProps {
  timeRange: TimeRange
  objective: Objective
  assets: ProjectionAsset[]
  transactions: ProjectionTransaction[]
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

          // Utiliser startDate de l'objectif ou la première transaction par défaut
          const objectiveStartDate = objective.startDate
            ? new Date(objective.startDate)
            : firstTransactionDate

          // Date de fin = date de début de l'objectif + années de l'objectif
          const endDate = new Date(objectiveStartDate)
          endDate.setFullYear(endDate.getFullYear() + objective.targetYears)

          // Générer les dates mensuelles depuis la PREMIÈRE TRANSACTION (pour l'historique réel)
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
        } // Trouver la première transaction pour commencer la courbe objectif
        const firstTransactionDate =
          transactions.length > 0
            ? transactions.reduce(
                (earliest, t) => (t.date < earliest ? t.date : earliest),
                transactions[0].date
              )
            : today

        // Utiliser startDate de l'objectif ou la première transaction par défaut
        const objectiveStartDate = objective.startDate
          ? new Date(objective.startDate)
          : firstTransactionDate

        // Calculer les 2 courbes
        const realityData = calculateRealityChartData(dates, assets, transactions, today)
        const objectiveData = calculateObjectiveChartData(
          dates,
          currentWealth,
          objective,
          today,
          objectiveStartDate
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
