import { ArrowLeft, PieChart as PieChartIcon } from 'lucide-react'
import type { Category } from '../../types'

interface CategoryHeaderProps {
  category: Category
  onBack: () => void
}

function CategoryHeader({ category, onBack }: CategoryHeaderProps): React.JSX.Element {
  return (
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
    </div>
  )
}

export default CategoryHeader
