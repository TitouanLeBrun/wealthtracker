interface AssetPriceFieldProps {
  value: number
  onChange: (value: number) => void
}

function AssetPriceField({ value, onChange }: AssetPriceFieldProps): React.JSX.Element {
  return (
    <div>
      <label
        htmlFor="asset-price"
        style={{
          display: 'block',
          fontWeight: '600',
          marginBottom: '8px',
          fontSize: '14px',
          color: '#374151'
        }}
      >
        Prix actuel (€)
      </label>
      <input
        type="number"
        id="asset-price"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder="Ex: 195.50"
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          outline: 'none',
          transition: 'border-color 0.2s'
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
      />
      <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
        Peut être mis à jour plus tard
      </small>
    </div>
  )
}

export default AssetPriceField
