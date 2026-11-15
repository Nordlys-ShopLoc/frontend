import { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm.jsx'
import RegistrationForm from './components/RegistrationForm.jsx'
import LoyaltyCardView from './components/LoyaltyCardView.jsx'
import { getToken, logout } from './auth.js'

function App() {
  const [shops, setShops] = useState([])
  const [error, setError] = useState(null)
  const [token, setToken] = useState(getToken())
  const [card, setCard] = useState(null)
  const [cardError, setCardError] = useState(null)
  const [cardLoading, setCardLoading] = useState(false)

  useEffect(() => {
    fetch('/api/v1/shops')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setShops)
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    if (!token) return

    let cancelled = false

    fetch('/api/v1/cards/me', {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setCard(data)
      })
      .catch((err) => {
        if (!cancelled) setCardError(err.message)
      })
      .finally(() => {
        if (!cancelled) setCardLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  function handleLogout() {
    logout()
    setToken(null)
    setCard(null)
    setCardError(null)
  }

  if (error) return <p>Erreur : {error}</p>

  return (
    <main>
      <h1>ShopLoc — Commerces partenaires</h1>

      {token ? (
        <>
          <p>
            Vous êtes connecté.{' '}
            <button onClick={handleLogout}>Se déconnecter</button>
          </p>

          {cardLoading ? (
            <p>Chargement de votre carte de fidélité...</p>
          ) : cardError ? (
            <p>Impossible de charger votre carte : {cardError}</p>
          ) : card ? (
            <LoyaltyCardView card={card} />
          ) : null}
        </>
      ) : (
        <>
          <LoginForm onLogin={setToken} />
          <RegistrationForm />
        </>
      )}

      <ul>
        {shops.map((shop) => (
          <li key={shop.id}>
            <strong>{shop.name}</strong> — {shop.category}
            <br />
            {shop.address}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
