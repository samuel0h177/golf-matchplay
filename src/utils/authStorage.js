const AUTH_KEY = 'golf-matchplay-auth'

export function loadAuthState() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (error) {
    console.error('Failed to load auth state', error)
    return null
  }
}

export function saveAuthState(state) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to persist auth state', error)
  }
}

export function clearAuthState() {
  try {
    localStorage.removeItem(AUTH_KEY)
  } catch (error) {
    console.error('Failed to clear auth state', error)
  }
}
