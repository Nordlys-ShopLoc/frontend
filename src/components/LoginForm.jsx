import { useState } from 'react'
import { login } from '../auth.js'
import './LoginForm.css'

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
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <label>
        E-mail
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Mot de passe
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p className="login-error" role="alert">{error}</p>}
      <button type="submit">Se connecter</button>
    </form>
  )
}

export default LoginForm
