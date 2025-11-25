import SortableColumnHeader from './SortableColumnHeader'

type SortKey =
  | 'ticker'
  | 'currentValue'
  | 'totalPnL'
  | 'totalPnLPercent'
  | 'unrealizedPnL'
  | 'realizedPnL'

interface AssetTableHeaderProps {
  sortKey: SortKey
  sortDirection: 'asc' | 'desc'
  onSort: (key: SortKey) => void
}

function AssetTableHeader({
  sortKey,
  sortDirection,
  onSort
}: AssetTableHeaderProps): React.JSX.Element {
  return (
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
      <SortableColumnHeader
        column="ticker"
        label="Actif"
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={onSort}
        align="left"
      />

      <div style={{ textAlign: 'right' }}>Quantité</div>

      <SortableColumnHeader
        column="currentValue"
        label="Valeur"
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={onSort}
        align="right"
      />

      <div style={{ textAlign: 'right' }}>PMA</div>

      <SortableColumnHeader
        column="unrealizedPnL"
        label="PV Latente"
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={onSort}
        align="right"
      />

      <SortableColumnHeader
        column="realizedPnL"
        label="PV Réalisée"
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={onSort}
        align="right"
      />

      <SortableColumnHeader
        column="totalPnL"
        label="PV Globale"
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={onSort}
        align="right"
      />

      <SortableColumnHeader
        column="totalPnLPercent"
        label="Performance"
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={onSort}
        align="right"
      />
    </div>
  )
}

export default AssetTableHeader
