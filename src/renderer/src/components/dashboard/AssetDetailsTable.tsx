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

      {/* Tableau */}
      <div
        style={{
          background: 'var(--color-card-bg)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden'
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
    </div>
  )
}

export default AssetDetailsTable
