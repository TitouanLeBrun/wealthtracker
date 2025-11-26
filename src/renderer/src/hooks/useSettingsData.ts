/**
 * Hook personnalisé pour gérer les données de la page Settings
 */

import { useState, useEffect, useMemo } from 'react'
import type { Category, Asset, Transaction } from '../types'
import { calculateCategoryValues } from '../utils/calculations/categoryCalculations'

interface UseSettingsDataReturn {
  categories: Category[]
  assets: Asset[]
  transactions: Transaction[]
  loadingCategories: boolean
  loadingAssets: boolean
  loadingTransactions: boolean
  categoryValues: ReturnType<typeof calculateCategoryValues>
  categoriesWithoutAssets: Category[]
  loadCategories: () => Promise<void>
  loadAssets: () => Promise<void>
  loadTransactions: () => Promise<void>
}

export function useSettingsData(onError: (message: string) => void): UseSettingsDataReturn {
  const [categories, setCategories] = useState<Category[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [loadingTransactions, setLoadingTransactions] = useState(true)

  // Charger les catégories
  const loadCategories = async (): Promise<void> => {
    try {
      setLoadingCategories(true)
      const data = await window.api.getAllCategories()
      setCategories(data)
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error)
      onError('Erreur lors du chargement des catégories')
    } finally {
      setLoadingCategories(false)
    }
  }

  // Charger les actifs
  const loadAssets = async (): Promise<void> => {
    try {
      setLoadingAssets(true)
      const data = await window.api.getAllAssets()
      setAssets(data)
    } catch (error) {
      console.error('Erreur lors du chargement des actifs:', error)
      onError('Erreur lors du chargement des actifs')
    } finally {
      setLoadingAssets(false)
    }
  }

  // Charger les transactions
  const loadTransactions = async (): Promise<void> => {
    try {
      setLoadingTransactions(true)
      const data = await window.api.getAllTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error)
      onError('Erreur lors du chargement des transactions')
    } finally {
      setLoadingTransactions(false)
    }
  }

  // Charger toutes les données au montage
  useEffect(() => {
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calculer les valeurs par catégorie
  const categoryValues = useMemo(() => {
    if (loadingCategories || loadingAssets || loadingTransactions) {
      return []
    }
    return calculateCategoryValues(categories, assets, transactions)
  }, [categories, assets, transactions, loadingCategories, loadingAssets, loadingTransactions])

  // Calculer les catégories sans actifs
  const categoriesWithoutAssets = useMemo(() => {
    if (loadingCategories || loadingAssets) {
      return []
    }
    const categoryIds = new Set(assets.map((asset) => asset.categoryId))
    return categories.filter((category) => !categoryIds.has(category.id))
  }, [categories, assets, loadingCategories, loadingAssets])

  return {
    categories,
    assets,
    transactions,
    loadingCategories,
    loadingAssets,
    loadingTransactions,
    categoryValues,
    categoriesWithoutAssets,
    loadCategories,
    loadAssets,
    loadTransactions
  }
}
