import KPICard from './KPICard'
import type { PortfolioMetrics } from '../../utils/calculations/enhancedPortfolioCalculations'
import {
  formatCurrency,
  formatPercent
} from '../../utils/calculations/enhancedPortfolioCalculations'

interface EnhancedPortfolioKPIProps {
  metrics: PortfolioMetrics
}

function EnhancedPortfolioKPI({ metrics }: EnhancedPortfolioKPIProps): React.JSX.Element {
  return (
    <div>
      {/* Titre de section */}
      {/* <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            margin: '0 0 var(--spacing-xs) 0'
          }}
        >
          📊 Vue d&apos;Ensemble
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            margin: 0
          }}
        >
          Performance globale de votre portefeuille
        </p>
      </div> */}

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)'
        }}
      >
        {/* Valeur Totale */}
        <KPICard
          title="Valeur Totale"
          value={formatCurrency(metrics.totalValue)}
          subtitle="Valeur actuelle"
          icon="wallet"
          trend="neutral"
        />

        {/* Capital Investi */}
        <KPICard
          title="Capital Investi"
          value={formatCurrency(metrics.totalInvested)}
          subtitle="Total des achats"
          icon="dollar"
          trend="neutral"
        />

        {/* Capital Récupéré */}
        <KPICard
          title="Capital Récupéré"
          value={formatCurrency(metrics.totalRecovered)}
          subtitle="Total des ventes"
          icon="piggy"
          trend="positive"
        />

        {/* Capital Net Investi */}
        <KPICard
          title="Capital Net"
          value={formatCurrency(metrics.netInvested)}
          subtitle="Investi - Récupéré"
          icon="target"
          trend="neutral"
        />
      </div>

      {/* Performance Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--spacing-lg)'
        }}
      >
        {/* Plus-Value Latente */}
        <KPICard
          title="Plus-Value Latente"
          value={formatCurrency(metrics.unrealizedPnL)}
          icon={metrics.unrealizedPnL >= 0 ? 'up' : 'down'}
          trend={metrics.unrealizedPnL >= 0 ? 'positive' : 'negative'}
          percentage={formatPercent(metrics.unrealizedPnLPercent)}
        />

        {/* Plus-Value Réalisée */}
        <KPICard
          title="Plus-Value Réalisée"
          value={formatCurrency(metrics.realizedPnL)}
          icon={metrics.realizedPnL >= 0 ? 'up' : 'down'}
          trend={metrics.realizedPnL >= 0 ? 'positive' : 'negative'}
          subtitle="Sur les ventes"
        />

        {/* Plus-Value Globale */}
        <KPICard
          title="Plus-Value Globale"
          value={formatCurrency(metrics.totalPnL)}
          icon={metrics.totalPnL >= 0 ? 'up' : 'down'}
          trend={metrics.totalPnL >= 0 ? 'positive' : 'negative'}
          percentage={formatPercent(metrics.totalPnLPercent)}
        />

        {/* Frais Totaux */}
        <KPICard
          title="Frais Totaux"
          value={formatCurrency(metrics.totalFees)}
          icon="dollar"
          trend="negative"
          percentage={formatPercent(metrics.feesPercent)}
        />
      </div>
    </div>
  )
}

export default EnhancedPortfolioKPI
