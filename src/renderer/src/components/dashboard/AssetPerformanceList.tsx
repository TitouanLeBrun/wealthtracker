import { useState } from 'react'
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react'
import type { AssetPerformance } from '../../types'

interface AssetPerformanceListProps {
  assets: AssetPerformance[]
}

function AssetPerformanceList({ assets }: AssetPerformanceListProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false)

  if (assets.length === 0) {
    return (
      <div
        style={{
          background: 'var(--color-card-bg)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-xl)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)'
        }}
      >
        <p style={{ margin: 0 }}>Aucun actif en position ouverte</p>
        <p style={{ margin: 'var(--spacing-xs) 0 0', fontSize: '14px' }}>
          Ajoutez des transactions pour voir vos performances
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'var(--color-card-bg)',
        borderRadius: 'var(--border-radius)',
        overflow: 'hidden'
      }}
    >
      {/* Header du menu déroulant */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: 'var(--spacing-lg)',
          background: 'var(--color-border)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background 0.2s ease'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <span style={{ fontSize: '16px', fontWeight: '600' }}>
            📊 Détails par Actif ({assets.length})
          </span>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Contenu déroulant */}
      {isExpanded && (
        <div style={{ padding: 'var(--spacing-lg)' }}>
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr',
              gap: 'var(--spacing-md)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderBottom: '2px solid var(--color-border)',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-sm)'
            }}
          >
            <div>ACTIF</div>
            <div style={{ textAlign: 'right' }}>QUANTITÉ</div>
            <div style={{ textAlign: 'right' }}>PMA</div>
            <div style={{ textAlign: 'right' }}>PRIX MARCHÉ</div>
            <div style={{ textAlign: 'right' }}>VALEUR</div>
            <div style={{ textAlign: 'right' }}>+/- VALUE</div>
          </div>

          {/* Table rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            {assets.map((asset) => {
              const isPositive = asset.unrealizedPnL >= 0
              return (
                <div
                  key={asset.assetId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--color-bg)',
                    borderRadius: 'var(--border-radius)',
                    borderLeft: `4px solid ${asset.categoryColor}`,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Actif */}
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{asset.ticker}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {asset.name}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: asset.categoryColor,
                        marginTop: '2px'
                      }}
                    >
                      {asset.categoryName}
                    </div>
                  </div>

                  {/* Quantité */}
                  <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>
                      {asset.netQuantity.toFixed(4)}
                    </div>
                  </div>

                  {/* PMA */}
                  <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>
                      {asset.averageBuyPrice.toFixed(2)} €
                    </div>
                  </div>

                  {/* Prix Marché */}
                  <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>
                      {asset.currentPrice.toFixed(2)} €
                    </div>
                  </div>

                  {/* Valeur */}
                  <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>
                      {asset.currentValue.toFixed(2)} €
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      Investi: {asset.investedValue.toFixed(2)} €
                    </div>
                  </div>

                  {/* +/- Value */}
                  <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 'var(--spacing-xs)',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: isPositive ? 'var(--color-success)' : 'var(--color-error)'
                      }}
                    >
                      {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <span>
                        {isPositive ? '+' : ''}
                        {asset.unrealizedPnL.toFixed(2)} €
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: isPositive ? 'var(--color-success)' : 'var(--color-error)',
                        marginTop: '2px'
                      }}
                    >
                      {isPositive ? '+' : ''}
                      {asset.unrealizedPnLPercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default AssetPerformanceList
