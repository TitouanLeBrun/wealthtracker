import type { AssetMetrics } from '../../utils/calculations/enhancedPortfolioCalculations'

interface AssetMobileCardProps {
  asset: AssetMetrics
  onAssetClick?: (assetId: number) => void
}

function AssetMobileCard({ asset, onAssetClick }: AssetMobileCardProps): React.JSX.Element {
  return (
    <div
      onClick={() => onAssetClick?.(asset.asset.id)}
      style={{
        background: 'var(--color-card-bg)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--color-border)',
        padding: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-md)',
        cursor: onAssetClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* En-tête de la card */}
      <div
        style={{
          marginBottom: 'var(--spacing-md)',
          paddingBottom: 'var(--spacing-md)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 'var(--spacing-xs)'
          }}
        >
          <div>
            <div
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--color-text-primary)'
              }}
            >
              {asset.ticker}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                marginTop: '2px'
              }}
            >
              {asset.name}
            </div>
          </div>
          <span
            style={{
              padding: '4px 10px',
              background: asset.categoryColor,
              color: 'white',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            {asset.category}
          </span>
        </div>
      </div>

      {/* Métriques principales */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              marginBottom: '4px'
            }}
          >
            Valeur Actuelle
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: 'var(--color-text-primary)'
            }}
          >
            {asset.currentValue.toFixed(2)} €
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              marginTop: '2px'
            }}
          >
            {asset.currentQuantity} × {asset.currentPrice.toFixed(2)} €
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              marginBottom: '4px'
            }}
          >
            Performance
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: asset.totalPnLPercent >= 0 ? '#10b981' : '#ef4444'
            }}
          >
            {asset.totalPnLPercent >= 0 ? '+' : ''}
            {asset.totalPnLPercent.toFixed(2)}%
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: asset.totalPnL >= 0 ? '#10b981' : '#ef4444',
              marginTop: '2px'
            }}
          >
            {asset.totalPnL >= 0 ? '+' : ''}
            {asset.totalPnL.toFixed(2)} €
          </div>
        </div>
      </div>

      {/* Détails PnL */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 'var(--spacing-sm)',
          paddingTop: 'var(--spacing-md)',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--color-text-secondary)',
              marginBottom: '2px'
            }}
          >
            PMA
          </div>
          <div style={{ fontSize: '13px', fontWeight: '600' }}>
            {asset.averageBuyPrice.toFixed(2)} €
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--color-text-secondary)',
              marginBottom: '2px'
            }}
          >
            PV Latente
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: asset.unrealizedPnL >= 0 ? '#10b981' : '#ef4444'
            }}
          >
            {asset.unrealizedPnL >= 0 ? '+' : ''}
            {asset.unrealizedPnL.toFixed(2)} €
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--color-text-secondary)',
              marginBottom: '2px'
            }}
          >
            PV Réalisée
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: asset.realizedPnL >= 0 ? '#10b981' : '#ef4444'
            }}
          >
            {asset.realizedPnL >= 0 ? '+' : ''}
            {asset.realizedPnL.toFixed(2)} €
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetMobileCard
