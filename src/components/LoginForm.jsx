import { useState } from 'react'
import { login } from '../auth.js'

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    try {
      onLogin(await login(email, password))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="card">
      <h3 className="card-title">Connexion</h3>
      <p className="card-description">Déjà inscrit ? Connectez-vous avec votre adresse email.</p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="loginEmail">Adresse email</label>
          <input id="loginEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="loginPassword">Mot de passe</label>
          <input
            id="loginPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="msg-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary">Se connecter</button>
      </form>
    </section>
  )
}

export default LoginForm
