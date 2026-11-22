import { useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import ShopList from './components/ShopList.jsx'
import LoginForm from './components/LoginForm.jsx'
import RegistrationForm from './components/RegistrationForm.jsx'
import InShopRegistrationForm from './components/InShopRegistrationForm.jsx'
import ShopRegistrationForm from './components/ShopRegistrationForm.jsx'
import PendingShops from './components/PendingShops.jsx'
import PersonalDataForm from './components/PersonalDataForm.jsx'
import MyLoyaltyCard from './components/MyLoyaltyCard.jsx'
import { getRole, getToken, logout } from './auth.js'

const SPACE_TITLES = {
  CLIENT: 'Espace client',
  MERCHANT: 'Espace commerçant',
  ADMIN: 'Espace administrateur',
}

function App() {
  const [token, setToken] = useState(getToken())
  const role = token ? getRole() : null

  function handleLogout() {
    logout()
    setToken(null)
  }

  return (
    <>
      <Header role={role} onLogout={handleLogout} />

      <main className="page" id="accueil">
        <Hero loggedIn={Boolean(token)} />
        <ShopList />

        {token ? (
          <section className="section" id="mon-espace">
            <h2 className="page-title">{SPACE_TITLES[role] || 'Mon espace'}</h2>
            <p className="page-subtitle">Retrouvez ici tout ce que vous pouvez faire avec votre compte.</p>
            {/* One line per screen, inside the grid of its role */}
            <div className="grid">
              {role === 'CLIENT' && <MyLoyaltyCard />}
            {role === 'MERCHANT' && <ShopRegistrationForm />}
              {role === 'MERCHANT' && <InShopRegistrationForm />}
              {role === 'ADMIN' && <PendingShops />}
              <PersonalDataForm onDeleted={handleLogout} />
            </div>
          </section>
        ) : (
          <section className="section" id="connexion">
            <h2 className="page-title">Mon compte</h2>
            <p className="page-subtitle">Connectez-vous ou créez votre compte pour obtenir votre carte de fidélité.</p>
            <div className="grid">
              <LoginForm onLogin={setToken} />
              <RegistrationForm />
            </div>
          </section>
        )}
      </main>

      <footer className="footer">ShopLoc · projet Nordlys · Université de Lille</footer>
    </>
  )
}

export default App
