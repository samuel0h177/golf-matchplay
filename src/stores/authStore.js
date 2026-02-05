import { defineStore } from 'pinia'
import { mockUsers } from '../data/users'
import { clearAuthState, loadAuthState, saveAuthState } from '../utils/authStorage'

const ROLE_LABELS = {
  admin: 'Administrator',
  observer: 'Observer',
  player: 'Player',
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const saved = loadAuthState()
    return {
      currentUserId: saved?.currentUserId ?? null,
    }
  },
  getters: {
    users: () => mockUsers,
    currentUser: (state) =>
      mockUsers.find((user) => user.id === state.currentUserId) ?? null,
    isAuthenticated() {
      return Boolean(this.currentUser)
    },
    roleLabel() {
      return this.currentUser ? ROLE_LABELS[this.currentUser.role] : null
    },
    canViewAdmin() {
      return this.currentUser?.role === 'admin'
    },
    canEditAnyMatch() {
      return this.currentUser?.role === 'admin' || this.currentUser?.role === 'observer'
    },
  },
  actions: {
    login(userId) {
      this.currentUserId = userId
      saveAuthState({ currentUserId: userId })
    },
    logout() {
      this.currentUserId = null
      clearAuthState()
    },
  },
})
