import { QRCodeSVG } from 'qrcode.react'
import './LoyaltyCardView.css'

function LoyaltyCardView({ card }) {
  if (!card) {
    return <p className="muted">Aucune carte de fidélité disponible.</p>
  }

  const active = card.status === 'ACTIVE'

  return (
    <section className="card loyalty-card">
      <h2 className="card-title">Ma carte de fidélité</h2>
      <p className="card-description">
        Retrouvez votre carte de fidélité ShopLoc.
      </p>

      <div className="loyalty-card-content">
        <h3>ShopLoc</h3>
        <p className="muted">Carte de fidélité</p>

        <p className={active ? 'badge badge-success' : 'badge badge-error'}>
          {active ? 'Carte active' : 'Carte bloquée'}
        </p>

        {active && card.qrCode ? (
          <div className="card-qr">
            <QRCodeSVG value={card.qrCode} size={190} />
            <p className="muted">{card.qrCode}</p>
          </div>
        ) : (
          <p className="muted">Cette carte ne peut pas être utilisée.</p>
        )}
      </div>

      {active && card.qrCode && (
        <p className="card-instruction muted">
          Présentez ce QR code au commerçant lors de votre achat.
        </p>
      )}
    </section>
  )
}

export default LoyaltyCardView
