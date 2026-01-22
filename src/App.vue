<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tab = computed({
  get: () => route.name ?? 'scoreboard',
  set: (value) => {
    if (value) {
      router.push({ name: value })
    }
  },
})
</script>

<template>
  <v-app>
    <v-app-bar color="surface" flat>
      <v-toolbar-title class="app-title">Ryder Mode Scoring</v-toolbar-title>
      <template #extension>
        <v-tabs v-model="tab" align-tabs="center" grow>
          <v-tab value="scoreboard">Scoreboard</v-tab>
          <v-tab value="admin">Admin</v-tab>
        </v-tabs>
      </template>
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
</style>
