import { Calendar, Trash2 } from 'lucide-react'
import type { Transaction } from '../../types'

interface TransactionDesktopViewProps {
  transaction: Transaction
  total: number
  isBuy: boolean
  onDelete?: () => void
  onAssetClick?: (assetId: number) => void
}

function TransactionDesktopView({
  transaction,
  total,
  isBuy,
  onDelete,
  onAssetClick
}: TransactionDesktopViewProps): React.JSX.Element {
  return (
    <div
      className="transaction-card-desktop"
      style={{
        padding: 'var(--spacing-lg)',
        overflowX: 'auto'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr 100px 100px 100px 100px 150px auto',
          gap: 'var(--spacing-md)',
          alignItems: 'center',
          minWidth: '850px'
        }}
      >
        {/* Col 1: Badge Type */}
        <div>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              background: isBuy ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: isBuy ? '#ef4444' : '#10b981',
              whiteSpace: 'nowrap'
            }}
          >
            {isBuy ? 'ACHAT' : 'VENTE'}
          </span>
        </div>

        {/* Col 2: Asset (Ticker + Nom + Catégorie) */}
        <div style={{ minWidth: '0' }}>
          <div
            onClick={() => transaction.asset && onAssetClick?.(transaction.asset.id)}
            style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '4px',
              cursor: onAssetClick ? 'pointer' : 'default',
              color: onAssetClick ? 'var(--color-primary)' : 'var(--color-text-primary)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (onAssetClick) {
                e.currentTarget.style.textDecoration = 'underline'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none'
            }}
          >
            {transaction.asset?.ticker}
          </div>
          <div
            style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              marginBottom: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {transaction.asset?.name}
          </div>
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

        {/* Col 3: Quantité */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              marginBottom: '4px'
            }}
          >
            Quantité
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>{transaction.quantity}</div>
        </div>

        {/* Col 4: Prix unitaire */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              marginBottom: '4px'
            }}
          >
            Prix/u
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>
            {transaction.pricePerUnit.toFixed(2)} €
          </div>
        </div>

        {/* Col 5: Frais */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              marginBottom: '4px'
            }}
          >
            Frais
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>{transaction.fee.toFixed(2)} €</div>
        </div>

        {/* Col 6: Total */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              marginBottom: '4px'
            }}
          >
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

        {/* Col 7: Date */}
        <div
          style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            justifyContent: 'center'
          }}
        >
          <Calendar size={14} />
          <span>
            {new Date(transaction.date).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </span>
        </div>

        {/* Col 8: Bouton Supprimer (à la fin) */}
        {onDelete && (
          <button
            onClick={onDelete}
            title="Supprimer cette transaction"
            style={{
              padding: '8px',
              background: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              marginLeft: 'auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee2e2'
              e.currentTarget.style.borderColor = '#ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          >
            <Trash2 size={16} color="#ef4444" />
          </button>
        )}
      </div>
    </div>
  )
}

export default TransactionDesktopView
