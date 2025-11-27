import { useState, useRef, useEffect } from 'react'
import { X, Upload, FileText, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import type { ImportResult, UnresolvedAsset, Category, Asset } from '../../types'
import UnresolvedAssetsModal from '../import/UnresolvedAssetsModal'

interface ImportTransactionsModalProps {
  onClose: () => void
  onImportSuccess: () => void
}

function ImportTransactionsModal({
  onClose,
  onImportSuccess
}: ImportTransactionsModalProps): React.JSX.Element {
  const [source, setSource] = useState<'TradeRepublic' | 'Kraken' | 'Other'>('TradeRepublic')
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload')
  const [unresolvedAssets, setUnresolvedAssets] = useState<UnresolvedAsset[]>([])
  const [showUnresolvedModal, setShowUnresolvedModal] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Charger les catégories et actifs au montage
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const [loadedCategories, loadedAssets] = await Promise.all([
          window.api.getAllCategories(),
          window.api.getAllAssets()
        ])
        setCategories(loadedCategories)
        setAssets(loadedAssets)
      } catch (error) {
        console.error('Erreur chargement données:', error)
      }
    }
    loadData()
  }, [])

  const handleFileSelect = (selectedFile: File): void => {
    const extension = selectedFile.name.split('.').pop()?.toLowerCase()

    if (!extension || !['csv', 'xlsx'].includes(extension)) {
      alert('Format de fichier non supporté. Veuillez sélectionner un fichier CSV ou XLSX.')
      return
    }

    setFile(selectedFile)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleImport = async (): Promise<void> => {
    if (!file) return

    setIsProcessing(true)

    try {
      const fileContent = await file.text()

      const importResult = await window.api.importTransactions({
        fileContent,
        source
      })

      setResult(importResult)

      // Si des actifs n'ont pas pu être résolus, afficher le modal
      if (importResult.unresolvedAssets && importResult.unresolvedAssets.length > 0) {
        setUnresolvedAssets(importResult.unresolvedAssets)
        setShowUnresolvedModal(true)
      } else {
        setStep('result')
        if (importResult.summary.valid > 0) {
          onImportSuccess()
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'import:", error)
      alert("Erreur lors de l'import des transactions. Veuillez réessayer.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResolveAsset = async (
    unresolvedAsset: UnresolvedAsset,
    assetData: {
      name: string
      ticker: string
      isin: string
      currentPrice: number
      categoryId: number
    }
  ): Promise<void> => {
    try {
      // Créer l'actif
      const createdAsset = await window.api.createAsset(assetData)

      // Créer les transactions associées
      for (const tx of unresolvedAsset.transactions) {
        await window.api.createTransaction({
          assetId: createdAsset.id,
          type: tx.type,
          quantity: tx.quantity,
          pricePerUnit: tx.pricePerUnit,
          fee: tx.fee,
          date: new Date(tx.date)
        })
      }

      // Mettre à jour la liste des actifs
      setAssets((prev) => [...prev, createdAsset])
    } catch (error) {
      console.error('Erreur lors de la résolution:', error)
      throw error
    }
  }

  const handleSkipAsset = (unresolvedAsset: UnresolvedAsset): void => {
    console.log('Actif ignoré:', unresolvedAsset.assetName)
  }

  const handleCloseUnresolvedModal = (): void => {
    setShowUnresolvedModal(false)
    setStep('result')
    onImportSuccess()
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
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
        padding: 'var(--spacing-lg)',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '85vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
            Importer des transactions
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 'var(--spacing-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'background 0.2s ease',
              color: '#6b7280'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--spacing-lg)' }}>
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <>
              {/* Source selector */}
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-sm)',
                    fontWeight: '500',
                    fontSize: '14px',
                    color: '#374151'
                  }}
                >
                  Provenance des données
                </label>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  {(['TradeRepublic', 'Kraken', 'Other'] as const).map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setSource(src)}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        border: `2px solid ${source === src ? '#f59e0b' : '#d1d5db'}`,
                        background: source === src ? 'rgba(245, 158, 11, 0.1)' : '#ffffff',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '14px',
                        color: source === src ? '#d97706' : '#6b7280',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {src === 'Other' ? 'Autre' : src}
                    </button>
                  ))}
                </div>
                {source !== 'TradeRepublic' && (
                  <div
                    style={{
                      marginTop: 'var(--spacing-sm)',
                      padding: 'var(--spacing-sm)',
                      background: '#fef3c7',
                      border: '1px solid #fbbf24',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#92400e',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)'
                    }}
                  >
                    <AlertCircle size={14} />
                    Cette source n&apos;est pas encore supportée
                  </div>
                )}
              </div>

              {/* File upload */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: 'var(--spacing-xl)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: file ? '#f0fdf4' : '#f9fafb'
                }}
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={(e) => {
                  if (!file) {
                    e.currentTarget.style.borderColor = '#f59e0b'
                    e.currentTarget.style.background = '#fffbeb'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!file) {
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.background = '#f9fafb'
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />

                {file ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)'
                    }}
                  >
                    <FileText size={48} color="#10b981" />
                    <div>
                      <div style={{ fontWeight: '600', color: '#065f46', marginBottom: '4px' }}>
                        {file.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {(file.size / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)'
                    }}
                  >
                    <Upload size={48} color="#9ca3af" />
                    <div>
                      <div style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                        Glissez-déposez votre fichier ici
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        ou cliquez pour sélectionner (CSV, XLSX)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action button */}
              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                <button
                  onClick={handleImport}
                  disabled={!file || isProcessing || source !== 'TradeRepublic'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    background:
                      !file || isProcessing || source !== 'TradeRepublic' ? '#d1d5db' : '#f59e0b',
                    color: 'white',
                    borderRadius: '8px',
                    cursor:
                      !file || isProcessing || source !== 'TradeRepublic'
                        ? 'not-allowed'
                        : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (file && !isProcessing && source === 'TradeRepublic') {
                      e.currentTarget.style.background = '#d97706'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (file && !isProcessing && source === 'TradeRepublic') {
                      e.currentTarget.style.background = '#f59e0b'
                    }
                  }}
                >
                  {isProcessing ? 'Traitement en cours...' : 'Analyser et importer'}
                </button>
              </div>
            </>
          )}

          {/* Step 2: Result */}
          {step === 'result' && result && (
            <>
              {/* Summary */}
              <div
                style={{
                  padding: 'var(--spacing-md)',
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '8px',
                  marginBottom: 'var(--spacing-lg)'
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
                  <CheckCircle size={24} color="#16a34a" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#166534' }}>
                    Import terminé
                  </h3>
                </div>
                <div style={{ fontSize: '14px', color: '#166534' }}>
                  <div>
                    ✅ <strong>{result.summary.valid}</strong> transaction(s) importée(s)
                  </div>
                  {result.summary.warnings > 0 && (
                    <div>
                      ⚠️ <strong>{result.summary.warnings}</strong> avertissement(s)
                    </div>
                  )}
                  {result.summary.errors > 0 && (
                    <div>
                      ❌ <strong>{result.summary.errors}</strong> erreur(s)
                    </div>
                  )}
                </div>
              </div>

              {/* Created assets */}
              {result.createdAssets.length > 0 && (
                <div
                  style={{
                    padding: 'var(--spacing-md)',
                    background: '#eff6ff',
                    border: '1px solid #93c5fd',
                    borderRadius: '8px',
                    marginBottom: 'var(--spacing-lg)'
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
                    <AlertCircle size={20} color="#2563eb" />
                    <h4
                      style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1e40af' }}
                    >
                      {result.createdAssets.length} nouvel(x) actif(s) créé(s)
                    </h4>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#1e40af',
                      marginBottom: 'var(--spacing-xs)'
                    }}
                  >
                    Ces actifs ont été placés dans la catégorie &quot;A TRIER&quot; :
                  </div>
                  <ul
                    style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#1e40af' }}
                  >
                    {result.createdAssets.slice(0, 10).map((asset, idx) => (
                      <li key={idx}>{asset}</li>
                    ))}
                    {result.createdAssets.length > 10 && (
                      <li>... et {result.createdAssets.length - 10} autre(s)</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div
                  style={{
                    padding: 'var(--spacing-md)',
                    background: '#fefce8',
                    border: '1px solid #fde047',
                    borderRadius: '8px',
                    marginBottom: 'var(--spacing-lg)'
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
                    <AlertTriangle size={20} color="#ca8a04" />
                    <h4
                      style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#854d0e' }}
                    >
                      Avertissements
                    </h4>
                  </div>
                  <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                    {result.warnings.slice(0, 5).map((warning, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '12px',
                          color: '#854d0e',
                          marginBottom: 'var(--spacing-xs)'
                        }}
                      >
                        Ligne {warning.line}: {warning.reason}
                      </div>
                    ))}
                    {result.warnings.length > 5 && (
                      <div style={{ fontSize: '12px', color: '#854d0e', fontStyle: 'italic' }}>
                        ... et {result.warnings.length - 5} autre(s) avertissement(s)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Errors */}
              {result.errors.length > 0 && (
                <div
                  style={{
                    padding: 'var(--spacing-md)',
                    background: '#fef2f2',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    marginBottom: 'var(--spacing-lg)'
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
                    <AlertCircle size={20} color="#dc2626" />
                    <h4
                      style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#991b1b' }}
                    >
                      Erreurs
                    </h4>
                  </div>
                  <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                    {result.errors.slice(0, 5).map((error, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '12px',
                          color: '#991b1b',
                          marginBottom: 'var(--spacing-xs)'
                        }}
                      >
                        Ligne {error.line}: {error.reason}
                      </div>
                    ))}
                    {result.errors.length > 5 && (
                      <div style={{ fontSize: '12px', color: '#991b1b', fontStyle: 'italic' }}>
                        ... et {result.errors.length - 5} autre(s) erreur(s)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: 'none',
                  background: '#f59e0b',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#d97706'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f59e0b'
                }}
              >
                Fermer
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal de résolution des actifs non trouvés */}
      {showUnresolvedModal && unresolvedAssets.length > 0 && (
        <UnresolvedAssetsModal
          unresolvedAssets={unresolvedAssets}
          categories={categories}
          existingAssets={assets}
          onResolve={handleResolveAsset}
          onSkip={handleSkipAsset}
          onClose={handleCloseUnresolvedModal}
        />
      )}
    </div>
  )
}

export default ImportTransactionsModal
