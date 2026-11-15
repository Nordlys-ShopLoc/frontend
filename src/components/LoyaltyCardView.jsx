import { QRCodeSVG } from 'qrcode.react'
import './LoyaltyCardView.css'

// affiche la carte de fidelite du client avec son qr code
function LoyaltyCardView({ card }) {
  if (!card) {
    return <p>Aucune carte de fidelite disponible.</p>
  }

  const active = card.status === 'ACTIVE'

  return (
    <section className="loyalty-card">
      <h2>Ma carte de fidelite</h2>
      <div className="loyalty-card-content">
        <h3>ShopLoc</h3>
        <p>Carte de fidelite</p>
        <p className={active ? 'card-active' : 'card-blocked'}>
          {active ? 'Carte active' : 'Carte bloquee'}
        </p>

        {active && card.qrCode ? (
          <div className="card-qr">
            <QRCodeSVG value={card.qrCode} size={190} />
            <p>{card.qrCode}</p>
          </div>
        ) : (
          <p>Cette carte ne peut pas etre utilisee.</p>
        )}
      </div>
      <p className="card-instruction">
        Presentez ce QR code au commercant lors de votre achat.
      </p>
    </section>
  )
}

export default LoyaltyCardView
