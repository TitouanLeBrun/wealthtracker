import { useTransactionForm } from '../../../hooks/useTransactionForm'
import { useFormValidation } from '../../../hooks/useFormValidation'
import { useFormHandlers } from '../../../hooks/useFormHandlers'
import { useFormSubmit } from '../../../hooks/useFormSubmit'
import CategoryAssetSelector from './CategoryAssetSelector'
import TransactionTypeSelector from './TransactionTypeSelector'
import QuantityPriceFields from './QuantityPriceFields'
import FeeTotalFields from './FeeTotalFields'
import SellPercentageSelector from './SellPercentageSelector'
import TransactionSummary from './TransactionSummary'
import DateField from './DateField'
import SubmitButton from './SubmitButton'

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
  // Hook personnalisé pour gérer l'état du formulaire
  const {
    categories,
    allAssets,
    formData,
    setFormData,
    loading,
    filteredAssets,
    ownedQuantity,
    averageBuyPrice,
    transactionTotal,
    selectedAsset,
    resetForm
  } = useTransactionForm({ preselectedCategoryId, preselectedAssetId, preselectedType, onError })

  // Hook personnalisé pour la validation
  const { errors, validateQuantity, validatePrice, clearErrors } = useFormValidation({
    type: formData.type,
    ownedQuantity,
    averageBuyPrice
  })

  // Hook personnalisé pour les handlers
  const { handleCategoryChange, handleAssetChange, handleQuantityChange, handlePriceChange } =
    useFormHandlers({
      formData,
      setFormData,
      allAssets,
      clearErrors,
      validateQuantity,
      validatePrice
    })

  // Hook personnalisé pour la soumission
  const { handleSubmit } = useFormSubmit({
    formData,
    ownedQuantity,
    onSubmit,
    onError,
    resetForm,
    clearErrors
  })

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

  const isCategoryLocked = preselectedCategoryId !== undefined
  const isAssetLocked = preselectedAssetId !== undefined
  const isTypeLocked = preselectedType !== undefined
  const canSell = ownedQuantity > 0

  // Trouver la catégorie sélectionnée pour obtenir sa couleur
  const selectedCategory = categories.find((c) => c.id === Number(formData.categoryId))
  const categoryColor = selectedCategory?.color || '#3b82f6'

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
          categoryColor={categoryColor}
        />

        <DateField value={formData.date} onChange={(date) => setFormData({ ...formData, date })} />
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
        categoryColor={categoryColor}
      />

      {/* Bouton Submit */}
      <SubmitButton type={formData.type} categoryColor={categoryColor} />
    </form>
  )
}

export default TransactionForm
