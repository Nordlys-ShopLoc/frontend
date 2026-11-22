import { useEffect, useState } from 'react'
import { getToken } from '../auth.js'

const URL = '/api/v1/accounts/me'

// US-T02: the logged-in user consults, modifies or deletes their personal data
export default function PersonalDataForm({ onDeleted }) {
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(URL, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((response) => {
        if (!response.ok) throw new Error('Impossible de charger vos données.')
        return response.json()
      })
      .then((data) =>
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email || '',
          phone: data.phone || '',
          licensePlate: data.licensePlate || '',
        }),
      )
      .catch((err) => setError(err.message))
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSave(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    const response = await fetch(URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || null,
        licensePlate: form.licensePlate.trim() || null,
      }),
    })

    if (response.ok) setMessage('Vos informations ont été enregistrées.')
    else if (response.status === 400) setError('Le prénom et le nom sont obligatoires.')
    else setError("Impossible d'enregistrer vos informations.")
  }

  async function handleDelete() {
    setError('')
    setMessage('')
    if (!window.confirm('Supprimer définitivement votre compte ? Vos données personnelles seront effacées.')) return

    const response = await fetch(URL, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    })

    if (response.ok) onDeleted()
    else if (response.status === 409) setError("Il reste de l'argent sur votre carte : utilisez-le avant de supprimer votre compte.")
    else if (response.status === 403) setError('Seul un client peut supprimer son compte ici.')
    else setError('Impossible de supprimer votre compte.')
  }

  if (!form) {
    return (
      <section className="card">
        <h3 className="card-title">Mes données</h3>
        {error ? <p className="msg-error" role="alert">{error}</p> : <p className="muted">Chargement de vos données...</p>}
      </section>
    )
  }

  return (
    <section className="card">
      <h3 className="card-title">Mes données</h3>
      <p className="card-description">Consultez et modifiez les informations de votre compte.</p>

      <form className="form" onSubmit={handleSave}>
        <div className="field">
          <label htmlFor="meEmail">Adresse email (non modifiable)</label>
          <input id="meEmail" value={form.email} disabled />
        </div>

        <div className="field">
          <label htmlFor="meFirstName">Prénom</label>
          <input id="meFirstName" name="firstName" value={form.firstName} onChange={handleChange} maxLength={80} required />
        </div>

        <div className="field">
          <label htmlFor="meLastName">Nom</label>
          <input id="meLastName" name="lastName" value={form.lastName} onChange={handleChange} maxLength={80} required />
        </div>

        <div className="field">
          <label htmlFor="mePhone">Téléphone</label>
          <input id="mePhone" name="phone" type="tel" value={form.phone} onChange={handleChange} maxLength={20} />
        </div>

        <div className="field">
          <label htmlFor="meLicensePlate">Plaque d'immatriculation</label>
          <input id="meLicensePlate" name="licensePlate" value={form.licensePlate} onChange={handleChange} maxLength={16} />
        </div>

        {error && <p className="msg-error" role="alert">{error}</p>}
        {message && <p className="msg-success" role="status">{message}</p>}

        <div className="btn-row">
          <button type="submit" className="btn btn-primary">Enregistrer</button>
          <button type="button" className="btn btn-danger" onClick={handleDelete}>Supprimer mon compte</button>
        </div>
      </form>
    </section>
  )
}
