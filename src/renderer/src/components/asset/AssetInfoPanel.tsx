import { ShoppingCart, TrendingDown } from 'lucide-react'
import type { Asset, Transaction } from '../../types'

interface AssetInfoPanelProps {
  asset: Asset
  categoryColor: string
  netQuantity: number
  totalValue: number
  transactions: Transaction[]
  onBuy: () => void
  onSell: () => void
}

function AssetInfoPanel({
  asset,
  categoryColor,
  netQuantity,
  totalValue,
  transactions,
  onBuy,
  onSell
}: AssetInfoPanelProps): React.JSX.Element {
  // Calculer le Prix Moyen d'Achat (PMA)
  const buyTransactions = transactions.filter((t) => t.type === 'BUY')
  const totalSpent = buyTransactions.reduce((sum, t) => sum + t.quantity * t.pricePerUnit, 0)
  const totalBought = buyTransactions.reduce((sum, t) => sum + t.quantity, 0)
  const averageBuyPrice = totalBought > 0 ? totalSpent / totalBought : 0

  // Calculer la plus-value
  const investedAmount = netQuantity * averageBuyPrice
  const gainLoss = totalValue - investedAmount
  const gainLossPercentage = investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0

  // Vérifier si on peut vendre
  const canSell = netQuantity > 0

  return (
    <div
      style={{
        background: 'var(--color-card-bg)',
        borderRadius: '12px',
        padding: 'var(--spacing-xl)',
        height: 'fit-content',
        position: 'sticky',
        top: 'var(--spacing-lg)'
      }}
    >
      {/* En-tête */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-xs)'
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: categoryColor
            }}
          />
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{asset.ticker}</h2>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
          {asset.name}
        </p>
      </div>

      {/* Prix actuel */}
      <div
        style={{
          marginBottom: 'var(--spacing-md)',
          paddingBottom: 'var(--spacing-sm)',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <div
          style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}
        >
          💰 Prix actuel
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-sm)' }}>
          <div style={{ fontSize: '32px', fontWeight: '700', color: categoryColor }}>
            {asset.currentPrice.toFixed(2)} €
          </div>
          {investedAmount > 0 && (
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: gainLoss >= 0 ? '#10b981' : '#ef4444'
              }}
            >
              ({gainLoss >= 0 ? '+' : ''}
              {gainLoss.toFixed(2)} € / {gainLoss >= 0 ? '+' : ''}
              {gainLossPercentage.toFixed(2)}%)
            </div>
          )}
        </div>
      </div>

      {/* Votre Position */}
      <div style={{ marginBottom: 'var(--spacing-md)', paddingTop: 'var(--spacing-sm)' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: 'var(--spacing-md)',
            color: '#374151'
          }}
        >
          📊 Votre Position
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Quantité */}
          <div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Quantité</div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>
              {netQuantity.toFixed(4)} {asset.ticker}
            </div>
          </div>

          {/* Valeur actuelle */}
          <div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Valeur actuelle
            </div>
            <div style={{ fontSize: '20px', fontWeight: '600' }}>{totalValue.toFixed(2)} €</div>
          </div>

          {/* Prix Moyen d'Achat */}
          {averageBuyPrice > 0 && (
            <div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Prix Moyen d&apos;Achat (PMA)
              </div>
              <div style={{ fontSize: '18px', fontWeight: '600' }}>
                {averageBuyPrice.toFixed(2)} €
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Boutons d'action */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
        <button
          onClick={onBuy}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-xs)',
            padding: '14px 20px',
            background: categoryColor,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: `0 2px 8px ${categoryColor}40`,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = `0 6px 16px ${categoryColor}60`
            e.currentTarget.style.filter = 'brightness(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = `0 2px 8px ${categoryColor}40`
            e.currentTarget.style.filter = 'brightness(1)'
          }}
        >
          <ShoppingCart size={18} />
          Acheter
        </button>

        <button
          onClick={onSell}
          disabled={!canSell}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-xs)',
            padding: '14px 20px',
            background: canSell ? '#ef4444' : '#d1d5db',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: canSell ? 'pointer' : 'not-allowed',
            boxShadow: canSell ? '0 2px 8px rgba(239, 68, 68, 0.4)' : '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            opacity: canSell ? 1 : 0.5
          }}
          onMouseEnter={(e) => {
            if (canSell) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.6)'
              e.currentTarget.style.filter = 'brightness(1.1)'
            }
          }}
          onMouseLeave={(e) => {
            if (canSell) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.4)'
              e.currentTarget.style.filter = 'brightness(1)'
            }
          }}
        >
          <TrendingDown size={18} />
          Vendre
        </button>
      </div>

      {!canSell && (
        <p
          style={{
            fontSize: '12px',
            color: '#6b7280',
            textAlign: 'center',
            margin: '8px 0 0 0',
            fontStyle: 'italic'
          }}
        >
          ⚠️ Vous devez posséder cet actif pour le vendre
        </p>
      )}
    </div>
  )
}

export default AssetInfoPanel
