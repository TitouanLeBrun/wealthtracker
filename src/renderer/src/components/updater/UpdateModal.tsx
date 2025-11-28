import { useEffect } from 'react'
import type { UpdateInfo } from '../../../../preload/index.d'

interface UpdateModalProps {
  isOpen: boolean
  updateInfo: UpdateInfo | null
  onDownload: () => void
  onClose: () => void
}

export function UpdateModal({
  isOpen,
  updateInfo,
  onDownload,
  onClose
}: UpdateModalProps): React.JSX.Element | null {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
    return undefined
  }, [isOpen, onClose])

  if (!isOpen || !updateInfo) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🎉 Mise à jour disponible</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="update-version-badge">
            <span className="update-version-label">Nouvelle version :</span>
            <span className="update-version-number">v{updateInfo.version}</span>
          </div>

          {updateInfo.releaseNotes && typeof updateInfo.releaseNotes === 'string' ? (
            <div className="update-release-notes">
              <h3 className="release-notes-title">Notes de version</h3>
              <div className="release-notes-content">
                <p>{String(updateInfo.releaseNotes)}</p>
              </div>
            </div>
          ) : null}

          {updateInfo.releaseDate && (
            <p className="update-release-date">
              Date de publication : {new Date(updateInfo.releaseDate).toLocaleDateString('fr-FR')}
            </p>
          )}

          <div className="update-info-box">
            <p className="update-info-text">
              ℹ️ Le téléchargement se fera en arrière-plan. Vous serez notifié une fois terminé.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Plus tard
          </button>
          <button className="btn-primary" onClick={onDownload}>
            Télécharger maintenant
          </button>
        </div>
      </div>
    </div>
  )
}
