import { useEffect, useState } from 'react'
import { apiFetch, errorMessage } from '../api.js'
import './ShopProducts.css'

export default function ShopProducts({ shopId }) {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    apiFetch(`/api/v1/shops/${shopId}/products`)
      .then((response) => {
        if (!response.ok) throw new Error(errorMessage(response.status))
        return response.json()
      })
      .then((data) => {
        if (active) setProducts(data)
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [shopId])

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <section className="section">
      <h2 className="page-title">Articles en click & collect</h2>

      {loading && <p className="muted">Chargement des articles...</p>}
      {error && <p className="msg-error" role="alert">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="muted">Ce commerce ne propose pas encore d'articles.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="field product-search">
            <label htmlFor="product-search">Rechercher un article</label>
            <input
              id="product-search"
              type="search"
              placeholder="Nom de l'article"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {filteredProducts.length === 0 && (
            <p className="muted">Aucun article ne correspond à votre recherche.</p>
          )}

          <div className="grid">
            {filteredProducts.map((product) => (
              <article
                className={`card product-card ${product.outOfStock ? 'product-out-of-stock' : ''}`}
                key={product.id}
              >
                <h3 className="card-title">{product.name}</h3>

                {product.description && (
                  <p className="card-description">{product.description}</p>
                )}

                <p className="product-price">
                  {Number(product.price).toFixed(2)} €
                </p>

                {product.outOfStock && (
                  <span className="badge badge-error">Rupture de stock</span>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
