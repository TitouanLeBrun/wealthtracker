import { useState, useEffect } from 'react'
import { LayoutDashboard, ChevronDown, ChevronUp } from 'lucide-react'
import PriceTicker from '../components/dashboard/PriceTicker'
import EnhancedPortfolioKPI from '../components/dashboard/EnhancedPortfolioKPI'
import AssetDetailsTable from '../components/dashboard/AssetDetailsTable'
import { calculateEnhancedPortfolioMetrics } from '../utils/calculations/enhancedPortfolioCalculations'
import type { Transaction, Asset } from '../types'
import type { PortfolioMetrics } from '../utils/calculations/enhancedPortfolioCalculations'

interface DashboardPageProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
  onNavigateToAsset?: (assetId: number) => void
}

function DashboardPage({
  onSuccess,
  onError,
  onNavigateToAsset
}: DashboardPageProps): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [loadingAssets, setLoadingAssets] = useState(true)
  
  // États pour les dropdowns
  const [isPriceTickerOpen, setIsPriceTickerOpen] = useState(true)
  const [isKPIOpen, setIsKPIOpen] = useState(true)
  const [isTableOpen, setIsTableOpen] = useState(true)
  
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>({
    totalValue: 0,
    totalInvested: 0,
    totalRecovered: 0,
    netInvested: 0,
    unrealizedPnL: 0,
    unrealizedPnLPercent: 0,
    realizedPnL: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    totalFees: 0,
    feesPercent: 0,
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
      const metrics = calculateEnhancedPortfolioMetrics(assets, transactions)
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
      {!loadingAssets && (
        <div
          style={{
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            marginBottom: 'var(--spacing-lg)'
          }}
        >
          <button
            onClick={() => setIsPriceTickerOpen(!isPriceTickerOpen)}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--color-text-primary)'
              }}
            >
              📊 Prix en temps réel
            </h3>
            {isPriceTickerOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {isPriceTickerOpen && (
            <div style={{ padding: '0 var(--spacing-md) var(--spacing-md)' }}>
              <PriceTicker assets={assets} onPriceUpdate={handlePriceUpdate} />
            </div>
          )}
        </div>
      )}

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
          {/* KPI Cards - Vue d'ensemble */}
          <div
            style={{
              background: 'var(--color-card-bg)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              marginBottom: 'var(--spacing-xxl)'
            }}
          >
            <button
              onClick={() => setIsKPIOpen(!isKPIOpen)}
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)'
                }}
              >
                📊 Vue d&apos;ensemble du portefeuille
              </h3>
              {isKPIOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isKPIOpen && (
              <div style={{ padding: '0 var(--spacing-md) var(--spacing-md)' }}>
                <EnhancedPortfolioKPI metrics={portfolioMetrics} />
              </div>
            )}
          </div>
                <hr
        style={{
          margin: 'var(--spacing-xl) 0',
          border: 'none',
          borderTop: '1px solid var(--color-border)'
        }}
      />

          {/* Tableau détaillé */}
          <div
            style={{
              background: 'var(--color-card-bg)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => setIsTableOpen(!isTableOpen)}
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)'
                }}
              >
                📋 Détail des actifs ({portfolioMetrics.assets.length})
              </h3>
              {isTableOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isTableOpen && (
              <div>
                <AssetDetailsTable
                  assets={portfolioMetrics.assets}
                  onAssetClick={onNavigateToAsset}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* État vide */}
      {!loading && portfolioMetrics.assets.length === 0 && (
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
