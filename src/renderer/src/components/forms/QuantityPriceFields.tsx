import type { Asset } from '../../types'

interface QuantityPriceFieldsProps {
  quantity: string
  pricePerUnit: string
  onQuantityChange: (quantity: string) => void
  onPriceChange: (price: string) => void
  type: 'BUY' | 'SELL'
  ownedQuantity: number
  selectedAsset: Asset | undefined
  quantityError?: string
  priceError?: string
}

function QuantityPriceFields({
  quantity,
  pricePerUnit,
  onQuantityChange,
  onPriceChange,
  type,
  ownedQuantity,
  selectedAsset,
  quantityError,
  priceError
}: QuantityPriceFieldsProps): React.JSX.Element {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--spacing-md)',
        marginBottom:
          type === 'SELL' && ownedQuantity > 0 ? 'var(--spacing-sm)' : 'var(--spacing-md)'
      }}
    >
      {/* Quantité */}
      <div>
        <label
          htmlFor="quantity"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--color-text-primary)'
          }}
        >
          Quantité *
          {type === 'SELL' && ownedQuantity > 0 && (
            <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--color-primary)' }}>
              (Max: {ownedQuantity.toFixed(8)} {selectedAsset?.ticker})
            </span>
          )}
        </label>
        <input
          type="number"
          id="quantity"
          step="0.00000001"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          placeholder="Ex: 10 ou 0.5"
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--color-input-bg)',
            border: `1px solid ${quantityError ? '#ef4444' : 'var(--color-border)'}`,
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text-primary)',
            fontSize: '14px'
          }}
          required
        />
        {quantityError && (
          <small style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
            {quantityError}
          </small>
        )}
      </div>

      {/* Prix unitaire */}
      <div>
        <label
          htmlFor="pricePerUnit"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--color-text-primary)'
          }}
        >
          Prix unitaire (€) *
        </label>
        <input
          type="number"
          id="pricePerUnit"
          step="0.01"
          value={pricePerUnit}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="Ex: 195.50"
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--color-input-bg)',
            border: `1px solid ${priceError ? '#f59e0b' : 'var(--color-border)'}`,
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text-primary)',
            fontSize: '14px'
          }}
          required
        />
        {priceError && (
          <small style={{ color: '#f59e0b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
            {priceError}
          </small>
        )}
      </div>
    </div>
  )
}

export default QuantityPriceFields
