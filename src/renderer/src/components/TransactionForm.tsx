import { FormEvent, useState } from 'react'

interface TransactionFormData {
  label: string
  amount: string
  date: string
}

interface TransactionFormProps {
  onSubmit: (data: { label: string; amount: number; date: Date }) => Promise<void>
  onError: (message: string) => void
}

function TransactionForm({ onSubmit, onError }: TransactionFormProps): React.JSX.Element {
  const [formData, setFormData] = useState<TransactionFormData>({
    label: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // Validation
    if (!formData.label.trim() || !formData.amount) {
      onError('Veuillez remplir tous les champs')
      return
    }

    try {
      await onSubmit({
        label: formData.label,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date)
      })

      // Réinitialiser le formulaire
      setFormData({
        label: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction:", error)
      onError("Erreur lors de l'ajout de la transaction")
    }
  }

  return (
    <section style={{ marginBottom: '30px' }}>
      <h2>➕ Ajouter une transaction</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="label">
            Description:
            <br />
            <input
              type="text"
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Ex: Achat actions Apple"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="amount">
            Montant (€):
            <br />
            <input
              type="number"
              id="amount"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Ex: -1500 ou 250.50"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
          <small style={{ color: '#666' }}>Négatif pour une dépense, positif pour un gain</small>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="date">
            Date:
            <br />
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ajouter la transaction
        </button>
      </form>
    </section>
  )
}

export default TransactionForm
