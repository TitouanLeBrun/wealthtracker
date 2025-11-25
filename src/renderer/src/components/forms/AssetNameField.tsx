interface AssetNameFieldProps {
  value: string
  onChange: (value: string) => void
}

function AssetNameField({ value, onChange }: AssetNameFieldProps): React.JSX.Element {
  return (
    <div>
      <label
        htmlFor="asset-name"
        style={{
          display: 'block',
          fontWeight: '600',
          marginBottom: '8px',
          fontSize: '14px',
          color: '#374151'
        }}
      >
        Nom complet
      </label>
      <input
        type="text"
        id="asset-name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: Apple Inc., Bitcoin"
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
    </div>
  )
}

export default AssetNameField
