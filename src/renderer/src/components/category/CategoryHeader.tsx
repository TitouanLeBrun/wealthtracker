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
          padding: '10px 20px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)'
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.borderColor = '#d1d5db'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.06)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = '#e5e7eb'
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
