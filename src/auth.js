const TOKEN_KEY = 'shoploc-token'

export async function login(email, password) {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (response.status === 401) throw new Error('E-mail ou mot de passe incorrect')
  if (response.status === 403) throw new Error('Ce compte est désactivé')
  if (!response.ok) throw new Error(`Erreur ${response.status}`)

  const { token } = await response.json()
  sessionStorage.setItem(TOKEN_KEY, token)
  return token
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY)
}
