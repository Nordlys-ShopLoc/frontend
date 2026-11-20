import illustration from '../assets/shop-illustration.svg'

// Top of the home page: title, two actions and the illustration
export default function Hero({ loggedIn }) {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1 className="hero-title">
          Consommer
          <br />
          local
        </h1>
        <p className="hero-lead">
          Retrouvez les commerces de votre ville, commandez en click and collect et cumulez des points sur votre
          carte de fidélité.
        </p>
        <div className="hero-actions">
          {loggedIn ? (
            <a className="btn btn-secondary" href="#mon-espace">Mon espace</a>
          ) : (
            <a className="btn btn-secondary" href="#connexion">Créer mon compte</a>
          )}
          <span className="hero-or">ou</span>
          <a className="btn btn-primary" href="#commerces">Voir les commerces</a>
        </div>
      </div>
      <img className="illustration" src={illustration} alt="" />
    </section>
  )
}
