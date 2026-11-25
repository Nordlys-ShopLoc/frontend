import { useEffect, useState } from 'react'
import { apiFetch, errorMessage } from '../api.js'
import './ProductManager.css'

const URL = '/api/v1/shops/mine/products'
const EMPTY_FORM = { name: '', description: '', price: '', stock: '' }
const FORBIDDEN = 'Votre commerce doit être validé par ShopLoc pour gérer ses articles.'
const INVALID = 'Le nom et un prix supérieur à 0 sont obligatoires, et le stock ne peut pas être négatif.'

// Price in the French format, for example 2,50 €
const priceFormat = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

function messageFor(status) {
  return status === 400 ? INVALID : errorMessage(status, FORBIDDEN)
}

// A network failure (TypeError) gets the common message of the charter
function readableError(err) {
  return err instanceof TypeError ? errorMessage(0) : err.message
}

// US-S03: the merchant adds, changes and withdraws the articles of her shop
export default function ProductManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  // Goes up after each change to reload the list
  const [version, setVersion] = useState(0)

  useEffect(() => {
    apiFetch(URL)
      .then((response) => {
        if (!response.ok) throw new Error(messageFor(response.status))
        return response.json()
      })
      .then(setProducts)
      .catch((err) => setError(readableError(err)))
      .finally(() => setLoading(false))
  }, [version])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  function startEdit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
    })
    setFormError('')
    setMessage('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    setMessage('')
    setSaving(true)

    const body = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      stock: form.stock === '' ? null : Number(form.stock),
    }

    try {
      const response = editingId
        ? await apiFetch(`${URL}/${editingId}`, { method: 'PUT', body })
        : await apiFetch(URL, { method: 'POST', body })
      if (!response.ok) throw new Error(messageFor(response.status))

      setMessage(editingId ? `« ${body.name} » a été modifié.` : `« ${body.name} » a été ajouté.`)
      setEditingId(null)
      setForm(EMPTY_FORM)
      setError('')
      setVersion((previous) => previous + 1)
    } catch (err) {
      setFormError(readableError(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleWithdraw(product) {
    if (!window.confirm(`Retirer « ${product.name} » de la vente ? Les clients ne le verront plus.`)) return
    setMessage('')
    setError('')

    try {
      const response = await apiFetch(`${URL}/${product.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error(messageFor(response.status))

      setMessage(`« ${product.name} » a été retiré de la vente.`)
      if (editingId === product.id) cancelEdit()
      setVersion((previous) => previous + 1)
    } catch (err) {
      setError(readableError(err))
    }
  }

  return (
    <>
      <section className="card">
        <h3 className="card-title">{editingId ? "Modifier l'article" : 'Ajouter un article'}</h3>
        <p className="card-description">
          Les articles en vente apparaissent sur la page de votre commerce, en click and collect.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="productName">Nom de l'article</label>
            <input id="productName" name="name" value={form.name} onChange={handleChange} maxLength={120} required />
          </div>

          <div className="field">
            <label htmlFor="productDescription">Description (facultatif)</label>
            <textarea id="productDescription" name="description" value={form.description} onChange={handleChange}
                      maxLength={1000} rows={3} />
          </div>

          <div className="field">
            <label htmlFor="productPrice">Prix (€)</label>
            <input id="productPrice" name="price" type="number" min="0.01" step="0.01" value={form.price}
                   onChange={handleChange} placeholder="2,50" required />
          </div>

          <div className="field">
            <label htmlFor="productStock">Stock (facultatif, 0 par défaut)</label>
            <input id="productStock" name="stock" type="number" min="0" step="1" value={form.stock}
                   onChange={handleChange} />
          </div>

          {formError && <p className="msg-error" role="alert">{formError}</p>}

          <div className="btn-row">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Enregistrement...' : editingId ? 'Enregistrer' : "Ajouter l'article"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Annuler</button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h3 className="card-title">Mes articles</h3>
        {message && <p className="msg-success" role="status">{message}</p>}
        {loading && <p className="muted">Chargement de vos articles...</p>}
        {error && <p className="msg-error" role="alert">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p className="muted">Vous n'avez pas encore d'article : ajoutez le premier avec le formulaire.</p>
        )}

        <ul className="list">
          {products.map((product) => (
            <li className="list-item product-item" key={product.id}>
              <div>
                <p className="list-item-title">{product.name}</p>
                <p className="muted">{priceFormat.format(product.price)} · Stock : {product.stock}</p>
                <span className={product.available ? 'badge badge-success' : 'badge'}>
                  {product.available ? 'En vente' : 'Retiré de la vente'}
                </span>
              </div>
              {product.available && (
                <div className="btn-row">
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => startEdit(product)}>
                    Modifier
                  </button>
                  <button type="button" className="btn btn-danger btn-small" onClick={() => handleWithdraw(product)}>
                    Retirer
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
