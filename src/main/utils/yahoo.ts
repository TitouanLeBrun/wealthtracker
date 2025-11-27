/**
 * Yahoo Finance API Service
 * Gère la résolution de symboles (ticker/ISIN) et la récupération des prix
 */

interface YahooSearchResult {
  symbol: string
  shortname?: string
  longname?: string
  quoteType?: string
  exchange?: string
  isin?: string
}

interface YahooSearchResponse {
  quotes?: YahooSearchResult[]
}

interface ResolvedSymbol {
  symbol: string
  isin?: string
  name?: string
}

interface YahooChartResult {
  meta?: {
    regularMarketPrice?: number
  }
}

interface YahooChartResponse {
  chart?: {
    result?: YahooChartResult[]
    error?: {
      code: string
      description: string
    }
  }
}

/**
 * Résout un ticker ou un ISIN en symbole Yahoo Finance
 * @param query - Ticker (ex: AAPL) ou ISIN (ex: FR0000120271)
 * @returns Informations du symbole ou null si non trouvé
 */
export async function resolveSymbol(query: string): Promise<ResolvedSymbol | null> {
  try {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      console.warn('[Yahoo] Query vide')
      return null
    }

    console.log(`[Yahoo] Résolution de: ${trimmedQuery}`)

    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(trimmedQuery)}`
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      console.error(`[Yahoo] Erreur HTTP ${response.status}`)
      return null
    }

    const data = (await response.json()) as YahooSearchResponse

    if (!data.quotes || data.quotes.length === 0) {
      console.warn(`[Yahoo] Aucun résultat pour: ${trimmedQuery}`)
      return null
    }

    // Filtrer pour obtenir uniquement les actions et ETF
    const validQuotes = data.quotes.filter(
      (quote) => quote.quoteType === 'EQUITY' || quote.quoteType === 'ETF'
    )

    if (validQuotes.length === 0) {
      console.warn(`[Yahoo] Aucun résultat EQUITY/ETF pour: ${trimmedQuery}`)
      return null
    }

    const firstResult = validQuotes[0]

    const resolved: ResolvedSymbol = {
      symbol: firstResult.symbol,
      name: firstResult.longname || firstResult.shortname || firstResult.symbol,
      isin: firstResult.isin
    }

    console.log(`[Yahoo] Résolu: ${trimmedQuery} → ${resolved.symbol}`, resolved)

    return resolved
  } catch (error) {
    console.error('[Yahoo] Erreur lors de la résolution:', error)
    return null
  }
}

/**
 * Récupère le dernier prix d'un symbole Yahoo Finance
 * @param symbol - Symbole Yahoo (ex: AAPL, CW8.PA)
 * @returns Prix actuel ou null si non disponible
 */
export async function getLatestPrice(symbol: string): Promise<number | null> {
  try {
    const trimmedSymbol = symbol.trim()
    if (!trimmedSymbol) {
      console.warn('[Yahoo] Symbole vide')
      return null
    }

    console.log(`[Yahoo] Récupération prix pour: ${trimmedSymbol}`)

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(trimmedSymbol)}`
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      console.error(`[Yahoo] Erreur HTTP ${response.status}`)
      return null
    }

    const data = (await response.json()) as YahooChartResponse

    if (data.chart?.error) {
      console.error(`[Yahoo] Erreur API:`, data.chart.error)
      return null
    }

    const price = data.chart?.result?.[0]?.meta?.regularMarketPrice

    if (typeof price !== 'number' || isNaN(price)) {
      console.warn(`[Yahoo] Prix non disponible pour: ${trimmedSymbol}`)
      return null
    }

    console.log(`[Yahoo] Prix pour ${trimmedSymbol}: ${price}`)

    return price
  } catch (error) {
    console.error('[Yahoo] Erreur lors de la récupération du prix:', error)
    return null
  }
}

/**
 * Résout un ticker/ISIN et récupère son prix en une seule opération
 * @param query - Ticker ou ISIN
 * @returns Symbole résolu avec prix ou null
 */
export async function resolveAndGetPrice(
  query: string
): Promise<(ResolvedSymbol & { price: number | null }) | null> {
  const resolved = await resolveSymbol(query)

  if (!resolved) {
    return null
  }

  const price = await getLatestPrice(resolved.symbol)

  return {
    ...resolved,
    price
  }
}
