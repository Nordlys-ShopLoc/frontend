import { useEffect, useState } from 'react'
import { apiFetch, errorMessage } from '../api.js'

const ROLES = ['CLIENT', 'MERCHANT', 'CITY_ADMIN', 'POLICE', 'ADMIN']

const ROLE_LABELS = {
  CLIENT: 'Client',
  MERCHANT: 'Commerçant',
  CITY_ADMIN: 'Agent collectivité',
  POLICE: 'Police municipale',
  ADMIN: 'Administrateur',
}

const STATUS_LABELS = {
  ACTIVE: 'Actif',
  SUSPENDED: 'Suspendu',
  DELETED: 'Supprimé',
}

const FORBIDDEN_MESSAGE = 'Cette action est réservée aux administrateurs.'

function getStatusBadgeClass(status) {
  if (status === 'ACTIVE') return 'badge badge-success'
  if (status === 'SUSPENDED' || status === 'DELETED') return 'badge badge-error'
  return 'badge'
}

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([])
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAccounts() {
      setLoading(true)
      setError(null)
      try {
        const query = roleFilter ? `?role=${encodeURIComponent(roleFilter)}` : ''
        const response = await apiFetch(`/api/v1/accounts${query}`)
        if (!response.ok) {
          throw new Error(errorMessage(response.status, FORBIDDEN_MESSAGE))
        }
        const data = await response.json()
        if (!cancelled) {
          setAccounts(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof TypeError ? errorMessage(0) : err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchAccounts()
    return () => {
      cancelled = true
    }
  }, [roleFilter])

  function updateAccountInList(updatedAccount) {
    setAccounts((prev) => {
      if (roleFilter && updatedAccount.role !== roleFilter) {
        return prev.filter((item) => item.id !== updatedAccount.id)
      }
      return prev.map((item) => (item.id === updatedAccount.id ? updatedAccount : item))
    })
  }

  async function runAction(accountId, path, successMessage, forbiddenMessage = FORBIDDEN_MESSAGE) {
    setBusyId(accountId)
    setError(null)
    setSuccess(null)
    try {
      const response = await apiFetch(path, { method: 'PUT' })
      if (!response.ok) {
        throw new Error(errorMessage(response.status, forbiddenMessage))
      }
      const updated = await response.json()
      updateAccountInList(updated)
      setSuccess(successMessage)
    } catch (err) {
      setError(err instanceof TypeError ? errorMessage(0) : err.message)
    } finally {
      setBusyId(null)
    }
  }

  function handleSuspend(account) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment suspendre le compte de ${account.firstName} ${account.lastName} (${account.email}) ?`
    )
    if (!confirmed) return

    runAction(
      account.id,
      `/api/v1/accounts/${account.id}/suspend`,
      `Le compte de ${account.email} a été suspendu.`,
      'Action refusée : vous ne pouvez pas suspendre votre propre compte.'
    )
  }

  function handleReactivate(account) {
    runAction(
      account.id,
      `/api/v1/accounts/${account.id}/reactivate`,
      `Le compte de ${account.email} a été réactivé.`
    )
  }

  function handleRoleChange(account, newRole) {
    if (newRole === account.role) return
    const confirmed = window.confirm(
      `Changer le rôle de ${account.email} en « ${ROLE_LABELS[newRole] || newRole} » ?`
    )
    if (!confirmed) return

    runAction(
      account.id,
      `/api/v1/accounts/${account.id}/role?newRole=${encodeURIComponent(newRole)}`,
      `Le rôle de ${account.email} a été mis à jour.`
    )
  }

  return (
    <section className="card">
      <h3 className="card-title">Gestion des comptes</h3>
      <p className="card-description">
        Consultez les comptes utilisateurs, suspendez ou réactivez un accès, et modifiez les rôles.
      </p>

      <div className="form">
        <div className="field">
          <label htmlFor="accountRoleFilter">Filtrer par rôle</label>
          <select
            id="accountRoleFilter"
            value={roleFilter}
            onChange={(e) => {
              setSuccess(null)
              setRoleFilter(e.target.value)
            }}
          >
            <option value="">Tous les rôles</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="msg-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="msg-success" role="status">
            {success}
          </p>
        )}

      {loading ? (
        <p className="muted">Chargement des comptes...</p>
      ) : accounts.length === 0 ? (
        <p className="muted">Aucun compte trouvé.</p>
      ) : (
        <ul className="list">
          {accounts.map((account) => {
            const isDeleted = account.status === 'DELETED'
            const isBusy = busyId === account.id
            const roleSelectId = `accountRole${account.id}`

            return (
              <li key={account.id} className="list-item">
                <div>
                  <div className="list-item-title">
                    {account.firstName} {account.lastName}
                  </div>
                  <p className="muted">{account.email}</p>
                  <div className="btn-row">
                    <span className="badge">{ROLE_LABELS[account.role] || account.role}</span>
                    <span className={getStatusBadgeClass(account.status)}>
                      {STATUS_LABELS[account.status] || account.status}
                    </span>
                  </div>
                </div>

                {!isDeleted && (
                  <div className="btn-row" style={{ alignItems: 'flex-end' }}>
                    <div className="field">
                      <label htmlFor={roleSelectId}>Rôle</label>
                      <select
                        id={roleSelectId}
                        value={account.role}
                        disabled={isBusy}
                        onChange={(e) => handleRoleChange(account, e.target.value)}
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </option>
                        ))}
                      </select>
                    </div>

                    {account.status === 'ACTIVE' && (
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        disabled={isBusy}
                        onClick={() => handleSuspend(account)}
                      >
                        {isBusy ? 'En cours...' : 'Suspendre'}
                      </button>
                    )}

                    {account.status === 'SUSPENDED' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-small"
                        disabled={isBusy}
                        onClick={() => handleReactivate(account)}
                      >
                        {isBusy ? 'En cours...' : 'Réactiver'}
                      </button>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
    </section>
  )
}