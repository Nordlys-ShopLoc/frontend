import { Link, useNavigate } from 'react-router'
import LoginForm from '../components/LoginForm.jsx'
import { getRole, getToken } from '../auth.js'

// Page shown after login, according to the role
const HOME_BY_ROLE = {
  MERCHANT: '/espace-commercant',
  ADMIN: '/admin',
}

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()

  function handleLogin(token) {
    onLogin(token || getToken())
    navigate(HOME_BY_ROLE[getRole()] || '/mon-compte')
  }

  return (
    <section className="section">
      <h1 className="page-title">Connexion</h1>
      <p className="page-subtitle">Connectez-vous pour retrouver votre espace.</p>
      <div className="grid">
        <LoginForm onLogin={handleLogin} />
      </div>
      <p className="muted">
        Pas encore de compte ? <Link to="/inscription">Créer mon compte</Link>
      </p>
    </section>
  )
}
