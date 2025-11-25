function NoCategoriesWarning(): React.JSX.Element {
  return (
    <section
      style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '2px solid #ffc107'
      }}
    >
      <h3>⚠️ Aucune catégorie disponible</h3>
      <p style={{ margin: '10px 0' }}>
        Vous devez d&apos;abord créer au moins une catégorie avant de pouvoir ajouter des actifs.
      </p>
      <p style={{ margin: 0, color: '#666' }}>
        👆 Rendez-vous dans l&apos;onglet <strong>&quot;Catégories&quot;</strong> ci-dessus.
      </p>
    </section>
  )
}

export default NoCategoriesWarning
