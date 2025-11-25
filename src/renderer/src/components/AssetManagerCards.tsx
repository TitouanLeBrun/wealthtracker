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

      {/* Section Actifs */}
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
            <TrendingUp size={20} color="var(--color-primary)" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              Actifs{' '}
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                ({assets.length})
              </span>
            </h3>
          </div>
          <button
            onClick={onAddAsset}
            disabled={categories.length === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: '8px 16px',
              backgroundColor:
                categories.length === 0 ? 'var(--color-text-disabled)' : 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: categories.length === 0 ? 'not-allowed' : 'pointer',
              opacity: categories.length === 0 ? 0.5 : 1
            }}
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>

        {categories.length === 0 ? (
          <div
            style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-warning-light)',
              border: '1px solid var(--color-warning)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-warning-dark)',
              fontSize: '14px'
            }}
          >
            ⚠️ Créez d&apos;abord une catégorie pour pouvoir ajouter des actifs.
          </div>
        ) : assets.length === 0 ? (
          <div
            style={{
              padding: 'var(--spacing-xl)',
              textAlign: 'center',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <TrendingUp
              size={48}
              color="var(--color-text-disabled)"
              style={{ margin: '0 auto var(--spacing-md)' }}
            />
            <p style={{ margin: 0 }}>Aucun actif. Ajoutez vos premiers investissements.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="card"
                style={{
                  padding: 'var(--spacing-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  borderLeft: `4px solid ${asset.category?.color || 'var(--color-border)'}`,
                  transition: 'all var(--transition-base)'
                }}
              >
                {/* Ticker */}
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: `${asset.category?.color || 'var(--color-primary)'}20`,
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: asset.category?.color || 'var(--color-primary)',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {asset.ticker}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: '600',
                      fontSize: '16px',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {asset.name}
                  </div>
                  {asset.category && (
                    <div
                      className="badge"
                      style={{
                        backgroundColor: `${asset.category.color}20`,
                        color: asset.category.color,
                        border: `1px solid ${asset.category.color}40`,
                        display: 'inline-block'
                      }}
                    >
                      {asset.category.name}
                    </div>
                  )}
                </div>

                {/* Prix */}
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-success)' }}
                  >
                    {asset.currentPrice.toLocaleString('fr-FR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}{' '}
                    €
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {new Date(asset.createdAt).toLocaleDateString('fr-FR')}
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
