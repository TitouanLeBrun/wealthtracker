import type { Time } from 'lightweight-charts'

/**
 * Point de données pour le graphique TradingView
 */
export interface ChartDataPoint {
  time: Time // Format: '2025-11-26' (YYYY-MM-DD)
  value: number
}

/**
 * Période de visualisation du graphique
 */
export type TimeRange = '3M' | '6M' | '1A' | '3A' | 'MAX'

/**
 * Configuration d'une période
 */
export interface TimeRangeConfig {
  range: TimeRange
  label: string
  pastMonths: number
  futureMonths: number
  granularity: 'weekly' | 'monthly'
  isFullRange?: boolean // true pour MAX (calcul spécial)
}

/**
 * Données complètes pour le graphique
 */
export interface ProjectionChartData {
  realityData: ChartDataPoint[] // Patrimoine réel (vert)
  objectiveData: ChartDataPoint[] // Objectif théorique (bleu)
  todayMarker: string // Date du jour (YYYY-MM-DD)
}

/**
 * Configuration des périodes de temps
 */
export const TIME_RANGE_CONFIGS: Record<TimeRange, TimeRangeConfig> = {
  '3M': {
    range: '3M',
    label: '3 mois',
    pastMonths: 1,
    futureMonths: 1,
    granularity: 'weekly'
  },
  '6M': {
    range: '6M',
    label: '6 mois',
    pastMonths: 3,
    futureMonths: 2,
    granularity: 'weekly'
  },
  '1A': {
    range: '1A',
    label: '1 an',
    pastMonths: 6,
    futureMonths: 5,
    granularity: 'monthly'
  },
  '3A': {
    range: '3A',
    label: '3 ans',
    pastMonths: 18,
    futureMonths: 18,
    granularity: 'monthly'
  },
  MAX: {
    range: 'MAX',
    label: 'MAX',
    pastMonths: 0,
    futureMonths: 0,
    granularity: 'monthly',
    isFullRange: true
  }
}
