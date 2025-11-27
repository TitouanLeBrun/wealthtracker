import { Calendar, Trash2, Edit2 } from 'lucide-react'
import type { Transaction } from '../../types'

interface TransactionMobileViewProps {
  transaction: Transaction
  total: number
  isBuy: boolean
  onDelete?: () => void
  onEdit?: () => void
  onAssetClick?: (assetId: number) => void
}

function TransactionMobileView({
  transaction,
  total,
  isBuy,
  onDelete,
  onEdit,
  onAssetClick
}: TransactionMobileViewProps): React.JSX.Element {
  return (
    <div className="transaction-card-mobile" style={{ padding: 'var(--spacing-md)' }}>
      {/* En-tête */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--spacing-md)',
          paddingBottom: 'var(--spacing-md)',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              marginBottom: 'var(--spacing-xs)'
            }}
          >
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '600',
                background: isBuy ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: isBuy ? '#ef4444' : '#10b981',
                whiteSpace: 'nowrap'
              }}
            >
              {isBuy ? 'ACHAT' : 'VENTE'}
            </span>
            <span
              style={{
                padding: '3px 8px',
                background: transaction.asset?.category?.color || '#4CAF50',
                color: 'white',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '600'
              }}
            >
              {transaction.asset?.category?.name}
            </span>
          </div>
          <div
            onClick={() => transaction.asset && onAssetClick?.(transaction.asset.id)}
            style={{
              fontSize: '17px',
              fontWeight: '700',
              color: onAssetClick ? 'var(--color-primary)' : 'var(--color-text-primary)',
              cursor: onAssetClick ? 'pointer' : 'default',
              marginBottom: '2px'
            }}
          >
            {transaction.asset?.ticker}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            {transaction.asset?.name}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
          {onEdit && (
            <button
              onClick={onEdit}
              title="Éditer"
              style={{
                padding: '8px',
                background: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff3cd'
                e.currentTarget.style.borderColor = '#f59e0b'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <Edit2 size={16} color="#f59e0b" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              title="Supprimer"
              style={{
                padding: '8px',
                background: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
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

      {/* Détails principaux */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-md)'
        }}
      >
        <div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Quantité</div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>{transaction.quantity}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Prix/u</div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>
            {transaction.pricePerUnit.toFixed(2)} €
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Frais</div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>{transaction.fee.toFixed(2)} €</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Total</div>
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
          color: 'var(--color-text-secondary)',
          paddingTop: 'var(--spacing-sm)',
          borderTop: '1px solid var(--color-border)'
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
    </div>
  )
}

export default TransactionMobileView
