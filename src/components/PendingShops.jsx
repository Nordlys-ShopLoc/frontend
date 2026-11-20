import { useEffect, useState } from 'react'
import { getToken } from '../auth.js'

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` }
}

function errorMessage(status) {
  if (status === 401) return 'Veuillez vous reconnecter.'
  if (status === 403) return "Cette page est réservée à l'administrateur ShopLoc."
  if (status === 409) return 'Cette demande a déjà été traitée.'
  return 'Impossible de charger les demandes pour le moment.'
}

// US-A01: the ShopLoc administrator approves or rejects the shops waiting for validation
export default function PendingShops() {
  const [shops, setShops] = useState([])
  const [error, setError] = useState('')
  // Goes up after each decision to reload the list
  const [version, setVersion] = useState(0)

  useEffect(() => {
    fetch('/api/v1/shops/pending', { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error(errorMessage(res.status))
        return res.json()
      })
      .then(setShops)
      .catch((err) => setError(err.message))
  }, [version])

  async function decide(shopId, decision) {
    // decision is "approve" or "reject"
    const response = await fetch(`/api/v1/shops/${shopId}/${decision}`, { method: 'POST', headers: authHeaders() })
    if (!response.ok) {
      setError(errorMessage(response.status))
      return
    }
    setError('')
    setVersion((previous) => previous + 1)
  }

  return (
    <section className="card">
      <h3 className="card-title">Commerces en attente</h3>
      <p className="card-description">Acceptez ou refusez les demandes d'inscription des commerçants.</p>

      {error && <p className="msg-error" role="alert">{error}</p>}
      {!error && shops.length === 0 && <p className="muted">Aucune demande en attente.</p>}

      <ul className="list">
        {shops.map((shop) => (
          <li className="list-item" key={shop.id}>
            <div>
              <p className="list-item-title">{shop.name}</p>
              <p className="muted">{shop.category} · {shop.address}</p>
              {shop.description && <p className="muted">{shop.description}</p>}
            </div>
            <div className="btn-row">
              <button type="button" className="btn btn-primary btn-small" onClick={() => decide(shop.id, 'approve')}>
                Accepter
              </button>
              <button type="button" className="btn btn-secondary btn-small" onClick={() => decide(shop.id, 'reject')}>
                Refuser
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
