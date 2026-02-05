<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const auth = useAuthStore()
const selectedUser = ref(auth.users[0]?.id ?? null)

function handleLogin() {
  if (!selectedUser.value) return
  auth.login(selectedUser.value)
  router.push({ name: 'scoreboard' })
}
</script>

<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6" variant="flat" color="surface">
          <div class="login-title">Welcome to Matchplay</div>
          <div class="login-subtitle">Choose a mock account to continue.</div>

          <v-select
            v-model="selectedUser"
            class="mt-6"
            :items="auth.users"
            item-title="name"
            item-value="id"
            label="Select user"
            variant="outlined"
          >
            <template #selection="{ item }">
              <div class="user-chip">
                <strong>{{ item.raw.name }}</strong>
                <span class="user-role">{{ item.raw.role }}</span>
              </div>
            </template>
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.raw.role }} · {{ item.raw.username }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-select>

          <v-btn class="mt-6" color="primary" size="large" block @click="handleLogin">
            Login
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.login-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #111827;
}

.login-subtitle {
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.6);
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-role {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08rem;
  color: rgba(15, 23, 42, 0.5);
}
</style>
