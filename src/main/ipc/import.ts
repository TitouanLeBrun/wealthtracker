import { ipcMain } from 'electron'
import { getPrismaClient } from '../database/client'
import { parseTradeRepublicCSV, type ImportResult } from '../utils/importers/tradeRepublicParser'
import { searchAssetByISIN, getHistoricalPrice, type YahooAssetSearchResult } from '../utils/yahoo'

interface ImportTransactionsParams {
  fileContent: string
  source: 'TradeRepublic' | 'Kraken' | 'Other'
}

interface UnresolvedAsset {
  assetName: string
  isin: string | null
  transactions: {
    date: string
    type: 'BUY' | 'SELL'
    quantity: number
    pricePerUnit: number
    fee: number
  }[]
}

interface ImportTransactionsResult extends ImportResult {
  createdAssets: string[]
  createdCategory: boolean
  unresolvedAssets: UnresolvedAsset[]
}

/**
 * Trouve ou crée un actif par ISIN en utilisant Yahoo Finance
 * Retourne null si l'actif ne peut pas être résolu automatiquement
 */
async function getOrCreateAssetWithISIN(
  assetName: string,
  isin: string | null,
  isPEA = false
): Promise<{ id: number; created: boolean; categoryId: number } | null> {
  const db = await getPrismaClient()

  // 1. Chercher d'abord par ISIN si disponible
  if (isin) {
    const existingByISIN = await db.asset.findFirst({
      where: { isin }
    })

    if (existingByISIN) {
      return { id: existingByISIN.id, created: false, categoryId: existingByISIN.categoryId }
    }
  }

  // 2. Chercher par nom
  const existingByName = await db.asset.findFirst({
    where: { name: assetName }
  })

  if (existingByName) {
    return { id: existingByName.id, created: false, categoryId: existingByName.categoryId }
  }

  // 3. Essayer de résoudre via Yahoo Finance avec l'ISIN
  let yahooResult: YahooAssetSearchResult | null = null

  if (isin) {
    try {
      console.log(`[Import] Recherche Yahoo par ISIN: ${isin}`)
      yahooResult = await searchAssetByISIN(isin)

      if (yahooResult) {
        console.log(`[Import] ✓ Actif trouvé par ISIN: ${yahooResult.name}`)
      }
    } catch (error) {
      console.error(`[Import] Erreur recherche Yahoo pour ISIN ${isin}:`, error)
    }
  }

  // 4. Si ISIN non trouvé ou absent, essayer avec le nom de l'actif
  if (!yahooResult && assetName) {
    try {
      console.log(`[Import] Recherche Yahoo par nom: ${assetName}`)
      yahooResult = await searchAssetByISIN(assetName)

      if (yahooResult) {
        console.log(`[Import] ✓ Actif trouvé par nom: ${yahooResult.name}`)
      }
    } catch (error) {
      console.error(`[Import] Erreur recherche Yahoo pour nom ${assetName}:`, error)
    }
  }

  // 5. Si un résultat Yahoo a été trouvé (par ISIN ou nom), créer l'actif
  if (yahooResult) {
    try {
      // Créer/récupérer la catégorie automatique
      // Pour les actifs PEA, utiliser "ETF/PEA" au lieu du mapping standard
      const categoryName = isPEA ? 'ETF/PEA' : mapQuoteTypeToCategory(yahooResult.quoteType)
      const category = await db.category.findFirst({ where: { name: categoryName } })

      let categoryId: number
      if (!category) {
        const newCategory = await db.category.create({
          data: { name: categoryName, color: getDefaultColorForCategory(categoryName) }
        })
        categoryId = newCategory.id
      } else {
        categoryId = category.id
      }

      // Créer l'actif avec les données Yahoo
      const newAsset = await db.asset.create({
        data: {
          name: yahooResult.name,
          ticker: yahooResult.symbol,
          isin: yahooResult.isin || isin || undefined,
          currentPrice: yahooResult.price || 0,
          categoryId
        }
      })

      console.log(`[Import] ✓ Actif créé: ${newAsset.name} (${newAsset.ticker})`)
      return { id: newAsset.id, created: true, categoryId }
    } catch (error) {
      console.error(`[Import] Erreur lors de la création de l'actif:`, error)
    }
  }

  // 6. Impossible de résoudre automatiquement
  console.warn(`[Import] ❌ Impossible de résoudre l'actif: ${assetName} (ISIN: ${isin || 'N/A'})`)
  return null
}

/**
 * Mapping Yahoo quoteType → Nom de catégorie
 */
function mapQuoteTypeToCategory(quoteType: string): string {
  const mapping: Record<string, string> = {
    ETF: 'ETF',
    EQUITY: 'Actions',
    CRYPTOCURRENCY: 'Crypto',
    MUTUALFUND: 'Fonds',
    INDEX: 'Indices',
    CURRENCY: 'Devises'
  }
  return mapping[quoteType] || 'Autres'
}

