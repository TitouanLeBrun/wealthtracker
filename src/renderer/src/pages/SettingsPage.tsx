import { useState, useEffect, useMemo } from 'react'
import { Settings2 } from 'lucide-react'
import Modal from '../components/Modal'
import AssetManagerCards from '../components/AssetManagerCards'
import CategoryForm from '../components/CategoryForm'
import AssetForm from '../components/AssetForm'
import CategoryPieChart from '../components/CategoryPieChart'
import type {
  Category,
  Asset,
  Transaction,
  CategoryFormData,
  AssetFormData,
  CategoryValue
} from '../types'
import { calculateCategoryValues } from '../utils/categoryCalculations'

interface SettingsPageProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
  onCategoryClick: (categoryId: number, categoryValues: CategoryValue[]) => void
}

function SettingsPage({
  onSuccess,
  onError,
  onCategoryClick
}: SettingsPageProps): React.JSX.Element {
  const [categories, setCategories] = useState<Category[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [loadingTransactions, setLoadingTransactions] = useState(true)

  // États des modales
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showAssetModal, setShowAssetModal] = useState(false)

  // Charger les catégories
  useEffect(() => {
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Charger les actifs
  useEffect(() => {
    loadAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Charger les transactions
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

  const handleCreateCategory = async (data: CategoryFormData): Promise<void> => {
    await window.api.createCategory(data)
    await loadCategories()
    setShowCategoryModal(false)
    onSuccess(`Catégorie "${data.name}" créée avec succès !`)
  }

  const handleCreateAsset = async (data: AssetFormData): Promise<void> => {
    await window.api.createAsset(data)
    await loadAssets()
    setShowAssetModal(false)
    onSuccess(`Actif "${data.ticker}" créé avec succès !`)
  }

  if (loadingCategories || loadingAssets) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <div
          className="loading-skeleton"
          style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-md)' }}
        />
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* En-tête */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-sm)'
          }}
        >
          <Settings2 size={32} color="var(--color-success)" />
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Configuration</h1>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '16px' }}>
          Gérez vos catégories et actifs financiers
        </p>
      </div>

      {/* Camembert de répartition */}
      {!loadingCategories && !loadingAssets && !loadingTransactions && (
        <CategoryPieChart
          categoryValues={categoryValues}
          onCategoryClick={(categoryId) => onCategoryClick(categoryId, categoryValues)}
        />
      )}

      {/* Modal Catégorie */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="➕ Nouvelle Catégorie"
      >
        <CategoryForm onSubmit={handleCreateCategory} onError={onError} />
      </Modal>

      {/* Modal Actif */}
      <Modal
        isOpen={showAssetModal}
        onClose={() => setShowAssetModal(false)}
        title="➕ Nouvel Actif"
      >
        <AssetForm onSubmit={handleCreateAsset} onError={onError} />
      </Modal>
    </div>
  )
}

export default SettingsPage
