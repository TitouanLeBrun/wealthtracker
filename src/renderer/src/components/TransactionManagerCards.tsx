import { Receipt, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react'
import type { Transaction } from '../types'

interface TransactionManagerCardsProps {
  transactions: Transaction[]
  loading?: boolean
}

function TransactionManagerCards({
  transactions,
  loading = false
}: TransactionManagerCardsProps): React.JSX.Element {
  // Calculer les statistiques
  const stats = transactions.reduce(
    (acc, transaction) => {
      const total = transaction.quantity * transaction.price + transaction.fees
      if (transaction.type === 'BUY') {
        acc.totalBuys += total
        acc.buyCount++
      } else {
        acc.totalSells += total
        acc.sellCount++
      }
      return acc
    },
    { totalBuys: 0, totalSells: 0, buyCount: 0, sellCount: 0 }
  )

  const balance = stats.totalSells - stats.totalBuys

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <div
          style={{
            height: '120px',
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      </div>
    )
  }

  return (
    <div>
      {/* Statistiques Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-xl)'
        }}
      >
        {/* Card Total Achats */}
        <div
          className="animate-scaleIn"
          style={{
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-lg)',
            border: '2px solid #ef4444',
            transition: 'all 0.2s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingDown size={24} color="#ef4444" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Achats ({stats.buyCount})
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>
                {stats.totalBuys.toFixed(2)} €
              </div>
            </div>
          </div>
        </div>

        {/* Card Total Ventes */}
        <div
          className="animate-scaleIn"
          style={{
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-lg)',
            border: '2px solid #10b981',
            transition: 'all 0.2s ease',
            cursor: 'default',
            animationDelay: '0.1s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingUp size={24} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Ventes ({stats.sellCount})
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                {stats.totalSells.toFixed(2)} €
              </div>
            </div>
          </div>
        </div>

        {/* Card Bilan */}
        <div
          className="animate-scaleIn"
          style={{
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-lg)',
            border: `2px solid ${balance >= 0 ? '#10b981' : '#ef4444'}`,
            transition: 'all 0.2s ease',
            cursor: 'default',
            animationDelay: '0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            const color = balance >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
            e.currentTarget.style.boxShadow = `0 12px 32px ${color}`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: `${balance >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DollarSign size={24} color={balance >= 0 ? '#10b981' : '#ef4444'} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Bilan</div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: balance >= 0 ? '#10b981' : '#ef4444'
                }}
              >
                {balance >= 0 ? '+' : ''}
                {balance.toFixed(2)} €
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des Transactions */}
      <div style={{ marginTop: 'var(--spacing-xl)' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: 'var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}
        >
          <Receipt size={20} />
          Historique des Transactions ({transactions.length})
        </h3>

        {transactions.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--spacing-xxl)',
              color: 'var(--color-text-secondary)'
            }}
          >
            <Receipt size={48} style={{ opacity: 0.3, margin: '0 auto var(--spacing-md)' }} />
            <p style={{ margin: 0, fontSize: '16px' }}>Aucune transaction enregistrée</p>
            <p style={{ margin: 'var(--spacing-sm) 0 0', fontSize: '14px' }}>
              Créez votre première transaction pour commencer
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)'
            }}
          >
            {transactions.map((transaction, index) => {
              const total = transaction.quantity * transaction.price + transaction.fees
              const isBuy = transaction.type === 'BUY'

              return (
                <div
                  key={transaction.id}
                  className="animate-scaleIn"
                  style={{
                    background: 'var(--color-card-bg)',
                    borderRadius: 'var(--border-radius)',
                    padding: 'var(--spacing-lg)',
                    borderLeft: `4px solid ${isBuy ? '#ef4444' : '#10b981'}`,
                    transition: 'all 0.2s ease',
                    animationDelay: `${index * 0.05}s`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
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
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: isBuy
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(16, 185, 129, 0.15)',
                            color: isBuy ? '#ef4444' : '#10b981',
                            border: `1px solid ${isBuy ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                          }}
                        >
                          {isBuy ? 'ACHAT' : 'VENTE'}
                        </span>
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          {transaction.asset.ticker}
                        </span>
                      </div>
                      <div
                        style={{
                          marginTop: 'var(--spacing-sm)',
                          fontSize: '14px',
                          color: 'var(--color-text-secondary)'
                        }}
                      >
                        {transaction.asset.name}
                      </div>
                    </div>

                    {/* Détails quantité/prix */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 'var(--spacing-lg)',
                        flexWrap: 'wrap'
                      }}
                    >
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
                          {transaction.price.toFixed(2)} €
                        </div>
                      </div>
                      {transaction.fees > 0 && (
                        <div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            Frais
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '600' }}>
                            {transaction.fees.toFixed(2)} €
                          </div>
                        </div>
                      )}
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        fontSize: '12px',
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      <Calendar size={14} />
                      {new Date(transaction.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionManagerCards
