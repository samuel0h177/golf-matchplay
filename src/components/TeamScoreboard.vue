<script setup>
import { computed } from 'vue'
import { useEventStore } from '../stores/eventStore'

const store = useEventStore()
const points = computed(() => store.teamPoints)
const teamMap = computed(() => store.teamMap)
</script>

<template>
  <v-card class="pa-4 scoreboard-card" color="surface" variant="flat">
    <v-row align="center" class="text-center">
      <v-col cols="6">
        <div class="scoreboard-team">
          <div
            class="team-bar"
            :style="{ backgroundColor: teamMap.usa?.color }"
          />
          <div class="team-label">
            <img class="team-flag" src="/flags/usa.svg" alt="USA flag" />
            USA
          </div>
          <div class="team-points">{{ points.usa?.toFixed(1) }}</div>
          <div class="team-subtitle">Home</div>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="scoreboard-team">
          <div
            class="team-bar"
            :style="{ backgroundColor: teamMap.vietnam?.color }"
          />
          <div class="team-label">
            <img class="team-flag" src="/flags/vietnam.svg" alt="Vietnam flag" />
            Vietnam
          </div>
          <div class="team-points">{{ points.vietnam?.toFixed(1) }}</div>
          <div class="team-subtitle">Away</div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.scoreboard-card {
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
}

.scoreboard-team {
  display: grid;
  gap: 4px;
  place-items: center;
}

.team-bar {
  width: 42px;
  height: 6px;
  border-radius: 999px;
}

.team-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.18rem;
  color: rgba(18, 24, 38, 0.7);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.team-points {
  font-size: 2.6rem;
  font-weight: 700;
  color: #111827;
}

.team-subtitle {
  font-size: 0.85rem;
  color: rgba(18, 24, 38, 0.6);
}

.team-flag {
  width: 24px;
  height: 16px;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  object-fit: cover;
}
</style>
