import { useEffect, useState } from 'react'
import { apiFetch, errorMessage } from '../api.js'
import ShopRegistrationForm from '../components/ShopRegistrationForm.jsx'
import InShopRegistrationForm from '../components/InShopRegistrationForm.jsx'

const STATUS_LABELS = {
  PENDING: 'En attente de validation par ShopLoc',
  APPROVED: 'Validé',
  REJECTED: 'Refusé',
}

// Merchant space: the merchant's own shop (GET /api/v1/shops/mine), then one block per screen
export default function MerchantSpacePage() {
  const [shop, setShop] = useState(null)
  const [noShop, setNoShop] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/api/v1/shops/mine')
      .then((response) => {
        if (response.status === 404) {
          setNoShop(true)
          return null
        }
        if (!response.ok) throw new Error(errorMessage(response.status))
        return response.json()
      })
      .then(setShop)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="section">
      <h1 className="page-title">{shop ? shop.name : 'Espace commerçant'}</h1>
      {shop && (
        <p className="page-subtitle">
          <span className="badge">{STATUS_LABELS[shop.status] || shop.status}</span>
        </p>
      )}
      {loading && <p className="muted">Chargement de votre commerce...</p>}
      {error && <p className="msg-error" role="alert">{error}</p>}
      {noShop && (
        <p className="page-subtitle">Vous n'avez pas encore inscrit de commerce : renseignez ses informations ci-dessous.</p>
      )}

      {/* One line per screen of the merchant space */}
      <div className="grid">
        {noShop && <ShopRegistrationForm />}
        <InShopRegistrationForm />
      </div>
    </section>
  )
}
