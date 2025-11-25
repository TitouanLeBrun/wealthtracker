import { Lock } from 'lucide-react'

interface TransactionTypeSelectorProps {
  type: 'BUY' | 'SELL'
  onChange: (type: 'BUY' | 'SELL') => void
  isLocked: boolean
  canSell: boolean
}

function TransactionTypeSelector({
  type,
  onChange,
  isLocked,
  canSell
}: TransactionTypeSelectorProps): React.JSX.Element {
  return (
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
        Type *
      </label>
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', position: 'relative' }}>
        <button
          type="button"
          onClick={() => !isLocked && onChange('BUY')}
          disabled={isLocked}
          style={{
            flex: 1,
            padding: '12px',
            background: type === 'BUY' ? '#10b981' : isLocked ? '#f3f4f6' : 'var(--color-card)',
            color: type === 'BUY' ? 'white' : 'var(--color-text-primary)',
            border: `2px solid ${type === 'BUY' ? '#10b981' : 'var(--color-border)'}`,
            borderRadius: 'var(--border-radius)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isLocked ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: isLocked ? 0.7 : 1
          }}
        >
          ✓ Achat
        </button>
        <button
          type="button"
          onClick={() => !isLocked && canSell && onChange('SELL')}
          disabled={isLocked || !canSell}
          title={!canSell ? 'Aucune position disponible pour cet actif' : ''}
          style={{
            flex: 1,
            padding: '12px',
            background:
              type === 'SELL' ? '#ef4444' : isLocked || !canSell ? '#f3f4f6' : 'var(--color-card)',
            color:
              type === 'SELL'
                ? 'white'
                : isLocked || !canSell
                  ? '#9ca3af'
                  : 'var(--color-text-primary)',
            border: `2px solid ${type === 'SELL' ? '#ef4444' : 'var(--color-border)'}`,
            borderRadius: 'var(--border-radius)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isLocked || !canSell ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: isLocked || !canSell ? 0.6 : 1
          }}
        >
          ✓ Vente {!canSell && '🔒'}
        </button>
        {isLocked && (
          <Lock
            size={16}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-secondary)',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
    </div>
  )
}

export default TransactionTypeSelector
