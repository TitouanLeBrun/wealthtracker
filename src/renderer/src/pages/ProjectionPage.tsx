import React, { useState, useEffect, useCallback } from 'react'
import {
  ObjectiveForm,
  DualCurveChart,
  ProjectionInsights,
  MonthlyInvestmentSimulator,
  type Objective
} from '../components/projection'

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
          {objective && <ObjectiveForm objective={objective} onUpdate={handleObjectiveUpdate} />}
        </div>
      </section>

      {/* Section 2 : Graphique & Insights */}
      <section className="mb-8">
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

      {/* Section 3 : Simulation Versements */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">💰 Simulation de Versements</h2>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <MonthlyInvestmentSimulator objective={objective} />
        </div>
      </section>
    </div>
  )
}
