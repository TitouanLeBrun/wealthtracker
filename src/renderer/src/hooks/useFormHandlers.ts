interface FormData {
  categoryId: string
  assetId: string
  type: 'BUY' | 'SELL'
  quantity: string
  pricePerUnit: string
  fee: string
  date: string
}

interface HandlersProps {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  allAssets: Array<{ id: number; categoryId: number; currentPrice: number }>
  clearErrors: () => void
  validateQuantity: (quantity: string) => void
  validatePrice: (price: string) => void
}

interface UseFormHandlersReturn {
  handleCategoryChange: (categoryId: string) => void
  handleAssetChange: (assetId: string) => void
  handleQuantityChange: (quantity: string) => void
  handlePriceChange: (price: string) => void
}

export function useFormHandlers({
  formData,
  setFormData,
  allAssets,
  clearErrors,
  validateQuantity,
  validatePrice
}: HandlersProps): UseFormHandlersReturn {
  const handleCategoryChange = (categoryId: string): void => {
    const categoryAssets = allAssets.filter((a) => a.categoryId === parseInt(categoryId))
    const firstAsset = categoryAssets[0]

    setFormData({
      ...formData,
      categoryId,
      assetId: firstAsset ? firstAsset.id.toString() : '',
      pricePerUnit: firstAsset ? firstAsset.currentPrice.toString() : ''
    })
    clearErrors()
  }

  const handleAssetChange = (assetId: string): void => {
    const selectedAsset = allAssets.find((a) => a.id === parseInt(assetId))
    setFormData({
      ...formData,
      assetId,
      pricePerUnit: selectedAsset ? selectedAsset.currentPrice.toString() : ''
    })
    clearErrors()
  }

  const handleQuantityChange = (quantity: string): void => {
    setFormData({ ...formData, quantity })
    validateQuantity(quantity)
  }

  const handlePriceChange = (price: string): void => {
    setFormData({ ...formData, pricePerUnit: price })
    validatePrice(price)
  }

  return {
    handleCategoryChange,
    handleAssetChange,
    handleQuantityChange,
    handlePriceChange
  }
}
