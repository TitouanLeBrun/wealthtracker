import { useState } from 'react'
import Modal from '../components/common/Modal'
import CategoryForm from '../components/forms/category/CategoryForm'
import AssetSearchForm from '../components/forms/asset/AssetSearchForm'
import CategoryPieChart from '../components/category/CategoryPieChart'
import AssetWithoutPositionAccordion from '../components/asset/AssetWithoutPositionAccordion'
import { SettingsHeader } from '../components/settings/SettingsHeader'
import { EmptyCategoriesSection } from '../components/settings/EmptyCategoriesSection'
import { useSettingsData } from '../hooks/useSettingsData'
import type { CategoryFormData } from '../types'

interface SettingsPageProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
  onCategoryClick: (categoryId: number) => void
  onAssetClick: (assetId: number) => void
}

function SettingsPage({
  onSuccess,
  onError,
  onCategoryClick,
  onAssetClick
}: SettingsPageProps): React.JSX.Element {
  // États des modales
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showAssetModal, setShowAssetModal] = useState(false)

  // Données via hook personnalisé
  const {
    categories,
    assets,
    transactions,
    loadingCategories,
    loadingAssets,
    loadingTransactions,
    categoryValues,
    categoriesWithoutAssets,
    loadCategories,
    loadAssets
  } = useSettingsData(onError)

  // Handlers
  const handleCreateCategory = async (data: CategoryFormData): Promise<void> => {
    await window.api.createCategory(data)
    await loadCategories()
    setShowCategoryModal(false)
    onSuccess(`Catégorie "${data.name}" créée avec succès !`)
  }

  const handleCreateAsset = async (data: {
    name: string
    ticker: string
    isin: string
    currentPrice: number
    categoryId: number
  }): Promise<void> => {
    await window.api.createAsset(data)
    await loadAssets()
    setShowAssetModal(false)
    onSuccess(`Actif "${data.ticker}" créé avec succès !`)
  }

  // État de chargement
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
      <SettingsHeader
        onCreateCategory={() => setShowCategoryModal(true)}
        onCreateAsset={() => setShowAssetModal(true)}
      />

      {/* Camembert de répartition */}
      {!loadingCategories && !loadingAssets && !loadingTransactions && (
        <CategoryPieChart
          categoryValues={categoryValues}
          onCategoryClick={(categoryId) => onCategoryClick(categoryId)}
        />
      )}

      {/* Catégories sans actifs */}
      {!loadingCategories && !loadingAssets && (
        <EmptyCategoriesSection
          categories={categoriesWithoutAssets}
          onCategoryClick={onCategoryClick}
        />
      )}

      {/* Actifs sans position */}
      {!loadingCategories && !loadingAssets && !loadingTransactions && (
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <AssetWithoutPositionAccordion
            assets={assets}
            transactions={transactions}
            onAssetDeleted={() => {
              loadAssets()
              onSuccess('Actif supprimé avec succès !')
            }}
            onAssetClick={onAssetClick}
            onError={onError}
          />
        </div>
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
        title="🔍 Rechercher ou Créer un Actif"
      >
        <AssetSearchForm
          categories={categories}
          onSubmit={handleCreateAsset}
          onCancel={() => setShowAssetModal(false)}
        />
      </Modal>
    </div>
  )
}

export default SettingsPage
