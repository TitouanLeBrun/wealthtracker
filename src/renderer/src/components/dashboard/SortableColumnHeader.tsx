import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface SortableColumnHeaderProps<K> {
  column: K
  label: string
  sortKey: K
  sortDirection: 'asc' | 'desc'
  onSort: (key: K) => void
  align?: 'left' | 'right'
}

function SortableColumnHeader<K>({
  column,
  label,
  sortKey,
  sortDirection,
  onSort,
  align = 'left'
}: SortableColumnHeaderProps<K>): React.JSX.Element {
  const isActive = sortKey === column

  const SortIcon = (): React.JSX.Element => {
    if (!isActive) {
      return <ArrowUpDown size={14} color="var(--color-text-secondary)" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={14} color="var(--color-primary)" />
    ) : (
      <ArrowDown size={14} color="var(--color-primary)" />
    )
  }

  return (
    <button
      onClick={() => onSort(column)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        gap: 'var(--spacing-xs)',
        padding: 0,
        color: 'inherit',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        textAlign: align
      }}
    >
      {label}
      <SortIcon />
    </button>
  )
}

export default SortableColumnHeader
