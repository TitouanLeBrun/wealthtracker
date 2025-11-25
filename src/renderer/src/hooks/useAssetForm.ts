import { useState, useEffect, FormEvent } from 'react'
import type { AssetFormData, Category, Asset } from '../types'

interface UseAssetFormProps {
  initialCategoryId?: number
  onSubmit: (data: AssetFormData) => Promise<void>
  onError: (message: string) => void
}

interface UseAssetFormReturn {
  categories: Category[]
  allAssets: Asset[]
  formData: AssetFormData
  setFormData: React.Dispatch<React.SetStateAction<AssetFormData>>
  tickerExists: boolean
  checkTickerExists: (ticker: string) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
}

export function useAssetForm({
  initialCategoryId,
  onSubmit,
  onError
}: UseAssetFormProps): UseAssetFormReturn {
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
    const loadData = async (): Promise<void> => {
      try {
        const [categoriesData, assetsData] = await Promise.all([
          window.api.getAllCategories(),
          window.api.getAllAssets()
        ])
        setCategories(categoriesData)
        setAllAssets(assetsData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        onError('Erreur lors du chargement des données')
      }
    }
    loadData()
  }, [onError])

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

  const validateForm = (): boolean => {
    if (!formData.name.trim() || !formData.ticker.trim()) {
      onError('Veuillez remplir le nom et le ticker')
      return false
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      onError('Veuillez sélectionner une catégorie')
      return false
    }

    if (formData.currentPrice < 0) {
      onError('Le prix ne peut pas être négatif')
      return false
    }

    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) return

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
      setTickerExists(false)
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

  return {
    categories,
    allAssets,
    formData,
    setFormData,
    tickerExists,
    checkTickerExists,
    handleSubmit
  }
}
