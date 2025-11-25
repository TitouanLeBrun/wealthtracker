import { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import type { AssetMetrics } from '../../utils/calculations/enhancedPortfolioCalculations'
import {
  formatCurrency,
  formatPercent
} from '../../utils/calculations/enhancedPortfolioCalculations'

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
type SortDirection = 'asc' | 'desc'

function AssetDetailsTable({ assets, onAssetClick }: AssetDetailsTableProps): React.JSX.Element {
  const [sortKey, setSortKey] = useState<SortKey>('currentValue')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Tri des actifs
  const sortedAssets = useMemo(() => {
    return [...assets].sort((a, b) => {
      let aValue: number | string = 0
      let bValue: number | string = 0

      switch (sortKey) {
        case 'ticker':
          aValue = a.ticker
          bValue = b.ticker
          break
        case 'currentValue':
          aValue = a.currentValue
          bValue = b.currentValue
          break
        case 'totalPnL':
          aValue = a.totalPnL
          bValue = b.totalPnL
          break
        case 'totalPnLPercent':
          aValue = a.totalPnLPercent
          bValue = b.totalPnLPercent
          break
        case 'unrealizedPnL':
          aValue = a.unrealizedPnL
          bValue = b.unrealizedPnL
          break
        case 'realizedPnL':
          aValue = a.realizedPnL
          bValue = b.realizedPnL
          break
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })
  }, [assets, sortKey, sortDirection])

  const handleSort = (key: SortKey): void => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ column }: { column: SortKey }): React.JSX.Element => {
    if (sortKey !== column) {
      return <ArrowUpDown size={14} color="var(--color-text-secondary)" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} color="var(--color-primary)" />
    ) : (
      <ArrowDown size={14} color="var(--color-primary)" />
    )
  }

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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '200px 120px 120px 120px 120px 120px 120px 120px',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-md)',
            background: 'var(--color-input-bg)',
            borderBottom: '2px solid var(--color-border)',
            fontWeight: '600',
            fontSize: '13px',
            color: 'var(--color-text-secondary)'
          }}
        >
          <button
            onClick={() => handleSort('ticker')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 0,
              color: 'inherit',
              fontWeight: 'inherit',
              fontSize: 'inherit',
              textAlign: 'left'
            }}
          >
            Actif
            <SortIcon column="ticker" />
          </button>

          <div style={{ textAlign: 'right' }}>Quantité</div>

          <button
            onClick={() => handleSort('currentValue')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--spacing-xs)',
              padding: 0,
              color: 'inherit',
              fontWeight: 'inherit',
              fontSize: 'inherit'
            }}
          >
            Valeur
            <SortIcon column="currentValue" />
          </button>

          <div style={{ textAlign: 'right' }}>PMA</div>

          <button
            onClick={() => handleSort('unrealizedPnL')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--spacing-xs)',
              padding: 0,
              color: 'inherit',
              fontWeight: 'inherit',
              fontSize: 'inherit'
            }}
          >
            PV Latente
            <SortIcon column="unrealizedPnL" />
          </button>

          <button
            onClick={() => handleSort('realizedPnL')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--spacing-xs)',
              padding: 0,
              color: 'inherit',
              fontWeight: 'inherit',
              fontSize: 'inherit'
            }}
          >
            PV Réalisée
            <SortIcon column="realizedPnL" />
          </button>

          <button
            onClick={() => handleSort('totalPnL')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--spacing-xs)',
              padding: 0,
              color: 'inherit',
              fontWeight: 'inherit',
              fontSize: 'inherit'
            }}
          >
            PV Globale
            <SortIcon column="totalPnL" />
          </button>

          <button
            onClick={() => handleSort('totalPnLPercent')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--spacing-xs)',
              padding: 0,
              color: 'inherit',
              fontWeight: 'inherit',
              fontSize: 'inherit'
            }}
          >
            Performance
            <SortIcon column="totalPnLPercent" />
          </button>
        </div>

        {/* Lignes du tableau */}
        {sortedAssets.map((asset, index) => (
          <div
            key={asset.ticker}
            style={{
              display: 'grid',
              gridTemplateColumns: '200px 120px 120px 120px 120px 120px 120px 120px',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-md)',
              borderBottom:
                index < sortedAssets.length - 1 ? '1px solid var(--color-border)' : 'none',
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
        ))}
      </div>
    </div>
  )
}

export default AssetDetailsTable
