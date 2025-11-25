import TransactionCard from './TransactionCard'
import type { Transaction } from '../../types'

interface TransactionListProps {
  transactions: Transaction[]
  onDeleteTransaction?: (transaction: Transaction) => void
}

function TransactionList({
  transactions,
  onDeleteTransaction
}: TransactionListProps): React.JSX.Element {
  if (transactions.length === 0) {
    return (
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
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)'
      }}
    >
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onDelete={onDeleteTransaction ? () => onDeleteTransaction(transaction) : undefined}
        />
      ))}
    </div>
  )
}

export default TransactionList
