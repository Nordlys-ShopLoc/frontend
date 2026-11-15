import { useState } from 'react'
import { getToken } from '../auth.js'
import './RegistrationForm.css'

const initialForm = { name: '', address: '', category: '', description: '' }

// US-S13: the merchant registers her shop, which waits for the administrator's approval
export default function ShopRegistrationForm() {
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
    setLoading(true)

    try {
      const response = await fetch('/api/v1/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          address: form.address.trim(),
          category: form.category.trim(),
          description: form.description.trim() || null,
        }),
      })

      if (!response.ok) {
        if (response.status === 400) throw new Error('Le nom, l’adresse et la catégorie sont obligatoires.')
        if (response.status === 401) throw new Error('Veuillez vous reconnecter.')
        if (response.status === 403) throw new Error('Seul un compte commerçant peut inscrire un commerce.')
        throw new Error("Impossible d'envoyer la demande pour le moment.")
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
    <section className="registration-card">
      <h1>Inscrire mon commerce</h1>
      <p className="registration-description">
        Votre commerce apparaîtra dans la liste des partenaires après validation par l'administrateur ShopLoc.
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="shopName">Nom du commerce</label>
        <input id="shopName" name="name" value={form.name} onChange={handleChange} maxLength={120} required />

        <label htmlFor="shopAddress">Adresse</label>
        <input id="shopAddress" name="address" value={form.address} onChange={handleChange} maxLength={255} required />

        <label htmlFor="shopCategory">Catégorie</label>
        <input id="shopCategory" name="category" value={form.category} onChange={handleChange} maxLength={60}
               placeholder="Boulangerie, Café…" required />

        <label htmlFor="shopDescription">Description (facultatif)</label>
        <textarea id="shopDescription" name="description" value={form.description} onChange={handleChange}
                  maxLength={1000} rows={4} />

        {error && <p className="registration-error" role="alert">{error}</p>}

        {success && (
          <p className="registration-success" role="status">
            Demande envoyée ! Votre commerce est en attente de validation.
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
        </button>
      </form>
    </section>
  )
}
