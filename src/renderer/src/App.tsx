import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import ProjectionPage from './pages/ProjectionPage'
import SettingsPage from './pages/SettingsPage'
import CategoryDetailPage from './pages/CategoryDetailPage'
import AssetDetailPage from './pages/AssetDetailPage'
import DataManagementPage from './pages/DataManagementPage'
import Notification from './components/common/Notification'
import type { NotificationMessage } from './types'
import { useUpdater } from './hooks/useUpdater'
import { UpdateModal } from './components/updater/UpdateModal'
import { DownloadProgressComponent } from './components/updater/DownloadProgress'
import { InstallNotification } from './components/updater/InstallNotification'

function App(): React.JSX.Element {
  const [activePage, setActivePage] = useState<
    | 'dashboard'
    | 'transactions'
    | 'projection'
    | 'settings'
    | 'category'
    | 'asset'
    | 'data-management'
  >('dashboard')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)
  const [message, setMessage] = useState<NotificationMessage | null>(null)

  // Hook de mise à jour
  const { status, updateInfo, downloadProgress, error, downloadUpdate, installUpdate, resetState } =
    useUpdater()

  // Afficher la modal de mise à jour disponible
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  // Gérer l'ouverture de la modal quand une mise à jour est disponible
  const handleUpdateAvailable = (): void => {
    if (status === 'available' && !showUpdateModal) {
      setShowUpdateModal(true)
    }
  }

  // Déclencher l'affichage quand le status change
  if (status === 'available' && !showUpdateModal) {
    handleUpdateAvailable()
  }

  // Fonction pour afficher un message temporaire
  const showMessage = (type: 'success' | 'error', text: string): void => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  // Navigation vers une catégorie
  const navigateToCategory = (categoryId: number): void => {
    setSelectedCategoryId(categoryId)
    setActivePage('category')
  }

  // Navigation vers un actif
  const navigateToAsset = (assetId: number): void => {
    setSelectedAssetId(assetId)
    setActivePage('asset')
  }

  // Retour à la page settings
  const navigateToSettings = (): void => {
    setActivePage('settings')
    setSelectedCategoryId(null)
  }

  // Retour à la page category depuis asset
  const navigateBackToCategory = (): void => {
    if (selectedCategoryId) {
      setActivePage('category')
      setSelectedAssetId(null)
    } else {
      navigateToSettings()
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Navigation */}
      <nav
        style={{
          borderBottom: '1px solid var(--color-border)',
          padding: '0',
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--spacing-md)',
            flexWrap: 'wrap',
            gap: 'var(--spacing-sm)'
          }}
        >
          {/* Logo avec gradient */}
          <div
            style={{
              padding: 'var(--spacing-md) 0',
              fontWeight: 'bold',
              fontSize: 'clamp(18px, 4vw, 24px)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              flexShrink: 0
            }}
          >
            <span className="logo-emoji" style={{ fontSize: 'clamp(24px, 5vw, 28px)' }}>
              💰
            </span>
            <span className="text-gradient logo-full">WealthTracker</span>
            <span className="text-gradient logo-short" style={{ display: 'none' }}>
              WT
            </span>
            <span
              className="version-badge"
              style={{
                fontSize: 'clamp(10px, 2vw, 12px)',
                padding: '2px 8px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}
            >
              v{__APP_VERSION__}
            </span>
          </div>

          {/* Menu Navigation */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-xs)',
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}
          >
            <button
              onClick={() => setActivePage('dashboard')}
              style={{
                padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 24px)',
                backgroundColor:
                  activePage === 'dashboard' ? 'var(--color-primary)' : 'transparent',
                color: activePage === 'dashboard' ? 'white' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: activePage === 'dashboard' ? '600' : '500',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <span>📈</span>
              <span className="nav-text">Dashboard</span>
            </button>
            <button
              onClick={() => setActivePage('transactions')}
              style={{
                padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 24px)',
                backgroundColor:
                  activePage === 'transactions' ? 'var(--color-primary)' : 'transparent',
                color: activePage === 'transactions' ? 'white' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: activePage === 'transactions' ? '600' : '500',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <span>📊</span>
              <span className="nav-text">Transactions</span>
            </button>
            <button
              onClick={() => setActivePage('projection')}
              style={{
                padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 24px)',
                backgroundColor:
                  activePage === 'projection' ? 'var(--color-primary)' : 'transparent',
                color: activePage === 'projection' ? 'white' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: activePage === 'projection' ? '600' : '500',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🎯</span>
              <span className="nav-text">Projection</span>
            </button>
            <button
              onClick={() => setActivePage('settings')}
              style={{
                padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 24px)',
                backgroundColor: activePage === 'settings' ? 'var(--color-success)' : 'transparent',
                color: activePage === 'settings' ? 'white' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: activePage === 'settings' ? '600' : '500',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              <span>⚙️</span>
              <span className="nav-text">Configuration</span>
            </button>
            <button
              onClick={() => setActivePage('data-management')}
              style={{
                padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 24px)',
                backgroundColor: activePage === 'data-management' ? '#dc2626' : 'transparent',
                color: activePage === 'data-management' ? 'white' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: activePage === 'data-management' ? '600' : '500',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (activePage !== 'data-management') {
                  e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (activePage !== 'data-management') {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <span>🗑️</span>
              <span className="nav-text">Données</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main
        className="animate-fadeIn"
        style={{
          padding: 'var(--spacing-xl) var(--spacing-lg)',
          maxWidth: '1200px',
          margin: '0 auto',
          minHeight: 'calc(100vh - 200px)'
        }}
      >
        {/* Notification visuelle */}
        {message && <Notification type={message.type} message={message.text} />}

        {/* Pages */}
        {activePage === 'dashboard' && (
          <DashboardPage
            onSuccess={(msg) => showMessage('success', msg)}
            onError={(msg) => showMessage('error', msg)}
            onNavigateToAsset={navigateToAsset}
          />
        )}

        {activePage === 'transactions' && (
          <TransactionsPage
            onSuccess={(msg) => showMessage('success', msg)}
            onError={(msg) => showMessage('error', msg)}
            onNavigateToAsset={navigateToAsset}
          />
        )}

        {activePage === 'projection' && <ProjectionPage onCategoryClick={navigateToCategory} />}

        {activePage === 'settings' && (
          <SettingsPage
            onSuccess={(msg) => showMessage('success', msg)}
            onError={(msg) => showMessage('error', msg)}
            onCategoryClick={navigateToCategory}
            onAssetClick={navigateToAsset}
          />
        )}

        {activePage === 'data-management' && (
          <DataManagementPage
            onSuccess={(msg) => showMessage('success', msg)}
            onError={(msg) => showMessage('error', msg)}
          />
        )}

        {activePage === 'category' && selectedCategoryId && (
          <CategoryDetailPage
            categoryId={selectedCategoryId}
            onBack={navigateToSettings}
            onNavigateToAsset={navigateToAsset}
            onSuccess={(msg) => showMessage('success', msg)}
            onError={(msg) => showMessage('error', msg)}
          />
        )}

        {activePage === 'asset' && selectedAssetId && (
          <AssetDetailPage
            assetId={selectedAssetId}
            onBack={navigateBackToCategory}
            onSuccess={(msg) => showMessage('success', msg)}
            onError={(msg) => showMessage('error', msg)}
          />
        )}
      </main>

      {/* Footer moderne */}
      <footer
        style={{
          textAlign: 'center',
          padding: 'var(--spacing-xl) var(--spacing-lg)',
          color: 'var(--color-text-secondary)',
          fontSize: '14px',
          borderTop: '1px solid var(--color-border)',
          marginTop: 'var(--spacing-xl)',
          backgroundColor: 'var(--color-surface)'
        }}
      >
        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
          <strong>WealthTracker v{__APP_VERSION__}</strong> - Gestion professionnelle de
          portefeuille financier
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-disabled)' }}>
          Made with ❤️ using Electron + React + Prisma
        </div>
      </footer>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)'
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'white'
            }
          },
          error: {
            iconTheme: {
              primary: 'var(--color-danger)',
              secondary: 'white'
            }
          }
        }}
      />

      {/* Système de mise à jour */}
      <UpdateModal
        isOpen={showUpdateModal}
        updateInfo={updateInfo}
        onDownload={() => {
          downloadUpdate()
          setShowUpdateModal(false)
        }}
        onClose={() => {
          setShowUpdateModal(false)
          resetState()
        }}
      />

      {status === 'downloading' && downloadProgress && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: 'var(--color-surface)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            minWidth: '400px',
            maxWidth: '500px'
          }}
        >
          <DownloadProgressComponent progress={downloadProgress} />
        </div>
      )}

      <InstallNotification
        isVisible={status === 'downloaded'}
        updateInfo={updateInfo}
        onInstallNow={installUpdate}
        onInstallLater={() => resetState()}
      />

      {status === 'error' && error && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            minWidth: '300px',
            maxWidth: '400px',
            border: '1px solid var(--color-danger)'
          }}
        >
          <strong>❌ Erreur de mise à jour</strong>
          <p style={{ marginTop: 'var(--spacing-sm)', fontSize: '14px' }}>{error}</p>
          <button
            className="btn-secondary-sm"
            style={{ marginTop: 'var(--spacing-md)' }}
            onClick={resetState}
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  )
}

export default App
