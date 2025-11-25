/**
 * Arrondit une quantité à 8 décimales pour éviter les erreurs de virgule flottante
 */
export function roundQuantity(quantity: number): number {
  return Math.round(quantity * 100000000) / 100000000
}

/**
 * Vérifie si une quantité est considérée comme nulle (< 1e-8)
 */
export function isQuantityZero(quantity: number): boolean {
  return Math.abs(quantity) < 1e-8
}

/**
 * Calcule la quantité possédée d'un actif à partir des transactions
 * avec arrondi correct pour éviter les résidus
 */
export function calculateOwnedQuantity(
  transactions: Array<{ type: 'BUY' | 'SELL'; quantity: number }>
): number {
  const total = transactions.reduce((acc, t) => {
    return t.type === 'BUY' ? acc + t.quantity : acc - t.quantity
  }, 0)

  // Arrondir à 8 décimales
  const rounded = roundQuantity(total)

  // Si c'est presque zéro, retourner exactement zéro
  return isQuantityZero(rounded) ? 0 : rounded
}
