import React, { useState, useEffect, useCallback } from 'react'
import {
  ObjectiveForm,
  DualCurveChart,
  InvestmentBreakdownChart,
  ProjectionInsights,
  MonthlyInvestmentSimulator,
  type Objective
} from '../components/projection'
import CategoryPieChart from '../components/category/CategoryPieChart'
import type { CategoryValue } from '../types'

interface ProjectionPageProps {
  onCategoryClick: (categoryId: number) => void
}

// Valeurs par défaut de l'objectif
const DEFAULT_OBJECTIVE = {
  targetAmount: 300000,
  targetYears: 25,
  interestRate: 8
}

/**
 * Page de Projection Financière
 * Permet de définir un objectif, visualiser la progression et simuler les versements nécessaires
 */
export default function ProjectionPage({
  onCategoryClick
}: ProjectionPageProps): React.JSX.Element {
  const [objective, setObjective] = useState<Objective | null>(null)
  const [loading, setLoading] = useState(true)
  const [categoryValues, setCategoryValues] = useState<CategoryValue[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

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

  // Charger les catégories et calculer les valeurs
  useEffect(() => {
    const loadCategoryValues = async (): Promise<void> => {
      try {
        setLoadingCategories(true)
        const [assets, transactions, categories] = await Promise.all([
          window.api.getAllAssets(),
          window.api.getAllTransactions(),
          window.api.getAllCategories()
        ])

        const values = categories.map((category) => {
          const categoryAssets = assets.filter((a) => a.categoryId === category.id)
          const assetValues: {
            assetId: number
            name: string
            ticker: string
            netQuantity: number
            currentPrice: number
            totalValue: number
            percentage: number
          }[] = []

          const totalValue = categoryAssets.reduce((sum, asset) => {
            const assetTransactions = transactions.filter((t) => t.assetId === asset.id)
            const netQuantity = assetTransactions.reduce((qty, t) => {
              return t.type === 'BUY' ? qty + t.quantity : qty - t.quantity
            }, 0)
            const value = netQuantity * asset.currentPrice

            if (netQuantity > 0) {
              assetValues.push({
                assetId: asset.id,
                name: asset.name,
                ticker: asset.ticker,
                netQuantity: netQuantity,
                currentPrice: asset.currentPrice,
                totalValue: value,
                percentage: 0 // Sera calculé après
              })
            }

            return sum + value
          }, 0)

          // Calculer les pourcentages des actifs
          assetValues.forEach((av) => {
            av.percentage = totalValue > 0 ? (av.totalValue / totalValue) * 100 : 0
          })

          return {
            categoryId: category.id,
            categoryName: category.name,
            totalValue,
            color: category.color,
            assetCount: assetValues.length,
            percentage: 0,
            assets: assetValues
          }
        })

        const total = values.reduce((sum, v) => sum + v.totalValue, 0)
        values.forEach((v) => {
          v.percentage = total > 0 ? (v.totalValue / total) * 100 : 0
        })

        setCategoryValues(values.filter((v) => v.totalValue > 0))
      } catch (error) {
        console.error('Error loading category values:', error)
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategoryValues()
  }, [])

  const handleObjectiveUpdate = async (data: {
    targetAmount: number
    targetYears: number
    interestRate: number
    startDate?: Date | null
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
    <div className="projection-page h-full overflow-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">🎯 Projection Financière</h1>
        <p className="text-gray-600">Définissez votre objectif et visualisez votre progression</p>
      </div>

      {/* Section 1 : Configuration de l'objectif */}
      <section className="mb-6">
        {objective && <ObjectiveForm objective={objective} onUpdate={handleObjectiveUpdate} />}
      </section>

      {/* Section 2 : Graphique & Insights */}
      <section className="mb-6">
        <h2 className="mb-4 text-xl font-semibold">📈 Progression vs Objectif</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Graphique (2/3) */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <DualCurveChart objective={objective} />
            </div>
          </div>

          {/* Insights (1/3) */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <ProjectionInsights objective={objective} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2.5 : Graphique Capital vs Intérêts */}
      <section className="mb-6">
        <InvestmentBreakdownChart objective={objective} />
      </section>

      {/* Section 2.6 : Répartition par Catégorie */}
      {!loadingCategories && categoryValues.length > 0 && (
        <section className="mb-6">
          <CategoryPieChart categoryValues={categoryValues} onCategoryClick={onCategoryClick} />
        </section>
      )}

      {/* Section 3 : Simulation Versements */}
      <section className="mb-6">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <MonthlyInvestmentSimulator objective={objective} />
        </div>
      </section>
    </div>
  )
}
