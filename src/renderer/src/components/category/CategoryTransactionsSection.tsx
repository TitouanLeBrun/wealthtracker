import { Plus } from 'lucide-react'
import TransactionManagerCards from '../transaction/TransactionManagerCards'
import type { Transaction } from '../../types'

interface CategoryTransactionsSectionProps {
  transactions: Transaction[]
  onAddTransaction: () => void
  onDeleteTransaction: (transactionId: number) => Promise<void>
}

function CategoryTransactionsSection({
  transactions,
  onAddTransaction,
  onDeleteTransaction
}: CategoryTransactionsSectionProps): React.JSX.Element {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-md)'
        }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
          📊 Historique des Transactions
        </h3>
        <button
          onClick={onAddTransaction}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            padding: '8px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Plus size={16} />
          Ajouter une Transaction
        </button>
      </div>
      <TransactionManagerCards
        transactions={transactions}
        loading={false}
        onDelete={onDeleteTransaction}
      />
    </div>
  )
}

export default CategoryTransactionsSection
