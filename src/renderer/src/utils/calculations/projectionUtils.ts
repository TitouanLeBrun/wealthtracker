/**
 * Utilitaires de calcul pour les projections financières
 * Ce fichier réexporte toutes les fonctions depuis les modules spécialisés
 * pour maintenir la compatibilité avec le code existant
 */

// Réexporter les formules financières
export {
  type ObjectiveParams,
  calculateFutureValue,
  calculateMonthlyPayment,
  calculateCAGR,
  formatEuros,
  formatPercent,
  calculateTotalFees
} from './financialCalculations'

// Réexporter les utilitaires de date
export {
  formatDateForChart,
  getMonthsDifference,
  generateMonthlyDates,
  getFirstTransactionDate,
  interpolateValue
} from './dateUtils'

// Réexporter les calculs de patrimoine
export {
  calculateCurrentWealth,
  calculateWealthAtDate,
  calculateHistoricalWealth
} from './wealthCalculations'

// Réexporter les générateurs de données de graphiques
export {
  type ProjectionPoint,
  generateObjectiveCurve,
  calculateObjectiveProjection,
  generateTimeRangeDates,
  calculateRealityChartData,
  calculateObjectiveChartData,
  calculateInvestedCapitalData,
  calculateInterestEarnedData
} from './chartDataGenerators'
