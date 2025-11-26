/**
 * Calculs de patrimoine et valorisation de positions
 */

import { generateMonthlyDates } from './dateUtils'

/**
 * Calcule le patrimoine actuel à partir des transactions
 */
export function calculateCurrentWealth(
  assets: Array<{
    currentPrice: number
    transactions: Array<{
      type: string
      quantity: number
      fee: number
    }>
  }>
): number {
  let totalValue = 0

  assets.forEach((asset) => {
    // Calculer la quantité possédée
    let quantity = 0
    asset.transactions.forEach((t) => {
      if (t.type === 'BUY') {
        quantity += t.quantity
      } else if (t.type === 'SELL') {
        quantity -= t.quantity
      }
    })

    // Valeur actuelle = quantité × prix actuel
    totalValue += quantity * asset.currentPrice
  })

  return totalValue
}

/**
 * Calcule le patrimoine total à une date précise
 */
export function calculateWealthAtDate(
  assets: Array<{ id: number; currentPrice: number }>,
  transactions: Array<{
    assetId: number
    type: 'BUY' | 'SELL'
    quantity: number
    date: Date
  }>,
  targetDate: Date
): number {
  // Filtrer les transactions jusqu'à la date cible
  const relevantTransactions = transactions.filter((t) => new Date(t.date) <= targetDate)

  // Calculer la quantité nette de chaque actif
  const assetQuantities = new Map<number, number>()

  relevantTransactions.forEach((transaction) => {
    const currentQty = assetQuantities.get(transaction.assetId) || 0

    if (transaction.type === 'BUY') {
      assetQuantities.set(transaction.assetId, currentQty + transaction.quantity)
    } else if (transaction.type === 'SELL') {
      assetQuantities.set(transaction.assetId, currentQty - transaction.quantity)
    }
  })

  // Calculer la valeur totale avec les prix actuels
  let totalWealth = 0
  assetQuantities.forEach((quantity, assetId) => {
    const asset = assets.find((a) => a.id === assetId)
    if (asset && quantity > 0) {
      const value = quantity * asset.currentPrice
      totalWealth += value
    }
  })

  return totalWealth
}

/**
 * Calcule le patrimoine historique mois par mois
 * Utilise le prix actuel pour valoriser les positions passées
 */
export function calculateHistoricalWealth(
  assets: Array<{
    id: number
    currentPrice: number
  }>,
  transactions: Array<{
    assetId: number
    type: 'BUY' | 'SELL'
    quantity: number
    date: Date
  }>,
  startDate: Date,
  endDate: Date = new Date()
): Array<{ date: Date; value: number }> {
  const monthlyDates = generateMonthlyDates(startDate, endDate)
  const wealthHistory: Array<{ date: Date; value: number }> = []

  monthlyDates.forEach((monthDate) => {
    // Filtrer les transactions jusqu'à ce mois (inclus)
    const transactionsUpToMonth = transactions.filter((t) => t.date <= monthDate)

    // Calculer la quantité nette de chaque actif à cette date
    const assetQuantities = new Map<number, number>()

    transactionsUpToMonth.forEach((t) => {
      const currentQty = assetQuantities.get(t.assetId) || 0
      if (t.type === 'BUY') {
        assetQuantities.set(t.assetId, currentQty + t.quantity)
      } else if (t.type === 'SELL') {
        assetQuantities.set(t.assetId, currentQty - t.quantity)
      }
    })

    // Calculer la valeur totale du patrimoine à cette date
    let totalWealth = 0
    assetQuantities.forEach((quantity, assetId) => {
      const asset = assets.find((a) => a.id === assetId)
      if (asset && quantity > 0) {
        totalWealth += quantity * asset.currentPrice
      }
    })

    wealthHistory.push({
      date: new Date(monthDate),
      value: totalWealth
    })
  })

  return wealthHistory
}
