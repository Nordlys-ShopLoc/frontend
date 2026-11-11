import { useEffect, useState } from 'react'
import LoyaltyCardView from './components/LoyaltyCardView'

function App() {
  const [shops, setShops] = useState([])
  const [error, setError] = useState(null)

  // carte fictive pour tester l'affichage
  const demoCard = {
    id: 1,
    accountId: 10,
    qrCode: 'SL-DEMO-C02-123456789',
    status: 'ACTIVE',
    balance: 0,
    issuedInShop: false
  }

  useEffect(() => {
    fetch('/api/v1/shops')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setShops)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <main>
      <h1>ShopLoc — Commerces partenaires</h1>

      {error ? (
        <p>Erreur lors du chargement des commerces : {error}</p>
      ) : (
        <ul>
          {shops.map((shop) => (
            <li key={shop.id}>
              <strong>{shop.name}</strong> — {shop.category}
              <br />
              {shop.address}
            </li>
          ))}
        </ul>
      )}

      <LoyaltyCardView card={demoCard} />
    </main>
  )
}

export default App
