import { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm.jsx'
import RegistrationForm from './components/RegistrationForm.jsx'
import InShopRegistrationForm from './components/InShopRegistrationForm.jsx'
import { getRole, getToken, logout } from './auth.js'

function App() {
  const [shops, setShops] = useState([])
  const [error, setError] = useState(null)
  const [token, setToken] = useState(getToken())

  useEffect(() => {
    fetch(`/api/v1/shops`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setShops)
      .catch((err) => setError(err.message))
  }, [])

  function handleLogout() {
    logout()
    setToken(null)
  }

  if (error) return <p>Erreur : {error}</p>

  return (
    <main>
      <h1>ShopLoc — Commerces partenaires</h1>
      {token ? (
        <>
          <p>
            Vous êtes connecté. <button onClick={handleLogout}>Se déconnecter</button>
          </p>
          {getRole() === 'MERCHANT' && <InShopRegistrationForm />}
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
