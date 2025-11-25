import { Plus } from 'lucide-react'
import TransactionManagerCards from '../transaction/TransactionManagerCards'
import type { Category, Transaction } from '../../types'

interface CategoryTransactionsSectionProps {
  category: Category
  transactions: Transaction[]
  onAddTransaction: () => void
  onDeleteTransaction: (transactionId: number) => Promise<void>
}

function CategoryTransactionsSection({
  category,
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
            padding: '10px 20px',
            background: category.color,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: `0 2px 8px ${category.color}40`,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = `0 6px 16px ${category.color}60`
            e.currentTarget.style.filter = 'brightness(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = `0 2px 8px ${category.color}40`
            e.currentTarget.style.filter = 'brightness(1)'
          }}
        >
          <Plus size={18} />
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
