import { MouseEvent } from 'react'

interface AssetSubmitButtonProps {
  disabled?: boolean
}

function AssetSubmitButton({ disabled = false }: AssetSubmitButtonProps): React.JSX.Element {
  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>): void => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = '#2563eb'
      e.currentTarget.style.transform = 'translateY(-1px)'
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'
    }
  }

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>): void => {
    if (!disabled) {
      e.currentTarget.style.backgroundColor = '#3b82f6'
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
          backgroundColor: disabled ? '#9ca3af' : '#3b82f6',
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
