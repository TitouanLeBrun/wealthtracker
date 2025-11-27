import { useState, useEffect } from 'react'
import { TrendingUp, Plus, Upload } from 'lucide-react'
import Modal from '../components/common/Modal'
import TransactionForm from '../components/forms/transaction/TransactionForm'
import TransactionManagerCards from '../components/transaction/TransactionManagerCards'
import EditTransactionModal from '../components/transaction/EditTransactionModal'
import ImportTransactionsModal from '../components/transaction/ImportTransactionsModal'
import { useTransactionUpdate } from '../hooks/useTransactionUpdate'
import type { Transaction, Asset } from '../types'

interface TransactionsPageProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
  onNavigateToAsset?: (assetId: number) => void
}

function TransactionsPage({
  onSuccess,
  onError,
  onNavigateToAsset
}: TransactionsPageProps): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [loadingAssets, setLoadingAssets] = useState(true)

  // État de la modale
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  // Hook pour la mise à jour
  const { updateTransaction } = useTransactionUpdate()

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

  const handleTransactionSubmit = async (data: {
    assetId: number
    type: 'BUY' | 'SELL'
    quantity: number
    pricePerUnit: number
    fee: number
    date: Date
  }): Promise<void> => {
    await window.api.createTransaction(data)
    await loadTransactions()
    setShowTransactionModal(false)
    onSuccess('Transaction ajoutée avec succès !')
  }

  const handleDeleteTransaction = async (transactionId: number): Promise<void> => {
    try {
      await window.api.deleteTransaction(transactionId)
      await loadTransactions()
      onSuccess('Transaction supprimée avec succès !')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      onError('Erreur lors de la suppression de la transaction')
    }
  }

  const handleEditTransaction = (transaction: Transaction): void => {
    setEditingTransaction(transaction)
  }

  const handleUpdateTransaction = async (
    id: number,
    data: {
      type?: 'BUY' | 'SELL'
      quantity?: number
      pricePerUnit?: number
      fee?: number
      date?: string
    }
  ): Promise<void> => {
    try {
      // Convertir la date string en Date si nécessaire
      const updateData = {
        ...data,
        date: data.date ? new Date(data.date) : undefined
      }
      await updateTransaction(id, updateData)
      await loadTransactions()
      setEditingTransaction(null)
      onSuccess('Transaction modifiée avec succès !')
    } catch (error) {
      console.error('Erreur lors de la modification:', error)
      onError('Erreur lors de la modification de la transaction')
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
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button
              onClick={() => setShowImportModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: '12px 24px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4b5563'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#6b7280'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Upload size={20} />
              Importer
            </button>
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
                borderRadius: '12px',
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
        </div>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '16px' }}>
          Gérez vos achats et ventes d&apos;actifs financiers
        </p>
      </div>

      {/* Affichage des transactions avec statistiques */}
      <TransactionManagerCards
        transactions={transactions}
        loading={loading}
        onDelete={handleDeleteTransaction}
        onEdit={handleEditTransaction}
        onAssetClick={onNavigateToAsset}
      />

      {/* Modale de création de transaction */}
      <Modal
        isOpen={showTransactionModal}
        title="Nouvelle Transaction"
        onClose={() => setShowTransactionModal(false)}
      >
        <TransactionForm onSubmit={handleTransactionSubmit} onError={onError} />
      </Modal>

      {/* Modale d'édition de transaction */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleUpdateTransaction}
        />
      )}

      {/* Modale d'import de transactions */}
      {showImportModal && (
        <ImportTransactionsModal
          onClose={() => setShowImportModal(false)}
          onImportSuccess={async () => {
            await loadTransactions()
            await loadAssets()
            onSuccess('Transactions importées avec succès !')
          }}
        />
      )}
    </div>
  )
}

export default TransactionsPage
