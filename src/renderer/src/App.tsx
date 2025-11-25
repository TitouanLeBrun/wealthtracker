import { useState, useEffect } from 'react'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import Notification from './components/Notification'
import type { Transaction, TransactionFormData, NotificationMessage } from './types'

function App(): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<NotificationMessage | null>(null)

  // Fonction pour afficher un message temporaire
  const showMessage = (type: 'success' | 'error', text: string): void => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000) // Disparaît après 3 secondes
  }

  // Fonction pour charger les transactions depuis la base de données
  const loadTransactions = async (): Promise<void> => {
    try {
      setLoading(true)
      const data = await window.api.getAllTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error)
      showMessage('error', 'Erreur lors du chargement des transactions')
    } finally {
      setLoading(false)
    }
  }

  // useEffect pour charger les transactions au démarrage de l'application
  useEffect(() => {
    loadTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fonction pour gérer la soumission du formulaire
  const handleTransactionSubmit = async (data: TransactionFormData): Promise<void> => {
    await window.api.createTransaction(data)
    await loadTransactions()
    showMessage('success', 'Transaction ajoutée avec succès !')
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>💰 WealthTracker v0.2</h1>
      <p>Suivi professionnel de vos actifs financiers</p>

      {/* Notification visuelle */}
      {message && <Notification type={message.type} message={message.text} />}

      <hr />

      {/* Formulaire d'ajout de transaction */}
      <TransactionForm
        onSubmit={handleTransactionSubmit}
        onError={(msg) => showMessage('error', msg)}
      />

      <hr />

      {/* Liste des transactions */}
      <TransactionList transactions={transactions} loading={loading} />
    </div>
  )
}

export default App
