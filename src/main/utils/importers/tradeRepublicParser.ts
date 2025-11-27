import Papa from 'papaparse'

export interface ParsedTransaction {
  date: string // ISO format
  assetName: string
  isin: string | null
  type: 'BUY' | 'SELL'
  quantity: number
  pricePerUnit: number
  fee: number
  total: number
}

export interface ImportResult {
  validTransactions: ParsedTransaction[]
  errors: { line: number; reason: string; data?: unknown }[]
  warnings: { line: number; reason: string; data?: unknown }[]
  summary: {
    total: number
    valid: number
    errors: number
    warnings: number
  }
}

/**
 * Extrait l'ISIN depuis le champ icon
 * Format: "logos/FR0011871128/v2" → "FR0011871128"
 */
function extractISIN(icon: string): string | null {
  if (!icon) return null
  const match = icon.match(/logos\/([A-Z]{2}[A-Z0-9]{10})\//)
  return match ? match[1] : null
}

/**
 * Parse un montant au format TradeRepublic
 * Exemples: "80,18", "+ 897,76 €", "Gratuit"
 */
function parseAmount(value: string): number {
  if (!value || value.trim() === '' || value.toLowerCase() === 'gratuit') {
    return 0
  }

  // Nettoyer: enlever €, +, espaces
  const cleaned = value.replace(/[€+\s]/g, '').replace(',', '.')

  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : Math.abs(parsed)
}

/**
 * Parse une date au format DD/MM/YYYY vers ISO
 */
function parseDate(dateStr: string): string | null {
  if (!dateStr) return null

  const parts = dateStr.split('/')
  if (parts.length !== 3) return null

  const [day, month, year] = parts
  const date = new Date(`${year}-${month}-${day}`)

  if (isNaN(date.getTime())) return null

  return date.toISOString()
}

/**
 * Détermine le type de transaction depuis le subtitle
 */
function getTransactionType(subtitle: string): 'BUY' | 'SELL' | null {
  if (!subtitle) return null

  const lower = subtitle.toLowerCase()

  if (
    lower.includes("plan d'épargne exécuté") ||
    lower.includes("ordre d'achat") ||
    lower.includes("order d'achat")
  ) {
    return 'BUY'
  }

  if (lower.includes('ordre de vente') || lower.includes('order de vente')) {
    return 'SELL'
  }

  return null
}

/**
 * Parse un fichier CSV TradeRepublic
 */
export function parseTradeRepublicCSV(fileContent: string): ImportResult {
  const result: ImportResult = {
    validTransactions: [],
    errors: [],
    warnings: [],
    summary: {
      total: 0,
      valid: 0,
      errors: 0,
      warnings: 0
    }
  }

  try {
    const parsed = Papa.parse(fileContent, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true
    })

    if (parsed.errors.length > 0) {
      parsed.errors.forEach((error) => {
        result.errors.push({
          line: error.row || 0,
          reason: `Erreur de parsing: ${error.message}`
        })
      })
    }

    parsed.data.forEach((row, index: number) => {
      const lineNumber = index + 2 // +2 car ligne 1 = header

      result.summary.total++

      // Row as CSV data
      const csvRow = row as Record<string, string>

      // Vérifier si c'est une transaction valide
      const type = getTransactionType(csvRow.subtitle)

      if (!type) {
        // Ignorer silencieusement (virements, intérêts, etc.)
        return
      }

      // Extraire les données
      const date = parseDate(csvRow.timestamp)
      const assetName = csvRow.title?.trim()
      const isin = extractISIN(csvRow.icon)

      // Validation de base
      if (!date) {
        result.errors.push({
          line: lineNumber,
          reason: 'Date invalide',
          data: csvRow
        })
        result.summary.errors++
        return
      }

      if (!assetName) {
        result.errors.push({
          line: lineNumber,
          reason: "Nom d'actif manquant",
          data: csvRow
        })
        result.summary.errors++
        return
      }

      // Parser les montants
      const quantity = parseAmount(csvRow.Titres)
      const pricePerUnit = parseAmount(csvRow['Cours du titre'])
      const fee = parseAmount(csvRow.Frais)
      const total = parseAmount(csvRow.Total)

      // Vérifier si les données sont manquantes
      let hasWarning = false

      if (quantity === 0) {
        result.warnings.push({
          line: lineNumber,
          reason: 'Quantité manquante ou nulle (importée avec 0)',
          data: csvRow
        })
        hasWarning = true
      }

      if (pricePerUnit === 0) {
        result.warnings.push({
          line: lineNumber,
          reason: 'Prix unitaire manquant ou nul (importé avec 0)',
          data: csvRow
        })
        hasWarning = true
      }

      if (hasWarning) {
        result.summary.warnings++
      }

      // Créer la transaction
      const transaction: ParsedTransaction = {
        date,
        assetName,
        isin,
        type,
        quantity,
        pricePerUnit,
        fee,
        total
      }

      result.validTransactions.push(transaction)
      result.summary.valid++
    })
  } catch (error) {
    result.errors.push({
      line: 0,
      reason: `Erreur fatale lors du parsing: ${error instanceof Error ? error.message : String(error)}`
    })
    result.summary.errors++
  }

  return result
}
