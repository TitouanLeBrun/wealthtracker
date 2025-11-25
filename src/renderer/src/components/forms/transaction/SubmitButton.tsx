import { MouseEvent } from 'react'

interface SubmitButtonProps {
  type: 'BUY' | 'SELL'
  disabled?: boolean
}

function SubmitButton({ type, disabled = false }: SubmitButtonProps): React.JSX.Element {
  const baseStyle = {
    width: '100%',
    padding: '14px',
    background: type === 'BUY' ? '#10b981' : '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    fontSize: '16px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1
  }

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>): void => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow =
        type === 'BUY' ? '0 4px 12px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(239, 68, 68, 0.4)'
    }
  }

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>): void => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }
  }

  return (
    <button
      type="submit"
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      {type === 'BUY' ? "✓ Confirmer l'Achat" : '✓ Confirmer la Vente'}
    </button>
  )
}

export default SubmitButton
