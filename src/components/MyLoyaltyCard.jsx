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

  if (loading) return <p>Chargement de votre carte de fidélité...</p>
  if (error) return <p role="alert">{error}</p>
  if (!card) return <p>Aucune carte de fidélité disponible.</p>

  return <LoyaltyCardView card={card} />
}

export default MyLoyaltyCard
