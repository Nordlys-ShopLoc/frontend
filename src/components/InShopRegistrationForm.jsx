import { useState } from 'react'
import { getToken } from '../auth.js'
import './RegistrationForm.css'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

// US-S16: the merchant registers a client in the shop and gives them a card
export default function InShopRegistrationForm() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [qrCode, setQrCode] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setQrCode('')

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Le prénom et le nom sont obligatoires.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/v1/accounts/in-shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
        }),
      })

      if (!response.ok) {
        if (response.status === 409) throw new Error('Cette adresse email est déjà utilisée.')
        if (response.status === 400) throw new Error('Veuillez vérifier les informations saisies.')
        if (response.status === 401) throw new Error('Veuillez vous reconnecter.')
        if (response.status === 403) throw new Error('Seul un commerçant actif peut inscrire un client.')
        throw new Error("Impossible d'inscrire le client pour le moment.")
      }

      const data = await response.json()
      setQrCode(data.qrCode)
      setForm(initialForm)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="registration-card">
      <h1>Inscrire un client</h1>
      <p className="registration-description">
        Pour les clients qui n'utilisent pas l'application : une carte de fidélité leur est créée tout de suite.
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="shopFirstName">Prénom</label>
        <input id="shopFirstName" name="firstName" value={form.firstName} onChange={handleChange} maxLength={80} required />

        <label htmlFor="shopLastName">Nom</label>
        <input id="shopLastName" name="lastName" value={form.lastName} onChange={handleChange} maxLength={80} required />

        <label htmlFor="shopEmail">Adresse email (facultatif)</label>
        <input id="shopEmail" name="email" type="email" value={form.email} onChange={handleChange} maxLength={180} />

        <label htmlFor="shopPhone">Téléphone (facultatif)</label>
        <input id="shopPhone" name="phone" type="tel" value={form.phone} onChange={handleChange} maxLength={20} />

        {error && <p className="registration-error" role="alert">{error}</p>}

        {qrCode && (
          <p className="registration-success" role="status">
            Client inscrit ! Code de la carte à lui remettre : <strong>{qrCode}</strong>
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Inscription en cours...' : 'Inscrire le client'}
        </button>
      </form>
    </section>
  )
}
