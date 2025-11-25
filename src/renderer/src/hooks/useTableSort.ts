import { useState, useMemo } from 'react'

export type SortDirection = 'asc' | 'desc'

interface UseTableSortOptions<T, K extends keyof T> {
  data: T[]
  initialSortKey: K
  initialDirection?: SortDirection
  getSortValue: (item: T, key: K) => number | string
}

interface UseTableSortReturn<K> {
  sortedData: unknown[]
  sortKey: K
  sortDirection: SortDirection
  handleSort: (key: K) => void
}

export function useTableSort<T, K extends keyof T>({
  data,
  initialSortKey,
  initialDirection = 'desc',
  getSortValue
}: UseTableSortOptions<T, K>): UseTableSortReturn<K> {
  const [sortKey, setSortKey] = useState<K>(initialSortKey)
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialDirection)

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = getSortValue(a, sortKey)
      const bValue = getSortValue(b, sortKey)

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })
  }, [data, sortKey, sortDirection, getSortValue])

  const handleSort = (key: K): void => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  return {
    sortedData,
    sortKey,
    sortDirection,
    handleSort
  }
}
