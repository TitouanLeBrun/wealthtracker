interface AssetIsinFieldProps {
  value: string
  onChange: (value: string) => void
}

function AssetIsinField({ value, onChange }: AssetIsinFieldProps): React.JSX.Element {
  const handleChange = (newValue: string): void => {
    const upperIsin = newValue.toUpperCase().trim()
    onChange(upperIsin)
  }

  return (
    <div>
      <label
        htmlFor="asset-isin"
        style={{
          display: 'block',
          fontWeight: '600',
          marginBottom: '8px',
          fontSize: '14px',
          color: '#374151'
        }}
      >
        Code ISIN{' '}
        <span style={{ color: '#9ca3af', fontWeight: '400', fontSize: '12px' }}>
          (optionnel si ticker fourni)
        </span>
      </label>
      <input
        type="text"
        id="asset-isin"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Ex: FR0000120271, LU1681043599"
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          outline: 'none',
          textTransform: 'uppercase',
          transition: 'border-color 0.2s',
          backgroundColor: 'white',
          fontFamily: 'monospace'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#3b82f6'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db'
        }}
      />
      <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
        Code international à 12 caractères (ex: FR pour France, LU pour Luxembourg)
      </small>
    </div>
  )
}

export default AssetIsinField
