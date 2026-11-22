import { getToken } from './auth.js'

// Calls the API through the gateway, with the token when the user is logged in
export function apiFetch(path, { method = 'GET', body } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  return fetch(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

// Same message for the same error code everywhere in the application
export function errorMessage(status, forbiddenMessage) {
  if (status === 400) return 'Veuillez vérifier les informations saisies.'
  if (status === 401) return 'Veuillez vous reconnecter.'
  if (status === 403) return forbiddenMessage || "Vous n'avez pas accès à cette action."
  if (status === 404) return "Cet élément n'existe plus."
  if (status === 409) return 'Cette demande a déjà été traitée.'
  return 'Impossible de joindre ShopLoc pour le moment. Réessayez plus tard.'
}
