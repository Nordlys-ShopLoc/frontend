import MyLoyaltyCard from '../components/MyLoyaltyCard.jsx'
import PersonalDataForm from '../components/PersonalDataForm.jsx'

// Account of any logged-in user: the client's card (US-C02) and personal data (US-T02).
// One line per screen in the grid.
export default function AccountPage({ role, onDeleted }) {
  return (
    <section className="section">
      <h1 className="page-title">Mon compte</h1>
      <p className="page-subtitle">Votre carte de fidélité et vos informations personnelles.</p>
      <div className="grid">
        {role === 'CLIENT' && <MyLoyaltyCard />}
        <PersonalDataForm onDeleted={onDeleted} />
      </div>
    </section>
  )
}
