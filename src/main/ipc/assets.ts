import { ipcMain } from 'electron'
import { getPrismaClient } from '../database/client'
import { resolveSymbol, getLatestPrice, getBatchPrices, searchAsset } from '../utils/yahoo'

export function registerAssetHandlers(): void {
  // ==================== ASSETS ====================

  ipcMain.handle('asset:getAll', async () => {
    try {
      const prisma = await getPrismaClient()
      return await prisma.asset.findMany({
        include: {
          category: true
        },
        orderBy: { ticker: 'asc' }
      })
    } catch (error) {
      console.error('[IPC] Error fetching assets:', error)
      throw error
    }
  })

  ipcMain.handle(
    'asset:create',
    async (
      _,
      data: {
        name: string
        ticker: string
        isin: string
        currentPrice: number
        categoryId: number
      }
    ) => {
      try {
        const prisma = await getPrismaClient()

        let finalTicker = data.ticker
        let finalPrice = data.currentPrice
        let isinCode: string | undefined = data.isin || undefined

        // PRIORITÉ 1 : Si un ISIN est fourni, on le résout d'abord
        if (data.isin && data.isin.trim()) {
          console.log(`[Asset:Create] ISIN fourni: ${data.isin} - Résolution en cours...`)
          const resolvedFromIsin = await resolveSymbol(data.isin.trim())

          if (resolvedFromIsin) {
            console.log(`[Asset:Create] ✓ ISIN résolu: ${data.isin} → ${resolvedFromIsin.symbol}`)
            finalTicker = resolvedFromIsin.symbol
            isinCode = data.isin.trim().toUpperCase() // Garder l'ISIN fourni

            // Récupérer le prix si non fourni
            if (finalPrice === 0 || !finalPrice) {
              const price = await getLatestPrice(resolvedFromIsin.symbol)
              if (price !== null) {
                finalPrice = price
                console.log(`[Asset:Create] ✓ Prix récupéré: ${finalPrice}`)
              }
            }
          } else {
            console.warn(`[Asset:Create] ⚠ ISIN ${data.isin} non résolu, tentative avec ticker...`)
          }
        }

        // PRIORITÉ 2 : Si pas d'ISIN ou résolution échouée, essayer le ticker
        if (finalTicker === data.ticker && data.ticker && data.ticker.trim()) {
          console.log(`[Asset:Create] Tentative de résolution du ticker: ${data.ticker}`)
          const resolvedFromTicker = await resolveSymbol(data.ticker.trim())

          if (resolvedFromTicker) {
            console.log(
              `[Asset:Create] ✓ Ticker résolu: ${data.ticker} → ${resolvedFromTicker.symbol}`
            )
            finalTicker = resolvedFromTicker.symbol
            if (!isinCode && resolvedFromTicker.isin) {
              isinCode = resolvedFromTicker.isin
            }

            // Récupérer le prix si non fourni
            if (finalPrice === 0 || !finalPrice) {
              const price = await getLatestPrice(resolvedFromTicker.symbol)
              if (price !== null) {
                finalPrice = price
                console.log(`[Asset:Create] ✓ Prix récupéré: ${finalPrice}`)
              }
            }
          } else {
            console.warn(
              `[Asset:Create] ⚠ Ticker ${data.ticker} non résolu, utilisation valeur brute`
            )
          }
        }

        // Créer l'actif avec les données résolues
        console.log(`[Asset:Create] Création actif:`, {
          ticker: finalTicker,
          isin: isinCode,
          price: finalPrice
        })

        return await prisma.asset.create({
          data: {
            name: data.name,
            ticker: finalTicker,
            isin: isinCode,
            currentPrice: finalPrice,
            categoryId: data.categoryId
          },
          include: {
            category: true
          }
        })
      } catch (error) {
        console.error('[IPC] Error creating asset:', error)
        throw error
      }
    }
  )

  ipcMain.handle('asset:updatePrice', async (_, data: { assetId: number; newPrice: number }) => {
    try {
      const prisma = await getPrismaClient()
      return await prisma.asset.update({
        where: { id: data.assetId },
        data: { currentPrice: data.newPrice },
        include: { category: true }
      })
    } catch (error) {
      console.error('[IPC] Error updating asset price:', error)
      throw error
    }
  })

  // Mettre à jour un actif (nom, ticker, ISIN, catégorie, prix)
  ipcMain.handle(
    'asset:update',
    async (
      _,
      data: {
        id: number
        name?: string
        ticker?: string
        isin?: string
        currentPrice?: number
        categoryId?: number
      }
    ) => {
      try {
        const prisma = await getPrismaClient()

        // Préparer les données à mettre à jour
        const updateData: {
          name?: string
          ticker?: string
          isin?: string | null
          currentPrice?: number
          categoryId?: number
        } = {}

        if (data.name !== undefined) updateData.name = data.name
        if (data.ticker !== undefined) updateData.ticker = data.ticker
        if (data.isin !== undefined) updateData.isin = data.isin || null
        if (data.currentPrice !== undefined) updateData.currentPrice = data.currentPrice
        if (data.categoryId !== undefined) updateData.categoryId = data.categoryId

        console.log(`[Asset:Update] Mise à jour actif ID ${data.id}:`, updateData)

        return await prisma.asset.update({
          where: { id: data.id },
          data: updateData,
          include: { category: true }
        })
      } catch (error) {
        console.error('[IPC] Error updating asset:', error)
        throw error
      }
    }
  )

  ipcMain.handle('asset:delete', async (_, assetId: number) => {
    try {
      const prisma = await getPrismaClient()

      // Vérifier qu'il n'y a aucune transaction pour cet actif
      const transactionCount = await prisma.transaction.count({
        where: { assetId }
      })

      if (transactionCount > 0) {
        throw new Error(
          `Impossible de supprimer cet actif : ${transactionCount} transaction(s) associée(s)`
        )
      }

      // Supprimer l'actif
      return await prisma.asset.delete({
        where: { id: assetId }
      })
    } catch (error) {
      console.error('[IPC] Error deleting asset:', error)
      throw error
    }
  })

  // Mettre à jour tous les prix depuis Yahoo Finance
  ipcMain.handle('asset:refreshAllPrices', async () => {
    try {
      const prisma = await getPrismaClient()

      console.log('[Asset:RefreshPrices] Début de la mise à jour des prix...')

      // Récupérer tous les actifs
      const assets = await prisma.asset.findMany({
        select: {
          id: true,
          ticker: true,
          name: true
        }
      })

      if (assets.length === 0) {
        console.log('[Asset:RefreshPrices] Aucun actif à mettre à jour')
        return { success: true, updated: 0, failed: 0 }
      }

      console.log(`[Asset:RefreshPrices] ${assets.length} actif(s) à mettre à jour`)

      // Récupérer tous les prix en batch
      const tickers = assets.map((a) => a.ticker)
      const pricesMap = await getBatchPrices(tickers)

      // Mettre à jour chaque actif
      let updated = 0
      let failed = 0

      for (const asset of assets) {
        const price = pricesMap.get(asset.ticker)

        if (price !== null && price !== undefined && !isNaN(price)) {
          try {
            await prisma.asset.update({
              where: { id: asset.id },
              data: { currentPrice: price }
            })
            console.log(`[Asset:RefreshPrices] ✓ ${asset.ticker}: ${price}`)
            updated++
          } catch (error) {
            console.error(`[Asset:RefreshPrices] ✗ Erreur mise à jour ${asset.ticker}:`, error)
            failed++
          }
        } else {
          console.warn(`[Asset:RefreshPrices] ✗ Prix non disponible pour ${asset.ticker}`)
          failed++
        }
      }

      console.log(
        `[Asset:RefreshPrices] Terminé: ${updated} succès, ${failed} échecs sur ${assets.length} actifs`
      )

      return {
        success: true,
        updated,
        failed,
        total: assets.length
      }
    } catch (error) {
      console.error('[IPC] Error refreshing all prices:', error)
      throw error
    }
  })

  // Rechercher un actif par ISIN ou Ticker via Yahoo Finance
  ipcMain.handle('asset:search', async (_, query: string) => {
    try {
      console.log(`[IPC:AssetSearch] Recherche de: ${query}`)

      const result = await searchAsset(query)

      if (!result) {
        console.log(`[IPC:AssetSearch] Aucun résultat pour: ${query}`)
        return null
      }

      console.log(`[IPC:AssetSearch] Résultat trouvé:`, result)

      return result
    } catch (error) {
      console.error('[IPC] Error searching asset:', error)
      throw error
    }
  })

  // Créer ou récupérer une catégorie par nom
  ipcMain.handle('category:getOrCreate', async (_, name: string) => {
    try {
      const prisma = await getPrismaClient()

      // Chercher si la catégorie existe déjà
      let category = await prisma.category.findUnique({
        where: { name }
      })

      // Si elle n'existe pas, la créer avec une couleur par défaut
      if (!category) {
        const defaultColors: Record<string, string> = {
          ETF: '#10b981', // Vert
          Actions: '#3b82f6', // Bleu
          Crypto: '#f59e0b', // Orange
          Fonds: '#8b5cf6', // Violet
          Indices: '#ef4444', // Rouge
          Devises: '#06b6d4', // Cyan
          Autres: '#6b7280' // Gris
        }

        category = await prisma.category.create({
          data: {
            name,
            color: defaultColors[name] || '#4CAF50'
          }
        })

        console.log(`[IPC:CategoryGetOrCreate] ✓ Catégorie créée: ${name}`)
      } else {
        console.log(`[IPC:CategoryGetOrCreate] ✓ Catégorie existante: ${name}`)
      }

      return category
    } catch (error) {
      console.error('[IPC] Error getting or creating category:', error)
      throw error
    }
  })
}
