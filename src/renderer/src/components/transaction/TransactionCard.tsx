import type { Transaction } from '../../types'
import TransactionDesktopView from './TransactionDesktopView'
import TransactionMobileView from './TransactionMobileView'

interface TransactionCardProps {
  transaction: Transaction
  onDelete?: () => void
  onAssetClick?: (assetId: number) => void
}

function TransactionCard({
  transaction,
  onDelete,
  onAssetClick
}: TransactionCardProps): React.JSX.Element {
  const total = transaction.quantity * transaction.pricePerUnit + transaction.fee
  const isBuy = transaction.type === 'BUY'

  return (
    <div
      style={{
        background: 'var(--color-card-bg)',
        borderRadius: 'var(--border-radius)',
        borderLeft: `4px solid ${isBuy ? '#ef4444' : '#10b981'}`,
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(4px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* VERSION DESKTOP - Tableau avec scroll horizontal */}
      <TransactionDesktopView
        transaction={transaction}
        total={total}
        isBuy={isBuy}
        onDelete={onDelete}
        onAssetClick={onAssetClick}
      />

      {/* VERSION MOBILE - Card compacte verticale */}
      <TransactionMobileView
        transaction={transaction}
        total={total}
        isBuy={isBuy}
        onDelete={onDelete}
        onAssetClick={onAssetClick}
      />
    </div>
  )
}

export default TransactionCard
