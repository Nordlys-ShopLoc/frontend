import { useEffect, useState } from 'react'
import { apiFetch, errorMessage } from '../api.js'

// Public list of the partner shops, visible by everyone
export default function ShopList() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/api/v1/shops')
      .then((response) => {
        if (!response.ok) throw new Error(errorMessage(response.status))
        return response.json()
      })
      .then(setShops)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="section" id="commerces">
      <h2 className="page-title">Commerces partenaires</h2>
      <p className="page-subtitle">Les commerces de votre ville qui acceptent la carte ShopLoc.</p>

      {loading && <p className="muted">Chargement des commerces...</p>}
      {error && <p className="msg-error" role="alert">{error}</p>}
      {!loading && !error && shops.length === 0 && <p className="muted">Aucun commerce pour le moment.</p>}

      <div className="grid">
        {shops.map((shop) => (
          <article className="card" key={shop.id}>
            <span className="badge">{shop.category}</span>
            <h3 className="card-title">{shop.name}</h3>
            <p className="muted">{shop.address}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
