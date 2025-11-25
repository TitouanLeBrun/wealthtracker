import type { Category, Asset, Transaction, CategoryValue, AssetValue } from '../../types'
import { roundQuantity, isQuantityZero } from './quantityUtils'

/**
 * Calcule les quantités nettes par actif (achats - ventes)
 * @param transactions Liste de toutes les transactions
 * @returns Map<assetId, quantitéNette>
 */
export function calculateNetQuantities(transactions: Transaction[]): Map<number, number> {
  const quantities = transactions.reduce((acc, transaction) => {
    const sign = transaction.type === 'BUY' ? 1 : -1
    const currentQuantity = acc.get(transaction.assetId) || 0
    acc.set(transaction.assetId, currentQuantity + transaction.quantity * sign)
    return acc
  }, new Map<number, number>())

  // Arrondir toutes les quantités et traiter les résidus
  quantities.forEach((qty, assetId) => {
    const rounded = roundQuantity(qty)
    quantities.set(assetId, isQuantityZero(rounded) ? 0 : rounded)
  })

  return quantities
}

/**
 * Calcule les valeurs par actif au sein d'une catégorie
 * @param assets Actifs de la catégorie
 * @param netQuantities Map des quantités nettes
 * @param categoryTotalValue Valeur totale de la catégorie (pour calcul %)
 * @returns Liste des valeurs par actif
 */
function calculateAssetValues(
  assets: Asset[],
  netQuantities: Map<number, number>,
  categoryTotalValue: number
): AssetValue[] {
  return assets
    .map((asset) => {
      const netQuantity = netQuantities.get(asset.id) || 0
      const totalValue = asset.currentPrice * netQuantity

      return {
        assetId: asset.id,
        ticker: asset.ticker,
        name: asset.name,
        currentPrice: asset.currentPrice,
        netQuantity,
        totalValue,
        percentage: categoryTotalValue > 0 ? (totalValue / categoryTotalValue) * 100 : 0
      }
    })
    .filter((assetValue) => assetValue.netQuantity > 0) // Exclure les actifs sans position
    .sort((a, b) => b.totalValue - a.totalValue) // Trier par valeur décroissante
}

/**
 * Calcule les valeurs par catégorie
 * @param categories Liste des catégories
 * @param assets Liste de tous les actifs
 * @param transactions Liste de toutes les transactions
 * @returns Liste des valeurs par catégorie (triées par valeur décroissante)
 */
export function calculateCategoryValues(
  categories: Category[],
  assets: Asset[],
  transactions: Transaction[]
): CategoryValue[] {
  // 1. Calculer les quantités nettes par actif
  const netQuantities = calculateNetQuantities(transactions)

  // 2. Grouper les actifs par catégorie
  const assetsByCategory = assets.reduce(
    (acc, asset) => {
      if (!acc[asset.categoryId]) {
        acc[asset.categoryId] = []
      }
      acc[asset.categoryId].push(asset)
      return acc
    },
    {} as Record<number, Asset[]>
  )

  // 3. Calculer les valeurs par catégorie
  const categoryValues = categories.map((category) => {
    const categoryAssets = assetsByCategory[category.id] || []

    // Calculer la valeur totale de la catégorie
    const totalValue = categoryAssets.reduce((sum, asset) => {
      const netQuantity = netQuantities.get(asset.id) || 0
      return sum + asset.currentPrice * netQuantity
    }, 0)

    // Compter les actifs avec position > 0
    const assetCount = categoryAssets.filter((asset) => {
      const netQuantity = netQuantities.get(asset.id) || 0
      return netQuantity > 0
    }).length

    // Calculer les détails par actif
    const assetValues = calculateAssetValues(categoryAssets, netQuantities, totalValue)

    return {
      categoryId: category.id,
      categoryName: category.name,
      color: category.color,
      totalValue,
      percentage: 0, // Sera calculé après avoir le total global
      assetCount,
      assets: assetValues
    }
  })

  // 4. Filtrer les catégories vides (totalValue = 0)
  const nonEmptyCategories = categoryValues.filter((cv) => cv.totalValue > 0)

  // 5. Calculer le total global
  const globalTotal = nonEmptyCategories.reduce((sum, cv) => sum + cv.totalValue, 0)

  // 6. Calculer les pourcentages
  nonEmptyCategories.forEach((cv) => {
    cv.percentage = globalTotal > 0 ? (cv.totalValue / globalTotal) * 100 : 0
  })

  // 7. Trier par valeur décroissante
  return nonEmptyCategories.sort((a, b) => b.totalValue - a.totalValue)
}

/**
 * Obtient les détails d'une catégorie spécifique
 * @param categoryId ID de la catégorie
 * @param categoryValues Liste des valeurs calculées
 * @returns Valeur de la catégorie ou undefined
 */
export function getCategoryValue(
  categoryId: number,
  categoryValues: CategoryValue[]
): CategoryValue | undefined {
  return categoryValues.find((cv) => cv.categoryId === categoryId)
}
