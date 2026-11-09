import { useEffect, useState } from 'react'

async function request(path, options) {
  const response = await fetch(path, options)
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || 'No se pudo completar la solicitud')
  return data
}

export default function App() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [productName, setProductName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [error, setError] = useState('')

  async function refresh() {
    const [nextCategories, nextProducts] = await Promise.all([
      request('/api/categorias'),
      request('/api/productos'),
    ])
    setCategories(nextCategories)
    setProducts(nextProducts)
  }

  useEffect(() => {
    refresh().catch((err) => setError(err.message))
  }, [])

  async function addCategory(event) {
    event.preventDefault()
    setError('')
    try {
      const category = await request('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: categoryName.trim() }),
      })
      setCategoryName('')
      setCategoryId(String(category.id))
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  async function addProduct(event) {
    event.preventDefault()
    setError('')
    try {
      await request('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: productName.trim(), categoria_id: Number(categoryId) }),
      })
      setProductName('')
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  const categoryById = Object.fromEntries(categories.map((category) => [category.id, category.nombre]))

  return (
    <main className="container">
      <header>
        <span className="eyebrow">2pruebas26 · FastAPI + React</span>
        <h1>Inventario</h1>
        <p>Organiza productos por categoría y comprueba cada cambio al instante.</p>
      </header>

      {error && <p className="error" role="alert">{error}</p>}

      <section className="grid">
        <div className="card">
          <h2>Categorías</h2>
          <form onSubmit={addCategory}>
            <label htmlFor="category-name">Nombre de categoría</label>
            <input id="category-name" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} required />
            <button type="submit">Agregar categoría</button>
          </form>
          <ul data-testid="category-list">
            {categories.map((category) => <li key={category.id}>{category.nombre}</li>)}
          </ul>
        </div>

        <div className="card">
          <h2>Productos</h2>
          <form onSubmit={addProduct}>
            <label htmlFor="product-name">Nombre de producto</label>
            <input id="product-name" value={productName} onChange={(event) => setProductName(event.target.value)} required />
            <label htmlFor="category-select">Categoría</label>
            <select id="category-select" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required>
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}
            </select>
            <button type="submit" disabled={categories.length === 0}>Agregar producto</button>
          </form>
          <ul data-testid="product-list">
            {products.map((product) => (
              <li key={product.id}>
                <strong>{product.nombre}</strong>
                <span>{categoryById[product.categoria_id]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
