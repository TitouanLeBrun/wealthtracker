import { Lock } from 'lucide-react'
import type { Asset, Category } from '../../../types'

interface CategoryAssetSelectorProps {
  categories: Category[]
  assets: Asset[]
  selectedCategoryId: string
  selectedAssetId: string
  onCategoryChange: (categoryId: string) => void
  onAssetChange: (assetId: string) => void
  isCategoryLocked: boolean
  isAssetLocked: boolean
}

function CategoryAssetSelector({
  categories,
  assets,
  selectedCategoryId,
  selectedAssetId,
  onCategoryChange,
  onAssetChange,
  isCategoryLocked,
  isAssetLocked
}: CategoryAssetSelectorProps): React.JSX.Element {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-md)'
      }}
    >
      {/* Catégorie */}
      <div>
        <label
          htmlFor="categoryId"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--color-text-primary)'
          }}
        >
          Catégorie *
        </label>
        <div style={{ position: 'relative' }}>
          <select
            id="categoryId"
            value={selectedCategoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={isCategoryLocked}
            style={{
              width: '100%',
              padding: '12px',
              paddingRight: isCategoryLocked ? '40px' : '12px',
              background: isCategoryLocked ? '#f3f4f6' : 'var(--color-input-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
              cursor: isCategoryLocked ? 'not-allowed' : 'pointer',
              opacity: isCategoryLocked ? 0.7 : 1
            }}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {isCategoryLocked && (
            <Lock
              size={16}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)',
                pointerEvents: 'none'
              }}
            />
          )}
        </div>
      </div>

      {/* Actif */}
      <div>
        <label
          htmlFor="assetId"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--color-text-primary)'
          }}
        >
          Actif *
        </label>
        <div style={{ position: 'relative' }}>
          <select
            id="assetId"
            value={selectedAssetId}
            onChange={(e) => onAssetChange(e.target.value)}
            disabled={isAssetLocked || assets.length === 0}
            style={{
              width: '100%',
              padding: '12px',
              paddingRight: isAssetLocked ? '40px' : '12px',
              background: isAssetLocked ? '#f3f4f6' : 'var(--color-input-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
              cursor: isAssetLocked ? 'not-allowed' : 'pointer',
              opacity: isAssetLocked ? 0.7 : 1
            }}
            required
          >
            {assets.length === 0 ? (
              <option value="">Aucun actif dans cette catégorie</option>
            ) : (
              assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.ticker} - {asset.name}
                </option>
              ))
            )}
          </select>
          {isAssetLocked && (
            <Lock
              size={16}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)',
                pointerEvents: 'none'
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryAssetSelector
