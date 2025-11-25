interface TickerExistsAlertProps {
  ticker: string
}

function TickerExistsAlert({ ticker }: TickerExistsAlertProps): React.JSX.Element {
  return (
    <div
      style={{
        padding: '12px 16px',
        backgroundColor: '#fee2e2',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#991b1b'
      }}
    >
      <span style={{ fontSize: '18px' }}>⚠️</span>
      <span style={{ fontWeight: '500' }}>
        Le ticker &quot;{ticker.toUpperCase()}&quot; existe déjà dans la base de données
      </span>
    </div>
  )
}

export default TickerExistsAlert
