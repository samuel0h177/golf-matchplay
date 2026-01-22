<script setup>
import { computed } from 'vue'
import { useEventStore } from '../stores/eventStore'
import MatchCard from '../components/MatchCard.vue'
import TeamScoreboard from '../components/TeamScoreboard.vue'

const store = useEventStore()
const sessions = computed(() => store.sessions)
const event = computed(() => store.event)
const matchCount = computed(() => store.matches.length)
const completedCount = computed(
  () => store.matches.filter((match) => match.status === 'final').length,
)
const tournamentComplete = computed(
  () => matchCount.value > 0 && completedCount.value === matchCount.value,
)
const teamPoints = computed(() => store.teamPoints)
const totalPoints = computed(() => store.matches.length)
const usaPoints = computed(() => teamPoints.value.usa ?? 0)
const vietnamPoints = computed(() => teamPoints.value.vietnam ?? 0)
const usaPercent = computed(() =>
  totalPoints.value === 0 ? 50 : (usaPoints.value / totalPoints.value) * 100,
)
const vietnamPercent = computed(() => 100 - usaPercent.value)
const winThreshold = computed(() => totalPoints.value / 2 + 0.5)
const winner = computed(() => {
  if (!tournamentComplete.value) return null
  if (usaPoints.value >= winThreshold.value) return 'usa'
  if (vietnamPoints.value >= winThreshold.value) return 'vietnam'
  return null
})
const segmentCount = computed(() => totalPoints.value)
</script>

<template>
  <v-container class="py-6">
    <div class="tournament-bar">
      <div class="tournament-score usa">
        <span class="score-value">{{ usaPoints.toFixed(1) }}</span>
        <v-icon v-if="winner === 'usa'" size="18">mdi-trophy</v-icon>
      </div>
      <div class="tournament-track">
        <div class="tournament-fill usa" :style="{ width: `${usaPercent}%` }" />
        <div
          class="tournament-fill vietnam"
          :style="{ width: `${vietnamPercent}%` }"
        />
        <div class="tournament-segments">
          <span
            v-for="segment in segmentCount"
            :key="segment"
            class="segment"
          />
        </div>
      </div>
      <div class="tournament-score vietnam">
        <span class="score-value">{{ vietnamPoints.toFixed(1) }}</span>
        <v-icon v-if="winner === 'vietnam'" size="18">mdi-trophy</v-icon>
      </div>
    </div>

    <div class="event-hero">
      <div class="event-meta">
        <div class="event-title">{{ event.name }}</div>
        <div class="event-subtitle">{{ event.venue }} · {{ event.dates }}</div>
      </div>
      <div class="event-stats">
        <div class="stat">
          <div class="stat-value">{{ completedCount }}/{{ matchCount }}</div>
          <div class="stat-label">Matches complete</div>
        </div>
      </div>
    </div>

    <TeamScoreboard class="mt-4" />

    <div class="session-list">
      <div v-for="session in sessions" :key="session.id" class="session-block">
        <div class="session-header">
          <div class="session-title">{{ session.name }}</div>
          <div class="session-meta">
            <div class="session-format">{{ session.format }}</div>
            <div class="session-points">
              {{ store.sessionPoints(session.id).usa?.toFixed(1) }} -
              {{ store.sessionPoints(session.id).vietnam?.toFixed(1) }}
            </div>
          </div>
        </div>
        <div class="session-matches">
          <MatchCard
            v-for="match in store.matchesBySession(session.id)"
            :key="match.id"
            :match="match"
          />
        </div>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.event-meta {
  display: grid;
  gap: 4px;
}

.tournament-bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
  margin-bottom: 16px;
}

.tournament-score {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 1.1rem;
  min-width: 48px;
}

.tournament-score.usa {
  color: #c8102e;
  justify-content: flex-start;
}

.tournament-score.vietnam {
  color: #0050b5;
  justify-content: flex-end;
}

.tournament-track {
  position: relative;
  display: flex;
  height: 28px;
  border-radius: 999px;
  overflow: hidden;
  background: #e5e7eb;
}

.tournament-fill {
  height: 100%;
}

.tournament-fill.usa {
  background: #c8102e;
}

.tournament-fill.vietnam {
  background: #0050b5;
}

.tournament-segments {
  position: absolute;
  inset: 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  pointer-events: none;
}

.segment {
  border-left: 1px solid rgba(255, 255, 255, 0.4);
}

.event-hero {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 18px;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.9), rgba(240, 244, 255, 0.9));
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.event-title {
  font-size: 1.4rem;
  font-weight: 700;
}

.event-subtitle {
  color: rgba(15, 23, 42, 0.6);
  font-size: 0.95rem;
}

.event-stats {
  display: flex;
  align-items: center;
}

.stat {
  text-align: right;
  min-width: 150px;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15rem;
  color: rgba(15, 23, 42, 0.5);
}

.session-list {
  margin-top: 32px;
  display: grid;
  gap: 28px;
}

.session-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;
}

.session-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.session-meta {
  display: flex;
  gap: 12px;
  align-items: baseline;
}

.session-format {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18rem;
  color: rgba(15, 23, 42, 0.5);
}

.session-points {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.8);
}

.session-matches {
  display: grid;
  gap: 12px;
}
</style>
