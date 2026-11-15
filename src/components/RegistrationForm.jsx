import { useState } from 'react'
import './RegistrationForm.css'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}

export default function RegistrationForm() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess(false)

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError('Tous les champs sont obligatoires.')
      return
    }

    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caracteres.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/v1/accounts/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      })

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Cette adresse email est deja utilisee.')
        }

        if (response.status === 400) {
          throw new Error('Veuillez verifier les informations saisies.')
        }

        throw new Error("Impossible de creer le compte pour le moment.")
      }

      setSuccess(true)
      setForm(initialForm)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="registration-page">
      <section className="registration-card">
        <div className="registration-logo">ShopLoc</div>
        <h1>Créer mon compte</h1>
        <p className="registration-description">
          Inscrivez-vous pour obtenir votre carte de fidélité numérique.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">Prénom</label>
          <input
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            autoComplete="given-name"
            maxLength={80}
            required
          />

          <label htmlFor="lastName">Nom</label>
          <input
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            autoComplete="family-name"
            maxLength={80}
            required
          />

          <label htmlFor="email">Adresse email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            maxLength={180}
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
          />

          {error && <p className="registration-error" role="alert">{error}</p>}

          {success && (
            <p className="registration-success" role="status">
              Votre compte et votre carte de fidélité ont été créés !
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Création en cours...' : "S'inscrire"}
          </button>
        </form>
      </section>
    </main>
  )
}
