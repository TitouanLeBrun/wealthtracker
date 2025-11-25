import { MouseEvent } from 'react'

interface SubmitButtonProps {
  type: 'BUY' | 'SELL'
  disabled?: boolean
  categoryColor?: string
}

function SubmitButton({
  type,
  disabled = false,
  categoryColor = '#10b981'
}: SubmitButtonProps): React.JSX.Element {
  const buttonColor = type === 'BUY' ? categoryColor : '#ef4444'

  const baseStyle = {
    width: '100%',
    padding: '14px',
    background: buttonColor,
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
      e.currentTarget.style.boxShadow = `0 4px 12px ${buttonColor}66`
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
