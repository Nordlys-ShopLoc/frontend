import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { apiFetch, errorMessage } from '../api.js'

const ALL = 'ALL'

// Public list of the partner shops, visible by everyone (US-C05)
export default function ShopList() {
    const [shops, setShops] = useState([])
    const [category, setCategory] = useState(ALL)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        apiFetch('/api/v1/shops')
            .then((response) => {
                if (!response.ok) throw new Error(errorMessage(response.status))
                return response.json()
            })
            .then(setShops)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    // Categories come from the shops themselves: no list to maintain by hand
    const categories = [...new Set(shops.map((shop) => shop.category))]
        .sort((a, b) => a.localeCompare(b, 'fr'))

    const visibleShops = category === ALL ? shops : shops.filter((shop) => shop.category === category)

    return (
        <section className="section" id="commerces">
            <h2 className="page-title">Commerces partenaires</h2>
            <p className="page-subtitle">Les commerces de votre ville qui acceptent la carte ShopLoc.</p>

            {loading && <p className="muted">Chargement des commerces...</p>}
            {error && <p className="msg-error" role="alert">{error}</p>}
            {!loading && !error && shops.length === 0 && <p className="muted">Aucun commerce pour le moment.</p>}

            {categories.length > 1 && (
                <div className="btn-row filter-bar" role="group" aria-label="Filtrer par catégorie">
                    {[ALL, ...categories].map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={`btn btn-small ${category === item ? 'btn-primary' : 'btn-secondary'}`}
                            aria-pressed={category === item}
                            onClick={() => setCategory(item)}
                        >
                            {item === ALL ? 'Tous' : item}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid">
                {visibleShops.map((shop) => (
                    <article className="card" key={shop.id}>
                        <span className="badge">{shop.category}</span>
                        <h3 className="card-title"><Link to={`/commerces/${shop.id}`}>{shop.name}</Link></h3>
                        <p className="muted">{shop.address}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}