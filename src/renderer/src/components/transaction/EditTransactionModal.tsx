import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import type { Transaction } from '../../types'

interface EditTransactionModalProps {
  transaction: Transaction
  onClose: () => void
  onSave: (
    id: number,
    data: {
      type?: 'BUY' | 'SELL'
      quantity?: number
      pricePerUnit?: number
      fee?: number
      date?: string
    }
  ) => Promise<void>
}

function EditTransactionModal({
  transaction,
  onClose,
  onSave
}: EditTransactionModalProps): React.JSX.Element {
  const [type, setType] = useState<'BUY' | 'SELL'>(transaction.type)
  const [quantity, setQuantity] = useState(transaction.quantity.toString())
  const [pricePerUnit, setPricePerUnit] = useState(transaction.pricePerUnit.toString())
  const [fee, setFee] = useState(transaction.fee.toString())
  const [date, setDate] = useState(new Date(transaction.date).toISOString().split('T')[0])
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Bloquer le scroll du body quand la modal est ouverte
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    const qty = parseFloat(quantity)
    if (isNaN(qty) || qty <= 0) {
      newErrors.quantity = 'La quantité doit être supérieure à 0'
    }

    const price = parseFloat(pricePerUnit)
    if (isNaN(price) || price <= 0) {
      newErrors.pricePerUnit = 'Le prix doit être supérieur à 0'
    }

    const feeValue = parseFloat(fee)
    if (isNaN(feeValue) || feeValue < 0) {
      newErrors.fee = 'Les frais doivent être positifs ou nuls'
    }

    if (!date) {
      newErrors.date = 'La date est requise'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSaving(true)

    try {
      const data: {
        type?: 'BUY' | 'SELL'
        quantity?: number
        pricePerUnit?: number
        fee?: number
        date?: string
      } = {}

      // Ne mettre à jour que les champs modifiés
      if (type !== transaction.type) data.type = type
      if (parseFloat(quantity) !== transaction.quantity) data.quantity = parseFloat(quantity)
      if (parseFloat(pricePerUnit) !== transaction.pricePerUnit) {
        data.pricePerUnit = parseFloat(pricePerUnit)
      }
      if (parseFloat(fee) !== transaction.fee) data.fee = parseFloat(fee)
      const transactionDateStr = new Date(transaction.date).toISOString().split('T')[0]
      if (date !== transactionDateStr) data.date = new Date(date).toISOString()

      await onSave(transaction.id, data)
      onClose()
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      onClick={handleOverlayClick}
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
          maxWidth: '450px',
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
            Éditer la transaction
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 'var(--spacing-md) var(--spacing-lg)' }}>
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label
              style={{
                display: 'block',
                marginBottom: 'var(--spacing-sm)',
                fontWeight: '500',
                fontSize: '14px',
                color: '#374151'
              }}
            >
              Type de transaction
            </label>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <button
                type="button"
                onClick={() => setType('BUY')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  border: `2px solid ${type === 'BUY' ? '#10b981' : '#d1d5db'}`,
                  background: type === 'BUY' ? 'rgba(16, 185, 129, 0.1)' : '#ffffff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: type === 'BUY' ? '#059669' : '#6b7280',
                  transition: 'all 0.2s ease'
                }}
              >
                Achat
              </button>
              <button
                type="button"
                onClick={() => setType('SELL')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  border: `2px solid ${type === 'SELL' ? '#ef4444' : '#d1d5db'}`,
                  background: type === 'SELL' ? 'rgba(239, 68, 68, 0.1)' : '#ffffff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: type === 'SELL' ? '#dc2626' : '#6b7280',
                  transition: 'all 0.2s ease'
                }}
              >
                Vente
              </button>
            </div>
          </div>

          {/* Ligne 1: Quantité et Prix unitaire */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)'
            }}
          >
            <div>
              <label
                htmlFor="quantity"
                style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                Quantité
              </label>
              <input
                id="quantity"
                type="number"
                step="0.00000001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${errors.quantity ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  background: '#ffffff',
                  color: '#111827',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  if (!errors.quantity) {
                    e.currentTarget.style.borderColor = '#3b82f6'
                  }
                }}
                onBlur={(e) => {
                  if (!errors.quantity) {
                    e.currentTarget.style.borderColor = '#d1d5db'
                  }
                }}
              />
              {errors.quantity && (
                <span
                  style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}
                >
                  {errors.quantity}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="pricePerUnit"
                style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                Prix unitaire (€)
              </label>
              <input
                id="pricePerUnit"
                type="number"
                step="0.01"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${errors.pricePerUnit ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  background: '#ffffff',
                  color: '#111827',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  if (!errors.pricePerUnit) {
                    e.currentTarget.style.borderColor = '#3b82f6'
                  }
                }}
                onBlur={(e) => {
                  if (!errors.pricePerUnit) {
                    e.currentTarget.style.borderColor = '#d1d5db'
                  }
                }}
              />
              {errors.pricePerUnit && (
                <span
                  style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}
                >
                  {errors.pricePerUnit}
                </span>
              )}
            </div>
          </div>

          {/* Ligne 2: Frais et Date */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-lg)'
            }}
          >
            <div>
              <label
                htmlFor="fee"
                style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                Frais (€)
              </label>
              <input
                id="fee"
                type="number"
                step="0.01"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${errors.fee ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  background: '#ffffff',
                  color: '#111827',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  if (!errors.fee) {
                    e.currentTarget.style.borderColor = '#3b82f6'
                  }
                }}
                onBlur={(e) => {
                  if (!errors.fee) {
                    e.currentTarget.style.borderColor = '#d1d5db'
                  }
                }}
              />
              {errors.fee && (
                <span
                  style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}
                >
                  {errors.fee}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="date"
                style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${errors.date ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  background: '#ffffff',
                  color: '#111827',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  if (!errors.date) {
                    e.currentTarget.style.borderColor = '#3b82f6'
                  }
                }}
                onBlur={(e) => {
                  if (!errors.date) {
                    e.currentTarget.style.borderColor = '#d1d5db'
                  }
                }}
              />
              {errors.date && (
                <span
                  style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}
                >
                  {errors.date}
                </span>
              )}
            </div>
          </div>

          {/* Résumé */}
          <div
            style={{
              padding: 'var(--spacing-md)',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: 'var(--spacing-lg)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-sm)'
              }}
            >
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Total</span>
              <span style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>
                {(parseFloat(quantity || '0') * parseFloat(pricePerUnit || '0')).toFixed(2)} €
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Frais</span>
              <span style={{ fontSize: '14px', color: '#111827' }}>
                {parseFloat(fee || '0').toFixed(2)} €
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                background: '#ffffff',
                borderRadius: '8px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                color: '#374151',
                opacity: isSaving ? 0.5 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = '#f9fafb'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = '#ffffff'
                }
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: 'none',
                background: '#f59e0b',
                color: 'white',
                borderRadius: '8px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-xs)',
                opacity: isSaving ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = '#d97706'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = '#f59e0b'
                }
              }}
            >
              <Save size={16} />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTransactionModal
