/**
 * Composant pour afficher les catégories sans actifs
 */

import { FolderOpen } from 'lucide-react'
import type { Category } from '../../types'

interface EmptyCategoriesSectionProps {
  categories: Category[]
  onCategoryClick: (categoryId: number) => void
}

export function EmptyCategoriesSection({
  categories,
  onCategoryClick
}: EmptyCategoriesSectionProps): React.JSX.Element | null {
  if (categories.length === 0) {
    return null
  }

  return (
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
            Catégories sans actifs ({categories.length})
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
          {categories.map((category) => (
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
  )
}
