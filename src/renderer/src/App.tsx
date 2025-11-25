import { useState } from 'react'
import TransactionsPage from './pages/TransactionsPage'
import SettingsPage from './pages/SettingsPage'
import Notification from './components/Notification'
import type { NotificationMessage } from './types'

function App(): React.JSX.Element {
  const [activePage, setActivePage] = useState<'transactions' | 'settings'>('transactions')
  const [message, setMessage] = useState<NotificationMessage | null>(null)

  // Fonction pour afficher un message temporaire
  const showMessage = (type: 'success' | 'error', text: string): void => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
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
            padding: '0 var(--spacing-lg)'
          }}
        >
          {/* Logo avec gradient */}
          <div
            style={{
              padding: 'var(--spacing-md) 0',
              fontWeight: 'bold',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}
          >
            <span style={{ fontSize: '28px' }}>💰</span>
            <span className="text-gradient">WealthTracker</span>
            <span
              style={{
                fontSize: '12px',
                padding: '2px 8px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary-dark)',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600'
              }}
            >
              v0.2
            </span>
          </div>

          {/* Menu Navigation */}
          <div style={{ display: 'flex', marginLeft: 'auto', gap: 'var(--spacing-xs)' }}>
            <button
              onClick={() => setActivePage('transactions')}
              style={{
                padding: '12px 24px',
                backgroundColor:
                  activePage === 'transactions' ? 'var(--color-primary)' : 'transparent',
                color: activePage === 'transactions' ? 'white' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: activePage === 'transactions' ? '600' : '500',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}
            >
              <span>📊</span>
              <span>Transactions</span>
            </button>
            <button
              onClick={() => setActivePage('settings')}
              style={{
                padding: '12px 24px',
                backgroundColor: activePage === 'settings' ? 'var(--color-success)' : 'transparent',
                color: activePage === 'settings' ? 'white' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: activePage === 'settings' ? '600' : '500',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}
            >
              <span>⚙️</span>
              <span>Configuration</span>
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
        {activePage === 'transactions' && (
          <TransactionsPage
            onSuccess={(msg) => showMessage('success', msg)}
            onError={(msg) => showMessage('error', msg)}
          />
        )}

        {activePage === 'settings' && (
          <SettingsPage
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
          <strong>WealthTracker v0.2</strong> - Gestion professionnelle de portefeuille financier
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-disabled)' }}>
          Made with ❤️ using Electron + React + Prisma
        </div>
      </footer>
    </div>
  )
}

export default App
