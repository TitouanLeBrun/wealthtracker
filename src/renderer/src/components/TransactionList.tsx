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

  // Calculer le total investi/récupéré
  const totalBuy = transactions
    .filter((t) => t.type === 'BUY')
    .reduce((sum, t) => sum + t.quantity * t.pricePerUnit + t.fee, 0)

  const totalSell = transactions
    .filter((t) => t.type === 'SELL')
    .reduce((sum, t) => sum + t.quantity * t.pricePerUnit - t.fee, 0)

  return (
    <section>
      <h2>📊 Liste des transactions</h2>

      {/* Résumé */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '20px'
        }}
      >
        <div style={{ padding: '15px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>Total Achats</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f44336' }}>
            -{totalBuy.toFixed(2)} €
          </div>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>Total Ventes</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>
            +{totalSell.toFixed(2)} €
          </div>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>Bilan Net</div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: totalSell - totalBuy >= 0 ? '#4CAF50' : '#f44336'
            }}
          >
            {totalSell - totalBuy >= 0 ? '+' : ''}
            {(totalSell - totalBuy).toFixed(2)} €
          </div>
        </div>
      </div>

      {/* Liste */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {transactions.map((transaction) => {
          const total = transaction.quantity * transaction.pricePerUnit
          const totalWithFee =
            transaction.type === 'BUY' ? total + transaction.fee : total - transaction.fee

          return (
            <li
              key={transaction.id}
              style={{
                padding: '15px',
                marginBottom: '10px',
                border: `2px solid ${transaction.type === 'BUY' ? '#4CAF50' : '#f44336'}`,
                borderRadius: '4px',
                backgroundColor: '#f9f9f9'
              }}
            >
              {/* En-tête */}
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}
              >
                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      backgroundColor: transaction.type === 'BUY' ? '#4CAF50' : '#f44336',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginRight: '10px'
                    }}
                  >
                    {transaction.type === 'BUY' ? '🟢 ACHAT' : '🔴 VENTE'}
                  </span>
                  <strong style={{ fontSize: '16px' }}>
                    {transaction.asset?.ticker || `Asset #${transaction.assetId}`}
                  </strong>
                  <span style={{ color: '#666', marginLeft: '8px' }}>
                    {transaction.asset?.name}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: transaction.type === 'BUY' ? '#f44336' : '#4CAF50'
                    }}
                  >
                    {transaction.type === 'BUY' ? '-' : '+'}
                    {totalWithFee.toFixed(2)} €
                  </div>
                  <small style={{ color: '#666' }}>
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </small>
                </div>
              </div>

              {/* Détails */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '10px',
                  fontSize: '14px',
                  color: '#666',
                  backgroundColor: '#fff',
                  padding: '10px',
                  borderRadius: '4px'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600' }}>Quantité</div>
                  <div>{transaction.quantity}</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>Prix unitaire</div>
                  <div>{transaction.pricePerUnit.toFixed(2)} €</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>Frais</div>
                  <div>{transaction.fee.toFixed(2)} €</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>Total</div>
                  <div>{total.toFixed(2)} €</div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <p style={{ marginTop: '20px', color: '#666' }}>
        <strong>Total de transactions:</strong> {transactions.length}
      </p>
    </section>
  )
}

export default TransactionList
