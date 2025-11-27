import { useCallback } from 'react'
import type { AssetMetrics } from '../../utils/calculations/enhancedPortfolioCalculations'
import { useTableSort } from '../../hooks/useTableSort'
import AssetTableHeader from './AssetTableHeader'
import AssetTableRow from './AssetTableRow'
import AssetMobileCard from './AssetMobileCard'
import AssetEmptyState from './AssetEmptyState'
import AssetTableTitle from './AssetTableTitle'

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
    return <AssetEmptyState />
  }

  return (
    <div>
      {/* Titre */}
      {/* <AssetTableTitle assetCount={assets.length} /> */}

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
          <AssetMobileCard key={asset.ticker} asset={asset} onAssetClick={onAssetClick} />
        ))}
      </div>
    </div>
  )
}

export default AssetDetailsTable
