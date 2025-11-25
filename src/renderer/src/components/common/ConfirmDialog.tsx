import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string | React.ReactNode
  details?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isDestructive?: boolean
  disabled?: boolean
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  details,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
  isDestructive = false,
  disabled = false
}: ConfirmDialogProps): React.JSX.Element | null {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onCancel}
      >
        {/* Dialog */}
        <div
          style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            maxWidth: '450px',
            width: '90%',
            animation: 'scaleIn 0.2s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: 'var(--spacing-lg)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <AlertTriangle size={20} color="#ef4444" />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{title}</h3>
            </div>
            <button
              onClick={onCancel}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-border)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: 'var(--spacing-lg)' }}>
            <p
              style={{
                margin: '0 0 var(--spacing-md)',
                fontSize: '15px',
                color: 'var(--color-text-primary)',
                lineHeight: '1.6'
              }}
            >
              {message}
            </p>
            {details && (
              <div
                style={{
                  background: 'var(--color-bg)',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  borderLeft: '3px solid var(--color-primary)'
                }}
              >
                {details}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: 'var(--spacing-lg)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: 'var(--spacing-md)',
              justifyContent: 'flex-end'
            }}
          >
            <button
              onClick={onCancel}
              style={{
                padding: '10px 20px',
                background: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#d1d5db'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-border)'
              }}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={disabled}
              style={{
                padding: '10px 20px',
                background: isDestructive ? '#ef4444' : 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: disabled ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.currentTarget.style.background = isDestructive ? '#dc2626' : '#2563eb'
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled) {
                  e.currentTarget.style.background = isDestructive
                    ? '#ef4444'
                    : 'var(--color-primary)'
                }
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmDialog
