import { useState, useEffect } from 'react'
import { LayoutDashboard } from 'lucide-react'
import PriceTicker from '../components/dashboard/PriceTicker'
import PortfolioKPI from '../components/dashboard/PortfolioKPI'
import AssetPerformanceList from '../components/dashboard/AssetPerformanceList'
import { calculatePortfolioMetrics } from '../utils/calculations/portfolioCalculations'
import type { Transaction, Asset, PortfolioMetrics } from '../types'

interface DashboardPageProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

function DashboardPage({ onSuccess, onError }: DashboardPageProps): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>({
    totalValue: 0,
    totalInvested: 0,
    unrealizedPnL: 0,
    unrealizedPnLPercent: 0,
    assetCount: 0,
    assets: []
  })

  // Charger les transactions
  useEffect(() => {
    loadTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Charger les actifs
  useEffect(() => {
    loadAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Recalculer les métriques quand les données changent
  useEffect(() => {
    if (!loadingTransactions && !loadingAssets) {
      const metrics = calculatePortfolioMetrics(assets, transactions)
      setPortfolioMetrics(metrics)
    }
  }, [transactions, assets, loadingTransactions, loadingAssets])

  const loadTransactions = async (): Promise<void> => {
    try {
      setLoadingTransactions(true)
      const data = await window.api.getAllTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error)
      onError('Erreur lors du chargement des transactions')
    } finally {
      setLoadingTransactions(false)
    }
  }

  const loadAssets = async (): Promise<void> => {
    try {
      setLoadingAssets(true)
      const data = await window.api.getAllAssets()
      setAssets(data)
    } catch (error) {
      console.error('Erreur lors du chargement des actifs:', error)
      onError('Erreur lors du chargement des actifs')
    } finally {
      setLoadingAssets(false)
    }
  }

  const handlePriceUpdate = async (assetId: number, newPrice: number): Promise<void> => {
    try {
      await window.api.updateAssetPrice({ assetId, newPrice })
      await loadAssets()
      onSuccess(`Prix mis à jour : ${newPrice.toFixed(2)} €`)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du prix:', error)
      onError('Erreur lors de la mise à jour du prix')
    }
  }

  const loading = loadingTransactions || loadingAssets

  return (
    <div className="animate-fadeIn">
      {/* En-tête */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-sm)'
          }}
        >
          <LayoutDashboard size={32} color="var(--color-primary)" />
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Dashboard</h1>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '16px' }}>
          Vue d&apos;ensemble de votre portefeuille d&apos;investissement
        </p>
      </div>

      {/* Price Ticker - Barre de prix Bloomberg-style */}
      {!loadingAssets && <PriceTicker assets={assets} onPriceUpdate={handlePriceUpdate} />}

      <hr
        style={{
          margin: 'var(--spacing-xl) 0',
          border: 'none',
          borderTop: '1px solid var(--color-border)'
        }}
      />

      {/* Loading State */}
      {loading && (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--spacing-xl)',
            color: 'var(--color-text-secondary)'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-md)' }}>⏳</div>
          <div style={{ fontSize: '18px', fontWeight: '500' }}>Chargement des données...</div>
        </div>
      )}

      {/* Contenu principal */}
      {!loading && (
        <>
          {/* KPI Cards */}
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <PortfolioKPI metrics={portfolioMetrics} />
          </div>

          {/* Liste détaillée des performances par actif */}
          <div>
            <AssetPerformanceList assets={portfolioMetrics.assets} />
          </div>
        </>
      )}

      {/* État vide */}
      {!loading && portfolioMetrics.assetCount === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--spacing-xxl)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed var(--color-border)'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: 'var(--spacing-md)' }}>📊</div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: 'var(--spacing-sm)',
              color: 'var(--color-text-primary)'
            }}
          >
            Aucune position ouverte
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', margin: 0 }}>
            Commencez par créer des actifs et ajouter des transactions pour voir votre dashboard
          </p>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
