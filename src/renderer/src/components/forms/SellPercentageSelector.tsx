import { useMemo } from 'react'

interface SellPercentageSelectorProps {
  maxQuantity: number
  currentQuantity: string
  onQuantityChange: (quantity: string) => void
  ticker: string
}

function SellPercentageSelector({
  maxQuantity,
  currentQuantity,
  onQuantityChange,
  ticker
}: SellPercentageSelectorProps): React.JSX.Element {
  const percentages = [25, 50, 75, 100]

  const currentPercentage = useMemo(() => {
    if (!currentQuantity || maxQuantity === 0) return null
    const qty = parseFloat(currentQuantity)
    const pct = (qty / maxQuantity) * 100
    return pct
  }, [currentQuantity, maxQuantity])

  const handlePercentageClick = (percentage: number): void => {
    let quantity = (maxQuantity * percentage) / 100
    // Si c'est 100%, utiliser exactement maxQuantity pour éviter les erreurs d'arrondi
    if (percentage === 100) {
      quantity = maxQuantity
    }
    // Arrondir à 8 décimales pour éviter les résidus de virgule flottante
    quantity = Math.round(quantity * 100000000) / 100000000
    onQuantityChange(quantity.toString())
  }

  return (
    <div style={{ marginTop: 'var(--spacing-sm)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          marginBottom: 'var(--spacing-xs)'
        }}
      >
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          Vente rapide :
        </span>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
          {percentages.map((pct) => {
            const isActive = currentPercentage !== null && Math.abs(currentPercentage - pct) < 0.1
            const quantity = (maxQuantity * pct) / 100

            return (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentageClick(pct)}
                style={{
                  padding: '6px 12px',
                  background: isActive ? 'var(--color-primary)' : 'var(--color-card)',
                  color: isActive ? 'white' : 'var(--color-text-primary)',
                  border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--color-border)'
                    e.currentTarget.style.borderColor = 'var(--color-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--color-card)'
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                  }
                }}
              >
                {pct}%
                <span
                  style={{
                    marginLeft: '4px',
                    fontSize: '10px',
                    opacity: 0.7
                  }}
                >
                  ({quantity.toFixed(8)} {ticker})
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SellPercentageSelector
