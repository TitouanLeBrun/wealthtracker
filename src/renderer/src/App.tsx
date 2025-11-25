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
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navigation */}
      <nav
        style={{
          backgroundColor: '#fff',
          borderBottom: '2px solid #ddd',
          padding: '0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div
          style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}
        >
          {/* Logo */}
          <div style={{ padding: '15px 20px', fontWeight: 'bold', fontSize: '20px' }}>
            💰 WealthTracker <span style={{ color: '#2196F3' }}>v0.2</span>
          </div>

          {/* Menu */}
          <div style={{ display: 'flex', marginLeft: 'auto' }}>
            <button
              onClick={() => setActivePage('transactions')}
              style={{
                padding: '18px 30px',
                backgroundColor: activePage === 'transactions' ? '#2196F3' : 'transparent',
                color: activePage === 'transactions' ? 'white' : '#666',
                border: 'none',
                borderBottom: activePage === 'transactions' ? '3px solid #2196F3' : 'none',
                cursor: 'pointer',
                fontWeight: activePage === 'transactions' ? 'bold' : 'normal',
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
            >
              📊 Transactions
            </button>
            <button
              onClick={() => setActivePage('settings')}
              style={{
                padding: '18px 30px',
                backgroundColor: activePage === 'settings' ? '#4CAF50' : 'transparent',
                color: activePage === 'settings' ? 'white' : '#666',
                border: 'none',
                borderBottom: activePage === 'settings' ? '3px solid #4CAF50' : 'none',
                cursor: 'pointer',
                fontWeight: activePage === 'settings' ? 'bold' : 'normal',
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
            >
              ⚙️ Configuration
            </button>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto' }}>
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

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '20px',
          color: '#999',
          fontSize: '14px',
          borderTop: '1px solid #ddd',
          marginTop: '50px'
        }}
      >
        WealthTracker v0.2 - Gestion professionnelle de portefeuille financier
      </footer>
    </div>
  )
}

export default App
