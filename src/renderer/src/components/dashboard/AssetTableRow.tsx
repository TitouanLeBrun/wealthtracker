import type { AssetMetrics } from '../../utils/calculations/enhancedPortfolioCalculations'
import {
  formatCurrency,
  formatPercent
} from '../../utils/calculations/enhancedPortfolioCalculations'

interface AssetTableRowProps {
  asset: AssetMetrics
  isLast: boolean
  onAssetClick?: (assetId: number) => void
}

function AssetTableRow({ asset, isLast, onAssetClick }: AssetTableRowProps): React.JSX.Element {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 120px 120px 120px 120px 120px 120px 120px',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-md)',
        borderBottom: !isLast ? '1px solid var(--color-border)' : 'none',
        transition: 'background 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-input-bg)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {/* Actif */}
      <div>
        <div
          onClick={() => onAssetClick?.(asset.asset.id)}
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: onAssetClick ? 'var(--color-primary)' : 'var(--color-text-primary)',
            marginBottom: '4px',
            cursor: onAssetClick ? 'pointer' : 'default',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (onAssetClick) {
              e.currentTarget.style.textDecoration = 'underline'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none'
          }}
        >
          {asset.ticker}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {asset.name}
        </div>
        <span
          style={{
            display: 'inline-block',
            marginTop: '4px',
            padding: '2px 8px',
            background: asset.categoryColor,
            color: 'white',
            borderRadius: '8px',
            fontSize: '11px'
          }}
        >
          {asset.category}
        </span>
      </div>

      {/* Quantité */}
      <div style={{ textAlign: 'right', alignSelf: 'center' }}>
        <div style={{ fontSize: '15px', fontWeight: '600' }}>{asset.currentQuantity}</div>
      </div>

      {/* Valeur */}
      <div style={{ textAlign: 'right', alignSelf: 'center' }}>
        <div style={{ fontSize: '15px', fontWeight: '600' }}>
          {formatCurrency(asset.currentValue)}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          {formatCurrency(asset.currentPrice)}/u
        </div>
      </div>

      {/* PMA */}
      <div style={{ textAlign: 'right', alignSelf: 'center' }}>
        <div style={{ fontSize: '15px', fontWeight: '600' }}>
          {formatCurrency(asset.averageBuyPrice)}
        </div>
      </div>

      {/* PV Latente */}
      <div style={{ textAlign: 'right', alignSelf: 'center' }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: asset.unrealizedPnL >= 0 ? '#10b981' : '#ef4444'
          }}
        >
          {formatCurrency(asset.unrealizedPnL)}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: asset.unrealizedPnL >= 0 ? '#10b981' : '#ef4444'
          }}
        >
          {formatPercent(asset.unrealizedPnLPercent)}
        </div>
      </div>

      {/* PV Réalisée */}
      <div style={{ textAlign: 'right', alignSelf: 'center' }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: asset.realizedPnL >= 0 ? '#10b981' : '#ef4444'
          }}
        >
          {formatCurrency(asset.realizedPnL)}
        </div>
      </div>

      {/* PV Globale */}
      <div style={{ textAlign: 'right', alignSelf: 'center' }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '700',
            color: asset.totalPnL >= 0 ? '#10b981' : '#ef4444'
          }}
        >
          {formatCurrency(asset.totalPnL)}
        </div>
      </div>

      {/* Performance */}
      <div style={{ textAlign: 'right', alignSelf: 'center' }}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: asset.totalPnLPercent >= 0 ? '#10b981' : '#ef4444'
          }}
        >
          {formatPercent(asset.totalPnLPercent)}
        </div>
      </div>
    </div>
  )
}

export default AssetTableRow
