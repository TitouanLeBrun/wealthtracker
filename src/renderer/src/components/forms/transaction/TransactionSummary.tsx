import type { Asset } from '../../../types'

interface TransactionSummaryProps {
  type: 'BUY' | 'SELL'
  selectedAsset: Asset | undefined
  quantity: string
  pricePerUnit: string
  fee: string
  total: number
  categoryColor?: string
}

function TransactionSummary({
  type,
  selectedAsset,
  quantity,
  pricePerUnit,
  fee,
  total,
  categoryColor = '#3b82f6'
}: TransactionSummaryProps): React.JSX.Element {
  if (total <= 0) return <></>

  // Utiliser la couleur de la catégorie pour les achats, rouge pour les ventes
  const bgColor = type === 'BUY' ? categoryColor : '#ef4444'
  const borderColor = type === 'BUY' ? categoryColor : '#ef4444'

  return (
    <div
      style={{
        padding: 'var(--spacing-md)',
        background: `${bgColor}15`,
        borderRadius: 'var(--border-radius)',
        marginBottom: 'var(--spacing-md)',
        border: `1px solid ${borderColor}50`
      }}
    >
      <h4
        style={{
          margin: '0 0 var(--spacing-sm) 0',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--color-text-primary)'
        }}
      >
        📋 Récapitulatif
      </h4>
      <div style={{ display: 'grid', gap: 'var(--spacing-xs)', fontSize: '13px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Type :</span>
          <span
            style={{
              fontWeight: '600',
              color: type === 'BUY' ? categoryColor : '#ef4444'
            }}
          >
            {type === 'BUY' ? '📈 Achat' : '📉 Vente'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Actif :</span>
          <span style={{ fontWeight: '600' }}>
            {selectedAsset ? `${selectedAsset.ticker} - ${selectedAsset.name}` : '—'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Quantité :</span>
          <span style={{ fontWeight: '600' }}>
            {quantity || '—'} {selectedAsset?.ticker}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Prix unitaire :</span>
          <span style={{ fontWeight: '600' }}>
            {pricePerUnit ? `${parseFloat(pricePerUnit).toFixed(2)} €` : '—'}
          </span>
        </div>
        {parseFloat(fee) > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Frais :</span>
            <span style={{ fontWeight: '600' }}>{parseFloat(fee).toFixed(2)} €</span>
          </div>
        )}
        <div
          style={{
            borderTop: `1px solid ${borderColor}50`,
            marginTop: 'var(--spacing-xs)',
            paddingTop: 'var(--spacing-xs)',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>Total :</span>
          <span
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: type === 'BUY' ? categoryColor : '#ef4444'
            }}
          >
            {total.toFixed(2)} €
          </span>
        </div>
      </div>
    </div>
  )
}

export default TransactionSummary
