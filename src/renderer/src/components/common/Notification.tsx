interface NotificationProps {
  type: 'success' | 'error'
  message: string
}

function Notification({ type, message }: NotificationProps): React.JSX.Element {
  return (
    <div
      style={{
        padding: '12px 20px',
        marginBottom: '20px',
        borderRadius: '4px',
        backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
        color: type === 'success' ? '#155724' : '#721c24',
        border: `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      {type === 'success' ? '✅ ' : '❌ '}
      {message}
    </div>
  )
}

export default Notification
