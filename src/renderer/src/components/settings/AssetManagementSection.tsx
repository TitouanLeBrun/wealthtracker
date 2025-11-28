import { useState, useMemo } from 'react'
import { Edit2, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Asset, Category, YahooAssetSearchResult } from '../../types'

interface AssetManagementSectionProps {
  assets: Asset[]
  categories: Category[]
  onAssetUpdated: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

interface GroupedAssets {
  [categoryId: number]: Asset[]
}

export function AssetManagementSection({
  assets,
  categories,
  onAssetUpdated,
  onSuccess,
  onError
}: AssetManagementSectionProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<YahooAssetSearchResult | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number>(0)
  const [draggedAsset, setDraggedAsset] = useState<Asset | null>(null)

  // Grouper les actifs par catégorie
  const groupedAssets = useMemo(() => {
    const grouped: GroupedAssets = {}

    assets.forEach((asset) => {
      if (!grouped[asset.categoryId]) {
        grouped[asset.categoryId] = []
      }
      grouped[asset.categoryId].push(asset)
    })

    // Trier les actifs par nom dans chaque catégorie
    Object.keys(grouped).forEach((categoryId) => {
      grouped[Number(categoryId)].sort((a, b) => a.name.localeCompare(b.name))
    })

    return grouped
  }, [assets])

  // Rechercher un actif via Yahoo
  const handleSearch = async (): Promise<void> => {
    if (!searchQuery.trim()) {
      toast.error('Veuillez entrer un ticker ou ISIN')
      return
    }

    setIsSearching(true)
    setSearchResult(null)

    try {
      const result = await window.api.searchAsset(searchQuery.trim())

      if (!result) {
        toast.error(`Aucun résultat trouvé pour "${searchQuery}"`)
        setIsSearching(false)
        return
      }

      setSearchResult(result)
      toast.success(`Actif trouvé : ${result.name}`)
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      toast.error('Erreur lors de la recherche')
    } finally {
      setIsSearching(false)
    }
  }

  // Appliquer les modifications
  const handleApplyChanges = async (): Promise<void> => {
    if (!editingAsset || !searchResult) return

    try {
      await window.api.updateAsset({
        id: editingAsset.id,
        name: searchResult.name,
        ticker: searchResult.symbol,
        isin: searchResult.isin || editingAsset.isin,
        currentPrice: searchResult.price || editingAsset.currentPrice,
        categoryId: selectedCategory || editingAsset.categoryId
      })

      onSuccess(`Actif "${searchResult.symbol}" mis à jour avec succès !`)
      setEditingAsset(null)
      setSearchQuery('')
      setSearchResult(null)
      setSelectedCategory(0)
      onAssetUpdated()
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      onError("Erreur lors de la mise à jour de l'actif")
    }
  }

  // Ouvrir le modal d'édition
  const handleEditClick = (asset: Asset): void => {
    setEditingAsset(asset)
    setSearchQuery(asset.ticker || '')
    setSelectedCategory(asset.categoryId)
    setSearchResult(null)
  }

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, asset: Asset): void => {
    e.stopPropagation()
    setDraggedAsset(asset)
  }

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent, targetCategoryId: number): Promise<void> => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedAsset || draggedAsset.categoryId === targetCategoryId) {
      setDraggedAsset(null)
      return
    }

    try {
      await window.api.updateAsset({ id: draggedAsset.id, categoryId: targetCategoryId })
      onSuccess('Catégorie mise à jour avec succès !')
      onAssetUpdated()
    } catch (error) {
      console.error('Erreur lors du changement de catégorie:', error)
      onError('Erreur lors du changement de catégorie')
    } finally {
      setDraggedAsset(null)
    }
  }

  return (
    <div
      style={{
        background: 'var(--color-card-bg)',
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        marginTop: '60px'
      }}
      onDragOver={handleDragOver}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setDraggedAsset(null)
      }}
    >
      {/* En-tête Accordion */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: 'var(--spacing-lg)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <Edit2 size={20} color="#f59e0b" />
          <div style={{ textAlign: 'left' }}>
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--color-text-primary)'
              }}
            >
              🔧 Gestion des Actifs ({assets.length})
            </h3>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '13px',
                color: 'var(--color-text-secondary)'
              }}
            >
              Modifier ticker, ISIN ou catégorie • Glisser-déposer pour réorganiser
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Contenu Accordion */}
      {isOpen && (
        <div
          style={{
            padding: '0 var(--spacing-lg) var(--spacing-lg) var(--spacing-lg)',
            borderTop: '1px solid var(--color-border)'
          }}
        >
          {categories.length === 0 ? (
            <p
              style={{
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                padding: 'var(--spacing-xl)'
              }}
            >
              Aucune catégorie disponible
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, category.id)}
                  style={{
                    marginTop: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${draggedAsset && draggedAsset.categoryId !== category.id ? category.color : 'var(--color-border)'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* En-tête de catégorie */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      marginBottom: 'var(--spacing-md)'
                    }}
                  >
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: category.color
                      }}
                    />
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '15px',
                        fontWeight: '600',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      {category.name}
                    </h4>
                    <span
                      style={{
                        padding: '2px 8px',
                        background: category.color,
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                    >
                      {groupedAssets[category.id]?.length || 0}
                    </span>
                  </div>

                  {/* Liste des actifs */}
                  {groupedAssets[category.id] && groupedAssets[category.id].length > 0 ? (
                    <div
                      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}
                    >
                      {groupedAssets[category.id].map((asset) => (
                        <div
                          key={asset.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, asset)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)',
                            cursor: 'grab',
                            transition: 'all 0.2s ease',
                            opacity: draggedAsset?.id === asset.id ? 0.5 : 1
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                            e.currentTarget.style.transform = 'translateX(4px)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                            e.currentTarget.style.transform = 'translateX(0)'
                          }}
                        >
                          {/* Info actif */}
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                marginBottom: '4px'
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '16px',
                                  fontWeight: '700',
                                  color: 'var(--color-primary)'
                                }}
                              >
                                {asset.ticker}
                              </span>
                              <span
                                style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}
                              >
                                {asset.name}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                              {asset.isin && `ISIN: ${asset.isin} • `}
                              Prix: {asset.currentPrice.toFixed(2)} €
                            </div>
                          </div>

                          {/* Bouton éditer */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditClick(asset)
                            }}
                            style={{
                              padding: '6px 12px',
                              background: '#f59e0b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#d97706'
                              e.currentTarget.style.transform = 'scale(1.05)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#f59e0b'
                              e.currentTarget.style.transform = 'scale(1)'
                            }}
                          >
                            <Edit2 size={14} />
                            Éditer
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      style={{
                        textAlign: 'center',
                        color: 'var(--color-text-secondary)',
                        fontSize: '13px',
                        padding: 'var(--spacing-md)',
                        fontStyle: 'italic'
                      }}
                    >
                      Aucun actif dans cette catégorie
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal d'édition */}
      {editingAsset && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => {
            setEditingAsset(null)
            setSearchQuery('')
            setSearchResult(null)
            setSelectedCategory(0)
          }}
        >
          <div
            className="animate-slideUp"
            style={{
              maxWidth: '600px',
              width: '100%',
              background: 'white',
              borderRadius: 'var(--border-radius)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête modal */}
            <div
              style={{
                padding: 'var(--spacing-lg)',
                borderBottom: '1px solid #e5e7eb',
                background:
                  'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: '#f59e0b',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Edit2 size={20} color="white" />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1f2937'
                    }}
                  >
                    Modifier l&apos;actif
                  </h3>
                  <p
                    style={{
                      margin: '2px 0 0 0',
                      fontSize: '13px',
                      color: '#6b7280'
                    }}
                  >
                    Rechercher de nouvelles données via Yahoo Finance
                  </p>
                </div>
              </div>
            </div>

            {/* Contenu modal */}
            <div style={{ padding: 'var(--spacing-lg)' }}>
              {/* Actif actuel */}
              <div
                style={{
                  padding: 'var(--spacing-md)',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--spacing-lg)'
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#3b82f6',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}
                >
                  📊 Actif actuel
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: '8px'
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#1f2937'
                    }}
                  >
                    {editingAsset.ticker}
                  </span>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>{editingAsset.name}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {editingAsset.isin && `ISIN: ${editingAsset.isin} • `}
                  Prix: {editingAsset.currentPrice.toFixed(2)} €
                </div>
              </div>

              {/* Champ de recherche */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: 'var(--spacing-sm)'
                  }}
                >
                  🔍 Nouveau Ticker ou ISIN
                </label>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                    placeholder="Ex: AAPL, CW8.PA, FR0013412020"
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      background: '#f9fafb',
                      border: '1px solid #d1d5db',
                      borderRadius: 'var(--radius-md)',
                      color: '#1f2937',
                      fontSize: '14px'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch()
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    style={{
                      padding: '10px 20px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      opacity: isSearching || !searchQuery.trim() ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isSearching && searchQuery.trim()) {
                        e.currentTarget.style.background = '#2563eb'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#3b82f6'
                    }}
                  >
                    {isSearching ? '⏳ Recherche...' : 'Rechercher'}
                  </button>
                </div>
                <p
                  style={{
                    margin: '8px 0 0 0',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}
                >
                  💡 Entrez un ticker Yahoo Finance ou un code ISIN
                </p>
              </div>

              {/* Résultat de recherche */}
              {searchResult && (
                <div
                  className="animate-fadeIn"
                  style={{
                    padding: 'var(--spacing-md)',
                    background:
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                    border: '2px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--spacing-lg)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      marginBottom: 'var(--spacing-md)'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        background: '#10b981',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>✓</span>
                    </div>
                    <div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#1f2937'
                        }}
                      >
                        {searchResult.name}
                      </h4>
                      <p
                        style={{
                          margin: '2px 0 0 0',
                          fontSize: '12px',
                          color: '#6b7280'
                        }}
                      >
                        {searchResult.symbol} • {searchResult.exchange}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 'var(--spacing-sm)',
                      marginBottom: 'var(--spacing-md)'
                    }}
                  >
                    <div
                      style={{
                        padding: 'var(--spacing-sm)',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '11px',
                          color: '#3b82f6',
                          marginBottom: '4px',
                          fontWeight: '600'
                        }}
                      >
                        Type
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#1f2937'
                        }}
                      >
                        {searchResult.quoteType}
                      </p>
                    </div>
                    <div
                      style={{
                        padding: 'var(--spacing-sm)',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '11px',
                          color: '#10b981',
                          marginBottom: '4px',
                          fontWeight: '600'
                        }}
                      >
                        Prix actuel
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#1f2937'
                        }}
                      >
                        {searchResult.price?.toFixed(2) || 'N/A'} {searchResult.currency || 'EUR'}
                      </p>
                    </div>
                  </div>

                  {searchResult.isin && (
                    <div
                      style={{
                        padding: 'var(--spacing-sm)',
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: 'var(--spacing-md)'
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '11px',
                          color: '#8b5cf6',
                          marginBottom: '4px',
                          fontWeight: '600'
                        }}
                      >
                        Code ISIN
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          fontWeight: '700',
                          fontFamily: 'monospace',
                          color: '#1f2937'
                        }}
                      >
                        {searchResult.isin}
                      </p>
                    </div>
                  )}

                  {/* Sélecteur de catégorie */}
                  <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: 'var(--spacing-sm)'
                      }}
                    >
                      📁 Catégorie
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#f9fafb',
                        border: '1px solid #d1d5db',
                        borderRadius: 'var(--radius-md)',
                        color: '#1f2937',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-sm)',
                  justifyContent: 'flex-end'
                }}
              >
                <button
                  onClick={() => {
                    setEditingAsset(null)
                    setSearchQuery('')
                    setSearchResult(null)
                    setSelectedCategory(0)
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: 'var(--radius-md)',
                    color: '#374151',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e5e7eb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f3f4f6'
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleApplyChanges}
                  disabled={!searchResult}
                  style={{
                    padding: '10px 24px',
                    background: searchResult ? '#10b981' : 'rgba(16, 185, 129, 0.3)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: searchResult ? 'pointer' : 'not-allowed',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    opacity: searchResult ? 1 : 0.5
                  }}
                  onMouseEnter={(e) => {
                    if (searchResult) {
                      e.currentTarget.style.background = '#059669'
                      e.currentTarget.style.transform = 'scale(1.02)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (searchResult) {
                      e.currentTarget.style.background = '#10b981'
                      e.currentTarget.style.transform = 'scale(1)'
                    }
                  }}
                >
                  ✓ Appliquer les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
