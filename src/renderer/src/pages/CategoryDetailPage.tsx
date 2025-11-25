import { useState, useEffect, useMemo, useCallback } from 'react'
import Modal from '../components/common/Modal'
import AssetForm from '../components/forms/asset/AssetForm'
import TransactionForm from '../components/forms/transaction/TransactionForm'
import CategoryHeader from '../components/category/CategoryHeader'
import CategoryStats from '../components/category/CategoryStats'
import CategoryAssetsList from '../components/category/CategoryAssetsList'
import CategoryTransactionsSection from '../components/category/CategoryTransactionsSection'
import type { Category, Asset, Transaction, AssetFormData } from '../types'
import { calculateCategoryValues } from '../utils/calculations/categoryCalculations'

interface CategoryDetailPageProps {
  categoryId: number
  onBack: () => void
  onNavigateToAsset: (assetId: number) => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

function CategoryDetailPage({
  categoryId,
  onBack,
  onNavigateToAsset,
  onSuccess,
  onError
}: CategoryDetailPageProps): React.JSX.Element {
  const [category, setCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [allAssets, setAllAssets] = useState<Asset[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showAssetModal, setShowAssetModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)

  // Recalculer les categoryValues dynamiquement à chaque changement
  const categoryValues = useMemo(() => {
    if (categories.length === 0 || allAssets.length === 0) return []
    return calculateCategoryValues(categories, allAssets, transactions)
  }, [categories, allAssets, transactions])

  // Récupérer les valeurs calculées de cette catégorie
  const categoryValue = useMemo(() => {
    return categoryValues.find((cv) => cv.categoryId === categoryId)
  }, [categoryId, categoryValues])

  // Créer une liste complète des actifs (avec et sans transactions)
  const allCategoryAssets = useMemo(() => {
    if (!categoryValue || !assets) return []

    // Créer un Map des actifs avec transactions (depuis categoryValue)
    const assetsWithTransactions = new Map(categoryValue.assets.map((a) => [a.assetId, a]))

    // Ajouter tous les actifs de la catégorie
    const completeList = assets.map((asset) => {
      const assetValue = assetsWithTransactions.get(asset.id)
      if (assetValue) {
        // L'actif a des transactions, utiliser les données calculées
        return assetValue
      } else {
        // L'actif n'a pas de transactions, créer une structure AssetValue
        return {
          assetId: asset.id,
          ticker: asset.ticker,
          name: asset.name,
          currentPrice: asset.currentPrice || 0,
          netQuantity: 0,
          totalValue: 0,
          percentage: 0,
          categoryName: category?.name || '',
          categoryColor: category?.color || '#999999'
        }
      }
    })

    return completeList
  }, [categoryValue, assets, category])

  // Trier les actifs : quantité > 0 d'abord, puis quantité = 0
  const sortedAssets = useMemo(() => {
    return [...allCategoryAssets].sort((a, b) => {
      // Tri par quantité (> 0 d'abord)
      if (a.netQuantity > 0 && b.netQuantity === 0) return -1
      if (a.netQuantity === 0 && b.netQuantity > 0) return 1
      // Si même statut, tri par valeur totale puis par ticker
      if (b.totalValue !== a.totalValue) {
        return b.totalValue - a.totalValue
      }
      return a.ticker.localeCompare(b.ticker)
    })
  }, [allCategoryAssets])

  // Charger les données
  const loadData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      const [categoriesData, assetsData, transactionsData] = await Promise.all([
        window.api.getAllCategories(),
        window.api.getAllAssets(),
        window.api.getAllTransactions()
      ])

      // Trouver la catégorie
      const foundCategory = categoriesData.find((c: Category) => c.id === categoryId)
      if (!foundCategory) {
        onError('Catégorie introuvable')
        onBack()
        return
      }

      // Stocker toutes les données (nécessaires pour recalculer categoryValues)
      setCategories(categoriesData)
      setAllAssets(assetsData)
      setTransactions(transactionsData)

      // Filtrer les actifs de cette catégorie
      const categoryAssets = assetsData.filter((a: Asset) => a.categoryId === categoryId)
      setAssets(categoryAssets)
      setCategory(foundCategory)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      onError('Impossible de charger les données')
    } finally {
      setLoading(false)
    }
  }, [categoryId, onError, onBack])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreateAsset = async (data: AssetFormData): Promise<void> => {
    await window.api.createAsset({ ...data, categoryId })
    await loadData()
    setShowAssetModal(false)
    onSuccess(`Actif "${data.ticker}" créé avec succès !`)
  }

  const handleCreateTransaction = async (data: {
    assetId: number
    type: 'BUY' | 'SELL'
    quantity: number
    pricePerUnit: number
    fee: number
    date: Date
  }): Promise<void> => {
    await window.api.createTransaction(data)
    await loadData()
    setShowTransactionModal(false)
    onSuccess('Transaction créée avec succès !')
  }

  const handleDeleteTransaction = async (transactionId: number): Promise<void> => {
    try {
      await window.api.deleteTransaction(transactionId)
      await loadData()
      onSuccess('Transaction supprimée avec succès !')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      onError('Erreur lors de la suppression de la transaction')
    }
  }

  if (loading || !category || !categoryValue) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* Header avec bouton retour */}
      <CategoryHeader category={category} onBack={onBack} />

      {/* Stats et Camembert */}
      <CategoryStats
        category={category}
        categoryValue={categoryValue}
        transactionCount={transactions.length}
      />

      {/* Liste des actifs */}
      <CategoryAssetsList
        category={category}
        sortedAssets={sortedAssets}
        onAddAsset={() => setShowAssetModal(true)}
        onAssetClick={onNavigateToAsset}
      />

      {/* Historique des transactions */}
      <CategoryTransactionsSection
        category={category}
        transactions={transactions}
        onAddTransaction={() => setShowTransactionModal(true)}
        onDeleteTransaction={handleDeleteTransaction}
      />

      {/* Modal ajout actif */}
      <Modal
        isOpen={showAssetModal}
        onClose={() => setShowAssetModal(false)}
        title={`➕ Nouvel Actif - ${category.name}`}
      >
        <AssetForm
          onSubmit={handleCreateAsset}
          onError={onError}
          initialCategoryId={category.id}
          lockCategory={true}
        />
      </Modal>

      {/* Modal ajout transaction */}
      <Modal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        title={`💰 Nouvelle Transaction - ${category.name}`}
      >
        <TransactionForm
          preselectedCategoryId={category.id}
          onSubmit={handleCreateTransaction}
          onError={onError}
        />
      </Modal>
    </div>
  )
}

export default CategoryDetailPage
