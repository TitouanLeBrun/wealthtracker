import React, { useState, useEffect } from 'react'
import { calculateCAGR, formatEuros, formatPercent } from '../../utils/calculations/projectionUtils'

interface Objective {
  id: number
  targetAmount: number
  targetYears: number
  interestRate: number
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
  const [currentWealth, setCurrentWealth] = useState(0)
  const [targetWealth, setTargetWealth] = useState(0)
  const [delta, setDelta] = useState(0)
  const [cagr, setCagr] = useState(0)
  const [status, setStatus] = useState('')
  const [statusColor, setStatusColor] = useState('')

  useEffect(() => {
    const loadInsights = async (): Promise<void> => {
      try {
        if (!objective) return

        // Charger assets et transactions
        const allAssets = await window.api.getAllAssets()
        const allTransactions = await window.api.getAllTransactions()

        // Grouper transactions par asset
        const assetsWithTransactions = allAssets.map((asset) => ({
          ...asset,
          transactions: allTransactions.filter((t) => t.assetId === asset.id)
        }))

        // Calculer patrimoine actuel
        let wealth = 0
        assetsWithTransactions.forEach((asset) => {
          let quantity = 0
          asset.transactions.forEach((t) => {
            if (t.type === 'BUY') {
              quantity += t.quantity
            } else if (t.type === 'SELL') {
              quantity -= t.quantity
            }
          })
          wealth += quantity * asset.currentPrice
        })

        setCurrentWealth(wealth)
        setTargetWealth(objective.targetAmount)

        // Calculer delta
        const diff = objective.targetAmount - wealth
        setDelta(diff)

        // Calculer CAGR (basé sur première transaction)
        if (allTransactions.length > 0) {
          const firstDate = allTransactions.reduce(
            (earliest, t) => (t.date < earliest ? t.date : earliest),
            allTransactions[0].date
          )
          const yearsElapsed =
            (new Date().getTime() - new Date(firstDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)

          if (yearsElapsed > 0 && wealth > 0) {
            const totalInvested = allTransactions
              .filter((t) => t.type === 'BUY')
              .reduce((sum, t) => sum + t.quantity * t.pricePerUnit, 0)

            if (totalInvested > 0) {
              const calculatedCagr = calculateCAGR(totalInvested, wealth, yearsElapsed)
              setCagr(calculatedCagr)
            }
          }
        }

        // Déterminer statut
        const progression = (wealth / objective.targetAmount) * 100
        if (progression >= 100) {
          setStatus('🎉 Objectif atteint !')
          setStatusColor('text-green-600')
        } else if (progression >= 75) {
          setStatus('🚀 En très bonne voie')
          setStatusColor('text-green-500')
        } else if (progression >= 50) {
          setStatus('📈 Sur la bonne voie')
          setStatusColor('text-blue-600')
        } else if (progression >= 25) {
          setStatus('⚠️ Effort à intensifier')
          setStatusColor('text-orange-500')
        } else {
          setStatus('🔴 Début du parcours')
          setStatusColor('text-red-500')
        }
      } catch (error) {
        console.error('Error loading insights:', error)
      }
    }

    loadInsights()
  }, [objective])

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">📊 Analyse de la Progression</h3>
      <div className="space-y-3">
        {/* Patrimoine actuel */}
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-gray-600">Patrimoine actuel</p>
          <p className="text-2xl font-bold text-blue-600">{formatEuros(currentWealth)}</p>
        </div>

        {/* Objectif */}
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-gray-600">Objectif cible</p>
          <p className="text-2xl font-bold text-green-600">{formatEuros(targetWealth)}</p>
        </div>

        {/* Delta */}
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-600">Reste à atteindre</p>
          <p className={`text-2xl font-bold ${delta > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {formatEuros(Math.abs(delta))}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {((currentWealth / targetWealth) * 100).toFixed(1)}% complété
          </p>
        </div>

        {/* CAGR */}
        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-sm text-gray-600">Taux de croissance (CAGR)</p>
          <p className="text-lg font-semibold text-purple-600">{formatPercent(cagr)}</p>
        </div>

        {/* Statut */}
        <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
          <p className="mb-2 text-sm text-gray-600">Statut</p>
          <p className={`text-sm font-semibold ${statusColor}`}>{status}</p>
        </div>
      </div>
    </div>
  )
}

export default ProjectionInsights
