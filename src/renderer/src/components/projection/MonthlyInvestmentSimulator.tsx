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
  const [categories, setCategories] = useState<CategoryBreakdown[]>([])

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

export default MonthlyInvestmentSimulator
