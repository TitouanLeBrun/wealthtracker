import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import CategoryList from './CategoryList'
import type { CategoryValue } from '../../types'

interface CategoryPieChartProps {
  categoryValues: CategoryValue[]
  onCategoryClick: (categoryId: number) => void
}

interface TooltipPayload {
  payload: CategoryValue
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
}

function CategoryPieChart({
  categoryValues,
  onCategoryClick
}: CategoryPieChartProps): React.JSX.Element {
  if (categoryValues.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--spacing-xxl)',
          color: 'var(--color-text-secondary)',
          background: 'var(--color-card-bg)',
          borderRadius: 'var(--border-radius)'
        }}
      >
        <p style={{ margin: 0, fontSize: '16px' }}>Aucune donnée à afficher</p>
        <p style={{ margin: 'var(--spacing-sm) 0 0', fontSize: '14px' }}>
          Créez des actifs et des transactions pour voir la répartition
        </p>
      </div>
    )
  }

  // Custom label pour afficher le pourcentage
  const renderLabel = (props: { percent?: number }): string => {
    const percent = props.percent || 0
    return `${(percent * 100).toFixed(1)}%`
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: CustomTooltipProps): React.JSX.Element | null => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CategoryValue
      return (
        <div
          style={{
            background: 'var(--color-card-bg)',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <p style={{ margin: 0, fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
            {data.categoryName}
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            Valeur: {data.totalValue.toFixed(2)} €
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            {data.assetCount} actif(s)
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: data.color, fontWeight: '600' }}>
            {data.percentage.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div
      style={{
        background: 'var(--color-card-bg)',
        borderRadius: 'var(--border-radius)',
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}
    >
      <h3
        style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: 'var(--spacing-lg)',
          textAlign: 'center'
        }}
      >
        📊 Répartition du Portefeuille par Catégorie
      </h3>

      {/* Layout flex avec camembert à gauche et liste à droite */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-xl)',
          alignItems: 'start'
        }}
      >
        {/* Camembert */}
        <div>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={categoryValues as never[]}
                dataKey="totalValue"
                nameKey="categoryName"
                cx="50%"
                cy="50%"
                outerRadius={140}
                label={renderLabel}
                labelLine={false}
                onClick={(data: CategoryValue) => onCategoryClick(data.categoryId)}
                style={{ cursor: 'pointer' }}
                animationBegin={0}
                animationDuration={800}
              >
                {categoryValues.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#fff"
                    strokeWidth={2}
                    style={{
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              marginTop: 'var(--spacing-md)',
              textAlign: 'center',
              fontSize: '14px',
              color: 'var(--color-text-secondary)'
            }}
          >
            💡 Cliquez sur une catégorie pour voir les détails
          </div>
        </div>

        {/* Liste des catégories */}
        <div>
          <h4
            style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-text-primary)'
            }}
          >
            Catégories
          </h4>
          <CategoryList categoryValues={categoryValues} onCategoryClick={onCategoryClick} />
        </div>
      </div>
    </div>
  )
}

export default CategoryPieChart
