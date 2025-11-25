import type { Category } from '../../types'

interface AssetCategorySelectorProps {
  value: number
  onChange: (categoryId: number) => void
  categories: Category[]
  isLocked?: boolean
}

function AssetCategorySelector({
  value,
  onChange,
  categories,
  isLocked = false
}: AssetCategorySelectorProps): React.JSX.Element {
  return (
    <div>
      <label
        htmlFor="asset-category"
        style={{
          display: 'block',
          fontWeight: '600',
          marginBottom: '8px',
          fontSize: '14px',
          color: '#374151'
        }}
      >
        Catégorie
      </label>
      <select
        id="asset-category"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        disabled={isLocked}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          outline: 'none',
          backgroundColor: isLocked ? '#f3f4f6' : 'white',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.2s'
        }}
        onFocus={(e) => {
          if (!isLocked) e.currentTarget.style.borderColor = '#3b82f6'
        }}
        onBlur={(e) => {
          if (!isLocked) e.currentTarget.style.borderColor = '#d1d5db'
        }}
      >
        <option value="0">-- Sélectionner une catégorie --</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {isLocked && (
        <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          📌 Catégorie verrouillée pour cette section
        </small>
      )}
    </div>
  )
}

export default AssetCategorySelector
