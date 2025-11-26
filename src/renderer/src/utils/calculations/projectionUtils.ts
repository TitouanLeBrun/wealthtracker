/**
 * Utilitaires de calcul pour les projections financières
 * Formules d'intérêt composé avec versements mensuels
 */

import type { TimeRangeConfig, ChartDataPoint } from '@renderer/types/projection'

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
 * Génère les dates pour une période donnée, centrées sur aujourd'hui
 */
export function generateTimeRangeDates(config: TimeRangeConfig, today: Date = new Date()): Date[] {
  const dates: Date[] = []
  const startDate = new Date(today)
  const endDate = new Date(today)

  // Calculer la plage
  startDate.setMonth(today.getMonth() - config.pastMonths)
  endDate.setMonth(today.getMonth() + config.futureMonths)

  if (config.granularity === 'monthly') {
    // Points mensuels (DERNIER JOUR de chaque mois)
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)

    while (current <= endDate) {
      // Dernier jour du mois = 1er du mois suivant - 1 jour
      const lastDayOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0)

      // Si c'est le mois actuel, utiliser aujourd'hui au lieu du dernier jour
      if (
        lastDayOfMonth.getMonth() === today.getMonth() &&
        lastDayOfMonth.getFullYear() === today.getFullYear()
      ) {
        dates.push(new Date(today))
      } else {
        dates.push(lastDayOfMonth)
      }

      current.setMonth(current.getMonth() + 1)
    }
  } else {
    // Points hebdomadaires (tous les dimanches = fin de semaine)
    const current = new Date(startDate)
    // Avancer au dimanche suivant
    const dayOfWeek = current.getDay()
    const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
    current.setDate(current.getDate() + daysToSunday)

    while (current <= endDate) {
      // Si c'est la semaine actuelle, utiliser aujourd'hui
      const weekStart = new Date(current)
      weekStart.setDate(current.getDate() - 6) // Lundi de cette semaine

      if (today >= weekStart && today <= current) {
        dates.push(new Date(today))
      } else {
        dates.push(new Date(current))
      }

      current.setDate(current.getDate() + 7) // +1 semaine
    }
  }

  return dates
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

/**
 * Génère les données de patrimoine réel pour une plage de dates
 */
export function calculateRealityChartData(
  dates: Date[],
  assets: Array<{ id: number; currentPrice: number }>,
  transactions: Array<{
    assetId: number
    type: 'BUY' | 'SELL'
    quantity: number
    date: Date
  }>,
  today: Date = new Date()
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []

  // Pour chaque date demandée
  dates.forEach((date) => {
    if (date > today) {
      return
    }

    // Calculer le patrimoine exact à cette date
    const wealth = calculateWealthAtDate(assets, transactions, date)

    data.push({
      time: formatDateForChart(date),
      value: wealth
    })
  })

  return data
}

/**
 * Génère la courbe objectif théorique (projection rétroactive complète)
 */
export function calculateObjectiveChartData(
  dates: Date[],
  currentWealth: number,
  objective: ObjectiveParams,
  today: Date = new Date()
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []

  // Paramètres
  const targetAmount = objective.targetAmount
  const targetYears = objective.targetYears
  const annualRate = objective.interestRate / 100
  const monthlyRate = annualRate / 12

  // Calculer le versement mensuel nécessaire
  const totalMonths = targetYears * 12
  const rateCompounded = Math.pow(1 + annualRate, targetYears)

  const monthlyPayment =
    totalMonths > 0
      ? (targetAmount - currentWealth * rateCompounded) *
        (monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1))
      : 0

  dates.forEach((date) => {
    const monthsFromNow = getMonthsDifference(today, date)

    let value: number

    if (date <= today) {
      // Projection rétroactive (passé)
      // Formule inversée : Capital_actuel / (1 + taux)^mois_écoulés
      const monthsElapsed = Math.abs(monthsFromNow)
      value = currentWealth / Math.pow(1 + monthlyRate, monthsElapsed)
    } else {
      // Projection future
      const monthsAhead = monthsFromNow
      value =
        currentWealth * Math.pow(1 + monthlyRate, monthsAhead) +
        monthlyPayment * ((Math.pow(1 + monthlyRate, monthsAhead) - 1) / monthlyRate)
    }

    data.push({
      time: formatDateForChart(date),
      value: Math.max(0, value) // Éviter les valeurs négatives
    })
  })

  return data
}

