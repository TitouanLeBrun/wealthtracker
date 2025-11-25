interface AssetTableTitleProps {
  assetCount: number
}

function AssetTableTitle({ assetCount }: AssetTableTitleProps): React.JSX.Element {
  return (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
      <h2
        style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'var(--color-text-primary)',
          margin: '0 0 var(--spacing-xs) 0'
        }}
      >
        📋 Détails par Actif
      </h2>
      <p
        style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          margin: 0
        }}
      >
        Performance détaillée de chaque actif ({assetCount} actif{assetCount > 1 ? 's' : ''})
      </p>
    </div>
  )
}

export default AssetTableTitle
