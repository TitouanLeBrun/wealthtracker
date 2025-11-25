interface FeeTotalFieldsProps {
  fee: string
  onFeeChange: (fee: string) => void
  total: number
  type: 'BUY' | 'SELL'
}

function FeeTotalFields({ fee, onFeeChange, total, type }: FeeTotalFieldsProps): React.JSX.Element {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-md)'
      }}
    >
      {/* Frais */}
      <div>
        <label
          htmlFor="fee"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--color-text-primary)'
          }}
        >
          Frais (€)
        </label>
        <input
          type="number"
          id="fee"
          step="0.01"
          value={fee}
          onChange={(e) => onFeeChange(e.target.value)}
          placeholder="Ex: 5.00"
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text-primary)',
            fontSize: '14px'
          }}
        />
        <small style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
          Frais de courtage (optionnel)
        </small>
      </div>

      {/* Total */}
      <div>
        <label
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--color-text-primary)'
          }}
        >
          Total de la transaction
        </label>
        <div
          style={{
            padding: '12px',
            background: type === 'BUY' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${type === 'BUY' ? '#10b981' : '#ef4444'}`,
            borderRadius: 'var(--border-radius)',
            fontSize: '18px',
            fontWeight: '700',
            color: type === 'BUY' ? '#10b981' : '#ef4444',
            textAlign: 'right'
          }}
        >
          {total > 0 ? `${total.toFixed(2)} €` : '—'}
        </div>
        <small style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
          {type === 'BUY' ? 'Montant à débourser' : 'Montant à recevoir'}
        </small>
      </div>
    </div>
  )
}

export default FeeTotalFields
