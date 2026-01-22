const STORAGE_KEY = 'golf-matchplay-event'

export function loadEventState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (error) {
    console.error('Failed to load saved state', error)
    return null
  }
}

export function saveEventState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to persist state', error)
  }
}

export function clearEventState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear saved state', error)
  }
}
