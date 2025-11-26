import React, { useState, useEffect } from 'react'
import {
  calculateHistoricalWealth,
  calculateObjectiveProjection,
  getFirstTransactionDate,
  type ObjectiveParams
} from '../../utils/calculations/projectionUtils'
import ProjectionChart from './ProjectionChart'

interface Objective {
  id: number
  targetAmount: number
  targetYears: number
  interestRate: number
  createdAt: Date
  updatedAt: Date
}

interface DualCurveChartProps {
  objective: Objective | null
}

/**
 * Graphique dual-courbe : Objectif vs Réalité
 */
function DualCurveChart({ objective }: DualCurveChartProps): React.JSX.Element {
  const [realityData, setRealityData] = useState<Array<{ date: Date; value: number }>>([])
  const [objectiveData, setObjectiveData] = useState<Array<{ date: Date; value: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        if (!objective) {
          setLoading(false)
          return
        }

        setLoading(true)

        // Charger les assets avec transactions
        const allAssets = await window.api.getAllAssets()
        const allTransactions = await window.api.getAllTransactions()

        // Convertir les dates string en objets Date
        const transactionsWithDates = allTransactions.map((t) => ({
          ...t,
          date: new Date(t.date)
        }))

        // Vérifier s'il y a des transactions
        if (transactionsWithDates.length === 0) {
          // Pas de transactions : afficher seulement la projection future
          const now = new Date()
          const objectiveParams: ObjectiveParams = {
            targetAmount: objective.targetAmount,
            targetYears: objective.targetYears,
            interestRate: objective.interestRate
          }

          const projection = calculateObjectiveProjection(0, objectiveParams, now)
          setObjectiveData(projection)
          setRealityData([])
          setLoading(false)
          return
        }

        // Trouver la date de première transaction
        const firstDate = getFirstTransactionDate(transactionsWithDates)
        if (!firstDate) {
          setLoading(false)
          return
        }

        // Calculer le patrimoine historique mois par mois
        const now = new Date()
        const historicalWealth = calculateHistoricalWealth(
          allAssets,
          transactionsWithDates,
          firstDate,
          now
        )

        // Calculer le patrimoine actuel (dernière valeur de l'historique)
        const currentWealth = historicalWealth[historicalWealth.length - 1]?.value || 0

        // Générer la projection d'objectif
        const objectiveParams: ObjectiveParams = {
          targetAmount: objective.targetAmount,
          targetYears: objective.targetYears,
          interestRate: objective.interestRate
        }

        const projection = calculateObjectiveProjection(currentWealth, objectiveParams, firstDate)

        setRealityData(historicalWealth)
        setObjectiveData(projection)
      } catch (error) {
        console.error('Error loading chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [objective])

  if (!objective) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="mb-2 text-4xl">📊</div>
          <p className="text-gray-500">Graphique de projection</p>
          <p className="mt-2 text-sm text-gray-400">
            Définissez un objectif pour voir la projection
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-500">Chargement de la projection...</p>
        </div>
      </div>
    )
  }

  if (objectiveData.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="mb-4 text-4xl">📈</div>
          <p className="text-gray-500">Aucune donnée de projection disponible</p>
          <p className="mt-2 text-sm text-gray-400">Ajoutez des transactions pour commencer</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">📊 Projection vs Réalité</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-8 rounded bg-green-500"></div>
            <span className="text-sm text-gray-600">Patrimoine réel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-8 rounded border-2 border-dashed border-blue-500"></div>
            <span className="text-sm text-gray-600">Objectif théorique</span>
          </div>
        </div>
      </div>

      <ProjectionChart realityData={realityData} objectiveData={objectiveData} height={400} />

      {/* Info supplémentaire */}
      <div className="mt-4 rounded-lg bg-blue-50 p-3">
        <p className="text-xs text-blue-800">
          💡 <span className="font-semibold">Info :</span> La courbe verte représente votre
          patrimoine historique réel. La courbe bleue en pointillés montre la projection théorique
          nécessaire pour atteindre votre objectif de {objective.targetAmount.toLocaleString()} € en{' '}
          {objective.targetYears} ans.
        </p>
      </div>
    </div>
  )
}

export default DualCurveChart
