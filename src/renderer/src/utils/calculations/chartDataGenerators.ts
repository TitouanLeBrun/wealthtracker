/**
 * Génération des données pour les graphiques de projection
 */

import type { TimeRangeConfig, ChartDataPoint } from '@renderer/types/projection'
import type { ObjectiveParams } from './financialCalculations'
import { calculateMonthlyPayment } from './financialCalculations'
import { formatDateForChart, getMonthsDifference } from './dateUtils'
import { calculateWealthAtDate } from './wealthCalculations'

export interface ProjectionPoint {
  date: Date
  value: number
}

/**
 * Génère les points de la courbe d'objectif (projection théorique)
 * @param startDate Date de début (première transaction)
 * @param params Paramètres de l'objectif
 * @param presentValue Patrimoine actuel
 * @param monthlyPayment Versement mensuel calculé
 * @returns Tableau de points mensuels
 */
export function generateObjectiveCurve(
  startDate: Date,
  params: ObjectiveParams,
  presentValue: number,
  monthlyPayment: number
): ProjectionPoint[] {
  const points: ProjectionPoint[] = []
  const r = params.interestRate / 100
  const monthlyRate = r / 12
  const totalMonths = params.targetYears * 12

  for (let month = 0; month <= totalMonths; month++) {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + month)

    // Valeur à ce point dans le temps
    const fvPresent = presentValue * Math.pow(1 + r, month / 12)
    const fvPayments =
      month > 0 ? (monthlyPayment * (Math.pow(1 + monthlyRate, month) - 1)) / monthlyRate : 0

    points.push({
      date,
      value: fvPresent + fvPayments
    })
  }

  return points
}

/**
 * Calcule la projection d'objectif avec versements mensuels
 * Génère une courbe exponentielle de la date de départ jusqu'à l'objectif
 */
export function calculateObjectiveProjection(
  currentWealth: number,
  objective: ObjectiveParams,
  startDate: Date
): Array<{ date: Date; value: number }> {
  const points: Array<{ date: Date; value: number }> = []
  const now = new Date()
  const r = objective.interestRate / 100
  const monthlyRate = r / 12
  const totalMonths = objective.targetYears * 12

  // Calculer le versement mensuel nécessaire
  const monthlyPayment = calculateMonthlyPayment(
    currentWealth,
    objective.targetAmount,
    objective.interestRate,
    objective.targetYears
  )

  // Calculer combien de mois se sont écoulés depuis le début
  const monthsElapsed = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  )

  // Générer les points mensuels
  for (let month = 0; month <= totalMonths; month++) {
    const pointDate = new Date(startDate)
    pointDate.setMonth(pointDate.getMonth() + month)

    let value: number

    if (month <= monthsElapsed) {
      // Projection passée/actuelle : interpoler vers le patrimoine actuel
      const progressRatio = monthsElapsed > 0 ? month / monthsElapsed : 0
      value = progressRatio * currentWealth
    } else {
      // Projection future : formule exponentielle avec versements
      const monthsFromNow = month - monthsElapsed
      const fvPresent = currentWealth * Math.pow(1 + monthlyRate, monthsFromNow)
      const fvPayments =
        monthsFromNow > 0
          ? (monthlyPayment * (Math.pow(1 + monthlyRate, monthsFromNow) - 1)) / monthlyRate
          : 0

      value = fvPresent + fvPayments
    }

    points.push({
      date: pointDate,
      value: Math.max(0, value)
    })
  }

  return points
}

/**
 * Génère les dates pour une période donnée, centrées sur aujourd'hui
 */
export function generateTimeRangeDates(config: TimeRangeConfig, today: Date = new Date()): Date[] {
  const dates: Date[] = []
  const startDate = new Date(today)
  const endDate = new Date(today)

  // Calculer la plage
  startDate.setMonth(today.getMonth() - config.pastMonths)
  endDate.setMonth(today.getMonth() + config.futureMonths)

  if (config.granularity === 'monthly') {
    // Points mensuels (DERNIER JOUR de chaque mois)
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)

    while (current <= endDate) {
      // Dernier jour du mois = 1er du mois suivant - 1 jour
      const lastDayOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0)

      // Si c'est le mois actuel, utiliser aujourd'hui au lieu du dernier jour
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
    // Points hebdomadaires (tous les dimanches = fin de semaine)
    const current = new Date(startDate)
    // Avancer au dimanche suivant
    const dayOfWeek = current.getDay()
    const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
    current.setDate(current.getDate() + daysToSunday)

    while (current <= endDate) {
      // Si c'est la semaine actuelle, utiliser aujourd'hui
      const weekStart = new Date(current)
      weekStart.setDate(current.getDate() - 6) // Lundi de cette semaine

      if (today >= weekStart && today <= current) {
        dates.push(new Date(today))
      } else {
        dates.push(new Date(current))
      }

      current.setDate(current.getDate() + 7) // +1 semaine
    }
  }

  return dates
}

