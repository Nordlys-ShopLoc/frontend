import { useState } from 'react'

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
      setError('Le mot de passe doit contenir au moins 8 caractères.')
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
          throw new Error('Cette adresse email est déjà utilisée.')
        }

        if (response.status === 400) {
          throw new Error('Veuillez vérifier les informations saisies.')
        }

        throw new Error("Impossible de créer le compte pour le moment.")
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
    <section className="card">
      <h3 className="card-title">Créer mon compte</h3>
      <p className="card-description">Inscrivez-vous pour obtenir votre carte de fidélité numérique.</p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
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
        </div>

        <div className="field">
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
        </div>

        <div className="field">
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
        </div>

        <div className="field">
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
        </div>

        {error && <p className="msg-error" role="alert">{error}</p>}

        {success && (
          <p className="msg-success" role="status">
            Votre compte et votre carte de fidélité ont été créés !
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Création en cours...' : "S'inscrire"}
        </button>
      </form>
    </section>
  )
}
