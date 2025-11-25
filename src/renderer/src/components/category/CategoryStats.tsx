import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { Category, CategoryValue, AssetValue } from '../../types'

interface CategoryStatsProps {
  category: Category
  categoryValue: CategoryValue
  transactionCount: number
}

interface AssetTooltipProps {
  active?: boolean
  payload?: Array<{ payload: AssetValue }>
}

function CategoryStats({
  category,
  categoryValue,
  transactionCount
}: CategoryStatsProps): React.JSX.Element {
  // Composant tooltip pour le camembert des actifs
  const AssetPieTooltip = ({ active, payload }: AssetTooltipProps): React.JSX.Element | null => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div
          style={{
            background: 'var(--color-card-bg)',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-border)'
          }}
        >
          <p style={{ margin: 0, fontWeight: '600' }}>{data.ticker}</p>
          <p style={{ margin: 0, fontSize: '14px' }}>{data.totalValue.toFixed(2)} €</p>
          <p style={{ margin: 0, fontSize: '14px' }}>{data.netQuantity} unités</p>
        </div>
      )
    }
    return null
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}
    >
      {/* Camembert des actifs */}
      <div
        style={{
          background: 'var(--color-card-bg)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-lg)'
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
          Répartition des Actifs
        </h3>
        {categoryValue.assets.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryValue.assets as never[]}
                dataKey="totalValue"
                nameKey="ticker"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(props: { percent?: number }) =>
                  `${((props.percent || 0) * 100).toFixed(1)}%`
                }
                labelLine={false}
              >
                {categoryValue.assets.map((_asset, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={category.color}
                    opacity={1 - index * 0.15}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={AssetPieTooltip as never} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Aucun actif avec position
          </p>
        )}
      </div>

      {/* Statistiques */}
      <div
        style={{
          background: 'var(--color-card-bg)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-lg)'
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>
          Statistiques
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Valeur Totale
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: category.color }}>
              {categoryValue.totalValue.toFixed(2)} €
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Pourcentage du Portefeuille
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600' }}>
              {categoryValue.percentage.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Nombre d&apos;Actifs
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600' }}>{categoryValue.assetCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Transactions
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600' }}>{transactionCount}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryStats
