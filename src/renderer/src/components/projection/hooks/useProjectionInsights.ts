import { useState, useEffect } from 'react'
import {
  calculateMonthlyPayment,
  calculateFutureValue
} from '../../../utils/calculations/projectionUtils'
import type { Objective } from '../types'

export interface TrajectoryStatus {
  level: 'excellent' | 'good' | 'warning' | 'critical' | 'behind'
  icon: string
  title: string
  description: string
  color: string
  bgColor: string
}

export interface ProjectionMetrics {
  currentWealth: number
  theoreticalWealth: number
  wealthDelta: number
  wealthDeltaPercent: number
  remainingToTarget: number
  remainingPercent: number
  theoreticalMonthlyInvestment: number
  requiredMonthlyInvestment: number
  monthlyInvestmentDelta: number
  monthlyInvestmentDeltaPercent: number
  historicalMonthlyInvestment: number // Montant moyen investi par mois historiquement
  historicalVsRequired: number // Delta entre historique et requis
  historicalVsRequiredPercent: number // Delta en %
  trajectoryStatus: TrajectoryStatus
}

/**
 * Détermine le statut de la trajectoire en comparant le patrimoine actuel
 * avec le patrimoine théorique attendu ET le rythme d'investissement historique
 */
function determineTrajectoryStatus(
  currentWealth: number,
  theoreticalWealth: number,
  deltaPercent: number,
  historicalMonthlyInvestment: number,
  requiredMonthlyInvestment: number,
  yearsElapsed: number
): TrajectoryStatus {
  // CAS SPÉCIAL : Objectif démarre "aujourd'hui" mais patrimoine existant
  // Si l'objectif vient de démarrer (< 1 mois) mais qu'il y a un patrimoine existant
  const isRecentStart = yearsElapsed < 0.1 // Moins de ~1 mois
  const hasExistingWealth = currentWealth > 0

  if (isRecentStart && hasExistingWealth) {
    // Analyser le rythme historique vs requis
    const historicalVsRequiredPercent =
      requiredMonthlyInvestment > 0
        ? ((historicalMonthlyInvestment - requiredMonthlyInvestment) / requiredMonthlyInvestment) *
          100
        : 0

    // Si le rythme historique est insuffisant pour l'objectif
    if (historicalVsRequiredPercent < -20) {
      return {
        level: 'warning',
        icon: '⚡',
        title: 'Patrimoine existant, rythme insuffisant',
        description: `Vous avez déjà ${currentWealth.toFixed(0)}€, mais votre rythme d'investissement historique (${historicalMonthlyInvestment.toFixed(0)}€/mois) est insuffisant pour atteindre cet objectif. Il faudra investir ${requiredMonthlyInvestment.toFixed(0)}€/mois.`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200'
      }
    }

    // Si le rythme historique est suffisant
    return {
      level: 'good',
      icon: '💪',
      title: 'Bon départ avec patrimoine existant',
      description: `Vous partez avec ${currentWealth.toFixed(0)}€ déjà constitués. Votre rythme d'investissement historique (${historicalMonthlyInvestment.toFixed(0)}€/mois) est compatible avec cet objectif.`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    }
  }

  // LOGIQUE NORMALE : Objectif en cours depuis un certain temps

  // Objectif déjà atteint
  if (currentWealth >= theoreticalWealth * 1.5) {
    return {
      level: 'excellent',
      icon: '🎉',
      title: 'Largement en avance !',
      description:
        "Vous êtes bien au-delà de la trajectoire théorique. Votre patrimoine dépasse largement l'objectif prévu à ce stade.",
      color: 'text-green-700',
      bgColor: 'bg-green-50 border-green-200'
    }
  }

  // En avance sur la trajectoire
  if (deltaPercent >= 10) {
    return {
      level: 'excellent',
      icon: '🚀',
      title: 'En avance sur la trajectoire',
      description:
        'Excellente progression ! Votre patrimoine dépasse la trajectoire théorique de plus de 10%. Continuez ainsi.',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200'
    }
  }

  // Légèrement en avance
  if (deltaPercent >= 0) {
    return {
      level: 'good',
      icon: '📈',
      title: 'Sur la bonne trajectoire',
      description:
        "Vous êtes aligné avec la trajectoire théorique. Votre progression est conforme à l'objectif fixé.",
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200'
    }
  }

  // Légèrement en retard (-10% à 0%)
  if (deltaPercent >= -10) {
    return {
      level: 'warning',
      icon: '⚠️',
      title: 'Légèrement en retard',
      description:
        "Vous êtes légèrement en dessous de la trajectoire théorique. Un petit effort d'investissement supplémentaire pourrait vous remettre sur la bonne voie.",
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200'
    }
  }

  // Retard significatif (-25% à -10%)
  if (deltaPercent >= -25) {
    return {
      level: 'critical',
      icon: '🔴',
      title: 'Retard significatif',
      description:
        "Votre patrimoine est en retard sur la trajectoire théorique. Il est recommandé d'augmenter vos investissements mensuels pour atteindre l'objectif.",
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200'
    }
  }

  // Très en retard (< -25%)
  return {
    level: 'behind',
    icon: '❌',
    title: 'Très en retard',
    description:
      "Votre trajectoire nécessite un ajustement important. Envisagez de revoir votre stratégie d'investissement ou l'échéance de votre objectif.",
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-300'
  }
}

/**
 * Hook personnalisé pour calculer tous les insights de projection
 */
