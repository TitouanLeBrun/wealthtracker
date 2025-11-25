import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import PriceTicker from '../components/PriceTicker'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import type { Transaction, Asset, TransactionFormData } from '../types'

interface TransactionsPageProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

function TransactionsPage({ onSuccess, onError }: TransactionsPageProps): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  // Charger les transactions et actifs au démarrage
  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true)
      const [transactionsData, assetsData] = await Promise.all([
        window.api.getAllTransactions(),
        window.api.getAllAssets()
      ])
      setTransactions(transactionsData)
      setAssets(assetsData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      onError('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const handleTransactionSubmit = async (data: TransactionFormData): Promise<void> => {
    await window.api.createTransaction(data)
    await loadData()
    onSuccess('Transaction ajoutée avec succès !')
  }

  const handlePriceUpdate = async (assetId: number, newPrice: number): Promise<void> => {
    try {
      await window.api.updateAssetPrice({ assetId, newPrice })
      await loadData()
      onSuccess(`Prix mis à jour : ${newPrice.toFixed(2)} €`)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du prix:', error)
      onError('Erreur lors de la mise à jour du prix')
    }
  }

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
          <TrendingUp size={32} color="var(--color-primary)" />
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Mes Transactions</h1>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '16px' }}>
          Gérez vos achats et ventes d&apos;actifs financiers
        </p>
      </div>

      {/* Price Ticker - Barre de prix Bloomberg-style */}
      <PriceTicker assets={assets} onPriceUpdate={handlePriceUpdate} />

      {/* Formulaire de transaction */}
      <TransactionForm onSubmit={handleTransactionSubmit} onError={onError} />

      <hr
        style={{
          margin: 'var(--spacing-xl) 0',
          border: 'none',
          borderTop: '1px solid var(--color-border)'
        }}
      />

      {/* Liste des transactions */}
      <TransactionList transactions={transactions} loading={loading} />
    </div>
  )
}

export default TransactionsPage
