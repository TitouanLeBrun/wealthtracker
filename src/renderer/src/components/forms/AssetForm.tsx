import { FormEvent, useState, useEffect } from 'react'
import type { AssetFormData, Category, Asset } from '../../types'

interface AssetFormProps {
  onSubmit: (data: AssetFormData) => Promise<void>
  onError: (message: string) => void
  initialCategoryId?: number // Catégorie par défaut
  lockCategory?: boolean // Si true, désactive la sélection de catégorie
}

function AssetForm({
  onSubmit,
  onError,
  initialCategoryId,
  lockCategory = false
}: AssetFormProps): React.JSX.Element {
  const [categories, setCategories] = useState<Category[]>([])
  const [allAssets, setAllAssets] = useState<Asset[]>([])
  const [tickerExists, setTickerExists] = useState(false)
  const [formData, setFormData] = useState<AssetFormData>({
    name: '',
    ticker: '',
    currentPrice: 0,
    categoryId: initialCategoryId || 0
  })

  // Charger les catégories et actifs au montage
  useEffect(() => {
    loadCategories()
    loadAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const loadAssets = async (): Promise<void> => {
    try {
      const data = await window.api.getAllAssets()
      setAllAssets(data)
    } catch (error) {
      console.error('Erreur lors du chargement des actifs:', error)
    }
  }

  // Vérifier si le ticker existe déjà
  const checkTickerExists = (ticker: string): void => {
    if (!ticker.trim()) {
      setTickerExists(false)
      return
    }
    const exists = allAssets.some(
      (asset) => asset.ticker.toUpperCase() === ticker.trim().toUpperCase()
    )
    setTickerExists(exists)
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
        categoryId: initialCategoryId || 0
      })
    } catch (error: unknown) {
      console.error("Erreur lors de la création de l'actif:", error)

      // Vérifier si c'est une erreur de contrainte unique (ticker ou nom déjà existant)
      const errorMessage = error instanceof Error ? error.message : String(error)

      if (errorMessage.includes('Unique constraint failed')) {
        // Déterminer quel champ pose problème
        if (errorMessage.includes('ticker')) {
          onError(
            `❌ Le ticker "${formData.ticker.toUpperCase()}" existe déjà dans la base de données. Veuillez en choisir un autre.`
          )
        } else if (errorMessage.includes('name')) {
          onError(
            `❌ Le nom "${formData.name.trim()}" existe déjà dans la base de données. Veuillez en choisir un autre.`
          )
        } else {
          onError(
            `❌ Un actif avec ces informations existe déjà. Veuillez vérifier le ticker et le nom.`
          )
        }
      } else {
        onError("❌ Erreur lors de la création de l'actif")
      }
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
    <div>
      {/* Message d'alerte si le ticker existe déjà */}
      {tickerExists && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#991b1b'
          }}
        >
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <span style={{ fontWeight: '500' }}>
            Le ticker &quot;{formData.ticker.toUpperCase()}&quot; existe déjà dans la base de
            données
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Nom de l'actif */}
          <div>
            <label
              htmlFor="asset-name"
              style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#374151'
              }}
            >
              Nom complet
            </label>
            <input
              type="text"
              id="asset-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Apple Inc., Bitcoin"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
            />
          </div>

          {/* Ticker */}
          <div>
            <label
              htmlFor="asset-ticker"
              style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#374151'
              }}
            >
              Ticker / Symbole
            </label>
            <input
              type="text"
              id="asset-ticker"
              value={formData.ticker}
              onChange={(e) => {
                const newTicker = e.target.value.toUpperCase()
                setFormData({ ...formData, ticker: newTicker })
                checkTickerExists(newTicker)
              }}
              placeholder="Ex: AAPL, BTC, SPY"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: tickerExists ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
                textTransform: 'uppercase',
                transition: 'border-color 0.2s',
                backgroundColor: tickerExists ? '#fef2f2' : 'white'
              }}
              onFocus={(e) => {
                if (!tickerExists) e.currentTarget.style.borderColor = '#3b82f6'
              }}
              onBlur={(e) => {
                if (!tickerExists) e.currentTarget.style.borderColor = '#d1d5db'
              }}
            />
            <small
              style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}
            >
              Sera converti en majuscules
            </small>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Prix actuel */}
            <div>
              <label
                htmlFor="asset-price"
                style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                Prix actuel (€)
              </label>
              <input
                type="number"
                id="asset-price"
                step="0.01"
                value={formData.currentPrice}
                onChange={(e) =>
                  setFormData({ ...formData, currentPrice: parseFloat(e.target.value) || 0 })
                }
                placeholder="Ex: 195.50"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
              />
              <small
                style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}
              >
                Peut être mis à jour plus tard
              </small>
            </div>

            {/* Catégorie */}
            <div>
              <label
                htmlFor="asset-category"
                style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                Catégorie
              </label>
              <select
                id="asset-category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                disabled={lockCategory}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  outline: 'none',
                  backgroundColor: lockCategory ? '#f3f4f6' : 'white',
                  cursor: lockCategory ? 'not-allowed' : 'pointer',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  if (!lockCategory) e.currentTarget.style.borderColor = '#3b82f6'
                }}
                onBlur={(e) => {
                  if (!lockCategory) e.currentTarget.style.borderColor = '#d1d5db'
                }}
              >
                <option value="0">-- Sélectionner une catégorie --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {lockCategory && (
                <small
                  style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}
                >
                  📌 Catégorie verrouillée pour cette section
                </small>
              )}
            </div>
          </div>
        </div>

        {/* Bouton Submit à droite */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button
            type="submit"
            disabled={tickerExists}
            style={{
              padding: '10px 24px',
              backgroundColor: tickerExists ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: tickerExists ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!tickerExists) {
                e.currentTarget.style.backgroundColor = '#2563eb'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (!tickerExists) {
                e.currentTarget.style.backgroundColor = '#3b82f6'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            <span>✓</span>
            <span>Créer l&apos;actif</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AssetForm
