import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TransactionPaginationProps {
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  totalItems: number
  onPageChange: (page: number) => void
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
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
