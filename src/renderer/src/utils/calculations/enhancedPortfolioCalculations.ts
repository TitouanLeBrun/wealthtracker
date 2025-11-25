import type { Asset, Transaction } from '../../types'
import { roundQuantity, isQuantityZero } from './quantityUtils'

/**
 * Métriques financières complètes pour un actif
 */
export interface AssetMetrics {
  asset: Asset
  ticker: string
  name: string
  category: string
  categoryColor: string

  // Quantités
  totalBought: number // Quantité totale achetée
  totalSold: number // Quantité totale vendue
  currentQuantity: number // Quantité nette possédée

  // Valeurs
  currentPrice: number // Prix de marché actuel
  currentValue: number // Valeur actuelle (prix × quantité)

  // Capital
  totalInvested: number // Capital total investi (achats + frais achats)
  totalRecovered: number // Capital total récupéré (ventes - frais ventes)
  netInvested: number // Capital net (investi - récupéré)
  investedInCurrentPosition: number // Capital investi sur position actuelle

  // Frais
  buyFees: number // Frais d'achat
  sellFees: number // Frais de vente
  totalFees: number // Frais totaux

  // PMA
  averageBuyPrice: number // PMA (Prix Moyen d'Achat) incluant frais

  // Plus-values
  unrealizedPnL: number // Plus-value latente (€)
  unrealizedPnLPercent: number // Plus-value latente (%)
  realizedPnL: number // Plus-value réalisée (€)
  totalPnL: number // Plus-value globale (€)
  totalPnLPercent: number // Plus-value globale (%)
}

/**
 * Métriques globales du portefeuille
 */
export interface PortfolioMetrics {
  // Valeurs globales
  totalValue: number // Valeur totale du portefeuille
  totalInvested: number // Capital total investi
  totalRecovered: number // Capital total récupéré
  netInvested: number // Capital net investi

  // Plus-values
  unrealizedPnL: number // Plus-value latente totale
  unrealizedPnLPercent: number // Plus-value latente (%)
  realizedPnL: number // Plus-value réalisée totale
  totalPnL: number // Plus-value globale
  totalPnLPercent: number // Performance globale (%)

  // Frais
  totalFees: number // Frais totaux
  feesPercent: number // Frais en % du capital investi

  // Détails par actif
  assets: AssetMetrics[]
}

/**
 * Calcule les métriques détaillées pour un actif
 */
