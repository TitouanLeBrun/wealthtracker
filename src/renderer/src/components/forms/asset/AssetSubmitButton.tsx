import { MouseEvent } from 'react'

interface AssetSubmitButtonProps {
  disabled?: boolean
  categoryColor?: string
}

function AssetSubmitButton({
  disabled = false,
  categoryColor = '#3b82f6'
}: AssetSubmitButtonProps): React.JSX.Element {
  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>): void => {
    if (!disabled) {
      // Darken the category color on hover
      e.currentTarget.style.backgroundColor = categoryColor
      e.currentTarget.style.filter = 'brightness(0.9)'
      e.currentTarget.style.transform = 'translateY(-1px)'
      e.currentTarget.style.boxShadow = `0 4px 12px ${categoryColor}66`
    }
  }

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>): void => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = categoryColor
      e.currentTarget.style.filter = 'brightness(1)'
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
      <button
        type="submit"
        disabled={disabled}
        style={{
          padding: '10px 24px',
          backgroundColor: disabled ? '#9ca3af' : categoryColor,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span>✓</span>
        <span>Créer l&apos;actif</span>
      </button>
    </div>
  )
}

export default AssetSubmitButton
