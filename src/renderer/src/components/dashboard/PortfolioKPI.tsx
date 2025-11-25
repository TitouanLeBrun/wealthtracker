import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react'
import type { PortfolioMetrics } from '../../types'

interface PortfolioKPIProps {
  metrics: PortfolioMetrics
}

function PortfolioKPI({ metrics }: PortfolioKPIProps): React.JSX.Element {
  const isPositive = metrics.unrealizedPnL >= 0

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)'
      }}
    >
      {/* Card 1: Valeur Totale */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-lg)',
          color: 'white',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <DollarSign size={24} />
          <span style={{ fontSize: '14px', opacity: 0.9 }}>Valeur Totale</span>
        </div>
        <div style={{ fontSize: '36px', fontWeight: '700', marginTop: 'var(--spacing-sm)' }}>
          {metrics.totalValue.toFixed(2)} €
        </div>
        <div style={{ fontSize: '12px', opacity: 0.8, marginTop: 'var(--spacing-xs)' }}>
          {metrics.assetCount} actif{metrics.assetCount > 1 ? 's' : ''} en portefeuille
        </div>
      </div>

      {/* Card 2: Montant Investi */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-lg)',
          color: 'white',
          boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <PiggyBank size={24} />
          <span style={{ fontSize: '14px', opacity: 0.9 }}>Montant Investi</span>
        </div>
        <div style={{ fontSize: '36px', fontWeight: '700', marginTop: 'var(--spacing-sm)' }}>
          {' '}
          {metrics.totalInvested.toFixed(2)} €
        </div>
        <div style={{ fontSize: '12px', opacity: 0.8, marginTop: 'var(--spacing-xs)' }}>
          Prix moyen d&apos;achat (avec frais)
        </div>
      </div>

      {/* Card 3: Plus/Moins-Value Latente */}
      <div
        style={{
          background: isPositive
            ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
            : 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-lg)',
          color: 'white',
          boxShadow: isPositive
            ? '0 4px 12px rgba(74, 222, 128, 0.3)'
            : '0 4px 12px rgba(248, 113, 113, 0.3)',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          {isPositive ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          <span style={{ fontSize: '14px', opacity: 0.9 }}>
            {isPositive ? 'Plus-Value' : 'Moins-Value'} Latente
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 'var(--spacing-sm)',
            marginTop: 'var(--spacing-sm)'
          }}
        >
          <span style={{ fontSize: '36px', fontWeight: '700' }}>
            {isPositive ? '+' : ''}
            {metrics.unrealizedPnL.toFixed(2)} €
          </span>
        </div>
        <div
          style={{
            fontSize: '18px',
            fontWeight: '600',
            opacity: 0.9,
            marginTop: 'var(--spacing-xs)'
          }}
        >
          {isPositive ? '+' : ''}
          {metrics.unrealizedPnLPercent.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}

export default PortfolioKPI
