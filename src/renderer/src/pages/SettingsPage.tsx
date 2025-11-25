import { useState, useEffect } from 'react'
import CategoryForm from '../components/CategoryForm'
import CategoryList from '../components/CategoryList'
import AssetForm from '../components/AssetForm'
import AssetList from '../components/AssetList'
import type { Category, Asset, CategoryFormData, AssetFormData } from '../types'

interface SettingsPageProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

function SettingsPage({ onSuccess, onError }: SettingsPageProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'categories' | 'assets'>('categories')
  const [categories, setCategories] = useState<Category[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingAssets, setLoadingAssets] = useState(true)

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

  const handleCreateCategory = async (data: CategoryFormData): Promise<void> => {
    await window.api.createCategory(data)
    await loadCategories()
    onSuccess(`Catégorie "${data.name}" créée avec succès !`)
  }

  const handleCreateAsset = async (data: AssetFormData): Promise<void> => {
    await window.api.createAsset(data)
    await loadAssets()
    onSuccess(`Actif "${data.ticker}" créé avec succès !`)
  }

  return (
    <div>
      {/* En-tête */}
      <div style={{ marginBottom: '30px' }}>
        <h1>⚙️ Configuration</h1>
        <p style={{ color: '#666' }}>Gérez vos catégories d&apos;actifs et vos actifs financiers</p>
      </div>

      {/* Onglets */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '2px solid #ddd',
          marginBottom: '30px'
        }}
      >
        <button
          onClick={() => setActiveTab('categories')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'categories' ? '#4CAF50' : 'transparent',
            color: activeTab === 'categories' ? 'white' : '#666',
            border: 'none',
            borderBottom: activeTab === 'categories' ? '3px solid #4CAF50' : 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'all 0.3s'
          }}
        >
          📁 Catégories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'assets' ? '#2196F3' : 'transparent',
            color: activeTab === 'assets' ? 'white' : '#666',
            border: 'none',
            borderBottom: activeTab === 'assets' ? '3px solid #2196F3' : 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'all 0.3s'
          }}
        >
          💼 Actifs ({assets.length})
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'categories' && (
        <div>
          <CategoryForm onSubmit={handleCreateCategory} onError={onError} />
          <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />
          <CategoryList categories={categories} loading={loadingCategories} />
        </div>
      )}

      {activeTab === 'assets' && (
        <div>
          <AssetForm onSubmit={handleCreateAsset} onError={onError} />
          <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />
          <AssetList assets={assets} loading={loadingAssets} />
        </div>
      )}
    </div>
  )
}

export default SettingsPage