/**
 * Couleurs par défaut pour les catégories
 */
function getDefaultColorForCategory(categoryName: string): string {
  const colors: Record<string, string> = {
    ETF: '#3B82F6',
    'ETF/PEA': '#8B5CF6', // Couleur spécifique pour ETF/PEA
    Actions: '#10B981',
    Crypto: '#F59E0B',
    Fonds: '#8B5CF6',
    Indices: '#EC4899',
    Devises: '#6366F1',
    Autres: '#9CA3AF'
  }
  return colors[categoryName] || '#9CA3AF'
}

/**
 * Import des transactions depuis un fichier CSV/XLSX
 */
export function registerImportHandlers(): void {
  ipcMain.handle('importTransactions', async (_, params: ImportTransactionsParams) => {
    const { fileContent, source } = params

    try {
      // Parser selon la source
      let parseResult: ImportResult

      if (source === 'TradeRepublic') {
        parseResult = parseTradeRepublicCSV(fileContent)
      } else {
        throw new Error(`Source non supportée: ${source}`)
      }

      // Préparer le résultat
      const result: ImportTransactionsResult = {
        ...parseResult,
        createdAssets: [],
        createdCategory: false,
        unresolvedAssets: []
      }

      // Si aucune transaction valide, retourner
      if (parseResult.validTransactions.length === 0) {
        return result
      }

      const db = await getPrismaClient()

      // Grouper les transactions par actif
      const transactionsByAsset = new Map<
        string,
        {
          assetName: string
          isin: string | null
          isPEA: boolean
          transactions: typeof parseResult.validTransactions
        }
      >()

      for (const tx of parseResult.validTransactions) {
        const key = tx.isin || tx.assetName
        if (!transactionsByAsset.has(key)) {
          transactionsByAsset.set(key, {
            assetName: tx.assetName,
            isin: tx.isin,
            isPEA: tx.isPEA,
            transactions: []
          })
        }
        transactionsByAsset.get(key)!.transactions.push(tx)
      }

      // Traiter chaque actif
      for (const [, assetGroup] of transactionsByAsset) {
        const assetResult = await getOrCreateAssetWithISIN(
          assetGroup.assetName,
          assetGroup.isin,
          assetGroup.isPEA
        )

        if (!assetResult) {
          // Actif non résolu → mode manuel requis
          result.unresolvedAssets.push({
            assetName: assetGroup.assetName,
            isin: assetGroup.isin,
            transactions: assetGroup.transactions.map((tx) => ({
              date: tx.date,
              type: tx.type,
              quantity: tx.quantity,
              pricePerUnit: tx.pricePerUnit,
              fee: tx.fee
            }))
          })
          continue
        }

        // Actif résolu → créer les transactions
        if (assetResult.created) {
          result.createdAssets.push(assetGroup.assetName)
        }

        // Récupérer le ticker de l'actif pour les résolutions de prix
        const asset = await db.asset.findUnique({
          where: { id: assetResult.id },
          select: { ticker: true }
        })

        for (const tx of assetGroup.transactions) {
          let quantity = tx.quantity
          let pricePerUnit = tx.pricePerUnit

          // Traiter les transactions nécessitant une résolution de prix
          if (tx.needsPriceResolution && asset?.ticker) {
            try {
              const historicalPrice = await getHistoricalPrice(asset.ticker, tx.date)

              if (historicalPrice && historicalPrice > 0) {
                // Calculer la quantité
                // Pour les PEA : arrondir au supérieur (actions entières obligatoires)
                // Pour les autres : arrondir au plus proche
                if (tx.isPEA) {
                  quantity = Math.ceil(tx.amountValue / historicalPrice)
                  console.log(
                    `[Import PEA] ${tx.assetName}: prix historique ${historicalPrice}€, quantité calculée (arrondi sup): ${quantity}`
                  )
                } else {
                  quantity = Math.round(tx.amountValue / historicalPrice)
                  console.log(
                    `[Import] ${tx.assetName}: prix historique ${historicalPrice}€, quantité calculée: ${quantity}`
                  )
                }
                pricePerUnit = historicalPrice
              } else {
                console.warn(
                  `[Import] Impossible de récupérer le prix historique pour ${tx.assetName} à ${tx.date}`
                )
                // Ajouter un warning
                result.warnings.push({
                  line: 0,
                  reason: `Prix historique non disponible pour ${tx.assetName} (${new Date(tx.date).toLocaleDateString()})`,
                  data: tx
                })
              }
            } catch (error) {
              console.error(
                `[Import] Erreur lors de la récupération du prix pour ${tx.assetName}:`,
                error
              )
            }
          }

          await db.transaction.create({
            data: {
              assetId: assetResult.id,
              type: tx.type,
              quantity,
              pricePerUnit,
              fee: tx.fee,
              date: new Date(tx.date)
            }
          })
        }
      }

      return result
    } catch (error) {
      console.error("Erreur lors de l'import:", error)
      throw error
    }
  })
}
