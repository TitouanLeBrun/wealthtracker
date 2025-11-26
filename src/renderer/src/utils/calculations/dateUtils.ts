/**
 * Utilitaires pour la manipulation de dates
 */

/**
 * Formate une date au format YYYY-MM-DD pour TradingView
 */
export function formatDateForChart(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Calcule la différence en mois entre 2 dates
 */
export function getMonthsDifference(date1: Date, date2: Date): number {
  return (date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth())
}

/**
 * Génère un tableau de dates mensuelles entre deux dates
 */
export function generateMonthlyDates(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = []
  const current = new Date(startDate)
  current.setDate(1) // Premier jour du mois
  current.setHours(0, 0, 0, 0)

  const end = new Date(endDate)
  end.setDate(1)
  end.setHours(0, 0, 0, 0)

  while (current <= end) {
    dates.push(new Date(current))
    current.setMonth(current.getMonth() + 1)
  }

  return dates
}

/**
 * Obtient la date de la première transaction
 */
export function getFirstTransactionDate(transactions: Array<{ date: Date }>): Date | null {
  if (transactions.length === 0) return null

  return transactions.reduce((earliest, t) => {
    return t.date < earliest ? t.date : earliest
  }, transactions[0].date)
}

/**
 * Interpole linéairement la valeur entre deux mois
 */
export function interpolateValue(
  date: Date,
  month1: Date,
  value1: number,
  month2: Date,
  value2: number
): number {
  const totalDays = (month2.getTime() - month1.getTime()) / (1000 * 60 * 60 * 24)
  const elapsedDays = (date.getTime() - month1.getTime()) / (1000 * 60 * 60 * 24)
  const ratio = totalDays > 0 ? elapsedDays / totalDays : 0

  return value1 + (value2 - value1) * ratio
}
