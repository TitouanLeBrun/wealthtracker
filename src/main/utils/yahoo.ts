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

// Nouveau : Interface détaillée pour la recherche
export interface YahooAssetSearchResult {
  symbol: string // Ticker Yahoo (ex: PLEM.PA)
  name: string // Nom complet (shortname ou longname)
  quoteType: string // Type : ETF, EQUITY, CRYPTOCURRENCY, etc.
  exchange: string // Bourse (ex: PAR, NYSEArca)
  isin?: string // Code ISIN si disponible
  currency?: string // Devise (USD, EUR, etc.)
}

interface YahooChartResult {
  meta?: {
    regularMarketPrice?: number
    currency?: string
    symbol?: string
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

    // Utiliser query2 pour la recherche (meilleure API)
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(trimmedQuery)}&quotesCount=10&newsCount=0`
    console.log(`[Yahoo] URL de recherche: ${url}`)

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (!response.ok) {
      console.error(`[Yahoo] Erreur HTTP ${response.status}`)
      return null
    }

    const data = (await response.json()) as YahooSearchResponse
    console.log(`[Yahoo] Réponse brute:`, JSON.stringify(data, null, 2))

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
      console.log(
        `[Yahoo] Types disponibles:`,
        data.quotes.map((q) => q.quoteType)
      )
      return null
    }

    const firstResult = validQuotes[0]

    const resolved: ResolvedSymbol = {
      symbol: firstResult.symbol,
      name: firstResult.longname || firstResult.shortname || firstResult.symbol,
      isin: firstResult.isin
    }

    console.log(`[Yahoo] ✓ Résolu: ${trimmedQuery} → ${resolved.symbol}`, resolved)

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
    console.error(`[Yahoo] URL HTTP ${url}`)

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

/**
 * Récupère les prix pour plusieurs symboles en parallèle (avec throttling)
 * @param symbols - Liste des symboles Yahoo à interroger
 * @param maxConcurrent - Nombre maximum de requêtes simultanées (défaut: 5)
 * @returns Map des symboles avec leur prix (ou null si erreur)
 */
export async function getBatchPrices(
  symbols: string[],
  maxConcurrent = 5
): Promise<Map<string, number | null>> {
  const results = new Map<string, number | null>()

  // Fonction pour traiter un batch de symboles
  const processBatch = async (batch: string[]): Promise<void> => {
    const promises = batch.map(async (symbol) => {
      const price = await getLatestPrice(symbol)
      results.set(symbol, price)
    })

    await Promise.all(promises)
  }

  // Découper en batches pour éviter de surcharger l'API
  for (let i = 0; i < symbols.length; i += maxConcurrent) {
    const batch = symbols.slice(i, i + maxConcurrent)
    await processBatch(batch)

    // Petit délai entre les batches pour respecter les limites de l'API
    if (i + maxConcurrent < symbols.length) {
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }

  console.log(`[Yahoo] Prix récupérés pour ${results.size}/${symbols.length} symboles`)

  return results
}

/**
 * Recherche complète d'un actif par ISIN ou Ticker
 * NOUVELLE FONCTION pour le formulaire moderne
 * @param query - ISIN (ex: FR0013412020) ou Ticker (ex: PLEM.PA)
 * @returns Résultat détaillé avec prix ou null si non trouvé
 */
export async function searchAsset(
  query: string
): Promise<(YahooAssetSearchResult & { price: number | null }) | null> {
  try {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      console.warn('[Yahoo:Search] Query vide')
      return null
    }

    console.log(`[Yahoo:Search] 🔍 Recherche de: ${trimmedQuery}`)

    // ÉTAPE 1 : Rechercher via l'API Yahoo Search
    const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(trimmedQuery)}&quotesCount=10&newsCount=0`
    console.log(`[Yahoo:Search] URL: ${searchUrl}`)

    const searchResponse = await fetch(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (!searchResponse.ok) {
      console.error(`[Yahoo:Search] Erreur HTTP ${searchResponse.status}`)
      return null
    }

    const searchData = (await searchResponse.json()) as YahooSearchResponse

    if (!searchData.quotes || searchData.quotes.length === 0) {
      console.warn(`[Yahoo:Search] ❌ Aucun résultat pour: ${trimmedQuery}`)
      return null
    }

    // Prendre le premier résultat (score le plus élevé)
    const firstQuote = searchData.quotes[0]

    console.log(`[Yahoo:Search] ✅ Résultat trouvé:`, {
      symbol: firstQuote.symbol,
      name: firstQuote.shortname || firstQuote.longname,
      type: firstQuote.quoteType
    })

    // ÉTAPE 2 : Récupérer le prix via l'API Chart
    const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(firstQuote.symbol)}?interval=1d&range=1d`
    console.log(`[Yahoo:Search] Récupération prix: ${chartUrl}`)

    const chartResponse = await fetch(chartUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    let price: number | null = null
    let currency: string | undefined = undefined

    if (chartResponse.ok) {
      const chartData = (await chartResponse.json()) as YahooChartResponse

      if (chartData.chart?.result?.[0]?.meta) {
        const meta = chartData.chart.result[0].meta
        price = meta.regularMarketPrice || null
        currency = meta.currency
        console.log(`[Yahoo:Search] 💰 Prix récupéré: ${price} ${currency}`)
      }
    } else {
      console.warn(`[Yahoo:Search] ⚠ Impossible de récupérer le prix pour ${firstQuote.symbol}`)
    }

    // Retourner le résultat complet
    const result: YahooAssetSearchResult & { price: number | null } = {
      symbol: firstQuote.symbol,
      name: firstQuote.longname || firstQuote.shortname || firstQuote.symbol,
      quoteType: firstQuote.quoteType || 'UNKNOWN',
      exchange: firstQuote.exchange || 'UNKNOWN',
      isin: firstQuote.isin,
      currency: currency,
      price: price
    }

    console.log(`[Yahoo:Search] ✅ Recherche complète terminée:`, result)

    return result
  } catch (error) {
    console.error('[Yahoo:Search] Erreur lors de la recherche:', error)
    return null
  }
}

/**
 * Mapper le quoteType Yahoo vers une catégorie locale
 * @param quoteType - Type Yahoo (ETF, EQUITY, CRYPTOCURRENCY, etc.)
 * @returns Nom de catégorie standardisé
 */
export function mapQuoteTypeToCategory(quoteType: string): string {
  const mapping: Record<string, string> = {
    ETF: 'ETF',
    EQUITY: 'Actions',
    CRYPTOCURRENCY: 'Crypto',
    MUTUALFUND: 'Fonds',
    INDEX: 'Indices',
    CURRENCY: 'Devises',
    FUTURE: 'Futures',
    OPTION: 'Options'
  }

  return mapping[quoteType.toUpperCase()] || 'Autres'
}
