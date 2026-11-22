import { Navigate } from 'react-router'
import { getRole } from '../auth.js'

// Shows a page only to a logged-in user with one of the given roles.
// Display aid only: the gateway and the services do the real checks (see the front charter).
export default function RequireRole({ token, roles, children }) {
  if (!token) return <Navigate to="/connexion" replace />
  if (roles && !roles.includes(getRole())) return <Navigate to="/" replace />
  return children
}