/**
 * Calcule le capital investi théorique pour atteindre l'objectif
 * IMPORTANT: Cette fonction calcule le capital THÉORIQUE nécessaire pour atteindre
 * l'objectif avec les intérêts composés, pas le capital réellement investi.
 *
 * @param dates - Dates pour lesquelles calculer le capital
 * @param currentWealth - Patrimoine actuel
 * @param objective - Paramètres de l'objectif
 * @param today - Date actuelle
 * @returns Tableau de points représentant le capital théorique investi
 */
export function calculateInvestedCapitalData(
  dates: Date[],
  currentWealth: number,
  objective: ObjectiveParams,
  today: Date = new Date()
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []

  const annualRate = objective.interestRate / 100
  const monthlyRate = annualRate / 12
  const targetAmount = objective.targetAmount
  const targetYears = objective.targetYears
  const totalMonths = targetYears * 12

  // Calculer le versement mensuel théorique nécessaire
  const rateCompounded = Math.pow(1 + annualRate, targetYears)
  const monthlyPayment =
    totalMonths > 0
      ? (targetAmount - currentWealth * rateCompounded) *
        (monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1))
      : 0

  dates.forEach((date) => {
    const monthsFromNow = getMonthsDifference(today, date)

    let capitalInvested: number

    if (date <= today) {
      // Passé : calculer le capital théorique qui aurait dû être investi
      // Formule : Capital = Somme des versements passés (sans intérêts)
      const monthsElapsed = Math.abs(monthsFromNow)

      // Capital = versement mensuel × nombre de mois écoulés
      // On part du patrimoine actuel et on remonte dans le temps
      // en enlevant les intérêts accumulés
      const theoreticalCapitalAtStart = currentWealth / Math.pow(1 + monthlyRate, monthsElapsed)

      // Capital investi = capital de départ + versements jusqu'à cette date
      const monthsFromStart = monthsElapsed
      capitalInvested = theoreticalCapitalAtStart + monthlyPayment * monthsFromStart
    } else {
      // Futur : capital actuel + versements futurs
      const monthsAhead = monthsFromNow
      capitalInvested = currentWealth + monthlyPayment * monthsAhead
    }

    data.push({
      time: formatDateForChart(date),
      value: Math.max(0, capitalInvested)
    })
  })

  return data
}

/**
 * Calcule les intérêts théoriques reçus
 * FORMULE CORRECTE : Intérêts = Objectif Théorique - Capital Investi
 * Cela garantit que Capital + Intérêts = Objectif pour chaque date
 *
 * @param dates - Dates pour lesquelles calculer les intérêts
 * @param objectiveData - Données de la courbe objectif théorique
 * @param capitalData - Données de la courbe capital investi
 * @returns Tableau de points représentant les intérêts gagnés
 */
export function calculateInterestEarnedData(
  dates: Date[],
  objectiveData: ChartDataPoint[],
  capitalData: ChartDataPoint[]
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []

  // Créer des maps pour un accès rapide par date
  const objectiveMap = new Map(objectiveData.map((p) => [p.time, p.value]))
  const capitalMap = new Map(capitalData.map((p) => [p.time, p.value]))

  dates.forEach((date) => {
    const timeKey = formatDateForChart(date)
    const objectiveValue = objectiveMap.get(timeKey) || 0
    const capitalValue = capitalMap.get(timeKey) || 0

    // Intérêts = Objectif - Capital
    const interest = objectiveValue - capitalValue

    data.push({
      time: timeKey,
      value: Math.max(0, interest) // Éviter les valeurs négatives
    })
  })

  return data
}
