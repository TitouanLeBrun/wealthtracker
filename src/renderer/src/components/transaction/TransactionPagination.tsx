import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TransactionPaginationProps {
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  totalItems: number
  onPageChange: (page: number) => void
}

/**
 * Génère la liste des numéros de page à afficher avec ellipses
 * Exemples:
 * - 1 [2] 3 4 5 (si 5 pages, page actuelle = 2)
 * - 1 2 3 ... 56 57 (si 57 pages, page actuelle = 1)
 * - 1 ... 28 [29] 30 ... 57 (si 57 pages, page actuelle = 29)
 */
function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []
  const maxVisiblePages = 7 // Nombre max de boutons visibles

  // Si peu de pages, afficher toutes
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // Toujours afficher la première page
  pages.push(1)

  // Calculer la plage autour de la page actuelle
  const leftBound = Math.max(2, currentPage - 1)
  const rightBound = Math.min(totalPages - 1, currentPage + 1)

  // Ajouter ellipsis si nécessaire avant la page actuelle
  if (leftBound > 2) {
    pages.push('ellipsis')
  }

  // Ajouter les pages autour de la page actuelle
  for (let i = leftBound; i <= rightBound; i++) {
    pages.push(i)
  }

  // Ajouter ellipsis si nécessaire après la page actuelle
  if (rightBound < totalPages - 1) {
    pages.push('ellipsis')
  }

  // Toujours afficher la dernière page
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  return pages
}

function TransactionPagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange
}: TransactionPaginationProps): React.JSX.Element | null {
  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <>
      {/* Boutons de pagination */}
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
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
          {pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  style={{
                    padding: '8px 4px',
                    color: 'var(--color-text-secondary)',
                    fontSize: '16px',
                    fontWeight: '700'
                  }}
                >
                  ...
                </span>
              )
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                style={{
                  padding: '8px 12px',
                  minWidth: '40px',
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
            )
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            background: currentPage === totalPages ? 'var(--color-border)' : 'var(--color-primary)',
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

      {/* Info pagination */}
      <div
        style={{
          marginTop: 'var(--spacing-md)',
          textAlign: 'center',
          fontSize: '14px',
          color: 'var(--color-text-secondary)'
        }}
      >
        Affichage de {startIndex + 1} à {Math.min(endIndex, totalItems)} sur {totalItems}{' '}
        transaction(s)
      </div>
    </>
  )
}

export default TransactionPagination
