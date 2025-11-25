function AssetEmptyState(): React.JSX.Element {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--spacing-xxl)',
        background: 'var(--color-card-bg)',
        borderRadius: 'var(--border-radius)',
        color: 'var(--color-text-secondary)'
      }}
    >
      <p style={{ margin: 0 }}>Aucun actif dans votre portefeuille</p>
    </div>
  )
}

export default AssetEmptyState
