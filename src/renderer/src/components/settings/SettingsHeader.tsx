/**
 * Composant d'en-tête de la page Settings
 */

import { Settings2, Plus } from 'lucide-react'

interface SettingsHeaderProps {
  onCreateCategory: () => void
  onCreateAsset: () => void
}

export function SettingsHeader({
  onCreateCategory,
  onCreateAsset
}: SettingsHeaderProps): React.JSX.Element {
  return (
    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-sm)',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <Settings2 size={32} color="var(--color-success)" />
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(22px, 5vw, 28px)',
              fontWeight: '700'
            }}
          >
            Configuration
          </h1>
        </div>

        {/* Boutons d'actions */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button
            onClick={onCreateCategory}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-success)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              borderTopRightRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-success-dark)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-success)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <Plus size={18} />
            <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>
              Nouvelle Catégorie
            </span>
          </button>

          <button
            onClick={onCreateAsset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              borderTopRightRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <Plus size={18} />
            <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>
              Nouvel Actif
            </span>
          </button>
        </div>
      </div>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          margin: 0,
          fontSize: 'clamp(14px, 3vw, 16px)'
        }}
      >
        Gérez vos catégories et actifs financiers
      </p>
    </div>
  )
}
