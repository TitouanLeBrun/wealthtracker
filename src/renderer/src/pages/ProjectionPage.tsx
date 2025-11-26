import React, { useState, useEffect, useCallback } from 'react'
import {
  generateObjectiveCurve,
  calculateMonthlyPayment,
  calculateCAGR,
  formatEuros,
  formatPercent,
  type ProjectionPoint
} from '../utils/calculations/projectionUtils'

// Valeurs par défaut de l'objectif
const DEFAULT_OBJECTIVE = {
  targetAmount: 300000,
  targetYears: 25,
  interestRate: 8
}

// Type Objective (sync avec preload/index.d.ts)
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
  transactions: Transaction[]
}

interface Transaction {
  type: 'BUY' | 'SELL'
  quantity: number
  fee: number
  date: Date
}

/**
 * Page de Projection Financière
 * Permet de définir un objectif, visualiser la progression et simuler les versements nécessaires
 */
export default function ProjectionPage(): React.JSX.Element {
  const [objective, setObjective] = useState<Objective | null>(null)
  const [loading, setLoading] = useState(true)

  const loadCurrentObjective = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      const current = await window.api.getCurrentObjective()

      // Si aucun objectif n'existe, créer un objectif par défaut
      if (!current) {
        const newObjective = await window.api.createObjective(DEFAULT_OBJECTIVE)
        setObjective(newObjective)
      } else {
        setObjective(current)
      }
    } catch (error) {
      console.error('Error loading objective:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger l'objectif actuel au montage
  useEffect(() => {
    loadCurrentObjective()
  }, [loadCurrentObjective])

  const handleObjectiveUpdate = async (data: {
    targetAmount: number
    targetYears: number
    interestRate: number
  }): Promise<void> => {
    try {
      if (objective) {
        const updated = await window.api.updateObjective(objective.id, data)
        setObjective(updated)
      } else {
        const created = await window.api.createObjective(data)
        setObjective(created)
      }
    } catch (error) {
      console.error('Error updating objective:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">🎯</div>
          <p className="text-gray-500">Chargement de vos objectifs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="projection-page h-full overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">🎯 Projection Financière</h1>
        <p className="text-gray-600">Définissez votre objectif et visualisez votre progression</p>
      </div>

      {/* Section 1 : Configuration de l'objectif */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">📝 Configuration de l&apos;Objectif</h2>
        <div className="rounded-lg bg-white p-6 shadow-md">
          {objective && (
            <ObjectiveFormPlaceholder objective={objective} onUpdate={handleObjectiveUpdate} />
          )}
        </div>
      </section>

      {/* Section 2 : Graphique & Insights */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">📈 Progression vs Objectif</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Graphique (2/3) */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <DualCurveChartPlaceholder objective={objective} />
            </div>
          </div>

          {/* Insights (1/3) */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <ProjectionInsightsPlaceholder objective={objective} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 : Simulation Versements */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">💰 Simulation de Versements</h2>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <MonthlyInvestmentSimulatorPlaceholder objective={objective} />
        </div>
      </section>
    </div>
  )
}

/**
 * PLACEHOLDERS - À remplacer par les vrais composants
 */

interface ObjectiveFormPlaceholderProps {
  objective: Objective
  onUpdate: (data: { targetAmount: number; targetYears: number; interestRate: number }) => void
}

function ObjectiveFormPlaceholder({
  objective,
  onUpdate
}: ObjectiveFormPlaceholderProps): React.JSX.Element {
  const [targetAmount, setTargetAmount] = useState(objective.targetAmount)
  const [targetYears, setTargetYears] = useState(objective.targetYears)
  const [interestRate, setInterestRate] = useState(objective.interestRate)

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    onUpdate({ targetAmount, targetYears, interestRate })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Montant cible */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Montant cible (€)</label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="1000"
            step="1000"
          />
        </div>

        {/* Durée */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Durée (années)</label>
          <input
            type="number"
            value={targetYears}
            onChange={(e) => setTargetYears(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="1"
            max="70"
          />
        </div>

        {/* Taux d'intérêt */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Taux d&apos;intérêt (%)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            min="1"
            max="50"
            step="0.1"
          />
        </div>
      </div>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Mettre à jour l&apos;objectif
      </button>
    </form>
  )
}

function DualCurveChartPlaceholder({
  objective
}: {
  objective: Objective | null
}): React.JSX.Element {
  const [objectiveCurve, setObjectiveCurve] = useState<ProjectionPoint[]>([])
  const [realityCurve, setRealityCurve] = useState<ProjectionPoint[]>([])

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        // Charger les assets avec transactions
        const allAssets = await window.api.getAllAssets()
        const allTransactions = await window.api.getAllTransactions()

        // Grouper transactions par asset
        const assetsWithTransactions = allAssets.map((asset) => ({
          ...asset,
          transactions: allTransactions.filter((t) => t.assetId === asset.id)
        }))

        // Générer courbe objectif si objectif existe
        if (objective && assetsWithTransactions.length > 0) {
          // Trouver date de première transaction
          const firstTransactionDate = allTransactions.reduce(
            (earliest, t) => (t.date < earliest ? t.date : earliest),
            allTransactions[0]?.date || new Date()
          )

          // Calculer patrimoine actuel
          const currentWealth = calculateCurrentWealth(assetsWithTransactions)

          // Calculer versement mensuel nécessaire
          const monthlyPayment = calculateMonthlyPayment(
            currentWealth,
            objective.targetAmount,
            objective.interestRate,
            objective.targetYears
          )

          // Générer courbe objectif
          const curve = generateObjectiveCurve(
            firstTransactionDate,
            {
              targetAmount: objective.targetAmount,
              targetYears: objective.targetYears,
              interestRate: objective.interestRate
            },
            currentWealth,
            monthlyPayment
          )

          setObjectiveCurve(curve)

          // Générer courbe réalité (historique simplifié pour MVP)
          // TODO: Implémenter le calcul rétroactif complet basé sur transactions
          const now = new Date()
          setRealityCurve([
            { date: firstTransactionDate, value: 0 },
            { date: now, value: currentWealth }
          ])
        }
      } catch (error) {
        console.error('Error loading chart data:', error)
      }
    }

    loadData()
  }, [objective])

  const calculateCurrentWealth = (assets: Asset[]): number => {
    let totalValue = 0
    assets.forEach((asset) => {
      let quantity = 0
      asset.transactions.forEach((t) => {
        if (t.type === 'BUY') {
          quantity += t.quantity
        } else if (t.type === 'SELL') {
          quantity -= t.quantity
        }
      })
      totalValue += quantity * asset.currentPrice
    })
    return totalValue
  }

  if (!objective || objectiveCurve.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="mb-2 text-4xl">📊</div>
          <p className="text-gray-500">Graphique dual-courbe</p>
          <p className="mt-2 text-sm text-gray-400">
            Ajoutez des transactions pour voir la projection
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-4 font-semibold">Projection vs Réalité</h3>
      <div className="h-96 rounded-lg bg-gradient-to-br from-blue-50 to-green-50 p-6">
        <div className="mb-4 flex justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-600"></div>
            <span className="text-sm">Objectif théorique</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-600"></div>
            <span className="text-sm">Réalité</span>
          </div>
        </div>

        {/* Graphique simplifié - TODO: Intégrer TradingView ou Chart.js */}
        <div className="flex h-64 items-end justify-between gap-1">
          {objectiveCurve.slice(0, 50).map((point, idx) => {
            const height = (point.value / objective.targetAmount) * 100
            const realPoint = realityCurve.find(
              (r) => Math.abs(r.date.getTime() - point.date.getTime()) < 30 * 24 * 60 * 60 * 1000
            )
            const realHeight = realPoint ? (realPoint.value / objective.targetAmount) * 100 : 0

            return (
              <div key={idx} className="relative flex-1">
                <div
                  className="absolute bottom-0 w-full bg-blue-400 opacity-50"
                  style={{ height: `${Math.min(height, 100)}%` }}
                ></div>
                <div
                  className="absolute bottom-0 w-full bg-green-600 opacity-70"
                  style={{ height: `${Math.min(realHeight, 100)}%` }}
                ></div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 text-center text-xs text-gray-600">
          <p>
            De {objectiveCurve[0]?.date.toLocaleDateString('fr-FR')} à{' '}
            {objectiveCurve[objectiveCurve.length - 1]?.date.toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </div>
  )
}

function ProjectionInsightsPlaceholder({
  objective
}: {
  objective: Objective | null
}): React.JSX.Element {
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
        <div className="rounded-lg bg-white p-4 border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Statut</p>
          <p className={`text-sm font-semibold ${statusColor}`}>{status}</p>
        </div>
      </div>
    </div>
  )
}

function MonthlyInvestmentSimulatorPlaceholder({
  objective
}: {
  objective: Objective | null
}): React.JSX.Element {
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [categories, setCategories] = useState<{ name: string; amount: number; color: string }[]>(
    []
  )

  useEffect(() => {
    const loadSimulation = async (): Promise<void> => {
      try {
        if (!objective) return

        // Charger données
        const allAssets = await window.api.getAllAssets()
        const allTransactions = await window.api.getAllTransactions()
        const allCategories = await window.api.getAllCategories()

        // Calculer patrimoine actuel
        const assetsWithTransactions = allAssets.map((asset) => ({
          ...asset,
          transactions: allTransactions.filter((t) => t.assetId === asset.id)
        }))

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

        // Calculer versement mensuel nécessaire
        const payment = calculateMonthlyPayment(
          wealth,
          objective.targetAmount,
          objective.interestRate,
          objective.targetYears
        )
        setMonthlyPayment(payment)
        setMonthlyPayment(payment)

        // Calculer répartition par catégorie (basé sur allocation actuelle)
        const categoryAllocations = new Map<number, number>()
        assetsWithTransactions.forEach((asset) => {
          let quantity = 0
          asset.transactions.forEach((t) => {
            if (t.type === 'BUY') quantity += t.quantity
            else if (t.type === 'SELL') quantity -= t.quantity
          })
          const value = quantity * asset.currentPrice
          const current = categoryAllocations.get(asset.categoryId) || 0
          categoryAllocations.set(asset.categoryId, current + value)
        })

        // Convertir en pourcentages et calculer montants
        const totalValue = wealth > 0 ? wealth : 1 // Éviter division par 0
        const categoryBreakdown = allCategories.map((cat) => {
          const catValue = categoryAllocations.get(cat.id) || 0
          const percentage = (catValue / totalValue) * 100
          const amount = (payment * percentage) / 100

          return {
            name: cat.name,
            amount: amount,
            color: cat.color
          }
        })

        setCategories(categoryBreakdown.filter((c) => c.amount > 0))
      } catch (error) {
        console.error('Error loading simulation:', error)
      }
    }

    loadSimulation()
  }, [objective])

  if (!objective) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="mb-2 text-4xl">💰</div>
          <p className="text-gray-500">Définissez un objectif pour voir la simulation</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">💰 Simulation de Versements Mensuels</h3>

      {/* Résumé principal */}
      <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 p-6">
        <div className="mb-2 text-sm text-gray-700">
          Pour atteindre{' '}
          <span className="font-bold text-blue-700">{formatEuros(objective.targetAmount)}</span> en{' '}
          <span className="font-bold text-purple-700">{objective.targetYears} ans</span> avec un
          taux de <span className="font-bold text-green-700">{objective.interestRate}%</span>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Versement mensuel recommandé</p>
          <p className="text-4xl font-bold text-blue-700">{formatEuros(monthlyPayment)}</p>
          <p className="mt-2 text-xs text-gray-500">
            Total sur {objective.targetYears} ans :{' '}
            {formatEuros(monthlyPayment * 12 * objective.targetYears)}
          </p>
        </div>
      </div>

      {/* Répartition par catégorie */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-700">
          💡 Répartition suggérée par catégorie
        </h4>
        {categories.length === 0 ? (
          <div className="rounded-lg bg-yellow-50 p-4 text-center">
            <p className="text-sm text-yellow-700">
              Aucune donnée historique. Ajoutez des transactions pour calculer la répartition
              optimale.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat, idx) => {
              const percentage = (cat.amount / monthlyPayment) * 100
              return (
                <div key={idx} className="rounded-lg bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      ></div>
                      <span className="font-medium text-gray-800">{cat.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: cat.color
                        }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {formatEuros(cat.amount)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Note informative */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <p className="text-xs text-blue-800">
          ℹ️ <span className="font-semibold">Note :</span> Cette simulation est basée sur votre
          allocation actuelle et les intérêts composés. Les versements réels peuvent varier selon
          vos performances et votre stratégie d&apos;investissement.
        </p>
      </div>
    </div>
  )
}
