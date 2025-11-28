import { useEffect, useState } from 'react'
import type { UpdateInfo } from '../../../../preload/index.d'

interface InstallNotificationProps {
  isVisible: boolean
  updateInfo: UpdateInfo | null
  onInstallNow: () => void
  onInstallLater: () => void
}

export function InstallNotification({
  isVisible,
  updateInfo,
  onInstallNow,
  onInstallLater
}: InstallNotificationProps): React.JSX.Element | null {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Petit délai pour l'animation d'entrée
      const timer = setTimeout(() => setIsAnimating(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
      return undefined
    }
  }, [isVisible])

  if (!isVisible || !updateInfo) return null

  return (
    <div className={`install-notification ${isAnimating ? 'install-notification-visible' : ''}`}>
      <div className="install-notification-content">
        <div className="install-notification-icon">✅</div>
        <div className="install-notification-text">
          <h4 className="install-notification-title">Mise à jour prête !</h4>
          <p className="install-notification-message">
            La version <strong>v{updateInfo.version}</strong> est téléchargée et prête à être
            installée.
          </p>
        </div>
      </div>

      <div className="install-notification-actions">
        <button className="btn-secondary-sm" onClick={onInstallLater}>
          À la fermeture
        </button>
        <button className="btn-primary-sm" onClick={onInstallNow}>
          Installer maintenant
        </button>
      </div>
    </div>
  )
}
