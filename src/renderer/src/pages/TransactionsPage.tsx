import { useState, useEffect } from 'react'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import type { Transaction, TransactionFormData } from '../types'

interface TransactionsPageProps {
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

function TransactionsPage({ onSuccess, onError }: TransactionsPageProps): React.JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Charger les transactions au démarrage
  useEffect(() => {
    loadTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadTransactions = async (): Promise<void> => {
    try {
      setLoading(true)
      const data = await window.api.getAllTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error)
      onError('Erreur lors du chargement des transactions')
    } finally {
      setLoading(false)
    }
  }

  const handleTransactionSubmit = async (data: TransactionFormData): Promise<void> => {
    await window.api.createTransaction(data)
    await loadTransactions()
    onSuccess('Transaction ajoutée avec succès !')
  }

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1>💰 Mes Transactions</h1>
        <p style={{ color: '#666' }}>Gérez vos achats et ventes d&apos;actifs financiers</p>
      </div>

      <TransactionForm onSubmit={handleTransactionSubmit} onError={onError} />

      <hr style={{ margin: '30px 0', border: 'none', borderTop: '2px solid #ddd' }} />

      <TransactionList transactions={transactions} loading={loading} />
    </div>
  )
}

export default TransactionsPage
