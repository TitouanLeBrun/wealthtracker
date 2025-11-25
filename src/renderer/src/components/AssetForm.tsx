import { FormEvent, useState, useEffect } from 'react'
import type { AssetFormData, Category } from '../types'

interface AssetFormProps {
  onSubmit: (data: AssetFormData) => Promise<void>
  onError: (message: string) => void
}

function AssetForm({ onSubmit, onError }: AssetFormProps): React.JSX.Element {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<AssetFormData>({
    name: '',
    ticker: '',
    currentPrice: 0,
    categoryId: 0
  })

  // Charger les catégories au montage
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async (): Promise<void> => {
    try {
      const data = await window.api.getAllCategories()
      setCategories(data)
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error)
      onError('Erreur lors du chargement des catégories')
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim() || !formData.ticker.trim()) {
      onError('Veuillez remplir le nom et le ticker')
      return
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      onError('Veuillez sélectionner une catégorie')
      return
    }

    if (formData.currentPrice < 0) {
      onError('Le prix ne peut pas être négatif')
      return
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        ticker: formData.ticker.trim().toUpperCase(),
        currentPrice: formData.currentPrice,
        categoryId: formData.categoryId
      })

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        ticker: '',
        currentPrice: 0,
        categoryId: 0
      })
    } catch (error) {
      console.error("Erreur lors de la création de l'actif:", error)
      onError("Erreur lors de la création de l'actif")
    }
  }

  if (categories.length === 0) {
    return (
      <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          border: '2px solid #ffc107'
        }}
      >
        <h3>⚠️ Aucune catégorie disponible</h3>
        <p style={{ margin: '10px 0' }}>
          Vous devez d&apos;abord créer au moins une catégorie avant de pouvoir ajouter des actifs.
        </p>
        <p style={{ margin: 0, color: '#666' }}>
          👆 Rendez-vous dans l&apos;onglet <strong>&quot;Catégories&quot;</strong> ci-dessus.
        </p>
      </section>
    )
  }

  return (
    <section
      style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      }}
    >
      <h3>➕ Ajouter un actif</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {/* Nom de l'actif */}
          <div>
            <label htmlFor="asset-name">
              <strong>Nom complet :</strong>
              <br />
              <input
                type="text"
                id="asset-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Apple Inc., Bitcoin"
                style={{ width: '100%', padding: '10px', marginTop: '5px', fontSize: '14px' }}
              />
            </label>
          </div>

          {/* Ticker */}
          <div>
            <label htmlFor="asset-ticker">
              <strong>Ticker / Symbole :</strong>
              <br />
              <input
                type="text"
                id="asset-ticker"
                value={formData.ticker}
                onChange={(e) =>
                  setFormData({ ...formData, ticker: e.target.value.toUpperCase() })
                }
                placeholder="Ex: AAPL, BTC, SPY"
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px',
                  fontSize: '14px',
                  textTransform: 'uppercase'
                }}
              />
            </label>
            <small style={{ color: '#666' }}>Sera converti en majuscules</small>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginTop: '15px'
          }}
        >
          {/* Prix actuel */}
          <div>
            <label htmlFor="asset-price">
              <strong>Prix actuel (€) :</strong>
              <br />
              <input
                type="number"
                id="asset-price"
                step="0.01"
                value={formData.currentPrice}
                onChange={(e) =>
                  setFormData({ ...formData, currentPrice: parseFloat(e.target.value) || 0 })
                }
                placeholder="Ex: 195.50"
                style={{ width: '100%', padding: '10px', marginTop: '5px', fontSize: '14px' }}
              />
            </label>
            <small style={{ color: '#666' }}>Peut être mis à jour plus tard</small>
          </div>

          {/* Catégorie */}
          <div>
            <label htmlFor="asset-category">
              <strong>Catégorie :</strong>
              <br />
              <select
                id="asset-category"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: parseInt(e.target.value) })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px',
                  fontSize: '14px'
                }}
              >
                <option value="0">-- Sélectionner une catégorie --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          ✅ Créer l&apos;actif
        </button>
      </form>
    </section>
  )
}

export default AssetForm
