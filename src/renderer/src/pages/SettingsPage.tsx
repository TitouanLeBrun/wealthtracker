import { useState, useEffect, useMemo } from 'react'
import { Settings2, Plus, FolderOpen } from 'lucide-react'
import Modal from '../components/common/Modal'
import CategoryForm from '../components/forms/category/CategoryForm'
import AssetForm from '../components/forms/asset/AssetForm'
import CategoryPieChart from '../components/category/CategoryPieChart'
import AssetWithoutPositionAccordion from '../components/asset/AssetWithoutPositionAccordion'
import type { Category, Asset, Transaction, CategoryFormData, AssetFormData } from '../types'
import { calculateCategoryValues } from '../utils/calculations/categoryCalculations'

interface SettingsPageProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
  onCategoryClick: (categoryId: number) => void
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

  // Calculer les catégories sans actifs
  const categoriesWithoutAssets = useMemo(() => {
    if (loadingCategories || loadingAssets) {
      return []
    }
    const categoryIds = new Set(assets.map((asset) => asset.categoryId))
    return categories.filter((category) => !categoryIds.has(category.id))
  }, [categories, assets, loadingCategories, loadingAssets])

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
            justifyContent: 'space-between',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-sm)',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <Settings2 size={32} color="var(--color-success)" />
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(22px, 5vw, 28px)',
                fontWeight: '700'
              }}
            >
              Configuration
            </h1>
          </div>

          {/* Boutons d'actions */}
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button
              onClick={() => setShowCategoryModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-success)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                borderTopRightRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-success-dark)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-success)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <Plus size={18} />
              <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>
                Nouvelle Catégorie
              </span>
            </button>

            <button
              onClick={() => setShowAssetModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                borderTopRightRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <Plus size={18} />
              <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>
                Nouvel Actif
              </span>
            </button>
          </div>
        </div>
        <p
          style={{
            color: 'var(--color-text-secondary)',
            margin: 0,
            fontSize: 'clamp(14px, 3vw, 16px)'
          }}
        >
          Gérez vos catégories et actifs financiers
        </p>
      </div>

      {/* Camembert de répartition */}
      {!loadingCategories && !loadingAssets && !loadingTransactions && (
        <CategoryPieChart
          categoryValues={categoryValues}
          onCategoryClick={(categoryId) => onCategoryClick(categoryId)}
        />
      )}

      {/* Catégories sans actifs */}
      {!loadingCategories && !loadingAssets && categoriesWithoutAssets.length > 0 && (
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <div
            style={{
              backgroundColor: 'var(--color-card-bg)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-lg)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-md)'
              }}
            >
              <FolderOpen size={24} color="var(--color-warning)" />
              <h2
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)'
                }}
              >
                Catégories sans actifs ({categoriesWithoutAssets.length})
              </h2>
            </div>

            <p
              style={{
                margin: '0 0 var(--spacing-md) 0',
                color: 'var(--color-text-secondary)',
                fontSize: '14px'
              }}
            >
              Ces catégories n&apos;ont pas encore d&apos;actifs associés. Cliquez pour ajouter des
              actifs.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 'var(--spacing-sm)'
              }}
            >
              {categoriesWithoutAssets.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryClick(category.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'white',
                    border: '2px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = category.color
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 4px 12px ${category.color}33`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: category.color,
                      flexShrink: 0
                    }}
                  />
                  <span
                    style={{
                      fontWeight: '500',
                      color: 'var(--color-text-primary)',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {category.name}
                  </span>
                  <FolderOpen size={16} color="var(--color-text-secondary)" />
                </button>
              ))}
            </div>
          </div>
        </div>
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
        title="➕ Nouvel Actif"
      >
        <AssetForm onSubmit={handleCreateAsset} onError={onError} />
      </Modal>
    </div>
  )
}

export default SettingsPage
