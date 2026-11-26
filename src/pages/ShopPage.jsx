import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { apiFetch, errorMessage } from '../api.js'
import ShopProducts from '../components/ShopProducts.jsx'

// Detail of a partner shop. Opening hours (US-C05) and articles (US-C07) are added in this page.
export default function ShopPage() {
  const { id } = useParams()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // No detail route yet: the shop is taken from the public list
    apiFetch('/api/v1/shops')
      .then((response) => {
        if (!response.ok) throw new Error(errorMessage(response.status))
        return response.json()
      })
      .then((shops) => {
        const found = shops.find((item) => String(item.id) === id)
        if (!found) throw new Error(errorMessage(404))
        setShop(found)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <section className="section">
      <p>
        <Link to="/">← Tous les commerces</Link>
      </p>
      {loading && <p className="muted">Chargement du commerce...</p>}
      {error && <p className="msg-error" role="alert">{error}</p>}
      {shop && (
        <>
          <span className="badge">{shop.category}</span>
          <h1 className="page-title">{shop.name}</h1>
          <p className="page-subtitle">{shop.address}</p>
          {shop.description && <p>{shop.description}</p>}
          <ShopProducts key={id} shopId={id} />
        </>
      )}
    </section>
  )
}
