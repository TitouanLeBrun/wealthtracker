import { useState } from 'react'
import Modal from '../common/Modal'
import AssetSearchForm from '../forms/asset/AssetSearchForm'
import type { UnresolvedAsset, Category, Asset } from '@renderer/types'

interface UnresolvedAssetsModalProps {
  unresolvedAssets: UnresolvedAsset[]
  categories: Category[]
  existingAssets: Asset[]
  onResolve: (
    unresolvedAsset: UnresolvedAsset,
    assetData: {
      name: string
      ticker: string
      isin: string
      currentPrice: number
      categoryId: number
    }
  ) => Promise<void>
  onSkip: (unresolvedAsset: UnresolvedAsset) => void
  onClose: () => void
}

export default function UnresolvedAssetsModal({
  unresolvedAssets,
  categories,
  existingAssets,
  onResolve,
  onSkip,
  onClose
}: UnresolvedAssetsModalProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isResolving, setIsResolving] = useState(false)

  const currentAsset = unresolvedAssets[currentIndex]
  const progress = `${currentIndex + 1} / ${unresolvedAssets.length}`

  const handleResolve = async (assetData: {
    name: string
    ticker: string
    isin: string
    currentPrice: number
    categoryId: number
  }): Promise<void> => {
    setIsResolving(true)
    try {
      await onResolve(currentAsset, assetData)

      // Passer au suivant ou fermer si terminé
      if (currentIndex < unresolvedAssets.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        onClose()
      }
    } finally {
      setIsResolving(false)
    }
  }

  const handleSkip = (): void => {
    onSkip(currentAsset)

    // Passer au suivant ou fermer si terminé
    if (currentIndex < unresolvedAssets.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onClose()
    }
  }

  if (!currentAsset) {
    return <></>
  }
  return (
    <Modal isOpen={true} onClose={onClose} title={`🔍 Résolution d'actifs - ${progress}`}>
      <div className="space-y-6">
        {/* Informations sur l'actif non résolu */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-500 rounded-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Actif non trouvé automatiquement
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                {currentAsset.assetName}
              </p>
              {currentAsset.isin && (
                <p className="text-xs font-mono text-amber-600 dark:text-amber-400">
                  ISIN : {currentAsset.isin}
                </p>
              )}
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                {currentAsset.transactions.length} transaction(s) associée(s)
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire de recherche/création */}
        <AssetSearchForm
          categories={categories}
          existingAssets={existingAssets}
          onSubmit={handleResolve}
          onCancel={handleSkip}
          isLoading={isResolving}
        />

        {/* Barre de progression */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Progression : {progress}</span>
            <button
              type="button"
              onClick={handleSkip}
              disabled={isResolving}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              Passer cet actif →
            </button>
          </div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / unresolvedAssets.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
