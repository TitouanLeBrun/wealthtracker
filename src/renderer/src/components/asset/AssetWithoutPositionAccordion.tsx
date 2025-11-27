import { useState } from 'react'
import { ChevronDown, ChevronUp, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import type { Asset, Transaction } from '../../types'
import {
  getAssetsWithoutPosition,
  canDeleteAsset,
  getTransactionCount
} from '../../utils/calculations/assetPositionUtils'
import ConfirmDialog from '../common/ConfirmDialog'

interface AssetWithoutPositionAccordionProps {
  assets: Asset[]
  transactions: Transaction[]
  onAssetDeleted: () => void
  onAssetClick?: (assetId: number) => void
  onError: (message: string) => void
}

function AssetWithoutPositionAccordion({
  assets,
  transactions,
  onAssetDeleted,
  onAssetClick,
  onError
}: AssetWithoutPositionAccordionProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const assetsWithoutPosition = getAssetsWithoutPosition(assets, transactions)

  const handleDeleteClick = (asset: Asset): void => {
    setAssetToDelete(asset)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async (): Promise<void> => {
    if (!assetToDelete) return

    setIsDeleting(true)
    try {
      await window.api.deleteAsset(assetToDelete.id)
      setDeleteDialogOpen(false)
      setAssetToDelete(null)
      onAssetDeleted()
    } catch (error) {
      console.error('Error deleting asset:', error)
      onError(error instanceof Error ? error.message : "Erreur lors de la suppression de l'actif")
    } finally {
      setIsDeleting(false)
    }
  }

  if (assetsWithoutPosition.length === 0) {
    return (
      <div
        style={{
          background: 'var(--color-card-bg)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid var(--color-border)',
          padding: 'var(--spacing-lg)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)'
        }}
      >
        <CheckCircle size={32} style={{ color: '#10b981', marginBottom: 'var(--spacing-sm)' }} />
        <p style={{ margin: 0, fontSize: '14px' }}>✅ Tous vos actifs ont une position active !</p>
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'var(--color-card-bg)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        marginTop: '60px'
      }}
    >
      {/* En-tête Accordion */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: 'var(--spacing-lg)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <Trash2 size={20} color="#f59e0b" />
          <div style={{ textAlign: 'left' }}>
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--color-text-primary)'
              }}
            >
              🗑️ Actifs sans position ({assetsWithoutPosition.length})
            </h3>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '13px',
                color: 'var(--color-text-secondary)'
              }}
            >
              Actifs soldés ou jamais achetés
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Contenu Accordion */}
      {isOpen && (
        <div
          style={{
            padding: '0 var(--spacing-lg) var(--spacing-lg) var(--spacing-lg)',
            borderTop: '1px solid var(--color-border)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {assetsWithoutPosition.map((asset) => {
              const isDeletable = canDeleteAsset(asset.id, transactions)
              const txCount = getTransactionCount(asset.id, transactions)

              return (
                <div
                  className="mt-4"
                  key={asset.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    padding: 'var(--spacing-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--spacing-md)'
                  }}
                >
                  {/* Infos actif */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        marginBottom: '4px'
                      }}
                    >
                      <span
                        onClick={() => onAssetClick?.(asset.id)}
                        style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: 'var(--color-primary)',
                          cursor: onAssetClick ? 'pointer' : 'default',
                          textDecoration: onAssetClick ? 'underline' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (onAssetClick) {
                            e.currentTarget.style.color = 'var(--color-primary-dark)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (onAssetClick) {
                            e.currentTarget.style.color = 'var(--color-primary)'
                          }
                        }}
                      >
                        {asset.ticker}
                      </span>
                      <span
                        style={{
                          padding: '2px 8px',
                          background: asset.category?.color || '#4CAF50',
                          color: 'white',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}
                      >
                        {asset.category?.name}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: 'var(--color-text-secondary)',
                        marginBottom: '6px'
                      }}
                    >
                      {asset.name}
                    </div>

                    {/* Statut */}
                    {isDeletable ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          color: '#10b981'
                        }}
                      >
                        <CheckCircle size={14} />
                        <span>Aucune transaction</span>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          color: '#f59e0b'
                        }}
                      >
                        <AlertTriangle size={14} />
                        <span>
                          Position soldée ({txCount} transaction{txCount > 1 ? 's' : ''})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bouton Supprimer */}
                  <button
                    onClick={() => handleDeleteClick(asset)}
                    disabled={!isDeletable}
                    title={
                      isDeletable
                        ? 'Supprimer cet actif'
                        : 'Impossible de supprimer un actif avec historique de transactions'
                    }
                    style={{
                      padding: '8px 16px',
                      background: isDeletable ? '#ef4444' : '#374151',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: isDeletable ? 'pointer' : 'not-allowed',
                      fontSize: '13px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                      opacity: isDeletable ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => {
                      if (isDeletable) {
                        e.currentTarget.style.background = '#dc2626'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isDeletable) {
                        e.currentTarget.style.background = '#ef4444'
                      }
                    }}
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Dialog de confirmation */}
      {deleteDialogOpen && assetToDelete && (
        <ConfirmDialog
          isOpen={deleteDialogOpen}
          title="Confirmer la suppression"
          message={
            <>
              Êtes-vous sûr de vouloir supprimer l&apos;actif{' '}
              <strong style={{ color: 'var(--color-primary)' }}>{assetToDelete.ticker}</strong> -{' '}
              {assetToDelete.name} ?
              <br />
              <br />
              Cette action est <strong>irréversible</strong>.
            </>
          }
          confirmLabel={isDeleting ? 'Suppression...' : 'Supprimer'}
          cancelLabel="Annuler"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setDeleteDialogOpen(false)
            setAssetToDelete(null)
          }}
          isDestructive={true}
          disabled={isDeleting}
        />
      )}
    </div>
  )
}

export default AssetWithoutPositionAccordion
