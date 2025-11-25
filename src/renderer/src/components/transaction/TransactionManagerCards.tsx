import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Filter } from 'lucide-react'
import type { Transaction } from '../../types'

interface TransactionManagerCardsProps {
  transactions: Transaction[]
  loading?: boolean
}

const ITEMS_PER_PAGE = 5

function TransactionManagerCards({
  transactions,
  loading = false
}: TransactionManagerCardsProps): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('')

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
      <div
        style={{
          background: 'var(--color-card-bg)',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-lg)',
          display: 'flex',
          gap: 'var(--spacing-md)',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          <Filter size={18} color="var(--color-primary)" />
          <span style={{ fontWeight: '600', fontSize: '14px' }}>Filtres:</span>
        </div>

        {/* Filtre par catégorie */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          <label
            htmlFor="category-filter"
            style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}
          >
            Catégorie:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => handleFilterChange(e.target.value, dateFilter)}
            style={{
              padding: '8px 12px',
              background: 'var(--color-input-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">Toutes</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
          <label
            htmlFor="date-filter"
            style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}
          >
            <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Date:
          </label>
          <input
            id="date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => handleFilterChange(selectedCategory, e.target.value)}
            style={{
              padding: '8px 12px',
              background: 'var(--color-input-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius)',
              color: 'var(--color-text-primary)',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Reset filters */}
        {(selectedCategory !== 'all' || dateFilter) && (
          <button
            onClick={() => {
              setSelectedCategory('all')
              setDateFilter('')
              setCurrentPage(1)
            }}
            style={{
              padding: '8px 16px',
              background: 'var(--color-border)',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
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
            Réinitialiser
          </button>
        )}

        {/* Résultats */}
        <div
          style={{
            marginLeft: 'auto',
            fontSize: '14px',
            color: 'var(--color-text-secondary)'
          }}
        >
          {filteredTransactions.length} transaction(s) trouvée(s)
        </div>
      </div>

      {/* Liste des transactions */}
      {filteredTransactions.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--spacing-xl)',
            color: 'var(--color-text-secondary)',
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)'
          }}
        >
          <p style={{ margin: 0 }}>Aucune transaction ne correspond aux filtres sélectionnés</p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)'
            }}
          >
            {currentTransactions.map((transaction) => {
              const total = transaction.quantity * transaction.pricePerUnit + transaction.fee
              const isBuy = transaction.type === 'BUY'

              return (
                <div
                  key={transaction.id}
                  style={{
                    background: 'var(--color-card-bg)',
                    borderRadius: 'var(--border-radius)',
                    padding: 'var(--spacing-lg)',
                    borderLeft: `4px solid ${isBuy ? '#ef4444' : '#10b981'}`,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: 'var(--spacing-md)'
                    }}
                  >
                    {/* Infos principales */}
                    <div style={{ flex: '1', minWidth: '200px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)',
                          marginBottom: 'var(--spacing-xs)'
                        }}
                      >
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: isBuy
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(16, 185, 129, 0.15)',
                            color: isBuy ? '#ef4444' : '#10b981'
                          }}
                        >
                          {isBuy ? 'ACHAT' : 'VENTE'}
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>
                          {transaction.asset?.ticker}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'var(--color-text-secondary)',
                          marginBottom: 'var(--spacing-xs)'
                        }}
                      >
                        {transaction.asset?.name}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-xs)'
                        }}
                      >
                        <span
                          style={{
                            padding: '2px 8px',
                            background: transaction.asset?.category?.color || '#4CAF50',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '11px'
                          }}
                        >
                          {transaction.asset?.category?.name}
                        </span>
                      </div>
                    </div>

                    {/* Détails */}
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                          Quantité
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>
                          {transaction.quantity}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                          Prix unitaire
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>
                          {transaction.pricePerUnit.toFixed(2)} €
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                          Frais
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>
                          {transaction.fee.toFixed(2)} €
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                          Total
                        </div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: isBuy ? '#ef4444' : '#10b981'
                          }}
                        >
                          {total.toFixed(2)} €
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)'
                      }}
                    >
                      <Calendar size={14} />
                      {new Date(transaction.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                marginTop: 'var(--spacing-lg)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'var(--spacing-md)'
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  background: currentPage === 1 ? 'var(--color-border)' : 'var(--color-primary)',
                  color: currentPage === 1 ? 'var(--color-text-secondary)' : 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronLeft size={16} />
                Précédent
              </button>

              <div
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-xs)',
                  alignItems: 'center'
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: '8px 12px',
                      background: page === currentPage ? 'var(--color-primary)' : 'transparent',
                      color: page === currentPage ? 'white' : 'var(--color-text-primary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--border-radius)',
                      cursor: 'pointer',
                      fontWeight: page === currentPage ? '700' : '400',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (page !== currentPage) {
                        e.currentTarget.style.background = 'var(--color-card-bg)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (page !== currentPage) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  background:
                    currentPage === totalPages ? 'var(--color-border)' : 'var(--color-primary)',
                  color: currentPage === totalPages ? 'var(--color-text-secondary)' : 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  transition: 'all 0.2s ease'
                }}
              >
                Suivant
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Info pagination */}
          <div
            style={{
              marginTop: 'var(--spacing-md)',
              textAlign: 'center',
              fontSize: '14px',
              color: 'var(--color-text-secondary)'
            }}
          >
            Affichage de {startIndex + 1} à {Math.min(endIndex, filteredTransactions.length)} sur{' '}
            {filteredTransactions.length} transaction(s)
          </div>
        </>
      )}
    </div>
  )
}

export default TransactionManagerCards