export function useProjectionInsights(objective: Objective | null): ProjectionMetrics | null {
  const [metrics, setMetrics] = useState<ProjectionMetrics | null>(null)

  useEffect(() => {
    const loadInsights = async (): Promise<void> => {
      try {
        if (!objective) {
          setMetrics(null)
          return
        }

        // Charger assets et transactions
        const allAssets = await window.api.getAllAssets()
        const allTransactions = await window.api.getAllTransactions()

        if (allTransactions.length === 0) {
          setMetrics(null)
          return
        }

        // Grouper transactions par asset
        const assetsWithTransactions = allAssets.map((asset) => ({
          ...asset,
          transactions: allTransactions.filter((t) => t.assetId === asset.id)
        }))

        // 1. Calculer patrimoine actuel
        let currentWealth = 0
        assetsWithTransactions.forEach((asset) => {
          let quantity = 0
          asset.transactions.forEach((t) => {
            if (t.type === 'BUY') {
              quantity += t.quantity
            } else if (t.type === 'SELL') {
              quantity -= t.quantity
            }
          })
          currentWealth += quantity * asset.currentPrice
        })

        // 2. Calculer le temps écoulé depuis le début
        const startDate = objective.startDate
          ? new Date(objective.startDate)
          : new Date(
              allTransactions.reduce(
                (earliest, t) => (t.date < earliest ? t.date : earliest),
                allTransactions[0].date
              )
            )

        const now = new Date()
        const yearsElapsed = (now.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)

        // 2b. Calculer l'investissement mensuel historique moyen
        // Somme totale investie (achats uniquement)
        const totalInvested = allTransactions
          .filter((t) => t.type === 'BUY')
          .reduce((sum, t) => sum + t.quantity * t.pricePerUnit + t.fee, 0)

        // Calculer le nombre de mois depuis la première transaction
        const firstTransactionDate = new Date(
          allTransactions.reduce(
            (earliest, t) => (t.date < earliest ? t.date : earliest),
            allTransactions[0].date
          )
        )
        const monthsElapsed = Math.max(
          1,
          (now.getTime() - firstTransactionDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000)
        )

        const historicalMonthlyInvestment = totalInvested / monthsElapsed

        // 3. Calculer le patrimoine théorique attendu à ce jour
        // PMT théorique initial (ce qui devait être investi chaque mois)
        const theoreticalMonthlyInvestment = calculateMonthlyPayment(
          0, // On part de zéro
          objective.targetAmount,
          objective.interestRate,
          objective.targetYears
        )

        // Patrimoine théorique = ce qu'on devrait avoir après X mois d'investissement théorique
        const theoreticalWealth = calculateFutureValue(
          0,
          theoreticalMonthlyInvestment,
          objective.interestRate,
          yearsElapsed
        )

        // 4. Calculer le delta entre réel et théorique
        const wealthDelta = currentWealth - theoreticalWealth
        const wealthDeltaPercent =
          theoreticalWealth > 0 ? (wealthDelta / theoreticalWealth) * 100 : 0

        // 5. Calculer ce qu'il reste à atteindre
        const remainingToTarget = objective.targetAmount - currentWealth
        const remainingPercent = (currentWealth / objective.targetAmount) * 100

        // 6. Calculer l'investissement mensuel requis pour atteindre l'objectif
        const yearsRemaining = objective.targetYears - yearsElapsed
        let requiredMonthlyInvestment = 0

        // Si objectif déjà atteint, pas besoin d'investir davantage
        if (currentWealth >= objective.targetAmount) {
          requiredMonthlyInvestment = 0
        } else if (yearsRemaining > 0) {
          requiredMonthlyInvestment = calculateMonthlyPayment(
            currentWealth,
            objective.targetAmount,
            objective.interestRate,
            yearsRemaining
          )
          // S'assurer que le montant requis est toujours positif
          requiredMonthlyInvestment = Math.max(0, requiredMonthlyInvestment)
        }

        // 7. Delta entre investissement théorique et requis
        const monthlyInvestmentDelta = requiredMonthlyInvestment - theoreticalMonthlyInvestment
        const monthlyInvestmentDeltaPercent =
          theoreticalMonthlyInvestment > 0
            ? (monthlyInvestmentDelta / theoreticalMonthlyInvestment) * 100
            : 0

        // 7b. Delta entre investissement historique et requis
        const historicalVsRequired = requiredMonthlyInvestment - historicalMonthlyInvestment
        const historicalVsRequiredPercent =
          historicalMonthlyInvestment > 0
            ? (historicalVsRequired / historicalMonthlyInvestment) * 100
            : 0

        // 8. Déterminer le statut de la trajectoire
        const trajectoryStatus = determineTrajectoryStatus(
          currentWealth,
          theoreticalWealth,
          wealthDeltaPercent,
          historicalMonthlyInvestment,
          requiredMonthlyInvestment,
          yearsElapsed
        )

        setMetrics({
          currentWealth,
          theoreticalWealth,
          wealthDelta,
          wealthDeltaPercent,
          remainingToTarget,
          remainingPercent,
          theoreticalMonthlyInvestment,
          requiredMonthlyInvestment,
          monthlyInvestmentDelta,
          monthlyInvestmentDeltaPercent,
          historicalMonthlyInvestment,
          historicalVsRequired,
          historicalVsRequiredPercent,
          trajectoryStatus
        })
      } catch (error) {
        console.error('Error loading insights:', error)
        setMetrics(null)
      }
    }

    loadInsights()
  }, [objective])

  return metrics
}
