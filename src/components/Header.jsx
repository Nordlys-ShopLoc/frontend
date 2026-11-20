import { useState } from 'react'

const ROLE_LABELS = {
  CLIENT: 'Client',
  MERCHANT: 'Commerçant',
  ADMIN: 'Administrateur',
}

// Common header: logo, navigation and logged-in user
export default function Header({ role, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-inner">
        <a className="logo" href="#accueil">
          <strong>Shop</strong>Loc
        </a>

        <button
          type="button"
          className="menu-button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <nav className={menuOpen ? 'nav open' : 'nav'}>
          <a href="#accueil">Accueil</a>
          <a href="#commerces">Commerces</a>
          {role ? (
            <>
              <a href="#mon-espace">Mon espace</a>
              <span className="nav-user">{ROLE_LABELS[role] || role}</span>
              <button type="button" className="btn btn-secondary btn-small" onClick={onLogout}>
                Se déconnecter
              </button>
            </>
          ) : (
            <a className="btn btn-secondary btn-small" href="#connexion">
              Se connecter
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}
