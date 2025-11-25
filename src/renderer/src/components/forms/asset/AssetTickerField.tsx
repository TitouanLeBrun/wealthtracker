interface AssetTickerFieldProps {
  value: string
  onChange: (value: string) => void
  onCheckExists: (ticker: string) => void
  hasError: boolean
}

function AssetTickerField({
  value,
  onChange,
  onCheckExists,
  hasError
}: AssetTickerFieldProps): React.JSX.Element {
  const handleChange = (newValue: string): void => {
    const upperTicker = newValue.toUpperCase()
    onChange(upperTicker)
    onCheckExists(upperTicker)
  }

  return (
    <div>
      <label
        htmlFor="asset-ticker"
        style={{
          display: 'block',
          fontWeight: '600',
          marginBottom: '8px',
          fontSize: '14px',
          color: '#374151'
        }}
      >
        Ticker / Symbole
      </label>
      <input
        type="text"
        id="asset-ticker"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Ex: AAPL, BTC, SPY"
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          border: hasError ? '2px solid #ef4444' : '1px solid #d1d5db',
          borderRadius: '6px',
          outline: 'none',
          textTransform: 'uppercase',
          transition: 'border-color 0.2s',
          backgroundColor: hasError ? '#fef2f2' : 'white'
        }}
        onFocus={(e) => {
          if (!hasError) e.currentTarget.style.borderColor = '#3b82f6'
        }}
        onBlur={(e) => {
          if (!hasError) e.currentTarget.style.borderColor = '#d1d5db'
        }}
      />
      <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
        Sera converti en majuscules
      </small>
    </div>
  )
}

export default AssetTickerField