/**
 * Génère les données de patrimoine réel pour une plage de dates
 */
export function calculateRealityChartData(
  dates: Date[],
  assets: Array<{ id: number; currentPrice: number }>,
  transactions: Array<{
    assetId: number
    type: 'BUY' | 'SELL'
    quantity: number
    date: Date
  }>,
  today: Date = new Date()
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []

  // Pour chaque date demandée
  dates.forEach((date) => {
    if (date > today) {
      return
    }

    // Calculer le patrimoine exact à cette date
    const wealth = calculateWealthAtDate(assets, transactions, date)

    data.push({
      time: formatDateForChart(date),
      value: wealth
    })
  })

  return data
}

/**
 * Génère la courbe objectif théorique basée UNIQUEMENT sur des versements mensuels
 * Part de 0 et projette en utilisant seulement les versements réguliers (ignore le patrimoine actuel)
 */
export function calculateObjectiveChartData(
  dates: Date[],
  _currentWealth: number,
  objective: ObjectiveParams,
  _today: Date = new Date(),
  startDate?: Date
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []

  // Si pas de date de départ fournie, utiliser aujourd'hui
  const projectionStart = startDate || _today

  // Paramètres
  const targetAmount = objective.targetAmount
  const targetYears = objective.targetYears
  const annualRate = objective.interestRate / 100
  const monthlyRate = annualRate / 12

  // Calculer le versement mensuel nécessaire pour atteindre l'objectif
  const totalMonths = targetYears * 12
  const monthlyPayment =
    totalMonths > 0 && monthlyRate > 0
      ? (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : targetAmount / totalMonths

  dates.forEach((date) => {
    const monthsFromStart = getMonthsDifference(projectionStart, date)

    if (monthsFromStart < 0) {
      return
    }

    // Projection : UNIQUEMENT les versements + intérêts composés
    const value =
      monthsFromStart > 0
        ? (monthlyPayment * (Math.pow(1 + monthlyRate, monthsFromStart) - 1)) / monthlyRate
        : 0

    data.push({
      time: formatDateForChart(date),
      value: Math.max(0, value)
    })
  })

  return data
}

/**
 * Calcule le capital investi théorique pour atteindre l'objectif
 */
export function calculateInvestedCapitalData(
  dates: Date[],
  _currentWealth: number,
  objective: ObjectiveParams,
  _today: Date = new Date(),
  startDate?: Date
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const projectionStart = startDate || _today

  const targetAmount = objective.targetAmount
  const targetYears = objective.targetYears
  const annualRate = objective.interestRate / 100
  const monthlyRate = annualRate / 12
  const totalMonths = targetYears * 12

  const monthlyPayment =
    totalMonths > 0 && monthlyRate > 0
      ? (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : targetAmount / totalMonths

  dates.forEach((date) => {
    const monthsFromStart = getMonthsDifference(projectionStart, date)

    if (monthsFromStart < 0) {
      return
    }

    const capitalInvested = monthlyPayment * monthsFromStart

    data.push({
      time: formatDateForChart(date),
      value: Math.max(0, capitalInvested)
    })
  })

  return data
}

/**
 * Calcule les intérêts théoriques reçus
 * Intérêts = Objectif Théorique - Capital Investi
 */
export function calculateInterestEarnedData(
  dates: Date[],
  objectiveData: ChartDataPoint[],
  capitalData: ChartDataPoint[]
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []

  // Créer des maps pour un accès rapide par date
  const objectiveMap = new Map(objectiveData.map((p) => [p.time, p.value]))
  const capitalMap = new Map(capitalData.map((p) => [p.time, p.value]))

  dates.forEach((date) => {
    const timeKey = formatDateForChart(date)
    const objectiveValue = objectiveMap.get(timeKey) || 0
    const capitalValue = capitalMap.get(timeKey) || 0

    const interest = objectiveValue - capitalValue

    data.push({
      time: timeKey,
      value: Math.max(0, interest)
    })
  })

  return data
}
