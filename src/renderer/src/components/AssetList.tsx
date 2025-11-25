import type { Asset } from '../types'

interface AssetListProps {
  assets: Asset[]
  loading: boolean
}

function AssetList({ assets, loading }: AssetListProps): React.JSX.Element {
  if (loading) {
    return (
      <section>
        <h3>💼 Liste des actifs</h3>
        <p style={{ color: '#666' }}>Chargement des actifs...</p>
      </section>
    )
  }

  if (assets.length === 0) {
    return (
      <section>
        <h3>💼 Liste des actifs</h3>
        <p style={{ color: '#999' }}>Aucun actif. Créez-en un ci-dessus !</p>
      </section>
    )
  }

  return (
    <section>
      <h3>💼 Liste des actifs ({assets.length})</h3>
      <div style={{ marginTop: '15px' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                Ticker
              </th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                Nom
              </th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                Catégorie
              </th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>
                Prix actuel
              </th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>
                Date création
              </th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr
                key={asset.id}
                style={{
                  borderBottom: '1px solid #eee',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '12px' }}>
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: '#333'
                    }}
                  >
                    {asset.ticker}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{asset.name}</td>
                <td style={{ padding: '12px' }}>
                  {asset.category && (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: asset.category.color,
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {asset.category.name}
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <strong style={{ color: '#2196F3' }}>{asset.currentPrice.toFixed(2)} €</strong>
                </td>
                <td
                  style={{ padding: '12px', textAlign: 'center', color: '#666', fontSize: '13px' }}
                >
                  {new Date(asset.createdAt).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AssetList
