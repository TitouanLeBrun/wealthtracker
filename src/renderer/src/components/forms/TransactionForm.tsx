import { FormEvent, useState, useEffect, useMemo } from 'react'
import type { Asset, Category, Transaction } from '../../types'
import { calculateOwnedQuantity } from '../../utils/calculations/quantityUtils'
import CategoryAssetSelector from './CategoryAssetSelector'
import TransactionTypeSelector from './TransactionTypeSelector'
import QuantityPriceFields from './QuantityPriceFields'
import FeeTotalFields from './FeeTotalFields'
import SellPercentageSelector from './SellPercentageSelector'
import TransactionSummary from './TransactionSummary'

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

        // Pré-remplir si actif présélectionné
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

  // Filtrer les actifs par catégorie (avec positions pour vente)
  const filteredAssets = useMemo(() => {
    if (!formData.categoryId) return []
    const categoryAssets = allAssets.filter((a) => a.categoryId === parseInt(formData.categoryId))

    if (formData.type === 'SELL') {
      return categoryAssets.filter((asset) => {
        const assetTransactions = transactions.filter((t) => t.assetId === asset.id)
        const owned = calculateOwnedQuantity(assetTransactions)
        return owned > 0
      })
    }

    return categoryAssets
  }, [allAssets, formData.categoryId, formData.type, transactions])

  // Calculer la quantité possédée
  const ownedQuantity = useMemo(() => {
    if (!formData.assetId) return 0
    const assetTransactions = transactions.filter((t) => t.assetId === parseInt(formData.assetId))
    return calculateOwnedQuantity(assetTransactions)
  }, [formData.assetId, transactions])

  // Calculer le Prix Moyen d'Achat
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

  // Gérer le changement de quantité
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

  // Gérer le changement de prix
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

  // Calculer le total
  const transactionTotal = useMemo(() => {
    if (!formData.quantity || !formData.pricePerUnit) return 0
    const qty = parseFloat(formData.quantity)
    const price = parseFloat(formData.pricePerUnit)
    const fee = parseFloat(formData.fee) || 0
    return formData.type === 'BUY' ? qty * price + fee : qty * price - fee
  }, [formData.quantity, formData.pricePerUnit, formData.fee, formData.type])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

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
  const canSell = ownedQuantity > 0

  return (
    <form onSubmit={handleSubmit}>
      {/* Catégorie | Actif */}
      <CategoryAssetSelector
        categories={categories}
        assets={filteredAssets}
        selectedCategoryId={formData.categoryId}
        selectedAssetId={formData.assetId}
        onCategoryChange={handleCategoryChange}
        onAssetChange={handleAssetChange}
        isCategoryLocked={isCategoryLocked}
        isAssetLocked={isAssetLocked}
      />

      {/* Type | Date */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)'
        }}
      >
        <TransactionTypeSelector
          type={formData.type}
          onChange={(type) => setFormData({ ...formData, type })}
          isLocked={isTypeLocked}
          canSell={canSell}
        />

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

      {/* Quantité | Prix */}
      <QuantityPriceFields
        quantity={formData.quantity}
        pricePerUnit={formData.pricePerUnit}
        onQuantityChange={handleQuantityChange}
        onPriceChange={handlePriceChange}
        type={formData.type}
        ownedQuantity={ownedQuantity}
        selectedAsset={selectedAsset}
        quantityError={errors.quantity}
        priceError={errors.pricePerUnit}
      />

      {/* Sélecteur % Vente */}
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

      {/* Frais | Total */}
      <FeeTotalFields
        fee={formData.fee}
        onFeeChange={(fee) => setFormData({ ...formData, fee })}
        total={transactionTotal}
        type={formData.type}
      />

      {/* Récapitulatif */}
      <TransactionSummary
        type={formData.type}
        selectedAsset={selectedAsset}
        quantity={formData.quantity}
        pricePerUnit={formData.pricePerUnit}
        fee={formData.fee}
        total={transactionTotal}
      />

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
