import { FormEvent, useState, useEffect } from 'react'
import type { Asset } from '../types'

interface TransactionFormData {
  assetId: string
  type: 'BUY' | 'SELL'
  quantity: string
  pricePerUnit: string
  fee: string
  date: string
}

interface TransactionFormProps {
  onSubmit: (data: {
    assetId: number
    type: 'BUY' | 'SELL'
    quantity: number
    pricePerUnit: number
    fee: number
    date: Date
  }) => Promise<void>
  onError: (message: string) => void
}

function TransactionForm({ onSubmit, onError }: TransactionFormProps): React.JSX.Element {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loadingAssets, setLoadingAssets] = useState(true)
  const [formData, setFormData] = useState<TransactionFormData>({
    assetId: '',
    type: 'BUY',
    quantity: '',
    pricePerUnit: '',
    fee: '0',
    date: new Date().toISOString().split('T')[0]
  })

  // Charger les actifs disponibles
  useEffect(() => {
    const loadAssets = async (): Promise<void> => {
      try {
        const data = await window.api.getAllAssets()
        setAssets(data)
      } catch (error) {
        console.error('Erreur lors du chargement des actifs:', error)
        onError('Impossible de charger les actifs')
      } finally {
        setLoadingAssets(false)
      }
    }
    loadAssets()
  }, [onError])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // Validation
    if (!formData.assetId || !formData.quantity || !formData.pricePerUnit) {
      onError('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      await onSubmit({
        assetId: parseInt(formData.assetId),
        type: formData.type,
        quantity: parseFloat(formData.quantity),
        pricePerUnit: parseFloat(formData.pricePerUnit),
        fee: parseFloat(formData.fee) || 0,
        date: new Date(formData.date)
      })

      // Réinitialiser le formulaire
      setFormData({
        assetId: '',
        type: 'BUY',
        quantity: '',
        pricePerUnit: '',
        fee: '0',
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction:", error)
      onError("Erreur lors de l'ajout de la transaction")
    }
  }

  if (loadingAssets) {
    return (
      <section style={{ marginBottom: '30px' }}>
        <h2>➕ Ajouter une transaction</h2>
        <p>Chargement des actifs...</p>
      </section>
    )
  }

  if (assets.length === 0) {
    return (
      <section style={{ marginBottom: '30px' }}>
        <h2>➕ Ajouter une transaction</h2>
        <p
          style={{
            color: '#f44336',
            padding: '15px',
            backgroundColor: '#ffebee',
            borderRadius: '4px'
          }}
        >
          ⚠️ Aucun actif disponible. Veuillez d&apos;abord créer des actifs dans la section
          Configuration.
        </p>
      </section>
    )
  }

  return (
    <section style={{ marginBottom: '30px' }}>
      <h2>➕ Ajouter une transaction</h2>
      <form onSubmit={handleSubmit}>
        {/* Sélection de l'actif */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="assetId">
            Actif: *
            <br />
            <select
              id="assetId"
              value={formData.assetId}
              onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            >
              <option value="">-- Sélectionner un actif --</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.ticker} - {asset.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Type de transaction */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="type">
            Type: *
            <br />
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'BUY' | 'SELL' })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="BUY">🟢 Achat (BUY)</option>
              <option value="SELL">🔴 Vente (SELL)</option>
            </select>
          </label>
        </div>

        {/* Quantité */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="quantity">
            Quantité: *
            <br />
            <input
              type="number"
              id="quantity"
              step="0.00000001"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Ex: 10 ou 0.5"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </label>
          <small style={{ color: '#666' }}>Nombre d&apos;unités achetées/vendues</small>
        </div>

        {/* Prix unitaire */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="pricePerUnit">
            Prix unitaire (€): *
            <br />
            <input
              type="number"
              id="pricePerUnit"
              step="0.01"
              value={formData.pricePerUnit}
              onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
              placeholder="Ex: 195.50"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </label>
          <small style={{ color: '#666' }}>Prix par unité au moment de la transaction</small>
        </div>

        {/* Frais */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="fee">
            Frais (€):
            <br />
            <input
              type="number"
              id="fee"
              step="0.01"
              value={formData.fee}
              onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
              placeholder="Ex: 5.00"
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
          <small style={{ color: '#666' }}>Frais de courtage (optionnel)</small>
        </div>

        {/* Date */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="date">
            Date: *
            <br />
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              required
            />
          </label>
        </div>

        {/* Récapitulatif */}
        {formData.assetId && formData.quantity && formData.pricePerUnit && (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#e3f2fd',
              borderRadius: '4px',
              marginBottom: '10px'
            }}
          >
            <strong>Montant total:</strong>{' '}
            {(
              parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit) +
              parseFloat(formData.fee || '0')
            ).toFixed(2)}{' '}
            €
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: formData.type === 'BUY' ? '#4CAF50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {formData.type === 'BUY' ? '🟢 Acheter' : '🔴 Vendre'}
        </button>
      </form>
    </section>
  )
}

export default TransactionForm
