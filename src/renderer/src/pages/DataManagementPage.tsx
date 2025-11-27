import { useState, useEffect } from 'react'
import { Trash2, Database, AlertTriangle, CheckCircle } from 'lucide-react'
import ConfirmDialog from '../components/common/ConfirmDialog'

interface DataManagementPageProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

function DataManagementPage({ onSuccess, onError }: DataManagementPageProps): React.JSX.Element {
  const [showConfirmTransactions, setShowConfirmTransactions] = useState(false)
  const [showConfirmAssets, setShowConfirmAssets] = useState(false)
  const [showConfirmCategories, setShowConfirmCategories] = useState(false)
  const [loading, setLoading] = useState(false)

  // Statistiques (à charger au besoin)
  const [stats, setStats] = useState({
    transactions: 0,
    assets: 0,
    categories: 0
  })

  // Charger les statistiques au montage
  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async (): Promise<void> => {
    try {
      const [transactions, assets, categories] = await Promise.all([
        window.api.getAllTransactions(),
        window.api.getAllAssets(),
        window.api.getAllCategories()
      ])

      setStats({
        transactions: transactions.length,
        assets: assets.length,
        categories: categories.length
      })
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    }
  }

  const handleDeleteAllTransactions = async (): Promise<void> => {
    setLoading(true)
    try {
      const transactions = await window.api.getAllTransactions()

      for (const transaction of transactions) {
        await window.api.deleteTransaction(transaction.id)
      }

      await loadStats()
      onSuccess(`${transactions.length} transaction(s) supprimée(s) avec succès !`)
      setShowConfirmTransactions(false)
    } catch (error) {
      console.error('Erreur lors de la suppression des transactions:', error)
      onError('Erreur lors de la suppression des transactions')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAllAssets = async (): Promise<void> => {
    setLoading(true)
    try {
      // Supprimer d'abord toutes les transactions (dépendances)
      const transactions = await window.api.getAllTransactions()
      for (const transaction of transactions) {
        await window.api.deleteTransaction(transaction.id)
      }

      // Puis supprimer tous les actifs
      const assets = await window.api.getAllAssets()
      for (const asset of assets) {
        await window.api.deleteAsset(asset.id)
      }

      await loadStats()
      onSuccess(
        `${assets.length} actif(s) et ${transactions.length} transaction(s) supprimé(s) avec succès !`
      )
      setShowConfirmAssets(false)
    } catch (error) {
      console.error('Erreur lors de la suppression des actifs:', error)
      onError('Erreur lors de la suppression des actifs')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAllCategories = async (): Promise<void> => {
    setLoading(true)
    try {
      // Supprimer d'abord toutes les transactions
      const transactions = await window.api.getAllTransactions()
      for (const transaction of transactions) {
        await window.api.deleteTransaction(transaction.id)
      }

      // Puis tous les actifs
      const assets = await window.api.getAllAssets()
      for (const asset of assets) {
        await window.api.deleteAsset(asset.id)
      }

      // Enfin toutes les catégories
      const categories = await window.api.getAllCategories()
      for (const category of categories) {
        await window.api.deleteCategory(category.id)
      }

      await loadStats()
      onSuccess(
        `${categories.length} catégorie(s), ${assets.length} actif(s) et ${transactions.length} transaction(s) supprimé(s) avec succès !`
      )
      setShowConfirmCategories(false)
    } catch (error) {
      console.error('Erreur lors de la suppression des catégories:', error)
      onError('Erreur lors de la suppression des catégories')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fadeIn">
      {/* En-tête */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <Database size={32} color="var(--color-primary)" />
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Gestion des Données</h1>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '16px' }}>
          Suppression en masse de vos données
        </p>
      </div>

      {/* Avertissement */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          background: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: 'var(--border-radius)',
          marginBottom: 'var(--spacing-xl)',
          display: 'flex',
          gap: 'var(--spacing-md)',
          alignItems: 'start'
        }}
      >
        <AlertTriangle size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h3 style={{ margin: 0, marginBottom: 'var(--spacing-xs)', color: '#92400e' }}>
            ⚠️ Attention : Actions irréversibles
          </h3>
          <p style={{ margin: 0, color: '#92400e', lineHeight: 1.6 }}>
            Les suppressions en masse sont <strong>définitives</strong> et{' '}
            <strong>ne peuvent pas être annulées</strong>. Assurez-vous d&apos;avoir une sauvegarde
            de vos données avant de continuer.
          </p>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-xl)'
        }}
      >
        <div
          style={{
            padding: 'var(--spacing-lg)',
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Transactions</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary)' }}>
            {stats.transactions}
          </div>
        </div>

        <div
          style={{
            padding: 'var(--spacing-lg)',
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Actifs</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary)' }}>
            {stats.assets}
          </div>
        </div>

        <div
          style={{
            padding: 'var(--spacing-lg)',
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>Catégories</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-primary)' }}>
            {stats.categories}
          </div>
        </div>
      </div>

      {/* Actions de suppression */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        {/* Supprimer toutes les transactions */}
        <div
          style={{
            padding: 'var(--spacing-lg)',
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  margin: 0,
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: '18px',
                  fontWeight: '600'
                }}
              >
                Supprimer toutes les transactions
              </h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                Supprime toutes les transactions d&apos;achat et de vente. Les actifs et catégories
                seront conservés.
              </p>
            </div>
            <button
              onClick={() => setShowConfirmTransactions(true)}
              disabled={loading || stats.transactions === 0}
              style={{
                padding: '12px 24px',
                background: stats.transactions === 0 ? 'var(--color-border)' : '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                cursor: stats.transactions === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                transition: 'all 0.2s ease',
                opacity: stats.transactions === 0 ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (stats.transactions > 0 && !loading) {
                  e.currentTarget.style.background = '#b91c1c'
                }
              }}
              onMouseLeave={(e) => {
                if (stats.transactions > 0) {
                  e.currentTarget.style.background = '#dc2626'
                }
              }}
            >
              <Trash2 size={18} />
              Supprimer {stats.transactions} transaction(s)
            </button>
          </div>
        </div>

        {/* Supprimer tous les actifs */}
        <div
          style={{
            padding: 'var(--spacing-lg)',
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  margin: 0,
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: '18px',
                  fontWeight: '600'
                }}
              >
                Supprimer tous les actifs
              </h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                Supprime tous les actifs ainsi que toutes leurs transactions associées. Les
                catégories seront conservées.
              </p>
            </div>
            <button
              onClick={() => setShowConfirmAssets(true)}
              disabled={loading || stats.assets === 0}
              style={{
                padding: '12px 24px',
                background: stats.assets === 0 ? 'var(--color-border)' : '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                cursor: stats.assets === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                transition: 'all 0.2s ease',
                opacity: stats.assets === 0 ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (stats.assets > 0 && !loading) {
                  e.currentTarget.style.background = '#b91c1c'
                }
              }}
              onMouseLeave={(e) => {
                if (stats.assets > 0) {
                  e.currentTarget.style.background = '#dc2626'
                }
              }}
            >
              <Trash2 size={18} />
              Supprimer {stats.assets} actif(s)
            </button>
          </div>
        </div>

        {/* Supprimer toutes les catégories */}
        <div
          style={{
            padding: 'var(--spacing-lg)',
            background: 'var(--color-card-bg)',
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  margin: 0,
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: '18px',
                  fontWeight: '600'
                }}
              >
                Supprimer toutes les catégories
              </h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                Supprime <strong>TOUTES</strong> les données : catégories, actifs et transactions.
                Cette action réinitialise complètement l&apos;application.
              </p>
            </div>
            <button
              onClick={() => setShowConfirmCategories(true)}
              disabled={loading || stats.categories === 0}
              style={{
                padding: '12px 24px',
                background: stats.categories === 0 ? 'var(--color-border)' : '#7f1d1d',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                cursor: stats.categories === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                transition: 'all 0.2s ease',
                opacity: stats.categories === 0 ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (stats.categories > 0 && !loading) {
                  e.currentTarget.style.background = '#5f1515'
                }
              }}
              onMouseLeave={(e) => {
                if (stats.categories > 0) {
                  e.currentTarget.style.background = '#7f1d1d'
                }
              }}
            >
              <Trash2 size={18} />
              TOUT SUPPRIMER
            </button>
          </div>
        </div>
      </div>

      {/* Message de confirmation si chargement */}
      {loading && (
        <div
          style={{
            marginTop: 'var(--spacing-xl)',
            padding: 'var(--spacing-lg)',
            background: '#dbeafe',
            border: '1px solid #3b82f6',
            borderRadius: 'var(--border-radius)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)'
          }}
        >
          <CheckCircle size={20} color="#3b82f6" />
          <span style={{ color: '#1e40af' }}>Suppression en cours...</span>
        </div>
      )}

      {/* Modales de confirmation */}
      <ConfirmDialog
        isOpen={showConfirmTransactions}
        title="Supprimer toutes les transactions ?"
        message={`Vous êtes sur le point de supprimer ${stats.transactions} transaction(s). Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDeleteAllTransactions}
        onCancel={() => setShowConfirmTransactions(false)}
      />

      <ConfirmDialog
        isOpen={showConfirmAssets}
        title="Supprimer tous les actifs ?"
        message={`Vous êtes sur le point de supprimer ${stats.assets} actif(s) et toutes leurs transactions associées. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDeleteAllAssets}
        onCancel={() => setShowConfirmAssets(false)}
      />

      <ConfirmDialog
        isOpen={showConfirmCategories}
        title="⚠️ SUPPRIMER TOUTES LES DONNÉES ?"
        message={`ATTENTION : Vous allez supprimer ${stats.categories} catégorie(s), ${stats.assets} actif(s) et ${stats.transactions} transaction(s). L'application sera complètement réinitialisée. Cette action est DÉFINITIVEMENT IRRÉVERSIBLE.`}
        confirmLabel="JE CONFIRME LA SUPPRESSION TOTALE"
        cancelLabel="Annuler"
        onConfirm={handleDeleteAllCategories}
        onCancel={() => setShowConfirmCategories(false)}
      />
    </div>
  )
}

export default DataManagementPage
