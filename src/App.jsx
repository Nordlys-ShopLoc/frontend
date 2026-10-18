import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function App() {
  const [shops, setShops] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/v1/shops`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setShops)
      .catch((err) => setError(err.message))
  }, [])

  if (error) return <p>Erreur : {error}</p>

  return (
    <main>
      <h1>ShopLoc — Commerces partenaires</h1>
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