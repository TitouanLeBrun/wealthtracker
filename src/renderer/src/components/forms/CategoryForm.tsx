import { FormEvent, useState } from 'react'
import type { CategoryFormData } from '../../types'

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => Promise<void>
  onError: (message: string) => void
}

function CategoryForm({ onSubmit, onError }: CategoryFormProps): React.JSX.Element {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    color: '#4CAF50'
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      onError('Veuillez saisir un nom de catégorie')
      return
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        color: formData.color
      })

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        color: '#4CAF50'
      })
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error)
      onError('Erreur lors de la création de la catégorie')
    }
  }

  // Couleurs prédéfinies
  const presetColors = [
    { name: 'Vert', value: '#4CAF50' },
    { name: 'Bleu', value: '#2196F3' },
    { name: 'Orange', value: '#FF9800' },
    { name: 'Rouge', value: '#F44336' },
    { name: 'Violet', value: '#9C27B0' },
    { name: 'Cyan', value: '#00BCD4' }
  ]

  return (
    <section
      style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      }}
    >
      <h3>➕ Ajouter une catégorie</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="category-name">
            <strong>Nom de la catégorie :</strong>
            <br />
            <input
              type="text"
              id="category-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Actions, Crypto, Immobilier"
              style={{ width: '100%', padding: '10px', marginTop: '5px', fontSize: '14px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <strong>Couleur :</strong>
            <br />
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
              {presetColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: color.value,
                    border: formData.color === color.value ? '3px solid #333' : '2px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title={color.name}
                />
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  style={{
                    width: '50px',
                    height: '50px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                />
                <small style={{ color: '#666' }}>Personnalisé</small>
              </div>
            </div>
            <div style={{ marginTop: '8px' }}>
              <small style={{ color: '#666' }}>Couleur sélectionnée : {formData.color}</small>
            </div>
          </label>
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: formData.color,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          ✅ Créer la catégorie
        </button>
      </form>
    </section>
  )
}

export default CategoryForm
