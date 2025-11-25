import type { CategoryValue } from '../../types'

interface CategoryListProps {
  categoryValues: CategoryValue[]
  onCategoryClick: (categoryId: number) => void
}

function CategoryList({ categoryValues, onCategoryClick }: CategoryListProps): React.JSX.Element {
  if (categoryValues.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--spacing-lg)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)'
        }}
      >
        <p style={{ margin: 0 }}>Aucune catégorie</p>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: 'var(--spacing-xs)'
      }}
    >
      {categoryValues.map((category) => (
        <button
          key={category.categoryId}
          onClick={() => onCategoryClick(category.categoryId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-md)',
            background: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(4px)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
            e.currentTarget.style.borderColor = category.color
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.borderColor = 'var(--color-border)'
          }}
        >
          {/* Indicateur de couleur */}
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: category.color,
              flexShrink: 0,
              boxShadow: `0 0 0 3px ${category.color}20`
            }}
          />

          {/* Informations */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {category.categoryName}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--color-text-secondary)'
              }}
            >
              {category.assetCount} actif{category.assetCount > 1 ? 's' : ''}
            </div>
          </div>

          {/* Valeur et pourcentage */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: category.color,
                marginBottom: '2px'
              }}
            >
              {category.totalValue.toFixed(0)} €
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--color-text-secondary)'
              }}
            >
              {category.percentage.toFixed(1)}%
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default CategoryList
