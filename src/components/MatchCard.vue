<script setup>
import { computed, ref } from 'vue'
import { useEventStore } from '../stores/eventStore'
import PlayerDrawer from './PlayerDrawer.vue'

const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
})

const store = useEventStore()

const teamAPlayers = computed(() =>
  props.match.teamAPlayerIds
    .map((id) => store.playerMap[id])
    .filter(Boolean),
)

const teamBPlayers = computed(() =>
  props.match.teamBPlayerIds
    .map((id) => store.playerMap[id])
    .filter(Boolean),
)

const matchSummary = computed(() => store.matchSummary(props.match))
const matchStatus = computed(() =>
  props.match.status === 'final' ? 'Final' : 'Live',
)
const leader = computed(() => props.match.score?.leader ?? null)
const holeResults = computed(() => props.match.score?.holes ?? [])
const usaPercent = computed(() => {
  if (leader.value === 'usa') return 100
  if (leader.value === 'vietnam') return 0
  return 50
})
const vietnamPercent = computed(() => 100 - usaPercent.value)
const drawerOpen = ref(false)
const activePlayerId = ref(null)

function openPlayer(playerId) {
  activePlayerId.value = playerId
  drawerOpen.value = true
}
</script>

<template>
  <v-card class="match-card" variant="flat" color="surface">
    <div class="match-header">
      <div class="match-title">Match {{ match.matchNumber }}</div>
      <div class="match-status">{{ matchStatus }}</div>
    </div>

    <div class="match-rows">
      <div class="match-side">
        <div class="match-team">
          <img class="team-flag" src="/flags/usa.svg" alt="USA flag" />
          USA
        </div>
        <div class="match-players">
          <button
            v-for="player in teamAPlayers"
            :key="player.id"
            type="button"
            class="match-player"
            @click="openPlayer(player.id)"
          >
            {{ player.displayName }}
          </button>
        </div>
      </div>
      <div class="match-score">
        <div
          class="match-score-text"
          :class="{
            'score-usa': leader === 'usa',
            'score-vietnam': leader === 'vietnam',
          }"
        >
          {{ matchSummary }}
        </div>
      </div>
      <div class="match-side">
        <div class="match-team">
          <img class="team-flag" src="/flags/vietnam.svg" alt="Vietnam flag" />
          Vietnam
        </div>
        <div class="match-players">
          <button
            v-for="player in teamBPlayers"
            :key="player.id"
            type="button"
            class="match-player"
            @click="openPlayer(player.id)"
          >
            {{ player.displayName }}
          </button>
        </div>
      </div>
    </div>

    <div class="match-holes">
      <div
        v-for="holeIndex in 18"
        :key="holeIndex"
        class="hole-chip"
        :class="{
          'hole-usa': holeResults[holeIndex - 1] === 'usa',
          'hole-vietnam': holeResults[holeIndex - 1] === 'vietnam',
        }"
      >
        {{ holeIndex }}
      </div>
    </div>

    <div class="match-winbar">
      <div class="winbar-labels">
        <span class="winbar-label usa">{{ usaPercent }}%</span>
        <span class="winbar-label vietnam">{{ vietnamPercent }}%</span>
      </div>
      <div class="winbar-track">
        <div class="winbar-usa" :style="{ width: `${usaPercent}%` }" />
        <div class="winbar-vietnam" :style="{ width: `${vietnamPercent}%` }" />
      </div>
    </div>
  </v-card>

  <PlayerDrawer v-model="drawerOpen" :player-id="activePlayerId" />
</template>

<style scoped>
.match-card {
  padding: 16px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.match-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.6);
}

.match-title {
  text-transform: uppercase;
  letter-spacing: 0.12rem;
  font-size: 0.75rem;
}

.match-status {
  font-size: 0.75rem;
}

.match-rows {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
}

.match-holes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 14px;
}

.hole-chip {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #111827;
  background: #e5e7eb;
}

.hole-usa {
  background: #c8102e;
  color: #fff;
}

.hole-vietnam {
  background: #0050b5;
  color: #fff;
}

.match-winbar {
  margin-top: 12px;
}

.winbar-labels {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 6px;
}

.winbar-label.usa {
  color: #c8102e;
}

.winbar-label.vietnam {
  color: #0050b5;
}

.winbar-track {
  display: flex;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  background: #e5e7eb;
}

.winbar-usa {
  background: #c8102e;
  transition: width 200ms ease;
}

.winbar-vietnam {
  background: #0050b5;
  transition: width 200ms ease;
}

.match-side {
  display: grid;
  gap: 6px;
}

.match-team {
  font-weight: 600;
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.8);
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.match-players {
  display: grid;
  gap: 4px;
  font-size: 0.85rem;
}

.match-player {
  color: rgba(15, 23, 42, 0.75);
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
  font: inherit;
}

.match-player:hover {
  color: rgba(15, 23, 42, 1);
  text-decoration: underline;
}

.match-score-text {
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  min-width: 64px;
  color: #111827;
}

.team-flag {
  width: 20px;
  height: 14px;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  object-fit: cover;
}

.score-usa {
  color: #c8102e;
}

.score-vietnam {
  color: #0050b5;
}
</style>
