import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import type { Category, YahooAssetSearchResult } from '@renderer/types'

interface AssetSearchFormProps {
  categories: Category[]
  onSubmit: (data: {
    name: string
    ticker: string
    isin: string
    currentPrice: number
    categoryId: number
  }) => void
  onCancel: () => void
  isLoading?: boolean
}

// Mapping Yahoo quoteType → Nom de catégorie
function mapQuoteTypeToCategory(quoteType: string): string {
  const mapping: Record<string, string> = {
    ETF: 'ETF',
    EQUITY: 'Actions',
    CRYPTOCURRENCY: 'Crypto',
    MUTUALFUND: 'Fonds',
    INDEX: 'Indices',
    CURRENCY: 'Devises'
  }
  return mapping[quoteType] || 'Autres'
}

export default function AssetSearchForm({
  categories,
  onSubmit,
  onCancel,
  isLoading = false
}: AssetSearchFormProps): React.ReactElement {
  // États du formulaire
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<YahooAssetSearchResult | null>(null)
  const [manualMode, setManualMode] = useState(false)

  // États pour mode manuel
  const [manualName, setManualName] = useState('')
  const [manualTicker, setManualTicker] = useState('')
  const [manualIsin, setManualIsin] = useState('')
  const [manualPrice, setManualPrice] = useState('')
  const [manualCategoryId, setManualCategoryId] = useState<number>(categories[0]?.id || 0)

  // Debounce pour la recherche automatique
  useEffect(() => {
    if (!searchQuery.trim() || manualMode) {
      setSearchResult(null)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      try {
        const result = await window.api.searchAsset(searchQuery.trim())

        if (result) {
          setSearchResult(result)
          // Feedback positif
          toast.success(`Actif trouvé : ${result.name}`)
        } else {
          setSearchResult(null)
          // Proposition de mode manuel
          toast.error("Aucun résultat trouvé. Utilisez le mode manuel pour créer l'actif.", {
            duration: 4000
          })
        }
      } catch (error) {
        console.error('Erreur recherche actif:', error)
        toast.error('Erreur lors de la recherche. Vérifiez votre connexion.')
        setSearchResult(null)
      } finally {
        setIsSearching(false)
      }
    }, 500) // Debounce 500ms

    return () => clearTimeout(timeoutId)
  }, [searchQuery, manualMode])

  // Handler : Utiliser le résultat trouvé
  const handleUseResult = async (): Promise<void> => {
    if (!searchResult) return

    try {
      // Créer/récupérer la catégorie automatiquement
      const categoryName = mapQuoteTypeToCategory(searchResult.quoteType)

      let category: Category | undefined = categories.find((c) => c.name === categoryName)

      if (!category) {
        // Créer la catégorie si elle n'existe pas
        category = await window.api.getOrCreateCategory(categoryName)
        toast.success(`Catégorie "${categoryName}" créée automatiquement`)
      }

      // Soumettre avec les données du résultat
      onSubmit({
        name: searchResult.name,
        ticker: searchResult.symbol,
        isin: searchResult.isin || '',
        currentPrice: searchResult.price || 0,
        categoryId: category.id
      })
    } catch (error) {
      console.error('Erreur création actif:', error)
      toast.error("Erreur lors de la création de l'actif")
    }
  }

  // Handler : Passer en mode manuel
  const handleSwitchToManual = (): void => {
    setManualMode(true)
    setSearchResult(null)

    // Pré-remplir avec les données de recherche si disponibles
    if (searchResult) {
      setManualName(searchResult.name)
      setManualTicker(searchResult.symbol)
      setManualPrice(searchResult.price?.toString() || '')
      
      // Si la recherche était un ISIN (différent du symbol), le pré-remplir
      const searchQueryUpper = searchQuery.trim().toUpperCase()
      if (searchResult.isin) {
        setManualIsin(searchResult.isin)
      } else if (searchQueryUpper !== searchResult.symbol.toUpperCase() && searchQueryUpper.length >= 12) {
        // Si l'utilisateur a cherché avec un ISIN mais Yahoo n'en a pas retourné, garder la recherche
        setManualIsin(searchQueryUpper)
      } else {
        setManualIsin('')
      }
    }
  }

  // Handler : Soumettre en mode manuel
  const handleManualSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    // Validation
    if (!manualName.trim()) {
      toast.error('Le nom est requis')
      return
    }
    if (!manualTicker.trim()) {
      toast.error('Le ticker est requis')
      return
    }
    if (!manualPrice || isNaN(Number(manualPrice)) || Number(manualPrice) <= 0) {
      toast.error('Le prix doit être un nombre positif')
      return
    }
    if (!manualCategoryId) {
      toast.error('Veuillez sélectionner une catégorie')
      return
    }

    onSubmit({
      name: manualName.trim(),
      ticker: manualTicker.trim(),
      isin: manualIsin.trim(),
      currentPrice: Number(manualPrice),
      categoryId: manualCategoryId
    })
  }

  return (
    <div className="space-y-6">
      {/* TITRE */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {manualMode ? "Création manuelle d'actif" : 'Rechercher un actif'}
        </h3>
        {manualMode && (
          <button
            type="button"
            onClick={() => {
              setManualMode(false)
              setSearchQuery('')
            }}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700
                     bg-white  hover:bg-gray-50
                     border border-gray-200 
                     rounded-lg transition-colors shadow-sm"
          >
            ← Retour à la recherche
          </button>
        )}
      </div>

      {/* MODE RECHERCHE AUTOMATIQUE */}
      {!manualMode && (
        <div className="space-y-4">
          {/* Champ de recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Code ISIN ou Ticker
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex: FR0000120271 (TotalEnergies) ou AAPL (Apple)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white text-gray-900
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-400"
                disabled={isSearching}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Saisissez un code ISIN ou un ticker, la recherche est automatique
            </p>
          </div>

          {/* Résultat trouvé */}
          {searchResult && !isSearching && (
            <div
              className="animate-fadeIn bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 
                          border-2 border-green-300 dark:border-green-700 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {searchResult.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {searchResult.symbol} • {searchResult.exchange}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                  <p className="text-xs text-blue-800 dark:text-blue-400 mb-1 font-medium">Catégorie</p>
                  <p className="font-semibold text-blue-400">
                    {searchResult.quoteType}
                  </p>
                </div>
                <div className="bg-white border border-emerald-200 dark:border-emerald-700 rounded-lg p-3">
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 mb-1 font-medium">Prix actuel</p>
                  <p className="font-semibold text-emerald-400">
                    {searchResult.price?.toFixed(2) || 'N/A'} {searchResult.currency || 'EUR'}
                  </p>
                </div>
                {searchResult.isin && (
                  <div className="col-span-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-lg p-3">
                    <p className="text-xs text-purple-600 dark:text-purple-400 mb-1 font-medium">Code ISIN</p>
                    <p className="font-mono text-sm font-semibold text-purple-900 dark:text-purple-100">
                      {searchResult.isin}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleUseResult}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 
                           rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Création...
                    </span>
                  ) : (
                    '✓ Utiliser cet actif'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleSwitchToManual}
                  className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-300
                           text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  ✏️ Modifier manuellement
                </button>
              </div>
            </div>
          )}

          {/* Aucun résultat */}
          {!searchResult && !isSearching && searchQuery.trim() && (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Aucun actif trouvé pour "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={handleSwitchToManual}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Créer manuellement
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE MANUEL */}
      {manualMode && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          {/* Grid 2 colonnes pour les champs */}
          <div className="grid grid-cols-2 gap-4">
            {/* Nom - occupe 2 colonnes */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom de l'actif *
              </label>
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Ex: Apple Inc."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       bg-white text-gray-900
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Ticker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ticker *
              </label>
              <input
                type="text"
                value={manualTicker}
                onChange={(e) => setManualTicker(e.target.value.toUpperCase())}
                placeholder="Ex: AAPL"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       bg-white text-gray-900
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* ISIN (optionnel) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Code ISIN (optionnel)
              </label>
              <input
                type="text"
                value={manualIsin}
                onChange={(e) => setManualIsin(e.target.value.toUpperCase())}
                placeholder="Ex: US0378331005"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       bg-white text-gray-900
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prix actuel (€) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                placeholder="Ex: 150.50"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       bg-white text-gray-900
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie *
              </label>
              <select
                value={manualCategoryId}
                onChange={(e) => setManualCategoryId(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       bg-white text-gray-900
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Boutons - Annuler à gauche, Créer à droite */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-300
                       text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 
                       rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création...' : "Créer l'actif"}
            </button>
          </div>
        </form>
      )}

      {/* Bouton annuler en mode recherche */}
      {!manualMode && (
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white hover:bg-gray-50 border-2 border-gray-300
                     text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  )
}
