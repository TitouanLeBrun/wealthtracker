import { useState } from 'react'
import { TrendingUp, Edit2, Check, X } from 'lucide-react'
import type { Asset } from '../types'

interface PriceTickerProps {
  assets: Asset[]
  onPriceUpdate: (assetId: number, newPrice: number) => Promise<void>
}

function PriceTicker({ assets, onPriceUpdate }: PriceTickerProps): React.JSX.Element {
  const [editingAssetId, setEditingAssetId] = useState<number | null>(null)
  const [newPrice, setNewPrice] = useState<string>('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStartEdit = (asset: Asset): void => {
    setEditingAssetId(asset.id)
    setNewPrice(asset.currentPrice.toString())
  }

  const handleCancelEdit = (): void => {
    setEditingAssetId(null)
    setNewPrice('')
  }

  const handleSavePrice = async (assetId: number): Promise<void> => {
    const price = parseFloat(newPrice)
    if (isNaN(price) || price < 0) return

    setIsUpdating(true)
    try {
      await onPriceUpdate(assetId, price)
      setEditingAssetId(null)
      setNewPrice('')
    } catch (error) {
      console.error('Erreur lors de la mise à jour du prix:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (assets.length === 0) {
    return (
      <div
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-lg)'
        }}
      >
        <p style={{ color: 'white', textAlign: 'center', margin: 0, fontSize: '14px' }}>
          📊 Aucun actif à afficher. Créez vos premiers actifs dans Configuration.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: 'var(--spacing-md)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-sm)'
        }}
      >
        <TrendingUp size={20} color="#4CAF50" />
        <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>Prix du Marché</span>
        <span
          style={{
            marginLeft: 'auto',
            color: '#888',
            fontSize: '12px',
            fontStyle: 'italic'
          }}
        >
          Cliquez pour modifier
        </span>
      </div>

      <div
        className="price-ticker-scroll"
        style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          overflowX: 'auto',
          paddingBottom: 'var(--spacing-sm)',
          scrollbarWidth: 'thin',
          scrollbarColor: '#444 transparent'
        }}
      >
        {assets.map((asset) => (
          <div
            key={asset.id}
            style={{
              minWidth: '200px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-md)',
              cursor: editingAssetId === asset.id ? 'default' : 'pointer',
              transition: 'all var(--transition-base)',
              position: 'relative'
            }}
            onClick={() => editingAssetId !== asset.id && handleStartEdit(asset)}
            onMouseEnter={(e) => {
              if (editingAssetId !== asset.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
              }
            }}
            onMouseLeave={(e) => {
              if (editingAssetId !== asset.id) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            {/* Badge Catégorie */}
            {asset.category && (
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  padding: '2px 6px',
                  backgroundColor: asset.category.color,
                  borderRadius: 'var(--radius-full)',
                  fontSize: '10px',
                  fontWeight: '600',
                  color: 'white',
                  opacity: 0.9
                }}
              >
                {asset.category.name}
              </div>
            )}

            {/* Ticker */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                marginBottom: 'var(--spacing-xs)'
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white',
                  letterSpacing: '0.5px'
                }}
              >
                {asset.ticker}
              </span>
              {editingAssetId !== asset.id && (
                <Edit2 size={14} color="#888" style={{ marginLeft: 'auto' }} />
              )}
            </div>

            {/* Nom */}
            <div
              style={{
                fontSize: '12px',
                color: '#aaa',
                marginBottom: 'var(--spacing-sm)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {asset.name}
            </div>

            {/* Prix - Mode Édition */}
            {editingAssetId === asset.id ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <input
                  type="number"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSavePrice(asset.id)
                    if (e.key === 'Escape') handleCancelEdit()
                  }}
                  autoFocus
                  disabled={isUpdating}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid var(--color-primary)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSavePrice(asset.id)
                  }}
                  disabled={isUpdating}
                  style={{
                    padding: '6px',
                    backgroundColor: 'var(--color-success)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Check size={16} color="white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancelEdit()
                  }}
                  disabled={isUpdating}
                  style={{
                    padding: '6px',
                    backgroundColor: 'var(--color-danger)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={16} color="white" />
                </button>
              </div>
            ) : (
              /* Prix - Mode Affichage */
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#4CAF50',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px'
                }}
              >
                {asset.currentPrice.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
                <span style={{ fontSize: '14px', color: '#888' }}>€</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .price-ticker-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .price-ticker-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .price-ticker-scroll::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 3px;
        }
        .price-ticker-scroll::-webkit-scrollbar-thumb:hover {
          background: #666;
        }
      `}</style>
    </div>
  )
}

export default PriceTicker
