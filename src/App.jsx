import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router'
import Header from './components/Header.jsx'
import RequireRole from './components/RequireRole.jsx'
import HomePage from './pages/HomePage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import MerchantSpacePage from './pages/MerchantSpacePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { getRole, getToken, logout } from './auth.js'

function App() {
  const [token, setToken] = useState(getToken())
  const role = token ? getRole() : null
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    setToken(null)
    navigate('/')
  }

  return (
    <>
      <Header role={role} onLogout={handleLogout} />

      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage loggedIn={Boolean(token)} />} />
          <Route path="/commerces/:id" element={<ShopPage />} />
          <Route path="/connexion" element={<LoginPage onLogin={setToken} />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route
            path="/mon-compte"
            element={<RequireRole token={token}><AccountPage role={role} onDeleted={handleLogout} /></RequireRole>}
          />
          <Route
            path="/espace-commercant"
            element={<RequireRole token={token} roles={['MERCHANT']}><MerchantSpacePage /></RequireRole>}
          />
          <Route
            path="/admin"
            element={<RequireRole token={token} roles={['ADMIN']}><AdminPage /></RequireRole>}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="footer">ShopLoc · projet Nordlys · Université de Lille</footer>
    </>
  )
}

export default App
