import { useState, useEffect } from 'react'
import { TrendingUp, Plus } from 'lucide-react'
import Modal from '../components/Modal'
import PriceTicker from '../components/PriceTicker'
import TransactionForm from '../components/TransactionForm'
import TransactionManagerCards from '../components/TransactionManagerCards'
import type { Transaction, Asset, TransactionFormData } from '../types'

interface TransactionsPageProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

function TransactionsPage({ onSuccess, onError }: TransactionsPageProps): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [loadingAssets, setLoadingAssets] = useState(true)

  // État de la modale
  const [showTransactionModal, setShowTransactionModal] = useState(false)

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

  const handleTransactionSubmit = async (data: TransactionFormData): Promise<void> => {
    await window.api.createTransaction(data)
    await loadTransactions()
    setShowTransactionModal(false)
    onSuccess('Transaction ajoutée avec succès !')
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
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <TrendingUp size={32} color="var(--color-primary)" />
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Mes Transactions</h1>
          </div>
          <button
            onClick={() => setShowTransactionModal(true)}
            disabled={assets.length === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: '12px 24px',
              background: assets.length === 0 ? 'var(--color-border)' : 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: assets.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: assets.length === 0 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (assets.length > 0) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            title={assets.length === 0 ? "Créez d'abord des actifs" : 'Ajouter une transaction'}
          >
            <Plus size={18} />
            Ajouter une Transaction
          </button>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '16px' }}>
          Gérez vos achats et ventes d&apos;actifs financiers
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

      {/* Affichage des transactions avec statistiques */}
      <TransactionManagerCards transactions={transactions} loading={loading} />

      {/* Modale de création de transaction */}
      {showTransactionModal && (
        <Modal title="Nouvelle Transaction" onClose={() => setShowTransactionModal(false)}>
          <TransactionForm onSubmit={handleTransactionSubmit} onError={onError} />
        </Modal>
      )}
    </div>
  )
}

export default TransactionsPage
