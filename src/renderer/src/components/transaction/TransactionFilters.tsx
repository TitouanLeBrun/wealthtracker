import { Calendar, Filter } from 'lucide-react'

interface TransactionFiltersProps {
  selectedCategory: string
  dateFilter: string
  categories: string[]
  resultCount: number
  onCategoryChange: (category: string) => void
  onDateChange: (date: string) => void
  onReset: () => void
}

function TransactionFilters({
  selectedCategory,
  dateFilter,
  categories,
  resultCount,
  onCategoryChange,
  onDateChange,
  onReset
}: TransactionFiltersProps): React.JSX.Element {
  const hasActiveFilters = selectedCategory !== 'all' || dateFilter

  return (
    <div
      style={{
        background: 'var(--color-card-bg)',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--border-radius)',
        marginBottom: 'var(--spacing-lg)',
        display: 'flex',
        gap: 'var(--spacing-md)',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
        <Filter size={18} color="var(--color-primary)" />
        <span style={{ fontWeight: '600', fontSize: '14px' }}>Filtres:</span>
      </div>

      {/* Filtre par catégorie */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
        <label
          htmlFor="category-filter"
          style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}
        >
          Catégorie:
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={{
            padding: '8px 12px',
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="all">Toutes</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre par date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
        <label
          htmlFor="date-filter"
          style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}
        >
          <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
          Date:
        </label>
        <input
          id="date-filter"
          type="date"
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
          style={{
            padding: '8px 12px',
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text-primary)',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Reset filters */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          style={{
            padding: '8px 16px',
            background: 'var(--color-border)',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            fontSize: '14px',
            cursor: 'pointer',
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
          Réinitialiser
        </button>
      )}

      {/* Résultats */}
      <div
        style={{
          marginLeft: 'auto',
          fontSize: '14px',
          color: 'var(--color-text-secondary)'
        }}
      >
        {resultCount} transaction(s) trouvée(s)
      </div>
    </div>
  )
}

export default TransactionFilters
