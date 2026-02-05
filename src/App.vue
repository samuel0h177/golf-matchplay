<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const tab = computed({
  get: () => route.name ?? 'scoreboard',
  set: (value) => {
    if (value) {
      router.push({ name: value })
    }
  },
})

function handleLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <v-app>
    <v-app-bar color="surface" flat>
      <v-toolbar-title class="app-title">Matchplay Scoring</v-toolbar-title>
      <template v-if="auth.isAuthenticated" #extension>
        <v-tabs v-model="tab" align-tabs="center" grow>
          <v-tab value="scoreboard">Scoreboard</v-tab>
          <v-tab v-if="auth.canViewAdmin" value="admin">Admin</v-tab>
        </v-tabs>
      </template>
      <v-spacer />
      <div v-if="auth.isAuthenticated" class="user-meta">
        <div class="user-name">{{ auth.currentUser?.name }}</div>
        <div class="user-role">{{ auth.roleLabel }}</div>
      </div>
      <v-btn v-if="auth.isAuthenticated" variant="text" @click="handleLogout">
        Logout
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
.app-title {
  font-weight: 700;
  letter-spacing: 0.04rem;
}

.user-meta {
  display: grid;
  margin-right: 12px;
  text-align: right;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #111827;
}

.user-role {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08rem;
  color: rgba(15, 23, 42, 0.6);
}
</style>