export function calculateAssetMetrics(asset: Asset, transactions: Transaction[]): AssetMetrics {
  // Filtrer les transactions de cet actif
  const assetTransactions = transactions.filter((t) => t.assetId === asset.id)

  // Séparer achats et ventes
  const buyTransactions = assetTransactions.filter((t) => t.type === 'BUY')
  const sellTransactions = assetTransactions.filter((t) => t.type === 'SELL')

  // Quantités
  const totalBought = buyTransactions.reduce((sum, t) => sum + t.quantity, 0)
  const totalSold = sellTransactions.reduce((sum, t) => sum + t.quantity, 0)
  const rawQuantity = totalBought - totalSold
  // Arrondir et traiter les résidus de virgule flottante
  const currentQuantity = isQuantityZero(rawQuantity) ? 0 : roundQuantity(rawQuantity)

  // Frais
  const buyFees = buyTransactions.reduce((sum, t) => sum + t.fee, 0)
  const sellFees = sellTransactions.reduce((sum, t) => sum + t.fee, 0)
  const totalFees = buyFees + sellFees

  // Capital investi (achats + frais achats)
  const totalInvested = buyTransactions.reduce(
    (sum, t) => sum + t.quantity * t.pricePerUnit + t.fee,
    0
  )

  // Capital récupéré (ventes - frais ventes)
  const totalRecovered = sellTransactions.reduce(
    (sum, t) => sum + t.quantity * t.pricePerUnit - t.fee,
    0
  )

  // Capital net investi
  const netInvested = totalInvested - totalRecovered

  // PMA (Prix Moyen d'Achat) - méthode PMP avec frais
  // PMA = (Somme(prix × qté) + Somme(frais_achats)) / Somme(qté_achats)
  const averageBuyPrice = totalBought > 0 ? totalInvested / totalBought : 0

  // Capital investi sur la position actuelle (PMA × quantité actuelle)
  const investedInCurrentPosition = averageBuyPrice * currentQuantity

  // Valeur actuelle
  const currentPrice = asset.currentPrice || 0
  const currentValue = currentPrice * currentQuantity

  // Plus-value LATENTE (sur position actuelle)
  const unrealizedPnL = currentValue - investedInCurrentPosition
  const unrealizedPnLPercent =
    investedInCurrentPosition > 0 ? (unrealizedPnL / investedInCurrentPosition) * 100 : 0

  // Plus-value RÉALISÉE (sur les ventes)
  // PV réalisée = (Prix_Vente × Qté - Frais_Vente) - (PMA × Qté)
  const realizedPnL = sellTransactions.reduce((sum, t) => {
    const saleRevenue = t.quantity * t.pricePerUnit - t.fee
    const cost = averageBuyPrice * t.quantity
    return sum + (saleRevenue - cost)
  }, 0)

  // Plus-value GLOBALE
  const totalPnL = unrealizedPnL + realizedPnL
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  return {
    asset,
    ticker: asset.ticker,
    name: asset.name,
    category: asset.category?.name || 'Sans catégorie',
    categoryColor: asset.category?.color || '#999999',

    totalBought,
    totalSold,
    currentQuantity,

    currentPrice,
    currentValue,

    totalInvested,
    totalRecovered,
    netInvested,
    investedInCurrentPosition,

    buyFees,
    sellFees,
    totalFees,

    averageBuyPrice,

    unrealizedPnL,
    unrealizedPnLPercent,
    realizedPnL,
    totalPnL,
    totalPnLPercent
  }
}

/**
 * Calcule les métriques globales du portefeuille
 */
export function calculateEnhancedPortfolioMetrics(
  assets: Asset[],
  transactions: Transaction[]
): PortfolioMetrics {
  // Calculer les métriques pour chaque actif
  const assetMetrics = assets
    .map((asset) => calculateAssetMetrics(asset, transactions))
    .filter((metrics) => metrics.currentQuantity > 0 || metrics.totalSold > 0) // Garder actifs avec position ou historique

  // Agréger les métriques globales
  const totalValue = assetMetrics.reduce((sum, m) => sum + m.currentValue, 0)
  const totalInvested = assetMetrics.reduce((sum, m) => sum + m.totalInvested, 0)
  const totalRecovered = assetMetrics.reduce((sum, m) => sum + m.totalRecovered, 0)
  const netInvested = totalInvested - totalRecovered

  const unrealizedPnL = assetMetrics.reduce((sum, m) => sum + m.unrealizedPnL, 0)
  const realizedPnL = assetMetrics.reduce((sum, m) => sum + m.realizedPnL, 0)
  const totalPnL = unrealizedPnL + realizedPnL

  const totalFees = assetMetrics.reduce((sum, m) => sum + m.totalFees, 0)

  // Calcul de la performance globale
  // Performance = (Valeur actuelle + Capital récupéré - Capital investi) / Capital investi
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0
  const unrealizedPnLPercent = netInvested > 0 ? (unrealizedPnL / netInvested) * 100 : 0
  const feesPercent = totalInvested > 0 ? (totalFees / totalInvested) * 100 : 0

  return {
    totalValue,
    totalInvested,
    totalRecovered,
    netInvested,

    unrealizedPnL,
    unrealizedPnLPercent,
    realizedPnL,
    totalPnL,
    totalPnLPercent,

    totalFees,
    feesPercent,

    assets: assetMetrics
  }
}

/**
 * Formate un montant en euros
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

/**
 * Formate un pourcentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}
