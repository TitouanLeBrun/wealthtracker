import { useState, useEffect, useMemo, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import { calculateOwnedQuantity } from '../utils/calculations/quantityUtils'
import Modal from '../components/common/Modal'
import TransactionForm from '../components/forms/transaction/TransactionForm'
import TransactionManagerCards from '../components/transaction/TransactionManagerCards'
import AssetPriceChart from '../components/asset/AssetPriceChart'
import AssetInfoPanel from '../components/asset/AssetInfoPanel'
import EditTransactionModal from '../components/transaction/EditTransactionModal'
import { useTransactionUpdate } from '../hooks/useTransactionUpdate'
import type { Asset, Transaction, Category } from '../types'

interface AssetDetailPageProps {
  assetId: number
  onBack: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

function AssetDetailPage({
  assetId,
  onBack,
  onSuccess,
  onError
}: AssetDetailPageProps): React.JSX.Element {
  const [asset, setAsset] = useState<Asset | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showSellModal, setShowSellModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  // Hook pour la mise à jour
  const { updateTransaction } = useTransactionUpdate()

  // Calculer la quantité nette et la valeur totale avec arrondi correct
  const { netQuantity, totalValue } = useMemo(() => {
    const net = calculateOwnedQuantity(transactions)
    const value = asset ? net * asset.currentPrice : 0
    return { netQuantity: net, totalValue: value }
  }, [transactions, asset])

  // Charger les données
  const loadData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      const [assetsData, categoriesData, transactionsData] = await Promise.all([
        window.api.getAllAssets(),
        window.api.getAllCategories(),
        window.api.getAllTransactions()
      ])

      // Trouver l'actif
      const foundAsset = assetsData.find((a: Asset) => a.id === assetId)
      if (!foundAsset) {
        onError('Actif introuvable')
        onBack()
        return
      }

      // Trouver la catégorie
      const foundCategory = categoriesData.find((c: Category) => c.id === foundAsset.categoryId)

      // Filtrer les transactions de cet actif
      const assetTransactions = transactionsData.filter((t: Transaction) => t.assetId === assetId)

      setAsset(foundAsset)
      setCategory(foundCategory || null)
      setTransactions(assetTransactions)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      onError('Impossible de charger les données')
    } finally {
      setLoading(false)
    }
  }, [assetId, onError, onBack])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleTransaction = async (data: {
    assetId: number
    type: 'BUY' | 'SELL'
    quantity: number
    pricePerUnit: number
    fee: number
    date: Date
  }): Promise<void> => {
    // Vérification pour les ventes
    if (data.type === 'SELL' && data.quantity > netQuantity) {
      onError(`Quantité insuffisante. Vous possédez ${netQuantity.toFixed(8)} ${asset?.ticker}`)
      return
    }

    await window.api.createTransaction(data)
    await loadData()
    setShowBuyModal(false)
    setShowSellModal(false)
    onSuccess(
      data.type === 'BUY'
        ? "Transaction d'achat créée avec succès !"
        : 'Transaction de vente créée avec succès !'
    )
  }

  const handleDeleteTransaction = async (transactionId: number): Promise<void> => {
    try {
      await window.api.deleteTransaction(transactionId)
      await loadData()
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
      await updateTransaction(id, data)
      await loadData()
      setEditingTransaction(null)
      onSuccess('Transaction modifiée avec succès !')
    } catch (error) {
      console.error('Erreur lors de la modification:', error)
      onError('Erreur lors de la modification de la transaction')
    }
  }

  if (loading || !asset || !category) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div
        style={{
          marginBottom: 'var(--spacing-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: '10px 20px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.borderColor = '#d1d5db'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.06)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = '#e5e7eb'
          }}
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(20px, 5vw, 28px)',
              fontWeight: '700'
            }}
          >
            {asset.ticker} - {asset.name}
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              margin: 0,
              fontSize: 'clamp(14px, 3vw, 16px)'
            }}
          >
            Catégorie : {category.name}
          </p>
        </div>
      </div>

      {/* Layout 2 colonnes */}
      <div
        className="asset-detail-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: 'var(--spacing-xl)',
          marginBottom: 'var(--spacing-xl)'
        }}
      >
        {/* Colonne gauche : Graphique */}
        <div>
          <AssetPriceChart
            currentPrice={asset.currentPrice}
            categoryColor={category.color}
            transactions={transactions}
          />
        </div>

        {/* Colonne droite : Infos et Actions */}
        <div>
          <AssetInfoPanel
            asset={asset}
            categoryColor={category.color}
            netQuantity={netQuantity}
            totalValue={totalValue}
            transactions={transactions}
            onBuy={() => setShowBuyModal(true)}
            onSell={() => setShowSellModal(true)}
          />
        </div>
      </div>

      {/* Historique des transactions */}
      <div>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: 'var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}
        >
          📊 Historique des Transactions
          <span
            style={{
              fontSize: '14px',
              fontWeight: '400',
              color: 'var(--color-text-secondary)'
            }}
          >
            ({transactions.length})
          </span>
        </h3>
        <TransactionManagerCards
          transactions={transactions}
          loading={false}
          onDelete={handleDeleteTransaction}
          onEdit={handleEditTransaction}
        />
      </div>

      {/* Modal Acheter */}
      <Modal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        title={`🟢 Acheter ${asset.ticker}`}
      >
        <TransactionForm
          preselectedCategoryId={asset.categoryId}
          preselectedAssetId={assetId}
          preselectedType="BUY"
          onSubmit={handleTransaction}
          onError={onError}
        />
      </Modal>

      {/* Modal Vendre */}
      <Modal
        isOpen={showSellModal}
        onClose={() => setShowSellModal(false)}
        title={`🔴 Vendre ${asset.ticker}`}
      >
        <TransactionForm
          preselectedCategoryId={asset.categoryId}
          preselectedAssetId={assetId}
          preselectedType="SELL"
          onSubmit={handleTransaction}
          onError={onError}
        />
      </Modal>

      {/* Modale d'édition de transaction */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleUpdateTransaction}
        />
      )}
    </div>
  )
}

export default AssetDetailPage
