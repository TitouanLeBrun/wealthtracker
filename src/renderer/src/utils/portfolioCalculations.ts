import type { Asset, Transaction, AssetPerformance, PortfolioMetrics } from '../types'

/**
 * Calcule les quantités nettes possédées par actif (achats - ventes)
 */
function calculateNetQuantities(transactions: Transaction[]): Map<number, number> {
  const netQuantities = new Map<number, number>()

  transactions.forEach((transaction) => {
    const currentQty = netQuantities.get(transaction.assetId) || 0
    const sign = transaction.type === 'BUY' ? 1 : -1
    netQuantities.set(transaction.assetId, currentQty + transaction.quantity * sign)
  })

  return netQuantities
}

/**
 * Calcule le prix moyen d'achat pondéré (PMA) avec frais pour un actif
 * Utilise la méthode FIFO/PRU (Prix de Revient Unitaire)
 * PMA = (Σ(quantité_achat × prix_achat) + Σ(frais_achat)) / Σ(quantité_achat)
 *
 * Note: Le PMA est calculé sur les achats uniquement, puis appliqué à la quantité nette
 */
function calculateAverageBuyPrice(
  assetId: number,
  transactions: Transaction[]
): { averageBuyPrice: number; totalBuyQuantity: number; totalCost: number } {
  const buyTransactions = transactions.filter((t) => t.assetId === assetId && t.type === 'BUY')

  if (buyTransactions.length === 0) {
    return { averageBuyPrice: 0, totalBuyQuantity: 0, totalCost: 0 }
  }

  let totalCost = 0
  let totalBuyQuantity = 0

  buyTransactions.forEach((transaction) => {
    const transactionCost = transaction.quantity * transaction.pricePerUnit + transaction.fee
    totalCost += transactionCost
    totalBuyQuantity += transaction.quantity
  })

  const averageBuyPrice = totalBuyQuantity > 0 ? totalCost / totalBuyQuantity : 0

  return { averageBuyPrice, totalBuyQuantity, totalCost }
}

/**
 * Calcule la performance d'un actif (PMA, valeur actuelle, +/- value)
 */
function calculateAssetPerformance(
  asset: Asset,
  netQuantity: number,
  transactions: Transaction[]
): AssetPerformance {
  const { averageBuyPrice, totalBuyQuantity, totalCost } = calculateAverageBuyPrice(
    asset.id,
    transactions
  )

  const currentValue = asset.currentPrice * netQuantity
  const investedValue = averageBuyPrice * netQuantity

  const unrealizedPnL = currentValue - investedValue
  const unrealizedPnLPercent = investedValue > 0 ? (unrealizedPnL / investedValue) * 100 : 0

  // 🐛 DEBUG - À retirer après correction
  console.log('📊 CALCUL ASSET:', asset.ticker, {
    netQuantity,
    currentPrice: asset.currentPrice,
    averageBuyPrice,
    totalBuyQuantity,
    totalCost,
    currentValue,
    investedValue,
    unrealizedPnL,
    unrealizedPnLPercent
  })

  return {
    assetId: asset.id,
    ticker: asset.ticker,
    name: asset.name,
    categoryName: asset.category?.name || 'Sans catégorie',
    categoryColor: asset.category?.color || '#6B7280',
    netQuantity,
    currentPrice: asset.currentPrice,
    averageBuyPrice,
    currentValue,
    investedValue,
    unrealizedPnL,
    unrealizedPnLPercent
  }
}

/**
 * Calcule les métriques globales du portefeuille
 * @param assets - Liste des actifs
 * @param transactions - Liste des transactions
 * @returns PortfolioMetrics avec métriques globales et détails par actif
 */
export function calculatePortfolioMetrics(
  assets: Asset[],
  transactions: Transaction[]
): PortfolioMetrics {
  // Calculer les quantités nettes par actif
  const netQuantities = calculateNetQuantities(transactions)

  // Calculer la performance de chaque actif avec position ouverte (quantité > 0)
  const assetPerformances: AssetPerformance[] = []

  assets.forEach((asset) => {
    const netQuantity = netQuantities.get(asset.id) || 0

    // Filtrer uniquement les positions ouvertes (quantité > 0)
    if (netQuantity > 0) {
      const performance = calculateAssetPerformance(asset, netQuantity, transactions)
      assetPerformances.push(performance)
    }
  })

  // Calculer les totaux
  const totalValue = assetPerformances.reduce((sum, perf) => sum + perf.currentValue, 0)
  const totalInvested = assetPerformances.reduce((sum, perf) => sum + perf.investedValue, 0)
  const unrealizedPnL = totalValue - totalInvested
  const unrealizedPnLPercent = totalInvested > 0 ? (unrealizedPnL / totalInvested) * 100 : 0

  // Trier par valeur décroissante
  assetPerformances.sort((a, b) => b.currentValue - a.currentValue)

  return {
    totalValue,
    totalInvested,
    unrealizedPnL,
    unrealizedPnLPercent,
    assetCount: assetPerformances.length,
    assets: assetPerformances
  }
}
