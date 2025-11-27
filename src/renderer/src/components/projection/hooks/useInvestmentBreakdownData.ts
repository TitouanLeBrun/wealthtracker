import { useState, useEffect, useMemo } from 'react'
import {
  generateTimeRangeDates,
  calculateObjectiveChartData,
  calculateInvestedCapitalData,
  calculateInterestEarnedData,
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
  pricePerUnit: number
  fee: number
  date: Date
}

interface UseInvestmentBreakdownDataProps {
  timeRange: TimeRange
  objective: Objective
  assets: ProjectionAsset[]
  transactions: ProjectionTransaction[]
}

/**
 * Hook pour calculer les données du graphique Capital/Intérêts
 */
export function useInvestmentBreakdownData({
  timeRange,
  objective,
  assets,
  transactions
}: UseInvestmentBreakdownDataProps): ProjectionChartData | null {
  const [chartData, setChartData] = useState<ProjectionChartData | null>(null)
  const [loading, setLoading] = useState(true)

  // Calculer le patrimoine actuel
  const currentWealth = useMemo(() => {
    const wealth = assets.reduce((sum, asset) => {
      const assetTransactions = transactions.filter((t) => t.assetId === asset.id)
      const netQuantity = assetTransactions.reduce((qty, t) => {
        return t.type === 'BUY' ? qty + t.quantity : qty - t.quantity
      }, 0)
      return sum + netQuantity * asset.currentPrice
    }, 0)

    return wealth
  }, [assets, transactions])

  useEffect(() => {
    const calculateData = async (): Promise<void> => {
      setLoading(true)
      try {
        const config = TIME_RANGE_CONFIGS[timeRange]
        const today = new Date()

        // ⚠️ IMPORTANT : Le graphique Capital/Intérêts commence AUJOURD'HUI
        // On ne projette que dans le futur
        let dates: Date[]

        if (config.isFullRange) {
          // Pour MAX : d'aujourd'hui jusqu'à la fin de l'objectif
          const endDate = new Date(today)
          endDate.setFullYear(endDate.getFullYear() + objective.targetYears)

          dates = []
          const current = new Date(today.getFullYear(), today.getMonth(), 1)

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
          // Pour les autres plages : uniquement les dates futures
          dates = generateTimeRangeDates(config, today)
          // Filtrer pour ne garder que aujourd'hui et les dates futures
          dates = dates.filter((date) => date >= today)
        }

        // Calculer les 3 courbes : Objectif → Capital → Intérêts
        const objectiveData = calculateObjectiveChartData(
          dates,
          currentWealth,
          objective,
          today,
          today // Commencer aujourd'hui pour le graphique Capital/Intérêts
        )
        const capitalData = calculateInvestedCapitalData(
          dates,
          currentWealth,
          objective,
          today,
          today // Commencer aujourd'hui
        )
        const interestData = calculateInterestEarnedData(dates, objectiveData, capitalData)

        const todayMarker = formatDateForChart(today)

        setChartData({
          realityData: capitalData, // Capital investi (orange)
          objectiveData: interestData, // Intérêts reçus (vert)
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
  }, [timeRange, objective, currentWealth, transactions])

  return loading ? null : chartData
}
