import type { AssetFormData } from '../../../types'
import { useAssetForm } from '../../../hooks/useAssetForm'
import AssetNameField from './AssetNameField'
import AssetTickerField from './AssetTickerField'
import AssetPriceField from './AssetPriceField'
import AssetCategorySelector from './AssetCategorySelector'
import TickerExistsAlert from './TickerExistsAlert'
import NoCategoriesWarning from './NoCategoriesWarning'
import AssetSubmitButton from './AssetSubmitButton'

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
  const { categories, formData, setFormData, tickerExists, checkTickerExists, handleSubmit } =
    useAssetForm({
      initialCategoryId,
      onSubmit,
      onError
    })

  if (categories.length === 0) {
    return <NoCategoriesWarning />
  }

  return (
    <div>
      {/* Message d'alerte si le ticker existe déjà */}
      {tickerExists && <TickerExistsAlert ticker={formData.ticker} />}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Nom de l'actif */}
          <AssetNameField
            value={formData.name}
            onChange={(name) => setFormData({ ...formData, name })}
          />

          {/* Ticker */}
          <AssetTickerField
            value={formData.ticker}
            onChange={(ticker) => setFormData({ ...formData, ticker })}
            onCheckExists={checkTickerExists}
            hasError={tickerExists}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Prix actuel */}
            <AssetPriceField
              value={formData.currentPrice}
              onChange={(currentPrice) => setFormData({ ...formData, currentPrice })}
            />

            {/* Catégorie */}
            <AssetCategorySelector
              value={formData.categoryId}
              onChange={(categoryId) => setFormData({ ...formData, categoryId })}
              categories={categories}
              isLocked={lockCategory}
            />
          </div>
        </div>

        {/* Bouton Submit */}
        <AssetSubmitButton disabled={tickerExists} />
      </form>
    </div>
  )
}

export default AssetForm
