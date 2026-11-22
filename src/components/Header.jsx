import { useState } from 'react'
import { Link, NavLink } from 'react-router'

const ROLE_LABELS = {
  CLIENT: 'Client',
  MERCHANT: 'Commerçant',
  ADMIN: 'Administrateur',
}

// Space of each role, shown in the navigation
const SPACES = {
  MERCHANT: { to: '/espace-commercant', label: 'Mon commerce' },
  ADMIN: { to: '/admin', label: 'Administration' },
}

// Common header: logo, navigation and logged-in user
export default function Header({ role, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const space = SPACES[role]

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleLogout() {
    closeMenu()
    onLogout()
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link className="logo" to="/" onClick={closeMenu}>
          <strong>Shop</strong>Loc
        </Link>

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
          <NavLink to="/" end onClick={closeMenu}>Accueil</NavLink>
          {role ? (
            <>
              {space && <NavLink to={space.to} onClick={closeMenu}>{space.label}</NavLink>}
              <NavLink to="/mon-compte" onClick={closeMenu}>Mon compte</NavLink>
              <span className="nav-user">{ROLE_LABELS[role] || role}</span>
              <button type="button" className="btn btn-secondary btn-small" onClick={handleLogout}>
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <NavLink to="/inscription" onClick={closeMenu}>Créer un compte</NavLink>
              <Link className="btn btn-secondary btn-small" to="/connexion" onClick={closeMenu}>
                Se connecter
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
