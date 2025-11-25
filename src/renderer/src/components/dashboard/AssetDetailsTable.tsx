import { useCallback } from 'react'
import type { AssetMetrics } from '../../utils/calculations/enhancedPortfolioCalculations'
import { useTableSort } from '../../hooks/useTableSort'
import AssetTableHeader from './AssetTableHeader'
import AssetTableRow from './AssetTableRow'

interface AssetDetailsTableProps {
  assets: AssetMetrics[]
  onAssetClick?: (assetId: number) => void
}

type SortKey =
  | 'ticker'
  | 'currentValue'
  | 'totalPnL'
  | 'totalPnLPercent'
  | 'unrealizedPnL'
  | 'realizedPnL'

function AssetDetailsTable({ assets, onAssetClick }: AssetDetailsTableProps): React.JSX.Element {
  // Hook personnalisé pour le tri
  const getSortValue = useCallback((asset: AssetMetrics, key: SortKey): number | string => {
    switch (key) {
      case 'ticker':
        return asset.ticker
      case 'currentValue':
        return asset.currentValue
      case 'totalPnL':
        return asset.totalPnL
      case 'totalPnLPercent':
        return asset.totalPnLPercent
      case 'unrealizedPnL':
        return asset.unrealizedPnL
      case 'realizedPnL':
        return asset.realizedPnL
      default:
        return 0
    }
  }, [])

  const { sortedData, sortKey, sortDirection, handleSort } = useTableSort<AssetMetrics, SortKey>({
    data: assets,
    initialSortKey: 'currentValue',
    initialDirection: 'desc',
    getSortValue
  })

  const sortedAssets = sortedData as AssetMetrics[]

  if (assets.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--spacing-xxl)',
          background: 'var(--color-card-bg)',
          borderRadius: 'var(--border-radius)',
          color: 'var(--color-text-secondary)'
        }}
      >
        <p style={{ margin: 0 }}>Aucun actif dans votre portefeuille</p>
      </div>
    )
  }

  return (
    <div>
      {/* Titre */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--spacing-xs) 0'
          }}
        >
          📋 Détails par Actif
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            margin: 0
          }}
        >
          Performance détaillée de chaque actif ({assets.length} actif{assets.length > 1 ? 's' : ''}
          )
        </p>
      </div>

      {/* Tableau - Desktop */}
      <div
        className="asset-table-desktop"
        style={{
          background: 'var(--color-card-bg)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          overflowX: 'auto'
        }}
      >
        {/* En-tête du tableau */}
        <AssetTableHeader sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />

        {/* Lignes du tableau */}
        {sortedAssets.map((asset, index) => (
          <AssetTableRow
            key={asset.ticker}
            asset={asset}
            isLast={index === sortedAssets.length - 1}
            onAssetClick={onAssetClick}
          />
        ))}
      </div>

      {/* Cards - Mobile */}
      <div className="asset-cards-mobile">
        {sortedAssets.map((asset) => (
          <div
            key={asset.ticker}
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
        ))}
      </div>
    </div>
  )
}

export default AssetDetailsTable
