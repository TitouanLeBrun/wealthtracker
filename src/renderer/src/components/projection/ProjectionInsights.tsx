import React from 'react'
import { formatEuros } from '../../utils/calculations/projectionUtils'
import { useProjectionInsights } from './hooks/useProjectionInsights'
import TrajectoryStatusCard from './TrajectoryStatusCard'

interface Objective {
  id: number
  targetAmount: number
  targetYears: number
  interestRate: number
  startDate?: Date | null
  createdAt: Date
  updatedAt: Date
}

interface ProjectionInsightsProps {
  objective: Objective | null
}

/**
 * Panneau d'insights et analyse de la progression
 */
function ProjectionInsights({ objective }: ProjectionInsightsProps): React.JSX.Element {
  const metrics = useProjectionInsights(objective)

  if (!metrics) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">📊 Analyse de la Progression</h3>
        <p className="text-sm text-gray-500">
          Aucune donnée disponible. Ajoutez des transactions pour voir l&apos;analyse.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">📊 Analyse de la Progression</h3>

      {/* Statut de la trajectoire avec explication détaillée */}
      <TrajectoryStatusCard status={metrics.trajectoryStatus} />

      <div className="space-y-3">
        {/* Patrimoine actuel (avec comparaison théorique si objectif commencé) */}
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          {/* Si objectif vient de démarrer (< 1 mois), afficher uniquement patrimoine actuel */}
          {metrics.theoreticalWealth < 10 ? (
            <div>
              <p className="text-xs text-gray-600">Patrimoine de départ</p>
              <p className="text-base font-semibold text-blue-600">
                {formatEuros(metrics.currentWealth)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Objectif récemment démarré - construction de la trajectoire en cours
              </p>
            </div>
          ) : (
            <>
              {/* Si objectif en cours, afficher patrimoine actuel vs théorique */}
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-gray-600">Patrimoine actuel</p>
                  <p className="text-base font-semibold text-blue-600">
                    {formatEuros(metrics.currentWealth)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Théorique attendu</p>
                  <p className="text-base font-semibold text-gray-700">
                    {formatEuros(metrics.theoreticalWealth)}
                  </p>
                </div>
              </div>
              <div className="mt-1 flex items-center justify-end gap-2 text-xs">
                <span
                  className={`font-medium ${
                    metrics.wealthDelta >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metrics.wealthDelta >= 0 ? '+' : ''}
                  {formatEuros(metrics.wealthDelta)}
                </span>
                <span
                  className={`font-medium ${
                    metrics.wealthDeltaPercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  ({metrics.wealthDeltaPercent >= 0 ? '+' : ''}
                  {metrics.wealthDeltaPercent.toFixed(1)}%)
                </span>
              </div>
            </>
          )}
        </div>

        {/* Reste à atteindre (petit format) */}
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          <p className="text-xs text-gray-600">Reste à atteindre</p>
          <div className="flex items-baseline justify-between">
            <p
              className={`text-base font-semibold ${
                metrics.remainingToTarget > 0 ? 'text-orange-600' : 'text-green-600'
              }`}
            >
              {formatEuros(Math.abs(metrics.remainingToTarget))}
            </p>
            <p className="text-xs text-gray-500">{metrics.remainingPercent.toFixed(1)}% complété</p>
          </div>
        </div>

        {/* Investissements mensuels : Théorique vs Requis */}
        <div className="rounded-lg bg-purple-50 p-4">
          <p className="mb-3 text-sm font-medium text-purple-900">💰 Investissements Mensuels</p>

          <div className="space-y-3">
            {/* Historique */}
            <div>
              <p className="text-xs text-gray-600">Investissement historique moyen</p>
              <p className="text-lg font-semibold text-blue-700">
                {formatEuros(metrics.historicalMonthlyInvestment)}
                <span className="text-xs font-normal text-gray-500">/mois</span>
              </p>
            </div>

            {/* Théorique */}
            <div>
              <p className="text-xs text-gray-600">Investissement théorique initial</p>
              <p className="text-lg font-semibold text-purple-700">
                {formatEuros(metrics.theoreticalMonthlyInvestment)}
                <span className="text-xs font-normal text-gray-500">/mois</span>
              </p>
            </div>

            {/* Requis actuellement */}
            <div>
              <p className="text-xs text-gray-600">Investissement requis maintenant</p>
              {metrics.requiredMonthlyInvestment === 0 ? (
                <p className="text-lg font-semibold text-green-600">
                  Objectif atteint !
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    Plus besoin d&apos;investir
                  </span>
                </p>
              ) : (
                <p className="text-lg font-semibold text-purple-900">
                  {formatEuros(metrics.requiredMonthlyInvestment)}
                  <span className="text-xs font-normal text-gray-500">/mois</span>
                </p>
              )}
            </div>

            {/* Delta Historique vs Requis */}
            <div className="border-t border-purple-200 pt-2">
              <p className="text-xs text-gray-600">Historique vs Requis</p>
              {metrics.requiredMonthlyInvestment === 0 ? (
                <p className="text-sm text-green-600">
                  ✅ Objectif déjà atteint - Aucun investissement supplémentaire requis
                </p>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-base font-bold ${
                        metrics.historicalVsRequired > 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {metrics.historicalVsRequired >= 0 ? '+' : ''}
                      {formatEuros(metrics.historicalVsRequired)}
                      <span className="text-xs font-normal">/mois</span>
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        metrics.historicalVsRequiredPercent > 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      ({metrics.historicalVsRequiredPercent >= 0 ? '+' : ''}
                      {metrics.historicalVsRequiredPercent.toFixed(1)}%)
                    </span>
                  </div>
                  {metrics.historicalVsRequired > 0 && (
                    <p className="mt-1 text-xs text-gray-600">
                      Votre rythme historique est{' '}
                      <span className="font-semibold text-red-600">insuffisant</span>. Augmentez
                      vos investissements de{' '}
                      <span className="font-semibold text-red-600">
                        {formatEuros(Math.abs(metrics.historicalVsRequired))}
                      </span>
                      /mois
                    </p>
                  )}
                  {metrics.historicalVsRequired <= 0 && (
                    <p className="mt-1 text-xs text-gray-600">
                      Votre rythme historique est{' '}
                      <span className="font-semibold text-green-600">compatible</span> avec
                      l&apos;objectif
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Delta Théorique vs Requis */}
            <div className="border-t border-purple-200 pt-2">
              <p className="text-xs text-gray-600">Théorique vs Requis</p>
              {metrics.requiredMonthlyInvestment === 0 ? (
                <p className="text-sm text-green-600">
                  🎉 Félicitations ! Vous avez dépassé votre objectif
                </p>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-base font-bold ${
                        metrics.monthlyInvestmentDelta >= 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {metrics.monthlyInvestmentDelta >= 0 ? '+' : ''}
                      {formatEuros(metrics.monthlyInvestmentDelta)}
                      <span className="text-xs font-normal">/mois</span>
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        metrics.monthlyInvestmentDeltaPercent >= 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      ({metrics.monthlyInvestmentDeltaPercent >= 0 ? '+' : ''}
                      {metrics.monthlyInvestmentDeltaPercent.toFixed(1)}%)
                    </span>
                  </div>
                  {metrics.monthlyInvestmentDelta > 0 && (
                    <p className="mt-1 text-xs text-gray-600">
                      Vous devez investir{' '}
                      <span className="font-semibold text-red-600">
                        {formatEuros(metrics.monthlyInvestmentDelta)}
                      </span>{' '}
                      de plus par mois par rapport au plan initial
                    </p>
                  )}
                  {metrics.monthlyInvestmentDelta < 0 && (
                    <p className="mt-1 text-xs text-gray-600">
                      Vous pouvez investir{' '}
                      <span className="font-semibold text-green-600">
                        {formatEuros(Math.abs(metrics.monthlyInvestmentDelta))}
                      </span>{' '}
                      de moins par mois par rapport au plan initial
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectionInsights
