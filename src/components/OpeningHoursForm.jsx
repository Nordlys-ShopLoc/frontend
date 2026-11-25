import { useEffect, useState } from 'react'
import { apiFetch, errorMessage } from '../api.js'
import './OpeningHoursForm.css'

const URL = '/api/v1/shops/mine/opening-hours'
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const DEFAULT_SLOT = { opensAt: '09:00', closesAt: '18:00' }
const FORBIDDEN = 'Votre commerce doit être validé par ShopLoc pour renseigner ses horaires.'
const INVALID = "Vérifiez les horaires : la fermeture doit être après l'ouverture, deux créneaux au plus par jour, sans chevauchement."

function messageFor(status) {
  return status === 400 ? INVALID : errorMessage(status, FORBIDDEN)
}

function readableError(err) {
  return err instanceof TypeError ? errorMessage(0) : err.message
}

function toWeek(hours) {
  return DAYS.map((label, index) => {
    const day = index + 1
    const slots = hours
      .filter((hour) => hour.dayOfWeek === day)
      .map((hour) => ({ opensAt: hour.opensAt.slice(0, 5), closesAt: hour.closesAt.slice(0, 5) }))
    return { day, label, closed: slots.length === 0, slots: slots.length > 0 ? slots : [{ ...DEFAULT_SLOT }] }
  })
}

function toBody(week) {
  return week
    .filter((entry) => !entry.closed)
    .flatMap((entry) => entry.slots.map((slot) => ({ dayOfWeek: entry.day, ...slot })))
}

// Short text shown under each day: one line per slot, or "Fermé"
function summaryLines(entry) {
  return entry.closed ? ['Fermé'] : entry.slots.map((slot) => `${slot.opensAt}–${slot.closesAt}`)
}

// US-S10: the merchant sets the opening hours of her shop, day by day
export default function OpeningHoursForm() {
  const [week, setWeek] = useState(toWeek([]))
  const [selectedDay, setSelectedDay] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    apiFetch(URL)
      .then((response) => {
        if (!response.ok) throw new Error(messageFor(response.status))
        return response.json()
      })
      .then((hours) => setWeek(toWeek(hours)))
      .catch((err) => setLoadError(readableError(err)))
      .finally(() => setLoading(false))
  }, [])

  function updateDay(day, change) {
    setWeek((previous) => previous.map((entry) => (entry.day === day ? { ...entry, ...change(entry) } : entry)))
  }

  function toggleClosed(day) {
    updateDay(day, (entry) => ({ closed: !entry.closed }))
  }

  function updateSlot(day, index, field, value) {
    updateDay(day, (entry) => ({
      slots: entry.slots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    }))
  }

  function addSlot(day) {
    updateDay(day, (entry) => {
      const first = entry.slots[0]
      return {
        slots: [
          { opensAt: first.opensAt, closesAt: '12:00' },
          { opensAt: '14:00', closesAt: first.closesAt },
        ],
      }
    })
  }

  function removeSlot(day) {
    updateDay(day, (entry) => ({
      slots: [{ opensAt: entry.slots[0].opensAt, closesAt: entry.slots[entry.slots.length - 1].closesAt }],
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)

    try {
      const response = await apiFetch(URL, { method: 'PUT', body: toBody(week) })
      if (!response.ok) throw new Error(messageFor(response.status))

      setWeek(toWeek(await response.json()))
      setMessage('Vos horaires ont été enregistrés.')
    } catch (err) {
      setError(readableError(err))
    } finally {
      setSaving(false)
    }
  }

  const allClosed = week.every((entry) => entry.closed)
  const selected = week.find((entry) => entry.day === selectedDay)

  return (
    <section className="card hours-card">
      <h3 className="card-title">Mes horaires d'ouverture</h3>
      {loading && <p className="muted">Chargement de vos horaires...</p>}
      {loadError && <p className="msg-error" role="alert">{loadError}</p>}

      {!loading && !loadError && (
        <form className="form" onSubmit={handleSubmit}>
          <p className="muted">
            {allClosed
              ? 'Aucun horaire renseigné : votre commerce apparaît fermé tous les jours.'
              : 'Choisissez un jour pour modifier ses horaires, puis enregistrez la semaine.'}
          </p>

          <div className="hours-days">
            {week.map((entry) => (
              <button
                key={entry.day}
                type="button"
                className={entry.day === selectedDay ? 'hours-day-tab selected' : 'hours-day-tab'}
                aria-pressed={entry.day === selectedDay}
                onClick={() => setSelectedDay(entry.day)}
              >
                <span className="hours-day-name">{entry.label}</span>
                {summaryLines(entry).map((line) => (
                  <span key={line} className={entry.closed ? 'hours-day-summary closed' : 'hours-day-summary'}>
                    {line}
                  </span>
                ))}
              </button>
            ))}
          </div>

          <fieldset className="hours-editor">
            <legend>{selected.label}</legend>

            <div className="hours-closed">
              <input
                id={`closed-${selected.day}`}
                type="checkbox"
                checked={selected.closed}
                onChange={() => toggleClosed(selected.day)}
              />
              <label htmlFor={`closed-${selected.day}`}>Fermé ce jour-là</label>
            </div>

            {!selected.closed &&
              selected.slots.map((slot, index) => (
                <div className="hours-slot" key={index}>
                  <div className="field">
                    <label htmlFor={`opens-${selected.day}-${index}`}>
                      {selected.slots.length > 1 ? (index === 0 ? 'Ouverture du matin' : "Ouverture de l'après-midi") : 'Ouverture'}
                    </label>
                    <input
                      id={`opens-${selected.day}-${index}`}
                      type="time"
                      required
                      value={slot.opensAt}
                      onChange={(event) => updateSlot(selected.day, index, 'opensAt', event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`closes-${selected.day}-${index}`}>
                      {selected.slots.length > 1 ? (index === 0 ? 'Fermeture du matin' : "Fermeture de l'après-midi") : 'Fermeture'}
                    </label>
                    <input
                      id={`closes-${selected.day}-${index}`}
                      type="time"
                      required
                      value={slot.closesAt}
                      onChange={(event) => updateSlot(selected.day, index, 'closesAt', event.target.value)}
                    />
                  </div>
                </div>
              ))}

            {!selected.closed &&
              (selected.slots.length === 1 ? (
                <button type="button" className="btn btn-secondary btn-small" onClick={() => addSlot(selected.day)}>
                  Ajouter une pause de midi
                </button>
              ) : (
                <button type="button" className="btn btn-secondary btn-small" onClick={() => removeSlot(selected.day)}>
                  Supprimer la pause de midi
                </button>
              ))}
          </fieldset>

          {error && <p className="msg-error" role="alert">{error}</p>}
          {message && <p className="msg-success" role="status">{message}</p>}

          <div className="btn-row">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer la semaine'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
