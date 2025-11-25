import { useState, useMemo } from 'react'
import ConfirmDialog from '../common/ConfirmDialog'
import TransactionFilters from './TransactionFilters'
import TransactionList from './TransactionList'
import TransactionPagination from './TransactionPagination'
import type { Transaction } from '../../types'

interface TransactionManagerCardsProps {
  transactions: Transaction[]
  loading?: boolean
  onDelete?: (transactionId: number) => Promise<void>
}

const ITEMS_PER_PAGE = 5

function TransactionManagerCards({
  transactions,
  loading = false,
  onDelete
}: TransactionManagerCardsProps): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')
  const [deleteConfirm, setDeleteConfirm] = useState<Transaction | null>(null)

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    const categorySet = new Set(
      transactions.filter((t) => t.asset?.category).map((t) => t.asset!.category!.name)
    )
    return Array.from(categorySet)
  }, [transactions])

  // Filtrer les transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Filtre par catégorie
      if (selectedCategory !== 'all') {
        if (transaction.asset?.category?.name !== selectedCategory) {
          return false
        }
      }

      // Filtre par date
      if (dateFilter) {
        const transactionDate = new Date(transaction.date).toISOString().split('T')[0]
        if (transactionDate !== dateFilter) {
          return false
        }
      }

      return true
    })
  }, [transactions, selectedCategory, dateFilter])

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  // Réinitialiser la page quand les filtres changent
  const handleFilterChange = (category: string, date: string): void => {
    setSelectedCategory(category)
    setDateFilter(date)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Chargement...</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--spacing-xxl)',
          color: 'var(--color-text-secondary)'
        }}
      >
        <p style={{ margin: 0, fontSize: '16px' }}>Aucune transaction enregistrée</p>
        <p style={{ margin: 'var(--spacing-sm) 0 0', fontSize: '14px' }}>
          Créez votre première transaction pour commencer
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Filtres */}
      <TransactionFilters
        selectedCategory={selectedCategory}
        dateFilter={dateFilter}
        categories={categories}
        resultCount={filteredTransactions.length}
        onCategoryChange={(category) => handleFilterChange(category, dateFilter)}
        onDateChange={(date) => handleFilterChange(selectedCategory, date)}
        onReset={() => {
          setSelectedCategory('all')
          setDateFilter('')
          setCurrentPage(1)
        }}
      />

      {/* Liste des transactions */}
      <TransactionList
        transactions={currentTransactions}
        onDeleteTransaction={onDelete ? (transaction) => setDeleteConfirm(transaction) : undefined}
      />

      {/* Pagination */}
      <TransactionPagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={filteredTransactions.length}
        onPageChange={setCurrentPage}
      />

      {/* Dialog de confirmation de suppression */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Supprimer la transaction"
        message="Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible."
        details={
          deleteConfirm
            ? `${deleteConfirm.type === 'BUY' ? 'ACHAT' : 'VENTE'} | ${deleteConfirm.asset?.ticker} | Quantité: ${deleteConfirm.quantity} | Total: ${(deleteConfirm.quantity * deleteConfirm.pricePerUnit + deleteConfirm.fee).toFixed(2)} €`
            : undefined
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={async () => {
          if (deleteConfirm && onDelete) {
            await onDelete(deleteConfirm.id)
            setDeleteConfirm(null)
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}

export default TransactionManagerCards
