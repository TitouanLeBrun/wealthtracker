import React, { useState, useEffect } from 'react'
import { calculateMonthlyPayment, formatEuros } from '../../utils/calculations/projectionUtils'

interface Objective {
  id: number
  targetAmount: number
  targetYears: number
  interestRate: number
  createdAt: Date
  updatedAt: Date
}

interface MonthlyInvestmentSimulatorProps {
  objective: Objective | null
}

interface CategoryBreakdown {
  name: string
  amount: number
  color: string
}

/**
 * Simulateur de versements mensuels avec répartition par catégorie
 */
function MonthlyInvestmentSimulator({
  objective
}: MonthlyInvestmentSimulatorProps): React.JSX.Element {
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [currentWealth, setCurrentWealth] = useState(0)
  const [categories, setCategories] = useState<CategoryBreakdown[]>([])
  const [objectiveAlreadyReached, setObjectiveAlreadyReached] = useState(false)

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

        setCurrentWealth(wealth)

        // Calculer la valeur future du patrimoine actuel avec intérêts composés
        const annualRate = objective.interestRate / 100
        const futureValueWithoutPayments = wealth * Math.pow(1 + annualRate, objective.targetYears)

        // Vérifier si l'objectif est déjà atteignable sans versements supplémentaires
        if (futureValueWithoutPayments >= objective.targetAmount) {
          setObjectiveAlreadyReached(true)
          setMonthlyPayment(0)
          setCategories([])
          return
        }

        setObjectiveAlreadyReached(false)

        // Calculer versement mensuel nécessaire
        const payment = calculateMonthlyPayment(
          wealth,
          objective.targetAmount,
          objective.interestRate,
          objective.targetYears
        )
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

      {/* Cas 1 : Objectif déjà atteignable */}
      {objectiveAlreadyReached ? (
        <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 p-8">
          <div className="mb-4 text-center">
            <div className="mb-3 text-6xl">🎉</div>
            <h4 className="mb-2 text-2xl font-bold text-green-800">
              Félicitations ! Objectif déjà sur la bonne voie
            </h4>
            <p className="text-green-700">
              Votre patrimoine actuel de{' '}
              <span className="font-bold">{formatEuros(currentWealth)}</span> avec un taux de
              croissance de <span className="font-bold">{objective.interestRate}%</span> par an
              permettra d&apos;atteindre votre objectif de{' '}
              <span className="font-bold">{formatEuros(objective.targetAmount)}</span> en{' '}
              <span className="font-bold">{objective.targetYears} ans</span> sans versements
              supplémentaires.
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-white/50 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Patrimoine actuel</p>
                <p className="text-xl font-bold text-gray-900">{formatEuros(currentWealth)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Valeur future estimée</p>
                <p className="text-xl font-bold text-green-700">
                  {formatEuros(
                    currentWealth *
                      Math.pow(1 + objective.interestRate / 100, objective.targetYears)
                  )}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Objectif</p>
                <p className="text-xl font-bold text-blue-700">
                  {formatEuros(objective.targetAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <p className="text-xs text-blue-800">
              💡 <span className="font-semibold">Conseil :</span> Vous pouvez continuer à investir
              pour dépasser votre objectif ou réviser votre objectif à la hausse pour viser plus
              grand !
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Cas 2 : Versements nécessaires */}
          {/* Résumé principal */}
          <div className="mb-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="mb-2 text-sm text-gray-700">
              Pour atteindre{' '}
              <span className="font-bold text-blue-700">{formatEuros(objective.targetAmount)}</span>{' '}
              en <span className="font-bold text-purple-700">{objective.targetYears} ans</span> avec
              un taux de <span className="font-bold text-green-700">{objective.interestRate}%</span>
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
              allocation actuelle et les intérêts composés. Les versements réels peuvent varier
              selon vos performances et votre stratégie d&apos;investissement.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default MonthlyInvestmentSimulator
