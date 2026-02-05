import { createRouter, createWebHistory } from 'vue-router'
import ScoreboardView from '../views/ScoreboardView.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '../stores/authStore'

const routes = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/', name: 'scoreboard', component: ScoreboardView, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true, adminOnly: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta?.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.meta?.adminOnly && !auth.canViewAdmin) {
    return { name: 'scoreboard' }
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'scoreboard' }
  }
  return true
})

export default router
