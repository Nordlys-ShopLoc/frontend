import { useEffect, useState } from 'react'
import { apiFetch, errorMessage } from '../api.js'
import LoyaltyCardView from './LoyaltyCardView.jsx'

function MyLoyaltyCard() {
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    apiFetch('/api/v1/cards/me')
      .then((response) => {
        if (!response.ok) {
          throw new Error(errorMessage(response.status))
        }
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setCard(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (loading || error || !card) {
    return (
      <section className="card">
        <h3 className="card-title">Ma carte de fidélité</h3>

        {loading ? (
          <p className="muted">Chargement de votre carte de fidélité...</p>
        ) : error ? (
          <p className="msg-error" role="alert">{error}</p>
        ) : (
          <p className="muted">Aucune carte de fidélité disponible.</p>
        )}
      </section>
    )
  }

  return <LoyaltyCardView card={card} />
}

export default MyLoyaltyCard
