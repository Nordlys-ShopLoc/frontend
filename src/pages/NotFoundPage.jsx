import { Link } from 'react-router'

// Unknown address
export default function NotFoundPage() {
  return (
    <section className="section">
      <h1 className="page-title">Page introuvable</h1>
      <p className="page-subtitle">Cette adresse ne correspond à aucune page de ShopLoc.</p>
      <Link className="btn btn-primary" to="/">Retour à l'accueil</Link>
    </section>
  )
}
