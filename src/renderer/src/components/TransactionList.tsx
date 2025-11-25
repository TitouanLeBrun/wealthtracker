import type { Transaction } from '../types'

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
}

function TransactionList({ transactions, loading }: TransactionListProps): React.JSX.Element {
  if (loading) {
    return (
      <section>
        <h2>📊 Liste des transactions</h2>
        <p>Chargement des transactions...</p>
      </section>
    )
  }

  if (transactions.length === 0) {
    return (
      <section>
        <h2>📊 Liste des transactions</h2>
        <p style={{ color: '#999' }}>Aucune transaction pour le moment. Ajoutez-en une !</p>
      </section>
    )
  }

  return (
    <section>
      <h2>📊 Liste des transactions</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            style={{
              padding: '15px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#333' }}>
              <strong>{transaction.label}</strong>
              <span
                style={{
                  color: transaction.amount >= 0 ? 'green' : 'red',
                  fontWeight: 'bold'
                }}
              >
                {transaction.amount >= 0 ? '+' : ''}
                {transaction.amount.toFixed(2)} €
              </span>
            </div>
            <small style={{ color: '#666' }}>
              {new Date(transaction.date).toLocaleDateString('fr-FR')}
            </small>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: '20px', color: '#666' }}>
        <strong>Total de transactions:</strong> {transactions.length}
      </p>
    </section>
  )
}

export default TransactionList
