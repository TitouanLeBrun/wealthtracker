import { FormEvent, useState, useEffect } from 'react'
import type { Asset } from '../../types'

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

  // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
  const getTodayDate = (): string => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState<TransactionFormData>({
    assetId: '',
    type: 'BUY',
    quantity: '',
    pricePerUnit: '',
    fee: '0',
    date: getTodayDate()
  })

  // Charger les actifs disponibles
  useEffect(() => {
    const loadAssets = async (): Promise<void> => {
      try {
        const data = await window.api.getAllAssets()
        setAssets(data)
        // Pré-sélectionner le premier actif et son prix
        if (data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            assetId: data[0].id.toString(),
            pricePerUnit: data[0].currentPrice.toString()
          }))
        }
      } catch (error) {
        console.error('Erreur lors du chargement des actifs:', error)
        onError('Impossible de charger les actifs')
      } finally {
        setLoadingAssets(false)
      }
    }
    loadAssets()
  }, [onError])

  // Mettre à jour le prix quand l'actif change
  const handleAssetChange = (assetId: string): void => {
    const selectedAsset = assets.find((a) => a.id === parseInt(assetId))
    setFormData({
      ...formData,
      assetId,
      pricePerUnit: selectedAsset ? selectedAsset.currentPrice.toString() : ''
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // Validation
    if (!formData.assetId || !formData.quantity || !formData.pricePerUnit || !formData.date) {
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
      const firstAsset = assets[0]
      setFormData({
        assetId: firstAsset ? firstAsset.id.toString() : '',
        type: 'BUY',
        quantity: '',
        pricePerUnit: firstAsset ? firstAsset.currentPrice.toString() : '',
        fee: '0',
        date: getTodayDate()
      })
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction:", error)
      onError("Erreur lors de l'ajout de la transaction")
    }
  }

  if (loadingAssets) {
    return (
      <div style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Chargement des actifs...</p>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--spacing-lg)',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 'var(--border-radius)',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}
      >
        <p style={{ color: '#ef4444', margin: 0 }}>
          ⚠️ Aucun actif disponible. Veuillez d&apos;abord créer des actifs dans la Configuration.
        </p>
      </div>
    )
  }

  const total =
    formData.quantity && formData.pricePerUnit
      ? parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit) +
        parseFloat(formData.fee || '0')
      : 0

  return (
    <form onSubmit={handleSubmit}>
      {/* Actif */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <label
          htmlFor="assetId"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Actif *
        </label>
        <select
          id="assetId"
          value={formData.assetId}
          onChange={(e) => handleAssetChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text-primary)',
            fontSize: '14px'
          }}
          required
        >
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.ticker} - {asset.name}
            </option>
          ))}
        </select>
      </div>

      {/* Type */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <label
          htmlFor="type"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Type *
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'BUY' | 'SELL' })}
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text-primary)',
            fontSize: '14px'
          }}
        >
          <option value="BUY">Achat (BUY)</option>
          <option value="SELL">Vente (SELL)</option>
        </select>
      </div>

      {/* Date de la transaction */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <label
          htmlFor="date"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Date de la transaction *
        </label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          max={getTodayDate()}
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text-primary)',
            fontSize: '14px'
          }}
          required
        />
        <small style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
          Date à laquelle vous avez effectué la transaction
        </small>
      </div>

      {/* Quantité */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <label
          htmlFor="quantity"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Quantité *
        </label>
        <input
          type="number"
          id="quantity"
          step="0.00000001"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          placeholder="Ex: 10 ou 0.5"
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text-primary)',
            fontSize: '14px'
          }}
          required
        />
      </div>

      {/* Prix unitaire */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <label
          htmlFor="pricePerUnit"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Prix unitaire (€) *
        </label>
        <input
          type="number"
          id="pricePerUnit"
          step="0.01"
          value={formData.pricePerUnit}
          onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
          placeholder="Ex: 195.50"
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text-primary)',
            fontSize: '14px'
          }}
          required
        />
      </div>

      {/* Frais */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <label
          htmlFor="fee"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Frais (€)
        </label>
        <input
          type="number"
          id="fee"
          step="0.01"
          value={formData.fee}
          onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
          placeholder="Ex: 5.00"
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--color-text-primary)',
            fontSize: '14px'
          }}
        />
        <small style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
          Frais de courtage (optionnel)
        </small>
      </div>

      {/* Récapitulatif */}
      {total > 0 && (
        <div
          style={{
            padding: 'var(--spacing-md)',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--spacing-md)',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Montant total:
            </span>
            <span
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: formData.type === 'BUY' ? '#ef4444' : '#10b981'
              }}
            >
              {total.toFixed(2)} €
            </span>
          </div>
        </div>
      )}

      {/* Bouton Submit */}
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '14px',
          background: formData.type === 'BUY' ? '#ef4444' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--border-radius)',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow =
            formData.type === 'BUY'
              ? '0 4px 12px rgba(239, 68, 68, 0.4)'
              : '0 4px 12px rgba(16, 185, 129, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {formData.type === 'BUY' ? 'Acheter' : 'Vendre'}
      </button>
    </form>
  )
}

export default TransactionForm
