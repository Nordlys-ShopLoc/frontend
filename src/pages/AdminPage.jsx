import AccountManagement from '../components/AccountManagement.jsx'
import PendingShops from '../components/PendingShops.jsx'

// Administrator space: shops waiting for approval (US-A01). One line per screen in the grid.
export default function AdminPage() {
  return (
    <section className="section">
      <h1 className="page-title">Administration</h1>
      <p className="page-subtitle">Validez les commerces qui demandent à rejoindre ShopLoc.</p>
      <div className="grid">
        <PendingShops />
        <AccountManagement />
      </div>
    </section>
  )
}
