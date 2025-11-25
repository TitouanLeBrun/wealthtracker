import type { Category } from '../types'

interface CategoryListProps {
  categories: Category[]
  loading: boolean
}

function CategoryList({ categories, loading }: CategoryListProps): React.JSX.Element {
  if (loading) {
    return (
      <section>
        <h3>📁 Liste des catégories</h3>
        <p style={{ color: '#666' }}>Chargement des catégories...</p>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section>
        <h3>📁 Liste des catégories</h3>
        <p style={{ color: '#999' }}>Aucune catégorie. Créez-en une ci-dessus !</p>
      </section>
    )
  }

  return (
    <section>
      <h3>📁 Liste des catégories ({categories.length})</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '15px',
          marginTop: '15px'
        }}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            style={{
              padding: '15px',
              backgroundColor: '#fff',
              border: `3px solid ${category.color}`,
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: category.color,
                borderRadius: '50%',
                margin: '0 auto 10px',
                border: '2px solid #fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
            <strong style={{ fontSize: '16px' }}>{category.name}</strong>
            <br />
            <small style={{ color: '#666' }}>ID: {category.id}</small>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CategoryList
