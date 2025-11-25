import { Plus, Folder, TrendingUp } from 'lucide-react'
import type { Category, Asset } from '../types'

interface AssetManagerCardsProps {
  categories: Category[]
  assets: Asset[]
  onAddCategory: () => void
  onAddAsset: () => void
}

function AssetManagerCards({
  categories,
  assets,
  onAddCategory,
  onAddAsset
}: AssetManagerCardsProps): React.JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* Section Catégories */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-md)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Folder size={20} color="var(--color-success)" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Catégories{' '}
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                ({categories.length})
              </span>
            </h3>
          </div>
          <button
            onClick={onAddCategory}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: '8px 16px',
              backgroundColor: 'var(--color-success)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>

        {categories.length === 0 ? (
          <div
            style={{
              padding: 'var(--spacing-xl)',
              textAlign: 'center',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <Folder
              size={48}
              color="var(--color-text-disabled)"
              style={{ margin: '0 auto var(--spacing-md)' }}
            />
            <p style={{ margin: 0 }}>Aucune catégorie. Créez-en une pour organiser vos actifs.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 'var(--spacing-md)'
            }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="card"
                style={{
                  padding: 'var(--spacing-md)',
                  border: `2px solid ${category.color}`,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  transition: 'all var(--transition-base)'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: category.color,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${category.color}40`
                  }}
                >
                  <Folder size={24} color="white" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: '600', fontSize: '16px' }}>{category.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {assets.filter((a) => a.categoryId === category.id).length} actifs
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AssetManagerCards
