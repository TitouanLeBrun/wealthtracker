import type { Asset, Transaction } from '../../types'

/**
 * Calcule la position actuelle (quantité possédée) d'un actif
 * @param assetId ID de l'actif
 * @param transactions Liste de toutes les transactions
 * @returns Quantité possédée (BUY - SELL)
 */
export function getAssetPosition(assetId: number, transactions: Transaction[]): number {
  const assetTransactions = transactions.filter((t) => t.assetId === assetId)

  const bought = assetTransactions
    .filter((t) => t.type === 'BUY')
    .reduce((sum, t) => sum + t.quantity, 0)

  const sold = assetTransactions
    .filter((t) => t.type === 'SELL')
    .reduce((sum, t) => sum + t.quantity, 0)

  return bought - sold
}

/**
 * Vérifie si un actif n'a aucune transaction
 * @param assetId ID de l'actif
 * @param transactions Liste de toutes les transactions
 * @returns true si aucune transaction, false sinon
 */
export function hasNoTransactions(assetId: number, transactions: Transaction[]): boolean {
  return transactions.filter((t) => t.assetId === assetId).length === 0
}

/**
 * Retourne le nombre de transactions d'un actif
 * @param assetId ID de l'actif
 * @param transactions Liste de toutes les transactions
 * @returns Nombre de transactions
 */
export function getTransactionCount(assetId: number, transactions: Transaction[]): number {
  return transactions.filter((t) => t.assetId === assetId).length
}

/**
 * Filtre les actifs sans position en cours (quantité = 0)
 * @param assets Liste des actifs
 * @param transactions Liste de toutes les transactions
 * @returns Actifs avec quantité = 0
 */
export function getAssetsWithoutPosition(assets: Asset[], transactions: Transaction[]): Asset[] {
  return assets.filter((asset) => getAssetPosition(asset.id, transactions) === 0)
}

/**
 * Filtre les actifs avec position en cours (quantité > 0)
 * @param assets Liste des actifs
 * @param transactions Liste de toutes les transactions
 * @returns Actifs avec quantité > 0
 */
export function getAssetsWithPosition(assets: Asset[], transactions: Transaction[]): Asset[] {
  return assets.filter((asset) => getAssetPosition(asset.id, transactions) > 0)
}

/**
 * Vérifie si un actif peut être supprimé (aucune transaction)
 * @param assetId ID de l'actif
 * @param transactions Liste de toutes les transactions
 * @returns true si supprimable, false sinon
 */
export function canDeleteAsset(assetId: number, transactions: Transaction[]): boolean {
  return hasNoTransactions(assetId, transactions)
}
