/**
 * Formules financières de base pour les calculs d'intérêts composés
 */

export interface ObjectiveParams {
  targetAmount: number // Montant cible en €
  targetYears: number // Durée en années
  interestRate: number // Taux annuel en % (ex: 8 pour 8%)
}

/**
 * Calcule la valeur future avec versements mensuels
 * FV = PV × (1 + r)^n + PMT × [(1 + r/12)^(12×n) - 1] / (r/12)
 */
export function calculateFutureValue(
  presentValue: number,
  monthlyPayment: number,
  annualRate: number, // En % (ex: 8)
  years: number
): number {
  const r = annualRate / 100 // Convertir en décimal
  const monthlyRate = r / 12
  const months = years * 12

  // Valeur future du capital initial
  const fvPresent = presentValue * Math.pow(1 + r, years)

  // Valeur future des versements mensuels
  const fvPayments = (monthlyPayment * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate

  return fvPresent + fvPayments
}

/**
 * Calcule le versement mensuel nécessaire pour atteindre un objectif
 * PMT = (FV - PV × (1 + r)^n) × (r/12) / [(1 + r/12)^(12×n) - 1]
 */
export function calculateMonthlyPayment(
  presentValue: number,
  futureValue: number,
  annualRate: number, // En % (ex: 8)
  years: number
): number {
  const r = annualRate / 100
  const monthlyRate = r / 12
  const months = years * 12

  // Si le taux est 0, calcul simplifié
  if (annualRate === 0) {
    return (futureValue - presentValue) / months
  }

  const numerator = (futureValue - presentValue * Math.pow(1 + r, years)) * monthlyRate
  const denominator = Math.pow(1 + monthlyRate, months) - 1

  return numerator / denominator
}

/**
 * Calcule le taux de croissance annuel composé (CAGR)
 * CAGR = [(Valeur Finale / Valeur Initiale)^(1/n) - 1] × 100
 */
export function calculateCAGR(initialValue: number, finalValue: number, years: number): number {
  if (initialValue <= 0 || years <= 0) return 0
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100
}

/**
 * Formatte un nombre en euros avec séparateur de milliers
 */
export function formatEuros(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Formatte un pourcentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)} %`
}

/**
 * Calcule le total des frais payés
 */
export function calculateTotalFees(transactions: Array<{ fee: number }>): number {
  return transactions.reduce((sum, t) => sum + t.fee, 0)
}
