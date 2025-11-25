import { FormEvent, useState, useEffect, useMemo } from 'react'
import { Lock } from 'lucide-react'
import type { Asset, Category, Transaction } from '../../types'
import SellPercentageSelector from './SellPercentageSelector'

interface TransactionFormData {
  categoryId: string
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
  // Props de contexte pour pré-remplir et verrouiller des champs
  preselectedCategoryId?: number
  preselectedAssetId?: number
  preselectedType?: 'BUY' | 'SELL'
}

function TransactionForm({
  onSubmit,
  onError,
  preselectedCategoryId,
  preselectedAssetId,
  preselectedType
}: TransactionFormProps): React.JSX.Element {
  const [categories, setCategories] = useState<Category[]>([])
  const [allAssets, setAllAssets] = useState<Asset[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
  const getTodayDate = (): string => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState<TransactionFormData>({
    categoryId: preselectedCategoryId?.toString() || '',
    assetId: preselectedAssetId?.toString() || '',
    type: preselectedType || 'BUY',
    quantity: '',
    pricePerUnit: '',
    fee: '0',
    date: getTodayDate()
  })

  const [errors, setErrors] = useState<{
    quantity?: string
    pricePerUnit?: string
  }>({})

  // Charger les catégories, actifs et transactions
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setLoading(true)
        const [categoriesData, assetsData, transactionsData] = await Promise.all([
          window.api.getAllCategories(),
          window.api.getAllAssets(),
          window.api.getAllTransactions()
        ])

        setCategories(categoriesData)
        setAllAssets(assetsData)
        setTransactions(transactionsData)

        // Si un actif est pré-sélectionné, pré-remplir les champs
        if (preselectedAssetId) {
          const selectedAsset = assetsData.find((a) => a.id === preselectedAssetId)
          if (selectedAsset) {
            setFormData((prev) => ({
              ...prev,
              categoryId: selectedAsset.categoryId.toString(),
              assetId: selectedAsset.id.toString(),
              pricePerUnit: selectedAsset.currentPrice.toString()
            }))
          }
        } else if (categoriesData.length > 0 && assetsData.length > 0) {
          // Sinon, sélectionner la première catégorie et le premier actif
          const firstCategory = preselectedCategoryId
            ? categoriesData.find((c) => c.id === preselectedCategoryId)
            : categoriesData[0]

          if (firstCategory) {
            const categoryAssets = assetsData.filter((a) => a.categoryId === firstCategory.id)
            const firstAsset = categoryAssets[0]

            setFormData((prev) => ({
              ...prev,
              categoryId: firstCategory.id.toString(),
              assetId: firstAsset ? firstAsset.id.toString() : '',
              pricePerUnit: firstAsset ? firstAsset.currentPrice.toString() : ''
            }))
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        onError('Impossible de charger les données')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [onError, preselectedAssetId, preselectedCategoryId])

  // Filtrer les actifs par catégorie sélectionnée
  // Pour les ventes, ne montrer que les actifs avec positions > 0
  const filteredAssets = useMemo(() => {
    if (!formData.categoryId) return []
    const categoryAssets = allAssets.filter((a) => a.categoryId === parseInt(formData.categoryId))

    // Si c'est une vente, filtrer uniquement les actifs avec positions en cours
    if (formData.type === 'SELL') {
      return categoryAssets.filter((asset) => {
        const assetTransactions = transactions.filter((t) => t.assetId === asset.id)
        const owned = assetTransactions.reduce((acc, t) => {
          return t.type === 'BUY' ? acc + t.quantity : acc - t.quantity
        }, 0)
        return owned > 0
      })
    }

    return categoryAssets
  }, [allAssets, formData.categoryId, formData.type, transactions])

  // Calculer la quantité possédée de l'actif sélectionné
  const ownedQuantity = useMemo(() => {
    if (!formData.assetId) return 0

    const assetTransactions = transactions.filter((t) => t.assetId === parseInt(formData.assetId))

    return assetTransactions.reduce((acc, t) => {
      return t.type === 'BUY' ? acc + t.quantity : acc - t.quantity
    }, 0)
  }, [formData.assetId, transactions])

  // Calculer le Prix Moyen d'Achat (PMA) pour l'alerte de vente à perte
  const averageBuyPrice = useMemo(() => {
    if (!formData.assetId) return 0

    const assetTransactions = transactions.filter(
      (t) => t.assetId === parseInt(formData.assetId) && t.type === 'BUY'
    )

    if (assetTransactions.length === 0) return 0

    const totalCost = assetTransactions.reduce(
      (acc, t) => acc + t.quantity * t.pricePerUnit + t.fee,
      0
    )
    const totalQuantity = assetTransactions.reduce((acc, t) => acc + t.quantity, 0)

    return totalQuantity > 0 ? totalCost / totalQuantity : 0
  }, [formData.assetId, transactions])

  // Gérer le changement de catégorie
  const handleCategoryChange = (categoryId: string): void => {
    const categoryAssets = allAssets.filter((a) => a.categoryId === parseInt(categoryId))
    const firstAsset = categoryAssets[0]

    setFormData({
      ...formData,
      categoryId,
      assetId: firstAsset ? firstAsset.id.toString() : '',
      pricePerUnit: firstAsset ? firstAsset.currentPrice.toString() : ''
    })
    setErrors({})
  }

  // Gérer le changement d'actif
  const handleAssetChange = (assetId: string): void => {
    const selectedAsset = allAssets.find((a) => a.id === parseInt(assetId))
    setFormData({
      ...formData,
      assetId,
      pricePerUnit: selectedAsset ? selectedAsset.currentPrice.toString() : ''
    })
    setErrors({})
  }

  // Gérer le changement de quantité avec validation
  const handleQuantityChange = (quantity: string): void => {
    setFormData({ ...formData, quantity })

    const qty = parseFloat(quantity)
    if (formData.type === 'SELL' && qty > ownedQuantity) {
      setErrors((prev) => ({
        ...prev,
        quantity: `Maximum disponible : ${ownedQuantity.toFixed(8)}`
      }))
    } else if (qty <= 0) {
      setErrors((prev) => ({ ...prev, quantity: 'La quantité doit être supérieure à 0' }))
    } else {
      setErrors((prev) => ({ ...prev, quantity: undefined }))
    }
  }

  // Gérer le changement de prix avec validation pour vente à perte
  const handlePriceChange = (price: string): void => {
    setFormData({ ...formData, pricePerUnit: price })

    const priceNum = parseFloat(price)
    if (formData.type === 'SELL' && priceNum < averageBuyPrice && averageBuyPrice > 0) {
      const loss = ((priceNum - averageBuyPrice) / averageBuyPrice) * 100
      setErrors((prev) => ({
        ...prev,
        pricePerUnit: `⚠️ Vente à perte : ${loss.toFixed(2)}% (PMA: ${averageBuyPrice.toFixed(2)} €)`
      }))
    } else {
      setErrors((prev) => ({ ...prev, pricePerUnit: undefined }))
    }
  }

  // Calculer le total de la transaction
  const transactionTotal = useMemo(() => {
    if (!formData.quantity || !formData.pricePerUnit) return 0

    const qty = parseFloat(formData.quantity)
    const price = parseFloat(formData.pricePerUnit)
    const fee = parseFloat(formData.fee) || 0

    return formData.type === 'BUY' ? qty * price + fee : qty * price - fee
  }, [formData.quantity, formData.pricePerUnit, formData.fee, formData.type])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // Validation
    if (!formData.assetId || !formData.quantity || !formData.pricePerUnit || !formData.date) {
      onError('Veuillez remplir tous les champs obligatoires')
      return
    }

    const qty = parseFloat(formData.quantity)
    const price = parseFloat(formData.pricePerUnit)

    if (qty <= 0) {
      onError('La quantité doit être supérieure à 0')
      return
    }

    if (price <= 0) {
      onError('Le prix doit être supérieur à 0')
      return
    }

    if (formData.type === 'SELL' && qty > ownedQuantity) {
      onError(`Quantité insuffisante. Maximum : ${ownedQuantity.toFixed(8)}`)
      return
    }

    try {
      await onSubmit({
        assetId: parseInt(formData.assetId),
        type: formData.type,
        quantity: qty,
        pricePerUnit: price,
        fee: parseFloat(formData.fee) || 0,
        date: new Date(formData.date)
      })

      // Réinitialiser le formulaire
      setFormData({
        categoryId: preselectedCategoryId?.toString() || categories[0]?.id.toString() || '',
        assetId: preselectedAssetId?.toString() || '',
        type: preselectedType || 'BUY',
        quantity: '',
        pricePerUnit: '',
        fee: '0',
        date: getTodayDate()
      })
      setErrors({})
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction:", error)
      onError("Erreur lors de l'ajout de la transaction")
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Chargement...</p>
      </div>
    )
  }

  if (categories.length === 0 || allAssets.length === 0) {
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
          ⚠️ Aucune catégorie ou actif disponible. Veuillez d&apos;abord les créer dans la
          Configuration.
        </p>
      </div>
    )
  }

  const selectedAsset = allAssets.find((a) => a.id === parseInt(formData.assetId))
  const isCategoryLocked = preselectedCategoryId !== undefined
  const isAssetLocked = preselectedAssetId !== undefined
  const isTypeLocked = preselectedType !== undefined

  // Vérifier si la vente est possible (position disponible)
  const canSell = ownedQuantity > 0

  return (
    <form onSubmit={handleSubmit}>
      {/* Ligne 1 : Catégorie | Actif */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)'
        }}
      >
        {/* Catégorie */}
        <div>
          <label
            htmlFor="categoryId"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-text-primary)'
            }}
          >
            Catégorie *
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="categoryId"
              value={formData.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={isCategoryLocked}
              style={{
                width: '100%',
                padding: '12px',
                paddingRight: isCategoryLocked ? '40px' : '12px',
                background: isCategoryLocked ? '#f3f4f6' : 'var(--color-input-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                cursor: isCategoryLocked ? 'not-allowed' : 'pointer',
                opacity: isCategoryLocked ? 0.7 : 1
              }}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {isCategoryLocked && (
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
        </div>

        {/* Actif */}
        <div>
          <label
            htmlFor="assetId"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-text-primary)'
            }}
          >
            Actif *
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="assetId"
              value={formData.assetId}
              onChange={(e) => handleAssetChange(e.target.value)}
              disabled={isAssetLocked || filteredAssets.length === 0}
              style={{
                width: '100%',
                padding: '12px',
                paddingRight: isAssetLocked ? '40px' : '12px',
                background: isAssetLocked ? '#f3f4f6' : 'var(--color-input-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius)',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                cursor: isAssetLocked ? 'not-allowed' : 'pointer',
                opacity: isAssetLocked ? 0.7 : 1
              }}
              required
            >
              {filteredAssets.length === 0 ? (
                <option value="">Aucun actif dans cette catégorie</option>
              ) : (
                filteredAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.ticker} - {asset.name}
                  </option>
                ))
              )}
            </select>
            {isAssetLocked && (
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Ligne 2 : Type | Date */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)'
        }}
      >
        {/* Type (Pills) */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-text-primary)'
            }}
          >
            Type *
          </label>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', position: 'relative' }}>
            <button
              type="button"
              onClick={() => !isTypeLocked && setFormData({ ...formData, type: 'BUY' })}
              disabled={isTypeLocked}
              style={{
                flex: 1,
                padding: '12px',
                background:
                  formData.type === 'BUY'
                    ? '#10b981'
                    : isTypeLocked
                      ? '#f3f4f6'
                      : 'var(--color-card)',
                color: formData.type === 'BUY' ? 'white' : 'var(--color-text-primary)',
                border: `2px solid ${formData.type === 'BUY' ? '#10b981' : 'var(--color-border)'}`,
                borderRadius: 'var(--border-radius)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isTypeLocked ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isTypeLocked ? 0.7 : 1
              }}
            >
              ✓ Achat
            </button>
            <button
              type="button"
              onClick={() => !isTypeLocked && canSell && setFormData({ ...formData, type: 'SELL' })}
              disabled={isTypeLocked || !canSell}
              title={!canSell ? 'Aucune position disponible pour cet actif' : ''}
              style={{
                flex: 1,
                padding: '12px',
                background:
                  formData.type === 'SELL'
                    ? '#ef4444'
                    : isTypeLocked || !canSell
                      ? '#f3f4f6'
                      : 'var(--color-card)',
                color:
                  formData.type === 'SELL'
                    ? 'white'
                    : isTypeLocked || !canSell
                      ? '#9ca3af'
                      : 'var(--color-text-primary)',
                border: `2px solid ${formData.type === 'SELL' ? '#ef4444' : 'var(--color-border)'}`,
                borderRadius: 'var(--border-radius)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isTypeLocked || !canSell ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isTypeLocked || !canSell ? 0.6 : 1
              }}
            >
              ✓ Vente {!canSell && '🔒'}
            </button>
            {isTypeLocked && (
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-text-primary)'
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
            Par défaut : aujourd&apos;hui
          </small>
        </div>
      </div>

      {/* Ligne 3 : Quantité | Prix unitaire */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom:
            formData.type === 'SELL' && ownedQuantity > 0
              ? 'var(--spacing-sm)'
              : 'var(--spacing-md)'
        }}
      >
        {/* Quantité */}
        <div>
          <label
            htmlFor="quantity"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-text-primary)'
            }}
          >
            Quantité *
            {formData.type === 'SELL' && ownedQuantity > 0 && (
              <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--color-primary)' }}>
                (Max: {ownedQuantity.toFixed(8)} {selectedAsset?.ticker})
              </span>
            )}
          </label>
          <input
            type="number"
            id="quantity"
            step="0.00000001"
            value={formData.quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            placeholder="Ex: 10 ou 0.5"
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--color-input-bg)',
              border: `1px solid ${errors.quantity ? '#ef4444' : 'var(--color-border)'}`,
              borderRadius: 'var(--border-radius)',
              color: 'var(--color-text-primary)',
              fontSize: '14px'
            }}
            required
          />
          {errors.quantity && (
            <small
              style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}
            >
              {errors.quantity}
            </small>
          )}
        </div>

        {/* Prix unitaire */}
        <div>
          <label
            htmlFor="pricePerUnit"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-text-primary)'
            }}
          >
            Prix unitaire (€) *
          </label>
          <input
            type="number"
            id="pricePerUnit"
            step="0.01"
            value={formData.pricePerUnit}
            onChange={(e) => handlePriceChange(e.target.value)}
            placeholder="Ex: 195.50"
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--color-input-bg)',
              border: `1px solid ${errors.pricePerUnit ? '#f59e0b' : 'var(--color-border)'}`,
              borderRadius: 'var(--border-radius)',
              color: 'var(--color-text-primary)',
              fontSize: '14px'
            }}
            required
          />
          {errors.pricePerUnit && (
            <small
              style={{ color: '#f59e0b', fontSize: '12px', marginTop: '4px', display: 'block' }}
            >
              {errors.pricePerUnit}
            </small>
          )}
        </div>
      </div>

      {/* Sélecteur de pourcentage pour la vente (prend toute la largeur) */}
      {formData.type === 'SELL' && ownedQuantity > 0 && selectedAsset && (
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <SellPercentageSelector
            maxQuantity={ownedQuantity}
            currentQuantity={formData.quantity}
            onQuantityChange={handleQuantityChange}
            ticker={selectedAsset.ticker}
          />
        </div>
      )}

      {/* Ligne 4 : Frais | Total */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)'
        }}
      >
        {/* Frais */}
        <div>
          <label
            htmlFor="fee"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-text-primary)'
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

        {/* Total */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--color-text-primary)'
            }}
          >
            Total de la transaction
          </label>
          <div
            style={{
              padding: '12px',
              background:
                formData.type === 'BUY' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${formData.type === 'BUY' ? '#10b981' : '#ef4444'}`,
              borderRadius: 'var(--border-radius)',
              fontSize: '18px',
              fontWeight: '700',
              color: formData.type === 'BUY' ? '#10b981' : '#ef4444',
              textAlign: 'right'
            }}
          >
            {transactionTotal > 0 ? `${transactionTotal.toFixed(2)} €` : '—'}
          </div>
          <small style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>
            {formData.type === 'BUY' ? 'Montant à débourser' : 'Montant à recevoir'}
          </small>
        </div>
      </div>

      {/* Récapitulatif */}
      {transactionTotal > 0 && (
        <div
          style={{
            padding: 'var(--spacing-md)',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--spacing-md)',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}
        >
          <h4
            style={{
              margin: '0 0 var(--spacing-sm) 0',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--color-text-primary)'
            }}
          >
            📋 Récapitulatif
          </h4>
          <div style={{ display: 'grid', gap: 'var(--spacing-xs)', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Type :</span>
              <span
                style={{
                  fontWeight: '600',
                  color: formData.type === 'BUY' ? '#10b981' : '#ef4444'
                }}
              >
                {formData.type === 'BUY' ? '📈 Achat' : '📉 Vente'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Actif :</span>
              <span style={{ fontWeight: '600' }}>
                {selectedAsset ? `${selectedAsset.ticker} - ${selectedAsset.name}` : '—'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Quantité :</span>
              <span style={{ fontWeight: '600' }}>
                {formData.quantity || '—'} {selectedAsset?.ticker}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Prix unitaire :</span>
              <span style={{ fontWeight: '600' }}>
                {formData.pricePerUnit ? `${parseFloat(formData.pricePerUnit).toFixed(2)} €` : '—'}
              </span>
            </div>
            {parseFloat(formData.fee) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Frais :</span>
                <span style={{ fontWeight: '600' }}>{parseFloat(formData.fee).toFixed(2)} €</span>
              </div>
            )}
            <div
              style={{
                borderTop: '1px solid rgba(59, 130, 246, 0.3)',
                marginTop: 'var(--spacing-xs)',
                paddingTop: 'var(--spacing-xs)',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>Total :</span>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: formData.type === 'BUY' ? '#10b981' : '#ef4444'
                }}
              >
                {transactionTotal.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bouton Submit */}
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '14px',
          background: formData.type === 'BUY' ? '#10b981' : '#ef4444',
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
              ? '0 4px 12px rgba(16, 185, 129, 0.4)'
              : '0 4px 12px rgba(239, 68, 68, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {formData.type === 'BUY' ? "✓ Confirmer l'Achat" : '✓ Confirmer la Vente'}
      </button>
    </form>
  )
}

export default TransactionForm
