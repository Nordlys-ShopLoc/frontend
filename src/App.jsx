import { useEffect, useState } from 'react'
import LoyaltyCardView from './components/LoyaltyCardView'

// page principale de l'application
function App() {
  const [shops, setShops] = useState([])
  const [shopsError, setShopsError] = useState(null)
  const [card, setCard] = useState(null)
  const [cardError, setCardError] = useState(null)
  const [cardLoading, setCardLoading] = useState(true)

  // recupere les commerces partenaires
  useEffect(() => {
    fetch('/api/v1/shops')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setShops)
      .catch((err) => setShopsError(err.message))
  }, [])

  // recupere la carte du client connecte
  useEffect(() => {
    fetch('/api/v1/cards/me', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setCard)
      .catch((err) => setCardError(err.message))
      .finally(() => setCardLoading(false))
  }, [])

  return (
    <main>
      <h1>ShopLoc — Commerces partenaires</h1>

      {shopsError ? (
        <p>Erreur lors du chargement des commerces : {shopsError}</p>
      ) : (
        <ul>
          {shops.map((shop) => (
            <li key={shop.id}>
              <strong>{shop.name}</strong> — {shop.category}
              <p>{shop.address}</p>
            </li>
          ))}
        </ul>
      )}

      {cardLoading ? (
        <p>Chargement de votre carte de fidelite...</p>
      ) : cardError ? (
        <p>Impossible de charger votre carte : {cardError}</p>
      ) : (
        <LoyaltyCardView card={card} />
      )}
    </main>
  )
}

export default App
