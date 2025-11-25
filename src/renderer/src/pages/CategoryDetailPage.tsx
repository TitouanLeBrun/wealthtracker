import { useState, useEffect, useMemo, useCallback } from 'react'
import { ArrowLeft, Plus, PieChart as PieChartIcon } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import Modal from '../components/Modal'
import AssetForm from '../components/AssetForm'
import TransactionManagerCards from '../components/TransactionManagerCards'
import type {
  Category,
  Asset,
  Transaction,
  CategoryValue,
  AssetFormData,
  AssetValue
} from '../types'
import { getCategoryValue } from '../utils/categoryCalculations'

interface CategoryDetailPageProps {
  categoryId: number
  categoryValues: CategoryValue[]
  onBack: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

interface AssetTooltipProps {
  active?: boolean
  payload?: Array<{ payload: AssetValue }>
}

function CategoryDetailPage({
  categoryId,
  categoryValues,
  onBack,
  onSuccess,
  onError
}: CategoryDetailPageProps): React.JSX.Element {
  const [category, setCategory] = useState<Category | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showAssetModal, setShowAssetModal] = useState(false)

  // Récupérer les valeurs calculées de cette catégorie
  const categoryValue = useMemo(
    () => getCategoryValue(categoryId, categoryValues),
    [categoryId, categoryValues]
  )

  // Composant tooltip pour le camembert des actifs
  const AssetPieTooltip = ({ active, payload }: AssetTooltipProps): React.JSX.Element | null => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div
          style={{
            background: 'var(--color-card-bg)',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-border)'
          }}
        >
          <p style={{ margin: 0, fontWeight: '600' }}>{data.ticker}</p>
          <p style={{ margin: 0, fontSize: '14px' }}>{data.totalValue.toFixed(2)} €</p>
          <p style={{ margin: 0, fontSize: '14px' }}>{data.netQuantity} unités</p>
        </div>
      )
    }
    return null
  }

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

      // Filtrer les actifs de cette catégorie
      const categoryAssets = assetsData.filter((a: Asset) => a.categoryId === categoryId)

      // Filtrer les transactions liées aux actifs de cette catégorie
      const assetIds = new Set(categoryAssets.map((a: Asset) => a.id))
      const categoryTransactions = transactionsData.filter((t: Transaction) =>
        assetIds.has(t.assetId)
      )

      setCategory(foundCategory)
      setTransactions(categoryTransactions)
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
      <div
        style={{
          marginBottom: 'var(--spacing-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)'
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px',
            background: 'var(--color-border)',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-primary)'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-border)'
            e.currentTarget.style.color = 'inherit'
          }}
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: category.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PieChartIcon size={18} color="white" />
            </div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>{category.name}</h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '16px' }}>
            Vue détaillée de la catégorie
          </p>
        </div>

        <button
          onClick={() => setShowAssetModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            padding: '12px 24px',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Plus size={18} />
          Ajouter un Actif
        </button>
      </div>

      {/* Stats et Camembert */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)'
        }}
      >
        {/* Camembert des actifs */}
        <div
          style={{
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-lg)'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
            Répartition des Actifs
          </h3>
          {categoryValue.assets.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryValue.assets as never[]}
                  dataKey="totalValue"
                  nameKey="ticker"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(props: { percent?: number }) =>
                    `${((props.percent || 0) * 100).toFixed(1)}%`
                  }
                  labelLine={false}
                >
                  {categoryValue.assets.map((_asset, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={category.color}
                      opacity={1 - index * 0.15}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={AssetPieTooltip as never} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              Aucun actif avec position
            </p>
          )}
        </div>

        {/* Statistiques */}
        <div
          style={{
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-lg)'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
            Statistiques
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                Valeur Totale
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: category.color }}>
                {categoryValue.totalValue.toFixed(2)} €
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                Pourcentage du Portefeuille
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>
                {categoryValue.percentage.toFixed(1)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                Nombre d&apos;Actifs
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>{categoryValue.assetCount}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                Transactions
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>{transactions.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des actifs */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
          📋 Actifs de la catégorie ({categoryValue.assets.length})
        </h3>
        {categoryValue.assets.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--spacing-md)'
            }}
          >
            {categoryValue.assets.map((assetValue) => (
              <div
                key={assetValue.assetId}
                style={{
                  background: 'var(--color-card-bg)',
                  borderRadius: 'var(--border-radius)',
                  padding: 'var(--spacing-lg)',
                  borderLeft: `4px solid ${category.color}`,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>{assetValue.ticker}</div>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                    {assetValue.name}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 'var(--spacing-md)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      Prix actuel
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                      {assetValue.currentPrice.toFixed(2)} €
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      Quantité
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>
                      {assetValue.netQuantity}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      Valeur totale
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: category.color }}>
                      {assetValue.totalValue.toFixed(2)} €
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--spacing-xl)',
              background: 'var(--color-card-bg)',
              borderRadius: 'var(--border-radius)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <p style={{ margin: 0 }}>Aucun actif avec position dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* Historique des transactions */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
          📊 Historique des Transactions
        </h3>
        <TransactionManagerCards transactions={transactions} loading={false} />
      </div>

      {/* Modal ajout actif */}
      <Modal
        isOpen={showAssetModal}
        onClose={() => setShowAssetModal(false)}
        title={`➕ Nouvel Actif - ${category.name}`}
      >
        <AssetForm onSubmit={handleCreateAsset} onError={onError} />
      </Modal>
    </div>
  )
}

export default CategoryDetailPage
