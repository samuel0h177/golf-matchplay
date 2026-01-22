import { createRouter, createWebHistory } from 'vue-router'
import ScoreboardView from '../views/ScoreboardView.vue'
import AdminView from '../views/AdminView.vue'

const routes = [
  { path: '/', name: 'scoreboard', component: ScoreboardView },
  { path: '/admin', name: 'admin', component: AdminView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
