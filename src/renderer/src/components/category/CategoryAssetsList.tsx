import { Plus } from 'lucide-react'
import type { Category, AssetValue } from '../../types'

interface CategoryAssetsListProps {
  category: Category
  sortedAssets: AssetValue[]
  onAddAsset: () => void
  onAssetClick: (assetId: number) => void
}

function CategoryAssetsList({
  category,
  sortedAssets,
  onAddAsset,
  onAssetClick
}: CategoryAssetsListProps): React.JSX.Element {
  // Séparer les actifs avec et sans position
  const assetsWithPosition = sortedAssets.filter((asset) => asset.netQuantity > 0)
  const assetsWithoutPosition = sortedAssets.filter((asset) => asset.netQuantity === 0)

  return (
    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-md)'
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
          📋 Actifs de la catégorie ({sortedAssets.length})
        </h3>
        <button
          onClick={onAddAsset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            padding: '10px 20px',
            background: category.color,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: `0 2px 8px ${category.color}40`,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = `0 6px 16px ${category.color}60`
            e.currentTarget.style.filter = 'brightness(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = `0 2px 8px ${category.color}40`
            e.currentTarget.style.filter = 'brightness(1)'
          }}
        >
          <Plus size={18} />
          Ajouter un Actif
        </button>
      </div>

      {/* Actifs avec position en cours */}
      {assetsWithPosition.length > 0 && (
        <>
          <h4
            style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 var(--spacing-md) 0',
              color: 'var(--color-success)'
            }}
          >
            ✅ Positions en cours ({assetsWithPosition.length})
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-xl)'
            }}
          >
            {assetsWithPosition.map((assetValue) => {
              return (
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
                    <div
                      onClick={() => onAssetClick(assetValue.assetId)}
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        color: category.color,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline'
                        e.currentTarget.style.filter = 'brightness(1.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none'
                        e.currentTarget.style.filter = 'brightness(1)'
                      }}
                    >
                      {assetValue.ticker}
                    </div>
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
                      <div
                        style={{ fontSize: '16px', fontWeight: '700', color: category.color }}
                      >
                        {assetValue.totalValue.toFixed(2)} €
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Actifs sans position */}
      {assetsWithoutPosition.length > 0 && (
        <>
          <h4
            style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 var(--spacing-md) 0',
              color: 'var(--color-warning)'
            }}
          >
            ⚠️ Actifs sans position ({assetsWithoutPosition.length})
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--spacing-md)'
            }}
          >
            {assetsWithoutPosition.map((assetValue) => {
              return (
                <div
                  key={assetValue.assetId}
                  style={{
                    background: 'var(--color-card-bg)',
                    borderRadius: 'var(--border-radius)',
                    padding: 'var(--spacing-lg)',
                    borderLeft: `4px solid var(--color-border)`,
                    opacity: 0.7,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.7'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                    <div
                      onClick={() => onAssetClick(assetValue.assetId)}
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        color: 'var(--color-text-secondary)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline'
                        e.currentTarget.style.color = category.color
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none'
                        e.currentTarget.style.color = 'var(--color-text-secondary)'
                      }}
                    >
                      {assetValue.ticker}
                    </div>
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
                        Statut
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--color-warning)'
                        }}
                      >
                        Aucune position
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Message si aucun actif */}
      {sortedAssets.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--spacing-xl)',
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text-secondary)'
          }}
        >
          <p style={{ margin: 0, fontSize: '14px' }}>ℹ️ Aucun actif dans cette catégorie.</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>
            Cliquez sur &quot;Ajouter un Actif&quot; pour commencer.
          </p>
        </div>
      )}
    </div>
  )
}

export default CategoryAssetsList
