import { useState, useEffect, useMemo } from 'react'
import type { Asset, Category, Transaction } from '../types'
import { calculateOwnedQuantity } from '../utils/calculations/quantityUtils'

interface TransactionFormData {
  categoryId: string
  assetId: string
  type: 'BUY' | 'SELL'
  quantity: string
  pricePerUnit: string
  fee: string
  date: string
}

interface UseTransactionFormProps {
  preselectedCategoryId?: number
  preselectedAssetId?: number
  preselectedType?: 'BUY' | 'SELL'
  onError: (message: string) => void
}

interface UseTransactionFormReturn {
  categories: Category[]
  allAssets: Asset[]
  formData: TransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<TransactionFormData>>
  loading: boolean
  filteredAssets: Asset[]
  ownedQuantity: number
  averageBuyPrice: number
  transactionTotal: number
  selectedAsset: Asset | undefined
  getTodayDate: () => string
  resetForm: () => void
}

export function useTransactionForm({
  preselectedCategoryId,
  preselectedAssetId,
  preselectedType,
  onError
}: UseTransactionFormProps): UseTransactionFormReturn {
  const [categories, setCategories] = useState<Category[]>([])
  const [allAssets, setAllAssets] = useState<Asset[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const getTodayDate = (): string => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState<TransactionFormData>({
    categoryId: preselectedCategoryId?.toString() || '',
    assetId: preselectedAssetId?.toString() || '',
    type: preselectedType || 'BUY',
    quantity: '',
    pricePerUnit: '',
    fee: '0',
    date: getTodayDate()
  })

  // Charger les données initiales
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setLoading(true)
        const [categoriesData, assetsData, transactionsData] = await Promise.all([
          window.api.getAllCategories(),
          window.api.getAllAssets(),
          window.api.getAllTransactions()
        ])

        setCategories(categoriesData)
        setAllAssets(assetsData)
        setTransactions(transactionsData)

        // Pré-remplir si actif présélectionné
        if (preselectedAssetId) {
          const selectedAsset = assetsData.find((a) => a.id === preselectedAssetId)
          if (selectedAsset) {
            setFormData((prev) => ({
              ...prev,
              categoryId: selectedAsset.categoryId.toString(),
              assetId: selectedAsset.id.toString(),
              pricePerUnit: selectedAsset.currentPrice.toString()
            }))
          }
        } else if (categoriesData.length > 0 && assetsData.length > 0) {
          const firstCategory = preselectedCategoryId
            ? categoriesData.find((c) => c.id === preselectedCategoryId)
            : categoriesData[0]

          if (firstCategory) {
            const categoryAssets = assetsData.filter((a) => a.categoryId === firstCategory.id)
            const firstAsset = categoryAssets[0]

            setFormData((prev) => ({
              ...prev,
              categoryId: firstCategory.id.toString(),
              assetId: firstAsset ? firstAsset.id.toString() : '',
              pricePerUnit: firstAsset ? firstAsset.currentPrice.toString() : ''
            }))
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        onError('Impossible de charger les données')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [onError, preselectedAssetId, preselectedCategoryId])

  // Filtrer les actifs par catégorie (avec positions pour vente)
  const filteredAssets = useMemo(() => {
    if (!formData.categoryId) return []
    const categoryAssets = allAssets.filter((a) => a.categoryId === parseInt(formData.categoryId))

    if (formData.type === 'SELL') {
      return categoryAssets.filter((asset) => {
        const assetTransactions = transactions.filter((t) => t.assetId === asset.id)
        const owned = calculateOwnedQuantity(assetTransactions)
        return owned > 0
      })
    }

    return categoryAssets
  }, [allAssets, formData.categoryId, formData.type, transactions])

  // Calculer la quantité possédée
  const ownedQuantity = useMemo(() => {
    if (!formData.assetId) return 0
    const assetTransactions = transactions.filter((t) => t.assetId === parseInt(formData.assetId))
    return calculateOwnedQuantity(assetTransactions)
  }, [formData.assetId, transactions])

  // Calculer le Prix Moyen d'Achat
  const averageBuyPrice = useMemo(() => {
    if (!formData.assetId) return 0
    const assetTransactions = transactions.filter(
      (t) => t.assetId === parseInt(formData.assetId) && t.type === 'BUY'
    )
    if (assetTransactions.length === 0) return 0

    const totalCost = assetTransactions.reduce(
      (acc, t) => acc + t.quantity * t.pricePerUnit + t.fee,
      0
    )
    const totalQuantity = assetTransactions.reduce((acc, t) => acc + t.quantity, 0)
    return totalQuantity > 0 ? totalCost / totalQuantity : 0
  }, [formData.assetId, transactions])

  // Calculer le total de la transaction
  const transactionTotal = useMemo(() => {
    if (!formData.quantity || !formData.pricePerUnit) return 0
    const qty = parseFloat(formData.quantity)
    const price = parseFloat(formData.pricePerUnit)
    const fee = parseFloat(formData.fee) || 0
    return formData.type === 'BUY' ? qty * price + fee : qty * price - fee
  }, [formData.quantity, formData.pricePerUnit, formData.fee, formData.type])

  const selectedAsset = allAssets.find((a) => a.id === parseInt(formData.assetId))

  const resetForm = (): void => {
    setFormData({
      categoryId: preselectedCategoryId?.toString() || categories[0]?.id.toString() || '',
      assetId: preselectedAssetId?.toString() || '',
      type: preselectedType || 'BUY',
      quantity: '',
      pricePerUnit: '',
      fee: '0',
      date: getTodayDate()
    })
  }

  return {
    // État
    categories,
    allAssets,
    formData,
    setFormData,
    loading,

    // Données calculées
    filteredAssets,
    ownedQuantity,
    averageBuyPrice,
    transactionTotal,
    selectedAsset,

    // Utilitaires
    getTodayDate,
    resetForm
  }
}
