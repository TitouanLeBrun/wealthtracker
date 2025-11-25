import { FormEvent } from 'react'

interface UseFormSubmitOptions {
  formData: {
    assetId: string
    type: 'BUY' | 'SELL'
    quantity: string
    pricePerUnit: string
    fee: string
    date: string
  }
  ownedQuantity: number
  onSubmit: (data: {
    assetId: number
    type: 'BUY' | 'SELL'
    quantity: number
    pricePerUnit: number
    fee: number
    date: Date
  }) => Promise<void>
  onError: (message: string) => void
  resetForm: () => void
  clearErrors: () => void
}

export function useFormSubmit({
  formData,
  ownedQuantity,
  onSubmit,
  onError,
  resetForm,
  clearErrors
}: UseFormSubmitOptions): { handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> } {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // Validation des champs obligatoires
    if (!formData.assetId || !formData.quantity || !formData.pricePerUnit || !formData.date) {
      onError('Veuillez remplir tous les champs obligatoires')
      return
    }

    const qty = parseFloat(formData.quantity)
    const price = parseFloat(formData.pricePerUnit)

    // Validation des valeurs numériques
    if (qty <= 0 || price <= 0) {
      onError('La quantité et le prix doivent être supérieurs à 0')
      return
    }

    // Validation de la quantité disponible pour les ventes
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
      resetForm()
      clearErrors()
    } catch (error) {
      console.error("Erreur lors de l'ajout de la transaction:", error)
      onError("Erreur lors de l'ajout de la transaction")
    }
  }

  return { handleSubmit }
}
