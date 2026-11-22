import { Link } from 'react-router'
import RegistrationForm from '../components/RegistrationForm.jsx'

// Online registration of a client (US-C01)
export default function RegisterPage() {
  return (
    <section className="section">
      <h1 className="page-title">Créer mon compte</h1>
      <p className="page-subtitle">Inscrivez-vous pour obtenir votre carte de fidélité ShopLoc.</p>
      <div className="grid">
        <RegistrationForm />
      </div>
      <p className="muted">
        Déjà inscrit ? <Link to="/connexion">Se connecter</Link>
      </p>
    </section>
  )
}
