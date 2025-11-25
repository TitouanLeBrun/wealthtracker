import { useState } from 'react'

interface ValidationErrors {
  quantity?: string
  pricePerUnit?: string
}

interface UseFormValidationProps {
  type: 'BUY' | 'SELL'
  ownedQuantity: number
  averageBuyPrice: number
}

interface UseFormValidationReturn {
  errors: ValidationErrors
  validateQuantity: (quantity: string) => void
  validatePrice: (price: string) => void
  clearErrors: () => void
}

export function useFormValidation({
  type,
  ownedQuantity,
  averageBuyPrice
}: UseFormValidationProps): UseFormValidationReturn {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateQuantity = (quantity: string): void => {
    const qty = parseFloat(quantity)

    if (type === 'SELL' && qty > ownedQuantity) {
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

  const validatePrice = (price: string): void => {
    const priceNum = parseFloat(price)

    if (type === 'SELL' && priceNum < averageBuyPrice && averageBuyPrice > 0) {
      const loss = ((priceNum - averageBuyPrice) / averageBuyPrice) * 100
      setErrors((prev) => ({
        ...prev,
        pricePerUnit: `⚠️ Vente à perte : ${loss.toFixed(2)}% (PMA: ${averageBuyPrice.toFixed(2)} €)`
      }))
    } else {
      setErrors((prev) => ({ ...prev, pricePerUnit: undefined }))
    }
  }

  const clearErrors = (): void => {
    setErrors({})
  }

  return {
    errors,
    validateQuantity,
    validatePrice,
    clearErrors
  }
}
