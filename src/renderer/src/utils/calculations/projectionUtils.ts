/**
 * Utilitaires de calcul pour les projections financières
 * Formules d'intérêt composé avec versements mensuels
 */

export interface ObjectiveParams {
  targetAmount: number // Montant cible en €
  targetYears: number // Durée en années
  interestRate: number // Taux annuel en % (ex: 8 pour 8%)
}

export interface ProjectionPoint {
  date: Date
  value: number
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
 * Génère les points de la courbe d'objectif (projection théorique)
 * @param startDate Date de début (première transaction)
 * @param params Paramètres de l'objectif
 * @param presentValue Patrimoine actuel
 * @param monthlyPayment Versement mensuel calculé
 * @returns Tableau de points mensuels
 */
export function generateObjectiveCurve(
  startDate: Date,
  params: ObjectiveParams,
  presentValue: number,
  monthlyPayment: number
): ProjectionPoint[] {
  const points: ProjectionPoint[] = []
  const r = params.interestRate / 100
  const monthlyRate = r / 12
  const totalMonths = params.targetYears * 12

  for (let month = 0; month <= totalMonths; month++) {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + month)

    // Valeur à ce point dans le temps
    const fvPresent = presentValue * Math.pow(1 + r, month / 12)
    const fvPayments =
      month > 0 ? (monthlyPayment * (Math.pow(1 + monthlyRate, month) - 1)) / monthlyRate : 0

    points.push({
      date,
      value: fvPresent + fvPayments
    })
  }

  return points
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
 * Calcule le total des frais payés
 */
export function calculateTotalFees(transactions: Array<{ fee: number }>): number {
  return transactions.reduce((sum, t) => sum + t.fee, 0)
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

/**
 * Calcule la projection d'objectif avec versements mensuels
 * Génère une courbe exponentielle de la date de départ jusqu'à l'objectif
 */
export function calculateObjectiveProjection(
  currentWealth: number,
  objective: ObjectiveParams,
  startDate: Date
): Array<{ date: Date; value: number }> {
  const points: Array<{ date: Date; value: number }> = []
  const now = new Date()
  const r = objective.interestRate / 100
  const monthlyRate = r / 12
  const totalMonths = objective.targetYears * 12

  // Calculer le versement mensuel nécessaire
  const monthlyPayment = calculateMonthlyPayment(
    currentWealth,
    objective.targetAmount,
    objective.interestRate,
    objective.targetYears
  )

  // Calculer combien de mois se sont écoulés depuis le début
  const monthsElapsed = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  )

  // Générer les points mensuels
  for (let month = 0; month <= totalMonths; month++) {
    const pointDate = new Date(startDate)
    pointDate.setMonth(pointDate.getMonth() + month)

    let value: number

    if (month <= monthsElapsed) {
      // Projection passée/actuelle : interpoler vers le patrimoine actuel
      const progressRatio = monthsElapsed > 0 ? month / monthsElapsed : 0
      value = progressRatio * currentWealth
    } else {
      // Projection future : formule exponentielle avec versements
      const monthsFromNow = month - monthsElapsed
      const fvPresent = currentWealth * Math.pow(1 + monthlyRate, monthsFromNow)
      const fvPayments =
        monthsFromNow > 0
          ? (monthlyPayment * (Math.pow(1 + monthlyRate, monthsFromNow) - 1)) / monthlyRate
          : 0

      value = fvPresent + fvPayments
    }

    points.push({
      date: pointDate,
      value: Math.max(0, value)
    })
  }

  return points
}
