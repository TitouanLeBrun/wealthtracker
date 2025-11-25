/**
 * Générateur de données de prix fictives pour les graphiques d'actifs
 * Basé sur les transactions réelles et une tendance calculée
 */

import type { Transaction } from '../types'

export type TimeRange = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y'

export interface PriceDataPoint {
  time: number // timestamp
  value: number // prix
}

interface TrendConfig {
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  volatility: number // 0.01 = 1% par jour
}

/**
 * Calcule la tendance basée sur les transactions de l'actif
 */
function calculateTrend(transactions: Transaction[], currentPrice: number): TrendConfig {
  if (transactions.length === 0) {
    return { direction: 'NEUTRAL', volatility: 0.02 }
  }

  // Calculer le prix moyen d'achat (PMA)
  const buyTransactions = transactions.filter((t) => t.type === 'BUY')
  const totalSpent = buyTransactions.reduce((sum, t) => sum + t.quantity * t.pricePerUnit, 0)
  const totalQuantity = buyTransactions.reduce((sum, t) => sum + t.quantity, 0)

  if (totalQuantity === 0) {
    return { direction: 'NEUTRAL', volatility: 0.02 }
  }

  const averageBuyPrice = totalSpent / totalQuantity
  const priceChange = (currentPrice - averageBuyPrice) / averageBuyPrice

  // Déterminer la tendance
  let direction: 'UP' | 'DOWN' | 'NEUTRAL'
  if (priceChange > 0.05) {
    direction = 'UP'
  } else if (priceChange < -0.05) {
    direction = 'DOWN'
  } else {
    direction = 'NEUTRAL'
  }

  // Volatilité de base : 2% par jour
  const volatility = 0.02

  return { direction, volatility }
}

/**
 * Génère un point de prix avec variation aléatoire
 */
function generatePricePoint(
  previousPrice: number,
  trend: TrendConfig,
  randomness: number = 0.5
): number {
  const { direction, volatility } = trend

  // Variation de base selon la tendance
  let baseChange = 0
  if (direction === 'UP') {
    baseChange = volatility * 0.3 // +0.6% par jour en moyenne
  } else if (direction === 'DOWN') {
    baseChange = -volatility * 0.3 // -0.6% par jour en moyenne
  }

  // Ajouter du bruit aléatoire
  const randomChange = (Math.random() - 0.5) * volatility * 2 * randomness

  // Calculer le nouveau prix
  const change = baseChange + randomChange
  const newPrice = previousPrice * (1 + change)

  return Math.max(newPrice, 0.01) // Prix minimum de 0.01
}

/**
 * Obtient le nombre de points de données pour une période
 */
function getDataPointCount(range: TimeRange): number {
  switch (range) {
    case '1D':
      return 24 // 1 point par heure
    case '5D':
      return 120 // 1 point par heure
    case '1M':
      return 30 // 1 point par jour
    case '6M':
      return 180 // 1 point par jour
    case '1Y':
      return 365 // 1 point par jour
    case '5Y':
      return 260 // 1 point par semaine (52 * 5)
    default:
      return 30
  }
}

/**
 * Obtient l'intervalle de temps entre les points (en millisecondes)
 */
function getTimeInterval(range: TimeRange): number {
  switch (range) {
    case '1D':
      return 60 * 60 * 1000 // 1 heure
    case '5D':
      return 60 * 60 * 1000 // 1 heure
    case '1M':
      return 24 * 60 * 60 * 1000 // 1 jour
    case '6M':
      return 24 * 60 * 60 * 1000 // 1 jour
    case '1Y':
      return 24 * 60 * 60 * 1000 // 1 jour
    case '5Y':
      return 7 * 24 * 60 * 60 * 1000 // 1 semaine
    default:
      return 24 * 60 * 60 * 1000
  }
}

/**
 * Génère l'historique de prix pour un actif
 */
export function generatePriceHistory(
  currentPrice: number,
  range: TimeRange,
  transactions: Transaction[] = []
): PriceDataPoint[] {
  const dataPoints: PriceDataPoint[] = []
  const count = getDataPointCount(range)
  const interval = getTimeInterval(range)
  const trend = calculateTrend(transactions, currentPrice)

  // Timestamp de fin (maintenant)
  const now = Date.now()

  // Calculer le prix de départ (en inversant la tendance)
  let startPrice = currentPrice
  if (trend.direction === 'UP') {
    // Si tendance haussière, le prix était plus bas avant
    startPrice = currentPrice / (1 + trend.volatility * 0.3 * count)
  } else if (trend.direction === 'DOWN') {
    // Si tendance baissière, le prix était plus haut avant
    startPrice = currentPrice / (1 - trend.volatility * 0.3 * count)
  }

  // Générer les points de données
  let price = startPrice
  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * interval
    dataPoints.push({
      time: Math.floor(time / 1000), // Lightweight Charts utilise des secondes
      value: parseFloat(price.toFixed(2))
    })

    // Générer le prix suivant
    if (i < count - 1) {
      price = generatePricePoint(price, trend)
    } else {
      // Le dernier point doit être le prix actuel
      price = currentPrice
    }
  }

  // Assurer que le dernier point est exactement le prix actuel
  dataPoints[dataPoints.length - 1].value = currentPrice

  return dataPoints
}

/**
 * Obtient le label d'une période pour l'affichage
 */
export function getRangeLabel(range: TimeRange): string {
  switch (range) {
    case '1D':
      return '1 Jour'
    case '5D':
      return '5 Jours'
    case '1M':
      return '1 Mois'
    case '6M':
      return '6 Mois'
    case '1Y':
      return '1 An'
    case '5Y':
      return '5 Ans'
    default:
      return range
  }
}

/**
 * Calcule la variation de prix sur une période
 */
export function calculatePriceChange(data: PriceDataPoint[]): {
  absolute: number
  percentage: number
} {
  if (data.length < 2) {
    return { absolute: 0, percentage: 0 }
  }

  const firstPrice = data[0].value
  const lastPrice = data[data.length - 1].value
  const absolute = lastPrice - firstPrice
  const percentage = (absolute / firstPrice) * 100

  return { absolute, percentage }
}
